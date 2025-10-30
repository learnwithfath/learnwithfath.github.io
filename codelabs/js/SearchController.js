/**
 * Single Responsibility: Handle search functionality
 * Dependency Inversion: Depends on abstractions (callbacks) not concrete implementations
 */
class SearchController {
    constructor(searchInput, onSearchCallback) {
        this.searchInput = searchInput;
        this.onSearchCallback = onSearchCallback;
        this.debounceTimer = null;
        this.debounceDelay = 300; // ms
        
        this.init();
    }

    init() {
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
    }

    handleSearch(query) {
        // Debounce search to avoid too many calls
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            if (this.onSearchCallback) {
                this.onSearchCallback(query);
            }
        }, this.debounceDelay);
    }

    clearSearch() {
        this.searchInput.value = '';
        if (this.onSearchCallback) {
            this.onSearchCallback('');
        }
    }

    setDebounceDelay(delay) {
        this.debounceDelay = delay;
    }
}
