// Reusable components

export async function renderHeader(basePath = '') {
    const path = basePath ? `${basePath}data/site.json` : 'data/site.json';
    const siteConfig = await fetch(path).then(r => r.json());
    const nav = siteConfig.nav.primary;
    
    const indexHref = basePath ? `${basePath}index.html` : 'index.html';
    
    return `
        <header class="header">
            <div class="container header-content">
                <a href="${indexHref}" class="logo">${siteConfig.brandName}</a>
                <nav>
                    <ul class="nav-menu">
                        ${nav.map(item => {
                            const href = basePath ? `${basePath}${item.href}` : item.href;
                            return `<li><a href="${href}">${item.label}</a></li>`;
                        }).join('')}
                    </ul>
                    <div class="hamburger">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </nav>
            </div>
        </header>
    `;
}

export async function renderFooter(basePath = '') {
    const path = basePath ? `${basePath}data/site.json` : 'data/site.json';
    const siteConfig = await fetch(path).then(r => r.json());
    const contact = siteConfig.contact;
    
    return `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <p class="footer-legal">${siteConfig.legalName}</p>
                        <p class="footer-location">${siteConfig.locationLine}</p>
                    </div>
                    <div class="footer-section">
                        <p><a href="mailto:${contact.email}">${contact.email}</a></p>
                        <p><a href="https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener">${contact.whatsapp}</a></p>
                        <p><a href="https://instagram.com/${contact.instagram.replace('@', '')}" target="_blank" rel="noopener">${contact.instagram}</a></p>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; ${new Date().getFullYear()} ${siteConfig.legalName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
}
