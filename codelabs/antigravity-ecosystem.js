class AntigravityEcosystem {
    constructor(dataUrl) {
        this.dataUrl = dataUrl;
        this.storageKey = 'antigravity-ecosystem-progress-v1';
        this.completed = new Set(this.readProgress());
        this.filter = 'all';
        this.totalSteps = 0;
    }

    async init() {
        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.data = await response.json();
            this.totalSteps = this.data.parts.reduce((sum, part) => sum + part.steps.length, 0);
            this.render();
            this.bindControls();
            this.updateProgress();
        } catch (error) {
            document.getElementById('roadmap').innerHTML = `<div class="error">Halaman gagal dimuat. Jalankan lewat local server dan coba lagi.</div>`;
            console.error(error);
        }
    }

    readProgress() {
        try { return JSON.parse(localStorage.getItem(this.storageKey) || '[]'); }
        catch { return []; }
    }

    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify([...this.completed].sort()));
    }

    stepId(part, step) {
        return `${part.number}-${step.step}`;
    }

    render() {
        const root = document.getElementById('roadmap');
        root.innerHTML = this.data.parts.map(part => `
            <section class="phase" id="part-${part.number}">
                <div class="phase-head">
                    <div>
                        <div class="phase-kicker">Part ${part.number} · ${part.steps.length} langkah</div>
                        <h2>${part.title}</h2>
                        <p class="phase-summary">${part.summary}</p>
                    </div>
                    <a class="module-link" href="${part.moduleUrl}">Buka Part ${part.number} →</a>
                </div>
                <div class="week-grid">
                    ${part.steps.map(step => this.stepCard(step, part)).join('')}
                </div>
            </section>`).join('');
    }

    stepCard(step, part) {
        const id = this.stepId(part, step);
        const done = this.completed.has(id);
        return `<article class="week-card${done ? ' done' : ''}" data-tracks="${step.tracks.join(' ')}">
            <div class="week-meta"><span>Part ${part.number}</span><span>Langkah ${step.step}</span></div>
            <h3>${step.title}</h3>
            <div class="tags">${step.tracks.map(track => `<span class="tag">${track}</span>`).join('')}</div>
            <div class="week-section"><strong>Yang dikerjakan</strong><p>${step.detail}</p></div>
            <div class="week-section"><strong>Hasil</strong><p>${step.outcome}</p></div>
            <div class="lab-actions">
                <a class="lab-link" href="${part.moduleUrl}#${step.step}">Buka panduan →</a>
            </div>
            <label class="complete-label"><input type="checkbox" data-step="${id}" ${done ? 'checked' : ''}> Tandai selesai</label>
        </article>`;
    }

    bindControls() {
        document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
            this.filter = button.dataset.filter;
            document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('active', item === button));
            document.querySelectorAll('.week-card').forEach(card => {
                card.classList.toggle('hidden', this.filter !== 'all' && !card.dataset.tracks.split(' ').includes(this.filter));
            });
        }));

        document.getElementById('roadmap').addEventListener('change', event => {
            if (!event.target.matches('[data-step]')) return;
            const id = event.target.dataset.step;
            event.target.checked ? this.completed.add(id) : this.completed.delete(id);
            event.target.closest('.week-card').classList.toggle('done', event.target.checked);
            this.saveProgress();
            this.updateProgress();
        });

        document.getElementById('resetProgress').addEventListener('click', () => {
            if (!window.confirm('Reset seluruh progress di perangkat ini?')) return;
            this.completed.clear();
            this.saveProgress();
            document.querySelectorAll('[data-step]').forEach(input => { input.checked = false; input.closest('.week-card').classList.remove('done'); });
            this.updateProgress();
        });
    }

    updateProgress() {
        const count = this.completed.size;
        const percentage = this.totalSteps ? Math.round((count / this.totalSteps) * 100) : 0;
        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('progressTrack').setAttribute('aria-valuenow', String(count));
        document.getElementById('progressTrack').setAttribute('aria-valuemax', String(this.totalSteps));
        document.getElementById('progressCopy').textContent = `${count}/${this.totalSteps} selesai · ${percentage}%`;
    }
}

new AntigravityEcosystem('data/antigravity-ecosystem.json').init();
