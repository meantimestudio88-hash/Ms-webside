// People rendering utilities

export async function loadPeople(basePath = '') {
    try {
        const path = basePath ? `${basePath}data/people.json` : 'data/people.json';
        const response = await fetch(path);
        const data = await response.json();
        return data.people.filter(p => p.isPublished);
    } catch (error) {
        console.error('Error loading people:', error);
        return [];
    }
}

export function renderPersonCard(person, basePath = '') {
    const photoPath = basePath ? `${basePath}${person.photo}` : person.photo;
    return `
        <article class="person-card">
            <div class="person-photo">
                <img src="${photoPath}" alt="${person.name}" loading="lazy">
            </div>
            <div class="person-info">
                <h3 class="person-name">${person.name}</h3>
                <p class="person-role">${person.role}</p>
                ${person.bioShort ? `<p class="person-bio">${person.bioShort}</p>` : ''}
            </div>
        </article>
    `;
}

export function renderPeopleGrid(people, container, basePath = '') {
    if (!container) return;
    
    container.innerHTML = people
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(person => renderPersonCard(person, basePath))
        .join('');
}
