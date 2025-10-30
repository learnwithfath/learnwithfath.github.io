/**
 * Single Responsibility: Handle data fetching and management
 */
class CodelabDataService {
    constructor(dataUrl) {
        this.dataUrl = dataUrl;
        this.data = null;
    }

    async fetchData() {
        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
            return this.data;
        } catch (error) {
            console.error('Error fetching codelab data:', error);
            throw error;
        }
    }

    getCodelabs() {
        return this.data?.codelabs || [];
    }

    getStats() {
        return this.data?.stats || {
            totalTutorials: 0,
            totalSubPhases: 0,
            totalMajorPhases: 0
        };
    }

    getCodelabById(id) {
        return this.getCodelabs().find(codelab => codelab.id === id);
    }

    searchCodelabs(query) {
        if (!query) return this.getCodelabs();
        
        const lowerQuery = query.toLowerCase();
        return this.getCodelabs().filter(codelab => {
            return (
                codelab.searchTerms.toLowerCase().includes(lowerQuery) ||
                codelab.title.toLowerCase().includes(lowerQuery) ||
                codelab.summary.toLowerCase().includes(lowerQuery) ||
                codelab.categories.some(cat => cat.toLowerCase().includes(lowerQuery)) ||
                codelab.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
            );
        });
    }
}
