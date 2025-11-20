/**
 * Single Responsibility: Handle UI updates and animations
 */
class UIController {
    constructor(elements) {
        this.elements = elements;
    }

    updateStats(stats) {
        if (this.elements.totalCodelabs) {
            this.elements.totalCodelabs.textContent = stats.totalTutorials;
        }
        if (this.elements.totalSubPhases) {
            this.elements.totalSubPhases.textContent = stats.totalSubPhases;
        }
        if (this.elements.totalMajorPhases) {
            this.elements.totalMajorPhases.textContent = stats.totalMajorPhases;
        }
    }

    showNoResults(show = true) {
        if (this.elements.noResults) {
            this.elements.noResults.style.display = show ? 'block' : 'none';
        }
        if (this.elements.codelabsGrid) {
            this.elements.codelabsGrid.style.display = show ? 'none' : 'grid';
        }
    }

    showPagination(show = true) {
        if (this.elements.paginationContainer) {
            this.elements.paginationContainer.style.display = show ? 'flex' : 'none';
        }
    }

    updatePaginationUI(paginationInfo) {
        if (!this.elements.paginationContainer) return;

        const { currentPage, totalPages, hasNext, hasPrevious } = paginationInfo;

        // Update page info
        if (this.elements.pageInfo) {
            this.elements.pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        }

        // Update buttons state
        if (this.elements.prevButton) {
            this.elements.prevButton.disabled = !hasPrevious;
            if (!hasPrevious) {
                this.elements.prevButton.classList.add('disabled');
            } else {
                this.elements.prevButton.classList.remove('disabled');
            }
        }

        if (this.elements.nextButton) {
            this.elements.nextButton.disabled = !hasNext;
            if (!hasNext) {
                this.elements.nextButton.classList.add('disabled');
            } else {
                this.elements.nextButton.classList.remove('disabled');
            }
        }

        // Show/hide pagination if only one page
        this.showPagination(totalPages > 1);
    }

    animateCards() {
        const cards = this.elements.codelabsGrid?.querySelectorAll('.codelab-card');
        if (!cards) return;

        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s, transform 0.5s';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    scrollToTop(smooth = true) {
        window.scrollTo({
            top: 0,
            behavior: smooth ? 'smooth' : 'auto'
        });
    }

    showLoading(show = true) {
        if (this.elements.loadingIndicator) {
            this.elements.loadingIndicator.style.display = show ? 'block' : 'none';
        }
    }

    showError(message) {
        if (this.elements.errorContainer) {
            this.elements.errorContainer.textContent = message;
            this.elements.errorContainer.style.display = 'block';
        }
    }

    hideError() {
        if (this.elements.errorContainer) {
            this.elements.errorContainer.style.display = 'none';
        }
    }
}
