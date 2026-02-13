// Projects rendering utilities

export async function loadProjects(basePath = '') {
    try {
        const path = basePath ? `${basePath}data/projects.json` : 'data/projects.json';
        const response = await fetch(path);
        const data = await response.json();
        return data.projects.filter(p => p.isPublished);
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

export function renderProjectCard(project, basePath = '') {
    const href = basePath ? `${basePath}work/${project.slug}.html` : `work/${project.slug}.html`;
    return `
        <article class="project-card">
            <a href="${href}" class="project-card-link">
                <div class="project-card-image">
                    <img src="${project.coverImage}" alt="${project.title}" loading="lazy">
                </div>
                <div class="project-card-info">
                    <h3 class="project-card-title">${project.title}</h3>
                    <p class="project-card-meta">${project.location} — ${project.year}</p>
                </div>
            </a>
        </article>
    `;
}

export function renderProjectIndexItem(project) {
    return `
        <div class="project-index-item">
            <a href="work/${project.slug}.html" class="project-index-link">
                <span class="project-index-title">${project.title}</span>
                <span class="project-index-meta">— ${project.year}</span>
            </a>
        </div>
    `;
}

export function renderProjectGrid(projects, container, basePath = '') {
    if (!container) return;
    
    container.innerHTML = projects
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(project => renderProjectCard(project, basePath))
        .join('');
}

export function renderProjectIndex(projects, container) {
    if (!container) return;
    
    container.innerHTML = projects
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(project => renderProjectIndexItem(project))
        .join('');
}

export function renderFeaturedProjects(projects, container) {
    if (!container) return;
    
    const featured = projects.filter(p => p.isFeatured);
    renderProjectGrid(featured, container);
}

export async function getProjectBySlug(slug, basePath = '') {
    const projects = await loadProjects(basePath);
    return projects.find(p => p.slug === slug);
}

export function renderProjectDetail(project, basePath = '') {
    if (!project) return '';
    
    const coverImagePath = basePath ? `${basePath}${project.coverImage}` : project.coverImage;
    const galleryHTML = project.galleryImages.map(img => {
        const imgPath = basePath ? `${basePath}${img}` : img;
        return `<div class="gallery-item"><img src="${imgPath}" alt="${project.title}" class="gallery-image" loading="lazy"></div>`;
    }).join('');
    
    return `
        <div class="project-hero">
            <img src="${coverImagePath}" alt="${project.title}" class="project-hero-image">
        </div>
        <div class="project-header">
            <h1 class="project-title">${project.title}</h1>
            <p class="project-meta">${project.location} — ${project.year} — ${project.type}</p>
        </div>
        <section class="project-section">
            <p class="project-intro">${project.introLifestyle || ''}</p>
        </section>
        <section class="project-section">
            <h2 class="section-heading">Living Framework</h2>
            <p class="section-content">${project.livingFramework || ''}</p>
        </section>
        <section class="project-section project-gallery">
            <h2 class="section-heading">Gallery</h2>
            <div class="gallery-grid">
                ${galleryHTML}
            </div>
        </section>
        <section class="project-section">
            <h2 class="section-heading">Delivery</h2>
            <p class="section-content">${project.deliveryNote || ''}</p>
        </section>
    `;
}
