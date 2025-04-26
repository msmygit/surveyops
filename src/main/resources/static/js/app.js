import apiService from './api.js';

const API_BASE_URL = '/api';

// DOM Elements
const presentationForm = document.getElementById('presentationForm');
const presentationsList = document.getElementById('presentationsList');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const filterActive = document.getElementById('filterActive');
const filterAll = document.getElementById('filterAll');
const loadingIndicator = document.getElementById('loadingIndicator');
const createButton = document.getElementById('createButton');
const presentationModal = new bootstrap.Modal(document.getElementById('presentationModal'));
const endPresentationBtn = document.getElementById('endPresentationBtn');
const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));
const errorMessage = document.getElementById('errorMessage');

// State
let currentFilter = 'all';
let currentPresentationId = null;
let presentations = [];

// Event Listeners
presentationForm.addEventListener('submit', handleCreatePresentation);
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keyup', (e) => e.key === 'Enter' && handleSearch());
filterActive.addEventListener('click', () => setFilter('active'));
filterAll.addEventListener('click', () => setFilter('all'));
endPresentationBtn.addEventListener('click', handleEndPresentation);

// Functions
function showError(message) {
    errorMessage.textContent = message;
    const toast = new bootstrap.Toast(errorToast);
    errorToast.querySelector('.toast-body').textContent = message;
    toast.show();
}

function setLoading(loading) {
    if (loading) {
        loadingIndicator.classList.remove('d-none');
        presentationsList.classList.add('d-none');
        createButton.disabled = true;
        createButton.querySelector('.spinner-border').classList.remove('d-none');
    } else {
        loadingIndicator.classList.add('d-none');
        presentationsList.classList.remove('d-none');
        createButton.disabled = false;
        createButton.querySelector('.spinner-border').classList.add('d-none');
    }
}

async function handleCreatePresentation(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const presenterId = document.getElementById('presenterId').value;
    
    try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/presentations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, presenterId })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create presentation');
        }
        
        const presentation = await response.json();
        addPresentationToList(presentation);
        presentationForm.reset();
        
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

async function loadPresentations() {
    try {
        setLoading(true);
        presentations = await apiService.fetchPresentations();
        renderPresentations();
    } catch (error) {
        showError('Failed to load presentations');
    } finally {
        setLoading(false);
    }
}

function renderPresentations() {
    presentationsList.innerHTML = '';
    presentations.forEach(presentation => {
        const listItem = createPresentationListItem(presentation);
        presentationsList.appendChild(listItem);
    });
}

function createPresentationListItem(presentation) {
    const listItem = document.createElement('div');
    listItem.className = 'list-group-item';
    listItem.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h5 class="mb-1">${presentation.title}</h5>
                <p class="mb-1">${presentation.description}</p>
                <small class="text-muted">Status: ${presentation.status}</small>
            </div>
            <div>
                <button class="btn btn-primary btn-sm me-2" onclick="showDetails('${presentation.id}')">
                    View Details
                </button>
                ${presentation.status === 'ACTIVE' ? `
                    <button class="btn btn-danger btn-sm" onclick="endPresentation('${presentation.id}')">
                        End Presentation
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    return listItem;
}

async function showDetails(id) {
    try {
        const presentation = await apiService.getPresentationDetails(id);
        const modalBody = presentationModal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <h5>${presentation.title}</h5>
            <p>${presentation.description}</p>
            <p>Status: ${presentation.status}</p>
            <p>Created: ${new Date(presentation.createdAt).toLocaleString()}</p>
        `;
        const modal = new bootstrap.Modal(presentationModal);
        modal.show();
    } catch (error) {
        showError('Failed to load presentation details');
    }
}

async function handleEndPresentation() {
    if (!currentPresentationId) return;
    
    try {
        setLoading(true);
        const updatedPresentation = await apiService.endPresentation(currentPresentationId);
        const index = presentations.findIndex(p => p.id === currentPresentationId);
        if (index !== -1) {
            presentations[index] = updatedPresentation;
            renderPresentations();
        }
        presentationModal.hide();
    } catch (error) {
        showError('Failed to end presentation');
    } finally {
        setLoading(false);
    }
}

async function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (!searchTerm) {
        loadPresentations();
        return;
    }
    
    try {
        setLoading(true);
        const filteredPresentations = presentations.filter(p => 
            p.title.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
        
        renderFilteredPresentations(filteredPresentations);
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

function renderFilteredPresentations(filteredPresentations) {
    presentationsList.innerHTML = '';
    filteredPresentations.forEach(presentation => {
        const listItem = createPresentationListItem(presentation);
        presentationsList.appendChild(listItem);
    });
}

function setFilter(filter) {
    currentFilter = filter;
    filterActive.classList.toggle('active', filter === 'active');
    filterAll.classList.toggle('active', filter === 'all');
    loadPresentations();
}

// Load presentations when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPresentations();
    setFilter('all');
});

// Make functions available globally
window.showDetails = showDetails;
window.endPresentation = handleEndPresentation; 