import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy, getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Load all projects
async function loadProjects(filter = 'all') {
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) return;
    
    try {
        const projectsRef = collection(db, 'projects');
        let q = query(projectsRef, orderBy('date', 'desc'));
        
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            portfolioGrid.innerHTML = '<p class="loading">No projects yet.</p>';
            return;
        }
        
        portfolioGrid.innerHTML = '';
        snapshot.forEach(doc => {
            const project = { id: doc.id, ...doc.data() };
            
            // Apply filter
            if (filter !== 'all' && project.category?.toLowerCase() !== filter.toLowerCase()) {
                return;
            }
            
            const projectCard = createProjectCard(project);
            portfolioGrid.appendChild(projectCard);
        });
        
        if (portfolioGrid.children.length === 0) {
            portfolioGrid.innerHTML = '<p class="loading">No projects found in this category.</p>';
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        portfolioGrid.innerHTML = '<p class="loading">Error loading projects.</p>';
    }
}

// Create project card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <img src="${project.images && project.images[0] ? project.images[0] : 'https://via.placeholder.com/400'}" 
             alt="${project.title}" class="project-image">
        <div class="project-info">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-category">${project.category || 'Interior Design'}</p>
        </div>
    `;
    
    card.addEventListener('click', () => {
        showProjectModal(project);
    });
    
    return card;
}

// Show project modal
function showProjectModal(project) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    const imagesHTML = project.images && project.images.length > 0
        ? project.images.map(img => `<img src="${img}" alt="${project.title}" class="modal-project-image">`).join('')
        : '<img src="https://via.placeholder.com/800" alt="Project image" class="modal-project-image">';
    
    modalBody.innerHTML = `
        <div class="modal-project-content">
            <div class="modal-project-images">
                ${imagesHTML}
            </div>
            <div class="modal-project-info">
                <h2>${project.title}</h2>
                <p class="modal-project-category">${project.category || 'Interior Design'}</p>
                <p class="modal-project-description">${project.description || ''}</p>
                ${project.date ? `<p class="modal-project-date">${new Date(project.date.seconds * 1000).toLocaleDateString()}</p>` : ''}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        loadProjects(filter);
    });
});

// Close modal
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal')) {
        const modal = document.getElementById('projectModal');
        if (modal && (e.target === modal || e.target.classList.contains('close-modal'))) {
            modal.style.display = 'none';
        }
    }
});

// Check for hash in URL (for direct project links)
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        loadProjectById(hash);
    } else {
        loadProjects();
    }
});

// Load specific project by ID
async function loadProjectById(projectId) {
    try {
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        if (projectDoc.exists()) {
            const project = { id: projectDoc.id, ...projectDoc.data() };
            showProjectModal(project);
        }
    } catch (error) {
        console.error('Error loading project:', error);
    }
}
