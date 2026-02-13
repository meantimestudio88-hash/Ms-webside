// Main application logic

import { loadProjects, renderFeaturedProjects, getProjectBySlug, renderProjectDetail, renderProjectGrid, renderProjectIndex } from './render/projects.js';
import { loadTestimonials, renderTestimonialsList } from './render/testimonials.js';
import { loadPeople, renderPeopleGrid } from './render/people.js';

// Load site configuration
export async function loadSiteConfig() {
    try {
        const response = await fetch('data/site.json');
        return await response.json();
    } catch (error) {
        console.error('Error loading site config:', error);
        return null;
    }
}

// Initialize navigation
export function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Set active nav item based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
}

// Initialize page-specific content
export async function initHomePage() {
    const featuredContainer = document.getElementById('featuredProjects');
    if (featuredContainer) {
        const projects = await loadProjects();
        renderFeaturedProjects(projects, featuredContainer);
    }
}

export async function initWorkPage() {
    const featuredContainer = document.getElementById('featuredProjects');
    const allProjectsContainer = document.getElementById('allProjects');
    
    const projects = await loadProjects();
    
    if (featuredContainer) {
        const featured = projects.filter(p => p.isFeatured);
        renderProjectGrid(featured, featuredContainer);
    }
    
    if (allProjectsContainer) {
        renderProjectIndex(projects, allProjectsContainer);
    }
}

export async function initProjectDetailPage() {
    const path = window.location.pathname;
    const isInWorkFolder = path.includes('/work/');
    const basePath = isInWorkFolder ? '../' : '';
    const slug = path.split('/').pop().replace('.html', '');
    const container = document.getElementById('projectDetail');
    
    if (container) {
        const project = await getProjectBySlug(slug, basePath);
        if (project) {
            container.innerHTML = renderProjectDetail(project, basePath);
            
            // Load related projects
            const relatedContainer = document.getElementById('relatedProjects');
            if (relatedContainer) {
                const projects = await loadProjects(basePath);
                const related = projects
                    .filter(p => p.slug !== slug)
                    .slice(0, 2);
                renderProjectGrid(related, relatedContainer, basePath);
            }
        } else {
            container.innerHTML = '<p>Project not found.</p>';
        }
    }
}

export async function initStudioPage() {
    const peopleContainer = document.getElementById('peopleGrid');
    const testimonialsContainer = document.getElementById('testimonialsList');
    
    if (peopleContainer) {
        const people = await loadPeople();
        renderPeopleGrid(people, peopleContainer);
    }
    
    if (testimonialsContainer) {
        const testimonials = await loadTestimonials();
        renderTestimonialsList(testimonials, testimonialsContainer);
    }
}

export async function initMethodPage() {
    // Method page is mostly static content
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    
    const path = window.location.pathname;
    
    if (path === '/' || path.includes('index.html')) {
        await initHomePage();
    } else if (path.includes('work.html')) {
        await initWorkPage();
    } else if (path.includes('work/')) {
        await initProjectDetailPage();
    } else if (path.includes('studio.html')) {
        await initStudioPage();
    } else if (path.includes('method.html')) {
        await initMethodPage();
    }
});
