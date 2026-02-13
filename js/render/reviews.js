// Reviews rendering utilities

export async function loadReviews() {
    try {
        const response = await fetch('data/reviews.json');
        const data = await response.json();
        return data.reviews.filter(r => r.isPublished);
    } catch (error) {
        console.error('Error loading reviews:', error);
        return [];
    }
}

export function renderReviewCard(review) {
    const projectLink = review.projectSlug 
        ? ` <a href="work/${review.projectSlug}.html" class="review-project-link">View project</a>`
        : '';
    
    return `
        <article class="review-card">
            <blockquote class="review-quote">
                "${review.quote}"
            </blockquote>
            <footer class="review-footer">
                <cite class="review-client">${review.clientName}</cite>
                ${projectLink}
            </footer>
        </article>
    `;
}

export function renderReviewsGrid(reviews, container) {
    if (!container) return;
    
    container.innerHTML = reviews
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(review => renderReviewCard(review))
        .join('');
}
