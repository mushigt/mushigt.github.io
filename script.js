// Data storage
let portfolioData = null;
let currentFilter = 'all';

// Load data from JSON
async function loadData() {
    try {
        const response = await fetch('data.json');
        portfolioData = await response.json();
        initializePortfolio();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Initialize portfolio
function initializePortfolio() {
    renderSkills();
    renderTools();
    renderProjects();
    renderFilters();
    setupEventListeners();
    animateOnScroll();
    setCurrentYear();
}

// Render Skills
function renderSkills() {
    const skillsGrid = document.getElementById('skillsGrid');
    
    portfolioData.skillCategories.forEach((category, index) => {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        skillCard.style.animationDelay = `${index * 0.1}s`;
        
        skillCard.innerHTML = `
            <div class="skill-icon">
                <div class="skill-icon-bg">
                    <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
                    </svg>
                </div>
            </div>
            <h3 class="skill-title">${category.title}</h3>
            <div class="skills-list">
                ${category.skills.map(skill => `
                    <div class="skill-item">
                        <div class="skill-header">
                            <span class="skill-name">${skill.name}</span>
                            <span class="skill-level">${skill.level}%</span>
                        </div>
                        <div class="skill-bar-bg">
                            <div class="skill-bar" data-level="${skill.level}"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        skillsGrid.appendChild(skillCard);
    });
}

// Render Tools
function renderTools() {
    const toolsGrid = document.getElementById('toolsGrid');
    
    portfolioData.tools.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        
        toolCard.innerHTML = `
            <div class="tool-icon">${tool.icon}</div>
            <h4 class="tool-name">${tool.name}</h4>
        `;
        
        toolsGrid.appendChild(toolCard);
    });
}

// Render Filters
function renderFilters() {
    const filtersContainer = document.getElementById('projectFilters');
    
    portfolioData.filters.forEach(filter => {
        const button = document.createElement('button');
        button.className = `filter-btn ${filter.id === 'all' ? 'active' : ''}`;
        button.textContent = filter.label;
        button.dataset.filter = filter.id;
        
        button.addEventListener('click', () => {
            currentFilter = filter.id;
            updateFilterButtons();
            renderProjects();
        });
        
        filtersContainer.appendChild(button);
    });
}

// Update Filter Buttons
function updateFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Render Projects
function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';
    
    const filteredProjects = currentFilter === 'all' 
        ? portfolioData.projects 
        : portfolioData.projects.filter(project => project.category === currentFilter);
    
    filteredProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        projectCard.innerHTML = `
            <div class="project-image-wrapper">
                <img src="${project.image}" alt="${project.title}" class="project-image" />
                <div class="project-image-overlay"></div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                </div>
                <div class="project-buttons">
                    <button class="project-btn project-btn-primary">Voir détail</button>
                    <button class="project-btn project-btn-secondary">GitHub</button>
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animate elements on scroll
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate skill bars
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => observer.observe(section));
}

// Animate Skill Bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const level = bar.dataset.level;
            bar.style.width = level + '%';
        }, index * 100);
    });
}

// Set current year in footer
function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = '#0f172999';
    } else {
        navbar.style.backgroundColor = '#0f172999';
    }
});

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
} else {
    loadData();
}