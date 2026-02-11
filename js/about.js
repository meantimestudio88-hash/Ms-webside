// 加载并填充 about 页面内容
async function loadAboutContent() {
    try {
        const response = await fetch('data/about-content.json');
        const content = await response.json();
        
        // 填充 Hero 部分
        const heroTagline = document.querySelector('.about-hero .hero-tagline');
        const heroTitle = document.querySelector('.about-hero .about-page-title');
        const heroSubtitle = document.querySelector('.about-hero .about-page-subtitle');
        
        if (heroTagline) heroTagline.textContent = content.hero.tagline;
        if (heroTitle) heroTitle.textContent = content.hero.title;
        if (heroSubtitle) heroSubtitle.textContent = content.hero.subtitle;
        
        // 填充 Narrative 部分
        const narrativeTitle = document.querySelector('.about-page-text .section-title-left');
        const narrativeContainer = document.querySelector('.about-page-text');
        
        if (narrativeTitle && content.narrative.title) {
            narrativeTitle.textContent = content.narrative.title;
        }
        
        if (narrativeContainer) {
            const paragraphs = narrativeContainer.querySelectorAll('.section-description');
            content.narrative.paragraphs.forEach((text, index) => {
                if (paragraphs[index]) {
                    paragraphs[index].textContent = text;
                }
            });
        }
        
        // 填充 Meta 信息
        const metaItems = document.querySelectorAll('.about-page-meta .studio-meta-item');
        content.narrative.meta.forEach((meta, index) => {
            if (metaItems[index]) {
                const title = metaItems[index].querySelector('h3');
                const text = metaItems[index].querySelector('p');
                if (title) title.textContent = meta.title;
                if (text) text.textContent = meta.text;
            }
        });
        
        // 填充 Approach 部分
        const approachTitle = document.querySelector('.about-approach .section-title-left');
        const approachDescription = document.querySelector('.about-approach-header .section-description');
        
        if (approachTitle) approachTitle.textContent = content.approach.title;
        if (approachDescription) approachDescription.textContent = content.approach.description;
        
        // 填充 Approach Steps
        const approachItems = document.querySelectorAll('.about-approach-item');
        content.approach.steps.forEach((step, index) => {
            if (approachItems[index]) {
                const label = approachItems[index].querySelector('.about-approach-label');
                const title = approachItems[index].querySelector('h3');
                const text = approachItems[index].querySelector('p');
                
                if (label) label.textContent = step.number;
                if (title) title.textContent = step.title;
                if (text) text.textContent = step.text;
            }
        });
        
        // 填充 Links 部分
        const linkCards = document.querySelectorAll('.about-link-card');
        content.links.forEach((link, index) => {
            if (linkCards[index]) {
                const title = linkCards[index].querySelector('h3');
                const description = linkCards[index].querySelector('p');
                const linkElement = linkCards[index].querySelector('.about-link');
                
                if (title) title.textContent = link.title;
                if (description) description.textContent = link.description;
                if (linkElement) {
                    linkElement.textContent = link.linkText;
                    linkElement.href = link.url;
                }
            }
        });
        
    } catch (error) {
        console.error('Error loading about content:', error);
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadAboutContent);
