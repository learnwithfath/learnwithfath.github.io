class AgenticRoadmap {
    constructor(dataUrl) {
        this.dataUrl = dataUrl;
        this.storageKey = 'agentic-roadmap-progress-v1';
        this.completed = new Set(this.readProgress());
        this.filter = 'all';
    }

    async init() {
        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.data = await response.json();
            this.render();
            this.bindControls();
            this.updateProgress();
        } catch (error) {
            document.getElementById('roadmap').innerHTML = `<div class="error">Roadmap gagal dimuat. Jalankan halaman melalui local server dan coba lagi.</div>`;
            console.error(error);
        }
    }

    readProgress() {
        try { return JSON.parse(localStorage.getItem(this.storageKey) || '[]'); }
        catch { return []; }
    }

    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify([...this.completed].sort((a, b) => a - b)));
    }

    render() {
        const root = document.getElementById('roadmap');
        root.innerHTML = this.data.phases.map(phase => `
            <section class="phase" id="phase-${phase.number}">
                <div class="phase-head">
                    <div>
                        <div class="phase-kicker">Fase ${phase.number} · Minggu ${phase.weeks[0].week}–${phase.weeks.at(-1).week}</div>
                        <h2>${phase.title}</h2>
                        <p class="phase-summary">${phase.summary}</p>
                    </div>
                    <a class="module-link" href="${phase.moduleUrl}">Buka modul fase ${phase.number} →</a>
                </div>
                <div class="week-grid">
                    ${phase.weeks.map(week => this.weekCard(week, phase)).join('')}
                </div>
            </section>`).join('');
    }

    weekCard(week, phase) {
        const done = this.completed.has(week.week);
        const step = ((week.week - 1) % 3) + 1;
        const bundle = week.week <= 3 ? 'agentic-loop-lab' : 'taskforge-agentic';
        const paddedWeek = String(week.week).padStart(2, '0');
        return `<article class="week-card${done ? ' done' : ''}" data-tracks="${week.tracks.join(' ')}">
            <div class="week-meta"><span>Minggu ${week.week}</span><span>${week.hours} jam</span></div>
            <h3>${week.title}</h3>
            <div class="tags">${week.tracks.map(track => `<span class="tag">${track}</span>`).join('')}</div>
            <div class="week-section"><strong>Lab</strong><p>${week.lab}</p></div>
            <div class="week-section"><strong>Evidence</strong><p>${week.deliverable}</p></div>
            <div class="week-section"><strong>Lulus bila</strong><p>${week.rubric}</p></div>
            <div class="lab-actions">
                <a class="lab-link" href="${phase.moduleUrl}#${step}">Buka panduan lab →</a>
                <a class="branch-link" href="downloads/${bundle}.bundle" download>Starter · week-${paddedWeek}-start</a>
            </div>
            <label class="complete-label"><input type="checkbox" data-week="${week.week}" ${done ? 'checked' : ''}> Tandai selesai</label>
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
            if (!event.target.matches('[data-week]')) return;
            const week = Number(event.target.dataset.week);
            event.target.checked ? this.completed.add(week) : this.completed.delete(week);
            event.target.closest('.week-card').classList.toggle('done', event.target.checked);
            this.saveProgress();
            this.updateProgress();
        });

        document.getElementById('resetProgress').addEventListener('click', () => {
            if (!window.confirm('Reset seluruh progress 24 minggu di perangkat ini?')) return;
            this.completed.clear();
            this.saveProgress();
            document.querySelectorAll('[data-week]').forEach(input => { input.checked = false; input.closest('.week-card').classList.remove('done'); });
            this.updateProgress();
        });
    }

    updateProgress() {
        const count = this.completed.size;
        const percentage = Math.round((count / 24) * 100);
        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('progressTrack').setAttribute('aria-valuenow', String(count));
        document.getElementById('progressCopy').textContent = `${count}/24 selesai · ${percentage}%`;
    }
}

new AgenticRoadmap('data/agentic-roadmap.json').init();
