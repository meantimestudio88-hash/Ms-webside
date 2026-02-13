// Testimonials rendering utilities

export async function loadTestimonials(basePath = '') {
    try {
        const path = basePath ? `${basePath}data/testimonials.json` : 'data/testimonials.json';
        const response = await fetch(path);
        const data = await response.json();
        return data.testimonials.filter(t => t.isPublished);
    } catch (error) {
        console.error('Error loading testimonials:', error);
        return [];
    }
}

export function renderTestimonial(testimonial, basePath = '') {
    const projectLink = testimonial.projectSlug 
        ? ` <a href="${basePath}work/${testimonial.projectSlug}.html" class="testimonial-project-link">View project</a>`
        : '';
    
    return `
        <article class="testimonial-item">
            <blockquote class="testimonial-quote">
                ${testimonial.quote}
            </blockquote>
            <footer class="testimonial-footer">
                <cite class="testimonial-name">${testimonial.nameOrInitials}</cite>
                ${projectLink}
            </footer>
        </article>
    `;
}

export function renderTestimonialsList(testimonials, container, basePath = '') {
    if (!container) return;
    
    container.innerHTML = testimonials
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(testimonial => renderTestimonial(testimonial, basePath))
        .join('');
}
