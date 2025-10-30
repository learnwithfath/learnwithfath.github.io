/**
 * Single Responsibility: Handle pagination logic
 */
class PaginationController {
    constructor(itemsPerPage = 6) {
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalPages = 1;
        this.allItems = [];
    }

    setItems(items) {
        this.allItems = items;
        this.totalPages = Math.ceil(items.length / this.itemsPerPage);
        this.currentPage = 1;
    }

    getCurrentPageItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.allItems.slice(startIndex, endIndex);
    }

    goToPage(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= this.totalPages) {
            this.currentPage = pageNumber;
            return true;
        }
        return false;
    }

    nextPage() {
        return this.goToPage(this.currentPage + 1);
    }

    previousPage() {
        return this.goToPage(this.currentPage - 1);
    }

    hasNextPage() {
        return this.currentPage < this.totalPages;
    }

    hasPreviousPage() {
        return this.currentPage > 1;
    }

    getPaginationInfo() {
        return {
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            totalItems: this.allItems.length,
            itemsPerPage: this.itemsPerPage,
            hasNext: this.hasNextPage(),
            hasPrevious: this.hasPreviousPage()
        };
    }
}
