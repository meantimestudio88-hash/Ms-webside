import { db } from './firebase-config.js';
import { collection, getDocs, query, where, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Animate statistics on homepage
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateStat = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateStat);
            } else {
                stat.textContent = target;
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateStat();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(stat);
    });
}

// Load featured projects on homepage
async function loadFeaturedProjects() {
    const featuredContainer = document.getElementById('featuredProjects');
    if (!featuredContainer) return;
    
    try {
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, where('featured', '==', true), orderBy('date', 'desc'), limit(3));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            featuredContainer.innerHTML = '<p class="loading">No featured projects yet.</p>';
            return;
        }
        
        featuredContainer.innerHTML = '';
        snapshot.forEach(doc => {
            const project = { id: doc.id, ...doc.data() };
            const projectCard = createProjectCard(project);
            featuredContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error loading featured projects:', error);
        featuredContainer.innerHTML = '<p class="loading">Error loading projects.</p>';
    }
}

// Create project card element
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
        window.location.href = `portfolio.html#${project.id}`;
    });
    
    return card;
}

// Load designers
async function loadDesigners() {
    const designersContainer = document.getElementById('designersGrid');
    if (!designersContainer) return;
    
    try {
        const designersRef = collection(db, 'designers');
        const snapshot = await getDocs(designersRef);
        
        if (snapshot.empty) {
            designersContainer.innerHTML = '<p class="loading">No designers added yet.</p>';
            return;
        }
        
        designersContainer.innerHTML = '';
        snapshot.forEach(doc => {
            const designer = { id: doc.id, ...doc.data() };
            const designerCard = createDesignerCard(designer);
            designersContainer.appendChild(designerCard);
        });
    } catch (error) {
        console.error('Error loading designers:', error);
        designersContainer.innerHTML = '<p class="loading">Error loading designers.</p>';
    }
}

// Create designer card element
function createDesignerCard(designer) {
    const card = document.createElement('div');
    card.className = 'designer-card';
    card.innerHTML = `
        <div class="designer-image-wrapper">
            <img src="${designer.image || 'https://via.placeholder.com/300'}" 
                 alt="${designer.name}" class="designer-image">
        </div>
        <div class="designer-info">
            <h3 class="designer-name">${designer.name}</h3>
            <p class="designer-role">${designer.role || 'Interior Designer'}</p>
            <p class="designer-bio">${designer.bio ? designer.bio.substring(0, 150) + '...' : ''}</p>
            <button class="btn-view-more" data-designer-id="${designer.id}">View Profile</button>
        </div>
    `;
    
    const viewMoreBtn = card.querySelector('.btn-view-more');
    viewMoreBtn.addEventListener('click', () => {
        showDesignerModal(designer);
    });
    
    return card;
}

// Show designer modal
function showDesignerModal(designer) {
    const modal = document.getElementById('designerModal');
    const modalBody = document.getElementById('designerModalBody');
    
    if (!modal || !modalBody) return;
    
    modalBody.innerHTML = `
        <div class="designer-modal-content">
            <img src="${designer.image || 'https://via.placeholder.com/400'}" 
                 alt="${designer.name}" class="designer-modal-image">
            <div class="designer-modal-info">
                <h2>${designer.name}</h2>
                <p class="designer-modal-role">${designer.role || 'Interior Designer'}</p>
                <p class="designer-modal-bio">${designer.bio || ''}</p>
                ${designer.specialties && designer.specialties.length > 0 ? `
                    <div class="designer-specialties">
                        <h4>Specialties</h4>
                        <div class="specialties-tags">
                            ${designer.specialties.map(spec => `<span class="specialty-tag">${spec}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                ${designer.experience ? `<p class="designer-experience">Experience: ${designer.experience} years</p>` : ''}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Load reviews
async function loadReviews() {
    const reviewsContainer = document.getElementById('reviewsGrid');
    if (!reviewsContainer) return;
    
    try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where('approved', '==', true), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            reviewsContainer.innerHTML = '<p class="loading">No reviews yet.</p>';
            return;
        }
        
        reviewsContainer.innerHTML = '';
        snapshot.forEach(doc => {
            const review = { id: doc.id, ...doc.data() };
            const reviewCard = createReviewCard(review);
            reviewsContainer.appendChild(reviewCard);
        });
    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsContainer.innerHTML = '<p class="loading">Error loading reviews.</p>';
    }
}

// Create review card element
function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const date = review.date ? new Date(review.date.seconds * 1000).toLocaleDateString() : '';
    
    card.innerHTML = `
        <div class="review-header">
            <div class="review-client">
                <h4>${review.clientName}</h4>
                ${review.project ? `<p class="review-project">${review.project}</p>` : ''}
            </div>
            <div class="review-rating">${stars}</div>
        </div>
        <p class="review-comment">"${review.comment}"</p>
        ${date ? `<p class="review-date">${date}</p>` : ''}
    `;
    
    return card;
}

// Close modal
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal')) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal === e.target || e.target.classList.contains('close-modal')) {
                modal.style.display = 'none';
            }
        });
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    animateStats();
    loadFeaturedProjects();
    
    // Load designers if on designers page
    if (document.getElementById('designersGrid')) {
        loadDesigners();
    }
    
    // Load reviews if on reviews page
    if (document.getElementById('reviewsGrid')) {
        loadReviews();
    }
});
