/**
 * Main Application Controller
 * Dependency Inversion: Orchestrates all components through interfaces
 * Open/Closed: Easy to add new features without modifying existing code
 */
class CodelabApp {
    constructor(config) {
        this.config = config;
        this.dataService = null;
        this.cardRenderer = null;
        this.paginationController = null;
        this.searchController = null;
        this.uiController = null;
        this.currentSearchQuery = '';
    }

    async init() {
        try {
            // Initialize UI Controller
            this.uiController = new UIController(this.config.elements);
            this.uiController.showLoading(true);

            // Initialize Data Service
            this.dataService = new CodelabDataService(this.config.dataUrl);
            await this.dataService.fetchData();

            // Initialize other components
            this.cardRenderer = new CodelabCardRenderer();
            this.paginationController = new PaginationController(this.config.itemsPerPage);
            
            // Initialize Search Controller with callback
            this.searchController = new SearchController(
                this.config.elements.searchInput,
                (query) => this.handleSearch(query)
            );

            // Setup pagination buttons
            this.setupPaginationButtons();

            // Initial render
            this.updateStats();
            this.renderCodelabs();
            
            this.uiController.showLoading(false);
            this.uiController.hideError();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.uiController.showLoading(false);
            this.uiController.showError('Failed to load codelabs. Please refresh the page.');
        }
    }

    updateStats() {
        const stats = this.dataService.getStats();
        this.uiController.updateStats(stats);
    }

    handleSearch(query) {
        this.currentSearchQuery = query;
        this.renderCodelabs();
    }

    renderCodelabs() {
        // Get filtered codelabs based on search
        const codelabs = this.currentSearchQuery 
            ? this.dataService.searchCodelabs(this.currentSearchQuery)
            : this.dataService.getCodelabs();

        // Check if no results
        if (codelabs.length === 0) {
            this.uiController.showNoResults(true);
            this.uiController.showPagination(false);
            return;
        }

        this.uiController.showNoResults(false);

        // Setup pagination
        this.paginationController.setItems(codelabs);
        const currentPageItems = this.paginationController.getCurrentPageItems();

        // Render cards
        this.cardRenderer.renderCards(
            currentPageItems, 
            this.config.elements.codelabsGrid
        );

        // Update pagination UI
        const paginationInfo = this.paginationController.getPaginationInfo();
        this.uiController.updatePaginationUI(paginationInfo);

        // Animate cards
        this.uiController.animateCards();
    }

    setupPaginationButtons() {
        const { prevButton, nextButton, paginationContainer } = this.config.elements;

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (this.paginationController.previousPage()) {
                    this.renderCodelabs();
                    this.uiController.scrollToTop();
                }
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (this.paginationController.nextPage()) {
                    this.renderCodelabs();
                    this.uiController.scrollToTop();
                }
            });
        }

        // Page number buttons (if implemented)
        if (paginationContainer) {
            paginationContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('page-number')) {
                    const pageNumber = parseInt(e.target.dataset.page);
                    if (this.paginationController.goToPage(pageNumber)) {
                        this.renderCodelabs();
                        this.uiController.scrollToTop();
                    }
                }
            });
        }
    }

    // Public API for external control
    goToPage(pageNumber) {
        if (this.paginationController.goToPage(pageNumber)) {
            this.renderCodelabs();
            this.uiController.scrollToTop();
        }
    }

    search(query) {
        this.searchController.handleSearch(query);
    }

    clearSearch() {
        this.searchController.clearSearch();
    }
}
