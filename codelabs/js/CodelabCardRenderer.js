/**
 * Single Responsibility: Render codelab cards
 * Open/Closed: Easy to extend with new card types
 */
class CodelabCardRenderer {
    constructor() {
        this.svgIcons = {
            clock: `<svg fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>`,
            book: `<svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
            </svg>`
        };
    }

    renderCard(codelab) {
        const card = document.createElement('a');
        card.href = codelab.url;
        card.className = 'codelab-card';
        card.dataset.title = codelab.searchTerms;
        card.dataset.tags = codelab.categories.join(' ');

        card.innerHTML = `
            <h2>${codelab.icon} ${codelab.title}</h2>
            <p class="summary">${codelab.summary}</p>
            
            <div class="codelab-meta">
                ${this.renderDuration(codelab)}
                ${this.renderSections(codelab)}
            </div>

            <div class="tags">
                ${this.renderTags(codelab.tags)}
            </div>

            <span class="cta-button">${codelab.ctaText} →</span>
        `;

        return card;
    }

    renderDuration(codelab) {
        if (codelab.duration) {
            return `
                <div class="meta-item">
                    ${this.svgIcons.clock}
                    ~${codelab.duration} minutes
                </div>
            `;
        } else if (codelab.phases) {
            return `
                <div class="meta-item">
                    ${this.svgIcons.clock}
                    ${codelab.phases} Phases
                </div>
            `;
        }
        return '';
    }

    renderSections(codelab) {
        const label = codelab.sectionLabel || 'sections';
        return `
            <div class="meta-item">
                ${this.svgIcons.book}
                ${codelab.sections} ${label}
            </div>
        `;
    }

    renderTags(tags) {
        return tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    }

    renderCards(codelabs, container) {
        container.innerHTML = '';
        codelabs.forEach(codelab => {
            const card = this.renderCard(codelab);
            container.appendChild(card);
        });
    }
}
