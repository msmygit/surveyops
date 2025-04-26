class ApiService {
    constructor() {
        this.baseUrl = '/api';
    }

    async fetchPresentations() {
        try {
            const response = await fetch(`${this.baseUrl}/presentations`);
            if (!response.ok) {
                throw new Error('Failed to fetch presentations');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching presentations:', error);
            throw error;
        }
    }

    async createPresentation(presentationData) {
        try {
            const response = await fetch(`${this.baseUrl}/presentations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(presentationData),
            });
            if (!response.ok) {
                throw new Error('Failed to create presentation');
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating presentation:', error);
            throw error;
        }
    }

    async updatePresentation(id, presentationData) {
        try {
            const response = await fetch(`${this.baseUrl}/presentations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(presentationData),
            });
            if (!response.ok) {
                throw new Error('Failed to update presentation');
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating presentation:', error);
            throw error;
        }
    }

    async endPresentation(id) {
        try {
            const response = await fetch(`${this.baseUrl}/presentations/${id}/end`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to end presentation');
            }
            return await response.json();
        } catch (error) {
            console.error('Error ending presentation:', error);
            throw error;
        }
    }

    async getPresentationDetails(id) {
        try {
            const response = await fetch(`${this.baseUrl}/presentations/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch presentation details');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching presentation details:', error);
            throw error;
        }
    }
}

// Export the API service instance
const apiService = new ApiService();
export default apiService; 