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
    errorToast.show();
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
        const response = await fetch(`${API_BASE_URL}/presentations`);
        if (!response.ok) {
            throw new Error('Failed to load presentations');
        }
        
        const presentations = await response.json();
        presentationsList.innerHTML = '';
        presentations.forEach(addPresentationToList);
        
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

function addPresentationToList(presentation) {
    const presentationItem = document.createElement('div');
    presentationItem.className = 'list-group-item';
    presentationItem.innerHTML = `
        <div class="presentation-item">
            <div>
                <h6 class="mb-1">${presentation.title}</h6>
                <small class="text-muted">Presenter: ${presentation.presenterId}</small>
            </div>
            <div class="presentation-actions">
                <span class="status-badge ${presentation.status === 'ACTIVE' ? 'status-active' : 'status-ended'}">
                    ${presentation.status}
                </span>
                <button class="btn btn-sm btn-outline-primary" onclick="showPresentationDetails('${presentation.id}')">
                    <i class="bi bi-eye"></i>
                </button>
            </div>
        </div>
    `;
    presentationsList.appendChild(presentationItem);
}

async function showPresentationDetails(presentationId) {
    try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/presentations/${presentationId}`);
        if (!response.ok) {
            throw new Error('Failed to load presentation details');
        }
        
        const presentation = await response.json();
        currentPresentationId = presentation.id;
        
        document.getElementById('presentationDetails').innerHTML = `
            <div class="mb-3">
                <h6>Title</h6>
                <p>${presentation.title}</p>
            </div>
            <div class="mb-3">
                <h6>Presenter ID</h6>
                <p>${presentation.presenterId}</p>
            </div>
            <div class="mb-3">
                <h6>Status</h6>
                <span class="status-badge ${presentation.status === 'ACTIVE' ? 'status-active' : 'status-ended'}">
                    ${presentation.status}
                </span>
            </div>
            <div class="mb-3">
                <h6>Created At</h6>
                <p>${new Date(presentation.createdAt).toLocaleString()}</p>
            </div>
        `;
        
        endPresentationBtn.disabled = presentation.status !== 'ACTIVE';
        presentationModal.show();
        
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

async function handleEndPresentation() {
    if (!currentPresentationId) return;
    
    try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/presentations/${currentPresentationId}/end`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error('Failed to end presentation');
        }
        
        presentationModal.hide();
        loadPresentations();
        
    } catch (error) {
        showError(error.message);
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
        const response = await fetch(`${API_BASE_URL}/presentations`);
        if (!response.ok) {
            throw new Error('Failed to search presentations');
        }
        
        const presentations = await response.json();
        const filteredPresentations = presentations.filter(p => 
            p.title.toLowerCase().includes(searchTerm) || 
            p.presenterId.toLowerCase().includes(searchTerm)
        );
        
        presentationsList.innerHTML = '';
        filteredPresentations.forEach(addPresentationToList);
        
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
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