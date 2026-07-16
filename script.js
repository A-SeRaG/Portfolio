/* ==========================================================================
   1. DATA LAYER (LOCALSTORAGE UTILITIES)
   ========================================================================== */
function loadPortfolioData() {
    let raw = localStorage.getItem('portfolio_data');
    if (!raw) {
        // First-time load: populate with defaults from data.js
        localStorage.setItem('portfolio_data', JSON.stringify(window.DEFAULT_PORTFOLIO_DATA));
        return window.DEFAULT_PORTFOLIO_DATA;
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error("Error parsing local portfolio data. Reverting to default.", e);
        return window.DEFAULT_PORTFOLIO_DATA;
    }
}

function savePortfolioData(data) {
    localStorage.setItem('portfolio_data', JSON.stringify(data));
}

function resetPortfolioData() {
    localStorage.setItem('portfolio_data', JSON.stringify(window.DEFAULT_PORTFOLIO_DATA));
    return window.DEFAULT_PORTFOLIO_DATA;
}

/* ==========================================================================
   2. GLOBAL TOAST NOTIFIER
   ========================================================================== */
function showToast(message, isError = false) {
    const toast = document.getElementById('save-status-toast');
    if (!toast) return;
    
    toast.innerHTML = isError 
        ? `<i class="fa-solid fa-triangle-exclamation"></i> ${message}`
        : `<i class="fa-solid fa-circle-check"></i> ${message}`;
        
    toast.style.background = isError ? '#ef4444' : '#10b981';
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3500);
}

/* ==========================================================================
   3. BACKGROUND PARTICLES SYSTEM
   ========================================================================== */
let globalParticleColor = 'rgba(59, 130, 246, 0.45)'; // default accent color (software)

function initBackgroundParticles() {
    const canvas = document.getElementById('bg-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationId = null;

    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    class Particle {
        constructor(x, y, vx, vy, size, color) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            if (this.x > canvas.width || this.x < 0) this.vx = -this.vx;
            if (this.y > canvas.height || this.y < 0) this.vy = -this.vy;

            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    this.x += dx * 0.02;
                    this.y += dy * 0.02;
                }
            }

            this.x += this.vx;
            this.y += this.vy;
            this.draw();
        }
    }

    function createParticles() {
        particlesArray = [];
        let count = (canvas.width * canvas.height) / 14000;
        count = Math.min(count, 100);

        for (let i = 0; i < count; i++) {
            let size = (Math.random() * 2) + 1;
            let x = Math.random() * (canvas.width - size * 2) + size * 2;
            let y = Math.random() * (canvas.height - size * 2) + size * 2;
            let vx = (Math.random() * 0.6) - 0.3;
            let vy = (Math.random() * 0.6) - 0.3;

            particlesArray.push(new Particle(x, y, vx, vy, size, globalParticleColor));
        }
    }

    function connect() {
        let maxRange = 110;
        for (let a = 0; a < particlesArray.length; a++) {
            particlesArray[a].color = globalParticleColor;
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxRange) {
                    let opacity = 1 - (distance / maxRange);
                    let accentRGB = getComputedStyle(document.body).getPropertyValue('--accent-rgb').trim();
                    ctx.strokeStyle = `rgba(${accentRGB || '59,130,246'}, ${opacity * 0.09})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        animationId = requestAnimationFrame(animate);
    }

    createParticles();
    animate();
}

/* ==========================================================================
   4. COMMON APP LIFECYCLE (GLOBAL EVENT INITIALIZERS)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load data from LocalStorage
    const data = loadPortfolioData();

    // 2. Initialize universal elements
    initBackgroundParticles();
    initMobileNav();
    initCopyButtons();
    initContactForm();

    // 3. Page specific rendering selectors
    if (document.getElementById('hero-name')) {
        renderIndexPage(data);
    } else if (document.getElementById('timeline-events-container')) {
        renderTimelinePage(data);
    } else if (document.querySelector('.customize-sidebar')) {
        initCustomizerPage(data);
    }
});

function initMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
        const icon = menuToggle.querySelector('i');
        icon.className = mobileNav.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            menuToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });
}

function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const copyText = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(copyText).then(() => {
                const icon = btn.querySelector('i');
                icon.className = 'fa-solid fa-check';
                icon.style.color = 'var(--accent-color)';
                setTimeout(() => {
                    icon.className = 'fa-regular fa-copy';
                    icon.style.color = '';
                }, 2000);
            }).catch(e => console.error("Copy failed", e));
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status-msg');
    if (!form || !statusMsg) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.btn-submit');
        const origHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Transmitting...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origHTML;
            form.reset();
            
            const nameVal = document.getElementById('name').value || 'User';
            statusMsg.textContent = `Transmission received! Thank you, I will respond soon.`;
            statusMsg.className = 'form-status success';
            setTimeout(() => { statusMsg.className = 'form-status'; statusMsg.textContent = ''; }, 5000);
        }, 1200);
    });
}

/* ==========================================================================
   5. PORTFOLIO INDEX VIEW COMPILER
   ========================================================================== */
let slideshowIndex = 0;
let slideshowInterval = null;

function renderIndexPage(data) {
    // -- Render Hero text
    document.getElementById('hero-name').innerHTML = data.hero.name.replace("SERAG", `<span class="gradient-text">SERAG</span>`);
    document.getElementById('hero-titles').textContent = data.hero.titles;
    document.getElementById('hero-summary').textContent = data.hero.summary;
    document.getElementById('footer-name-year').textContent = `${new Date().getFullYear()} ${data.hero.name}`;

    // -- Render Hero photo slideshow
    renderSlideshow(data.hero.photos);

    // -- Render Specializations
    renderSpecializationsList(data.specializations);

    // -- Render Skills
    renderSkillsList(data.skills);

    // -- Render Projects
    renderProjectsList(data.projects);

    // -- Render Certificates
    renderCertificatesList(data.certificates);

    // -- Render Hobbies
    renderHobbiesList(data.hobbies);

    // -- Render Contact Info
    renderContactInfoList(data.contact);
}

// 5.1 Hero slideshow compiler
function renderSlideshow(photos) {
    const frame = document.getElementById('hero-slideshow');
    const dotsContainer = document.getElementById('slide-indicators');
    if (!frame || !dotsContainer) return;

    frame.innerHTML = '';
    dotsContainer.innerHTML = '';

    if (!photos || photos.length === 0) {
        // Fallback placeholder
        photos = ['assets/hero_bg.png'];
    }

    photos.forEach((photo, idx) => {
        // Add slide element
        const slide = document.createElement('div');
        slide.className = `slide ${idx === 0 ? 'active' : ''}`;
        slide.style.backgroundImage = `url('${photo}')`;
        frame.appendChild(slide);

        // Add indicator dot
        const dot = document.createElement('span');
        dot.className = `slide-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('data-index', idx);
        dot.addEventListener('click', () => setSlide(idx));
        dotsContainer.appendChild(dot);
    });

    slideshowIndex = 0;
    startSlideshowTimer(photos.length);

    // Bind control arrows
    document.getElementById('prev-slide').onclick = () => changeSlide(-1, photos.length);
    document.getElementById('next-slide').onclick = () => changeSlide(1, photos.length);
}

function startSlideshowTimer(totalSlides) {
    if (slideshowInterval) clearInterval(slideshowInterval);
    if (totalSlides <= 1) return;
    slideshowInterval = setInterval(() => {
        changeSlide(1, totalSlides);
    }, 4500);
}

function setSlide(idx) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    if (slides.length === 0 || idx >= slides.length) return;

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[idx].classList.add('active');
    dots[idx].classList.add('active');
    slideshowIndex = idx;
}

function changeSlide(direction, totalSlides) {
    let nextIdx = slideshowIndex + direction;
    if (nextIdx >= totalSlides) nextIdx = 0;
    if (nextIdx < 0) nextIdx = totalSlides - 1;
    setSlide(nextIdx);
}

// 5.2 Specialization list renderer
function renderSpecializationsList(specs) {
    const grid = document.getElementById('specializations-cards-grid');
    if (!grid) return;

    grid.innerHTML = '';

    // Theme references for variables update
    const themes = {
        devops: 'theme-devops',
        edtech: 'theme-edtech',
        fullstack: 'theme-software',
        datascience: 'theme-art'
    };

    const particleColors = {
        devops: 'rgba(245, 158, 11, 0.45)',
        edtech: 'rgba(16, 185, 129, 0.45)',
        fullstack: 'rgba(59, 130, 246, 0.45)',
        datascience: 'rgba(236, 72, 153, 0.45)'
    };

    const banners = {
        devops: 'assets/devops_banner.png',
        edtech: 'assets/edtech_banner.png',
        fullstack: 'assets/software_banner.png',
        datascience: 'assets/art_banner.png'
    };

    specs.forEach((spec, idx) => {
        const card = document.createElement('div');
        card.className = `pillar-card ${idx === 0 ? 'active' : ''}`;
        card.setAttribute('data-pillar', spec.id);
        card.id = `trigger-${spec.id}`;

        card.innerHTML = `
            <div class="pillar-card-bg" style="background-image: url('${banners[spec.id] || 'assets/hero_bg.png'}');"></div>
            <div class="pillar-card-overlay"></div>
            <div class="pillar-card-icon"><i class="${spec.icon}"></i></div>
            <h3 class="pillar-card-title">${spec.title.split(' ')[0]}</h3>
            <p class="pillar-card-desc">${spec.description.substring(0, 75)}...</p>
            <span class="pillar-card-action">Explore <i class="fa-solid fa-chevron-right"></i></span>
            <div class="pillar-card-border"></div>
        `;

        // Card click triggers detail updates
        card.addEventListener('click', () => {
            document.querySelectorAll('.pillar-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Apply themes variables changes dynamically
            document.body.className = themes[spec.id] || 'theme-software';
            globalParticleColor = particleColors[spec.id] || 'rgba(59, 130, 246, 0.45)';

            // Render specific panel details
            renderSpecializationDetailsPanel(spec);
        });

        grid.appendChild(card);
    });

    // Initial render of first specialization details
    if (specs.length > 0) {
        renderSpecializationDetailsPanel(specs[0]);
    }
}

function renderSpecializationDetailsPanel(spec) {
    const container = document.getElementById('specialization-details-panel');
    if (!container) return;

    container.innerHTML = `
        <div class="pillar-panel active" id="panel-${spec.id}">
            <div class="panel-layout">
                <div class="panel-text">
                    <h3 class="panel-title"><i class="${spec.icon}"></i> ${spec.title}</h3>
                    <p class="panel-summary">${spec.description}</p>
                    <div class="features-list">
                        ${spec.details.map(det => `
                            <div class="feature-item">
                                <div class="feature-icon"><i class="fa-solid fa-circle-check"></i></div>
                                <div>
                                    <p style="font-size: 1rem; color: var(--text-primary); line-height: 1.5;">${det}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="spec-mock-visual animate-scale-up">
                    <img src="${
                        spec.id === 'devops' ? 'assets/devops_banner.png' :
                        spec.id === 'edtech' ? 'assets/edtech_banner.png' :
                        spec.id === 'fullstack' ? 'assets/software_banner.png' : 'assets/art_banner.png'
                    }" alt="${spec.title} Illustration">
                    <div class="glowing-border"></div>
                </div>
            </div>
        </div>
    `;
}

// 5.3 Skills list compiler
function renderSkillsList(skills) {
    const techBox = document.getElementById('tech-skills-container');
    const softBox = document.getElementById('soft-skills-container');
    const langBox = document.getElementById('languages-container');

    if (techBox) {
        techBox.innerHTML = skills.technical.map(skill => `
            <span class="tag">${skill}</span>
        `).join('');
    }

    if (softBox) {
        softBox.innerHTML = skills.soft.map(skill => `
            <span class="tag">${skill}</span>
        `).join('');
    }

    if (langBox) {
        langBox.innerHTML = skills.languages.map(lang => `
            <div class="lang-item">
                <span class="lang-name">${lang.name}</span>
                <span class="lang-level">${lang.level}</span>
            </div>
        `).join('');
    }
}

// 5.4 Projects list compiler
function renderProjectsList(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = '';
    
    if (!projects || projects.length === 0) {
        container.innerHTML = '<p class="text-muted">No projects found. Add projects in the customization console.</p>';
        return;
    }

    projects.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'glass-card project-card';
        card.innerHTML = `
            <div class="project-img-wrapper">
                <img src="${proj.image || 'assets/software_banner.png'}" alt="${proj.title}">
            </div>
            <div class="project-card-content">
                <h3 class="project-title">${proj.title}</h3>
                <p class="project-desc">${proj.desc}</p>
                <div class="project-footer">
                    <div class="tech-tags">
                        ${proj.tags.split(',').map(tag => `<span class="tag" style="font-size: 0.75rem;">${tag.trim()}</span>`).join('')}
                    </div>
                    <a href="${proj.link || '#'}" target="_blank" rel="noopener noreferrer" class="project-link-icon" aria-label="Github link">
                        <i class="fa-brands fa-github"></i>
                    </a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// 5.5 Certificates list compiler
function renderCertificatesList(certs) {
    const container = document.getElementById('certificates-container');
    if (!container) return;

    container.innerHTML = '';

    if (!certs || certs.length === 0) {
        container.innerHTML = '<p class="text-muted">No certificates found. Add certificates in the customization console.</p>';
        return;
    }

    certs.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'glass-card certificate-card';
        card.innerHTML = `
            <div class="cert-icon"><i class="fa-solid fa-award"></i></div>
            <h3 class="cert-title">${cert.title}</h3>
            <p class="cert-issuer">${cert.issuer}</p>
            <div class="cert-footer">
                <span>Date: ${cert.date}</span>
                <a href="${cert.link || '#'}" class="cert-link" target="_blank">Verify <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.7rem;"></i></a>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderHobbiesList(hobbies) {
    const container = document.getElementById('hobbies-container');
    if (!container) return;

    container.innerHTML = '';
    
    if (!hobbies || hobbies.length === 0) {
        container.innerHTML = '<p class="text-muted">No hobbies logged. Add hobbies in the customization console.</p>';
        return;
    }

    hobbies.forEach(hobby => {
        const card = document.createElement('div');
        card.className = 'glass-card hobby-card';
        card.innerHTML = `
            <div class="hobby-icon"><i class="${hobby.icon}"></i></div>
            <h3 class="hobby-title">${hobby.title}</h3>
            <p class="hobby-desc">${hobby.desc}</p>
        `;
        container.appendChild(card);
    });
}

// 5.6 Contact list compiler
function renderContactInfoList(contact) {
    const infoBlocks = document.getElementById('contact-info-blocks');
    const socialIcons = document.getElementById('contact-social-icons');

    if (infoBlocks) {
        infoBlocks.innerHTML = `
            <div class="info-block glass-card">
                <div class="info-icon"><i class="fa-solid fa-envelope"></i></div>
                <div class="info-details">
                    <span class="info-label">Email</span>
                    <span class="info-value">${contact.email}</span>
                </div>
                <button class="copy-btn" data-copy="${contact.email}" aria-label="Copy Email"><i class="fa-regular fa-copy"></i></button>
            </div>

            <div class="info-block glass-card">
                <div class="info-icon"><i class="fa-solid fa-phone"></i></div>
                <div class="info-details">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${contact.phone}</span>
                </div>
                <button class="copy-btn" data-copy="${contact.phone.replace(/[^0-9]/g, '')}" aria-label="Copy Phone"><i class="fa-regular fa-copy"></i></button>
            </div>

            <div class="info-block glass-card">
                <div class="info-icon"><i class="fa-solid fa-location-dot"></i></div>
                <div class="info-details">
                    <span class="info-label">Address</span>
                    <span class="info-value">${contact.address}</span>
                </div>
            </div>
        `;

        // Re-bind click event to new copy buttons
        initCopyButtons();
    }

    if (socialIcons) {
        socialIcons.innerHTML = `
            <a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="LinkedIn Profile"><i class="fa-brands fa-linkedin-in"></i></a>
            <a href="${contact.github}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="GitHub Profile"><i class="fa-brands fa-github"></i></a>
        `;
    }
}

/* ==========================================================================
   6. PORTFOLIO TIMELINE VIEW COMPILER
   ========================================================================== */
function renderTimelinePage(data) {
    const tabs = document.querySelectorAll('.timeline-tab');
    if (tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const stage = tab.getAttribute('data-timeline-stage');
            renderTimelineEvents(data.timeline, stage);
        });
    });

    // First render defaults to Juniority
    renderTimelineEvents(data.timeline, 'juniority');
}

function renderTimelineEvents(events, stage) {
    const container = document.getElementById('timeline-events-container');
    if (!container) return;

    container.innerHTML = '';

    const filtered = events.filter(e => e.stage === stage);

    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-muted" style="text-align:center; padding: 2rem;">No milestones logged for this stage yet.</p>';
        return;
    }

    // Sort events logically if needed (e.g. chronologically). We keep the database sorting.
    filtered.forEach(evt => {
        const item = document.createElement('div');
        item.className = 'glass-card timeline-event-card';
        item.innerHTML = `
            <div class="timeline-event-header">
                <div class="timeline-event-header-left">
                    <span class="timeline-event-date">${evt.date}</span>
                    <h3 class="timeline-event-title">${evt.title}</h3>
                    <p class="timeline-event-subtitle">${evt.subtitle}</p>
                </div>
                <div class="timeline-event-icon"><i class="fa-solid fa-chevron-down"></i></div>
            </div>
            <div class="timeline-event-body">
                <div class="timeline-event-body-content">
                    <p class="timeline-event-desc">${evt.text}</p>
                    ${evt.image ? `
                        <div class="timeline-event-photos">
                            <img src="${evt.image}" alt="${evt.title} Photo">
                        </div>
                    ` : ''}
                    ${evt.link ? `
                        <a href="${evt.link}" target="_blank" class="btn btn-secondary btn-small" style="align-self: flex-start;">
                            <span>Visit / Verify Link</span> <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                    ` : ''}
                </div>
            </div>
        `;

        // Expand / collapse logic
        const header = item.querySelector('.timeline-event-header');
        header.addEventListener('click', () => {
            const isExpanded = item.classList.contains('expanded');
            
            // Close other items (optional accordion behavior, let's make it standard accordion)
            document.querySelectorAll('.timeline-event-card').forEach(c => {
                c.classList.remove('expanded');
            });

            if (!isExpanded) {
                item.classList.add('expanded');
            }
        });

        container.appendChild(item);
    });
}

/* ==========================================================================
   7. CUSTOMIZATION HUB CONSOLE CONTROLLER
   ========================================================================== */
let localEditState = null; // Working copy of our data

function initCustomizerPage(data) {
    localEditState = JSON.parse(JSON.stringify(data)); // deep clone

    // Sidebar tab triggers
    const sidebarTabs = document.querySelectorAll('.sidebar-tab');
    const panels = document.querySelectorAll('.tab-panel');

    sidebarTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            sidebarTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetTab = tab.getAttribute('data-tab');
            panels.forEach(p => {
                p.classList.remove('active');
                if (p.id === `tab-${targetTab}`) {
                    p.classList.add('active');
                }
            });
        });
    });

    // Setup forms and events
    setupHeroTab();
    setupSpecializationsTab();
    setupSkillsTab();
    setupProjectsTab();
    setupCertificatesTab();
    setupTimelineTab();
    setupHobbiesTab();
    setupContactTab();
    setupBackupsTab();

    // Save All Button listener
    document.getElementById('save-all-btn').addEventListener('click', () => {
        saveAllData();
    });
}

// 7.1 Hero Tab Logic
function setupHeroTab() {
    const nameInput = document.getElementById('hero-name-input');
    const titlesInput = document.getElementById('hero-titles-input');
    const summaryInput = document.getElementById('hero-summary-input');
    const photoUpload = document.getElementById('hero-photo-upload');

    nameInput.value = localEditState.hero.name;
    titlesInput.value = localEditState.hero.titles;
    summaryInput.value = localEditState.hero.summary;

    // Pre-fill photos thumbnails
    renderHeroPhotosEditor();

    photoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(evt) {
            localEditState.hero.photos.push(evt.target.result);
            renderHeroPhotosEditor();
        };
        reader.readAsDataURL(file);
    });
}

function renderHeroPhotosEditor() {
    const container = document.getElementById('hero-uploaded-photos');
    if (!container) return;
    container.innerHTML = '';

    localEditState.hero.photos.forEach((photo, idx) => {
        const thumb = document.createElement('div');
        thumb.className = 'photo-thumb-container';
        thumb.innerHTML = `
            <img src="${photo}" alt="Slideshow image ${idx + 1}">
            <button type="button" class="photo-delete-badge" data-index="${idx}" aria-label="Delete Image"><i class="fa-solid fa-xmark"></i></button>
        `;
        thumb.querySelector('.photo-delete-badge').addEventListener('click', () => {
            localEditState.hero.photos.splice(idx, 1);
            renderHeroPhotosEditor();
        });
        container.appendChild(thumb);
    });
}

// 7.2 Specializations Tab Logic
let activeEditingSpecIdx = 0;

function setupSpecializationsTab() {
    const selectors = document.getElementById('specs-selectors');
    if (!selectors) return;

    renderSpecSelectors();
    fillSpecForm();

    document.getElementById('spec-add-bullet').addEventListener('click', () => {
        localEditState.specializations[activeEditingSpecIdx].details.push('');
        renderSpecBullets();
    });
}

function renderSpecSelectors() {
    const container = document.getElementById('specs-selectors');
    container.innerHTML = '';

    localEditState.specializations.forEach((spec, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `spec-selector-btn ${idx === activeEditingSpecIdx ? 'active' : ''}`;
        btn.textContent = spec.title;
        btn.addEventListener('click', () => {
            // Save current spec inputs first
            saveCurrentSpecFormData();

            activeEditingSpecIdx = idx;
            document.querySelectorAll('.spec-selector-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            fillSpecForm();
        });
        container.appendChild(btn);
    });
}

function fillSpecForm() {
    const spec = localEditState.specializations[activeEditingSpecIdx];
    document.getElementById('spec-edit-id').value = spec.id;
    document.getElementById('spec-edit-title').value = spec.title;
    document.getElementById('spec-edit-icon').value = spec.icon;
    document.getElementById('spec-edit-desc').value = spec.description;

    renderSpecBullets();
}

function renderSpecBullets() {
    const container = document.getElementById('spec-bullets-builder');
    container.innerHTML = '';

    const bullets = localEditState.specializations[activeEditingSpecIdx].details;

    bullets.forEach((bullet, idx) => {
        const row = document.createElement('div');
        row.className = 'builder-row';
        row.innerHTML = `
            <input type="text" class="spec-bullet-input" value="${bullet}" placeholder="Detail milestone or duty">
            <button type="button" class="btn-remove-row" data-index="${idx}"><i class="fa-solid fa-trash"></i></button>
        `;
        row.querySelector('.btn-remove-row').addEventListener('click', () => {
            bullets.splice(idx, 1);
            renderSpecBullets();
        });
        container.appendChild(row);
    });
}

function saveCurrentSpecFormData() {
    const titleVal = document.getElementById('spec-edit-title').value;
    const iconVal = document.getElementById('spec-edit-icon').value;
    const descVal = document.getElementById('spec-edit-desc').value;

    const currentSpec = localEditState.specializations[activeEditingSpecIdx];
    currentSpec.title = titleVal;
    currentSpec.icon = iconVal;
    currentSpec.description = descVal;

    // Collect bullets
    const bulletInputs = document.querySelectorAll('.spec-bullet-input');
    const collectedBullets = [];
    bulletInputs.forEach(input => {
        if (input.value.trim() !== '') collectedBullets.push(input.value.trim());
    });
    currentSpec.details = collectedBullets;
}

// 7.3 Skills Tab Logic
function setupSkillsTab() {
    renderSkillsChips();

    // Technical skills new add
    document.getElementById('tech-skill-add-btn').onclick = () => {
        const input = document.getElementById('tech-skill-new');
        const skill = input.value.trim();
        if (skill !== '') {
            localEditState.skills.technical.push(skill);
            input.value = '';
            renderSkillsChips();
        }
    };

    // Soft skills new add
    document.getElementById('soft-skill-add-btn').onclick = () => {
        const input = document.getElementById('soft-skill-new');
        const skill = input.value.trim();
        if (skill !== '') {
            localEditState.skills.soft.push(skill);
            input.value = '';
            renderSkillsChips();
        }
    };

    // Language new add
    document.getElementById('lang-add-btn').onclick = () => {
        const nameInput = document.getElementById('lang-name-new');
        const levelInput = document.getElementById('lang-level-new');
        const nameVal = nameInput.value.trim();
        const levelVal = levelInput.value.trim();

        if (nameVal !== '' && levelVal !== '') {
            localEditState.skills.languages.push({ name: nameVal, level: levelVal });
            nameInput.value = '';
            levelInput.value = '';
            renderSkillsChips();
        }
    };
}

function renderSkillsChips() {
    const techGrid = document.getElementById('tech-skills-chips');
    const softGrid = document.getElementById('soft-skills-chips');
    const langList = document.getElementById('languages-list-builder');

    if (techGrid) {
        techGrid.innerHTML = '';
        localEditState.skills.technical.forEach((skill, idx) => {
            const chip = document.createElement('span');
            chip.className = 'chip';
            chip.innerHTML = `${skill} <i class="fa-solid fa-xmark chip-delete" data-index="${idx}"></i>`;
            chip.querySelector('.chip-delete').onclick = () => {
                localEditState.skills.technical.splice(idx, 1);
                renderSkillsChips();
            };
            techGrid.appendChild(chip);
        });
    }

    if (softGrid) {
        softGrid.innerHTML = '';
        localEditState.skills.soft.forEach((skill, idx) => {
            const chip = document.createElement('span');
            chip.className = 'chip';
            chip.innerHTML = `${skill} <i class="fa-solid fa-xmark chip-delete" data-index="${idx}"></i>`;
            chip.querySelector('.chip-delete').onclick = () => {
                localEditState.skills.soft.splice(idx, 1);
                renderSkillsChips();
            };
            softGrid.appendChild(chip);
        });
    }

    if (langList) {
        langList.innerHTML = '';
        localEditState.skills.languages.forEach((lang, idx) => {
            const item = document.createElement('div');
            item.className = 'bullet-item';
            item.innerHTML = `
                <span><strong>${lang.name}</strong> - ${lang.level}</span>
                <i class="fa-solid fa-trash bullet-item-delete" data-index="${idx}"></i>
            `;
            item.querySelector('.bullet-item-delete').onclick = () => {
                localEditState.skills.languages.splice(idx, 1);
                renderSkillsChips();
            };
            langList.appendChild(item);
        });
    }
}

// 7.4 Projects Tab Logic
function setupProjectsTab() {
    renderProjectsEditorList();

    document.getElementById('project-add-new-btn').onclick = () => {
        const newProj = {
            id: Date.now(),
            title: "New Project Title",
            desc: "Description of the project accomplishments...",
            tags: "HTML, CSS, JS",
            image: "assets/software_banner.png",
            link: "#"
        };
        localEditState.projects.unshift(newProj); // Add to beginning
        renderProjectsEditorList();
    };
}

function renderProjectsEditorList() {
    const container = document.getElementById('projects-editor-list');
    if (!container) return;

    container.innerHTML = '';

    localEditState.projects.forEach((proj, idx) => {
        const card = document.createElement('div');
        card.className = 'editor-item-card';
        card.innerHTML = `
            <div class="editor-card-header">
                <span class="editor-card-title">${proj.title}</span>
                <button type="button" class="btn-delete-item" data-index="${idx}"><i class="fa-solid fa-trash"></i> Delete</button>
            </div>
            <div class="panel-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" class="proj-title-input" value="${proj.title}">
                    </div>
                    <div class="form-group">
                        <label>GitHub / Website Link</label>
                        <input type="text" class="proj-link-input" value="${proj.link}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tags (comma-separated)</label>
                        <input type="text" class="proj-tags-input" value="${proj.tags}">
                    </div>
                    <div class="form-group">
                        <label>Thumbnail Banner</label>
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <img src="${proj.image}" alt="Banner" style="width:60px; height:40px; object-fit:cover; border-radius:4px; border:1px solid var(--border-glass);">
                            <label class="btn btn-secondary btn-small file-upload-label" style="padding: 0.35rem 0.75rem;">
                                <span>Upload</span>
                                <input type="file" class="proj-img-upload" accept="image/*" style="display:none;">
                            </label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="proj-desc-input" rows="3">${proj.desc}</textarea>
                </div>
            </div>
        `;

        // Bind delete
        card.querySelector('.btn-delete-item').onclick = () => {
            localEditState.projects.splice(idx, 1);
            renderProjectsEditorList();
        };

        // Bind image upload
        card.querySelector('.proj-img-upload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                localEditState.projects[idx].image = evt.target.result;
                renderProjectsEditorList();
            };
            reader.readAsDataURL(file);
        });

        container.appendChild(card);
    });
}

function saveProjectsInputs() {
    const cards = document.querySelectorAll('#projects-editor-list .editor-item-card');
    cards.forEach((card, idx) => {
        if (!localEditState.projects[idx]) return;

        localEditState.projects[idx].title = card.querySelector('.proj-title-input').value;
        localEditState.projects[idx].link = card.querySelector('.proj-link-input').value;
        localEditState.projects[idx].tags = card.querySelector('.proj-tags-input').value;
        localEditState.projects[idx].desc = card.querySelector('.proj-desc-input').value;
    });
}

// 7.5 Certificates Tab Logic
function setupCertificatesTab() {
    renderCertificatesEditorList();

    document.getElementById('cert-add-new-btn').onclick = () => {
        const newCert = {
            id: Date.now(),
            title: "New Certificate",
            issuer: "Certifying Organization",
            date: "Jan 2026",
            link: "#"
        };
        localEditState.certificates.unshift(newCert);
        renderCertificatesEditorList();
    };
}

function renderCertificatesEditorList() {
    const container = document.getElementById('certs-editor-list');
    if (!container) return;

    container.innerHTML = '';

    localEditState.certificates.forEach((cert, idx) => {
        const card = document.createElement('div');
        card.className = 'editor-item-card';
        card.innerHTML = `
            <div class="editor-card-header">
                <span class="editor-card-title">${cert.title}</span>
                <button type="button" class="btn-delete-item" data-index="${idx}"><i class="fa-solid fa-trash"></i> Delete</button>
            </div>
            <div class="panel-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" class="cert-title-input" value="${cert.title}">
                    </div>
                    <div class="form-group">
                        <label>Issuer / Institution</label>
                        <input type="text" class="cert-issuer-input" value="${cert.issuer}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Validation Date</label>
                        <input type="text" class="cert-date-input" value="${cert.date}">
                    </div>
                    <div class="form-group">
                        <label>Verification URL</label>
                        <input type="text" class="cert-link-input" value="${cert.link}">
                    </div>
                </div>
            </div>
        `;

        card.querySelector('.btn-delete-item').onclick = () => {
            localEditState.certificates.splice(idx, 1);
            renderCertificatesEditorList();
        };

        container.appendChild(card);
    });
}

function saveCertificatesInputs() {
    const cards = document.querySelectorAll('#certs-editor-list .editor-item-card');
    cards.forEach((card, idx) => {
        if (!localEditState.certificates[idx]) return;

        localEditState.certificates[idx].title = card.querySelector('.cert-title-input').value;
        localEditState.certificates[idx].issuer = card.querySelector('.cert-issuer-input').value;
        localEditState.certificates[idx].date = card.querySelector('.cert-date-input').value;
        localEditState.certificates[idx].link = card.querySelector('.cert-link-input').value;
    });
}

// 7.6 Timeline Tab Logic
function setupTimelineTab() {
    renderTimelineEditorList();

    document.getElementById('time-add-new-btn').onclick = () => {
        const newEvt = {
            id: Date.now(),
            stage: "juniority",
            title: "New Milestone Title",
            subtitle: "Subtitle / Institution",
            date: "Jan 2026",
            text: "Description detailing results or photos related.",
            image: "",
            link: ""
        };
        localEditState.timeline.unshift(newEvt);
        renderTimelineEditorList();
    };
}

function renderTimelineEditorList() {
    const container = document.getElementById('timeline-editor-list');
    if (!container) return;

    container.innerHTML = '';

    localEditState.timeline.forEach((evt, idx) => {
        const card = document.createElement('div');
        card.className = 'editor-item-card';
        card.innerHTML = `
            <div class="editor-card-header">
                <span class="editor-card-title">${evt.title} (${evt.stage})</span>
                <button type="button" class="btn-delete-item" data-index="${idx}"><i class="fa-solid fa-trash"></i> Delete</button>
            </div>
            <div class="panel-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" class="time-title-input" value="${evt.title}">
                    </div>
                    <div class="form-group">
                        <label>Subtitle / Role</label>
                        <input type="text" class="time-sub-input" value="${evt.subtitle}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Milestone Date</label>
                        <input type="text" class="time-date-input" value="${evt.date}">
                    </div>
                    <div class="form-group">
                        <label>Roadmap Stage</label>
                        <select class="time-stage-select">
                            <option value="juniority" ${evt.stage === 'juniority' ? 'selected' : ''}>Juniority (until high school)</option>
                            <option value="seniority" ${evt.stage === 'seniority' ? 'selected' : ''}>Seniority (after high school)</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Verification Link (Optional)</label>
                        <input type="text" class="time-link-input" value="${evt.link || ''}">
                    </div>
                    <div class="form-group">
                        <label>Photo Attachment (Optional)</label>
                        <div style="display:flex; gap:1rem; align-items:center;">
                            ${evt.image ? `<img src="${evt.image}" alt="Attachment" style="width:60px; height:40px; object-fit:cover; border-radius:4px; border:1px solid var(--border-glass);">` : `<span class="text-muted" style="font-size:0.75rem;">No attachment</span>`}
                            <label class="btn btn-secondary btn-small file-upload-label" style="padding: 0.35rem 0.75rem;">
                                <span>Upload</span>
                                <input type="file" class="time-img-upload" accept="image/*" style="display:none;">
                            </label>
                            ${evt.image ? `<button type="button" class="btn btn-secondary btn-small btn-remove-time-img" style="padding: 0.35rem 0.75rem;"><i class="fa-solid fa-xmark"></i> Remove</button>` : ''}
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Expanded Details Description</label>
                    <textarea class="time-text-input" rows="4">${evt.text}</textarea>
                </div>
            </div>
        `;

        card.querySelector('.btn-delete-item').onclick = () => {
            localEditState.timeline.splice(idx, 1);
            renderTimelineEditorList();
        };

        // Attach image upload handler
        card.querySelector('.time-img-upload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evtData) => {
                localEditState.timeline[idx].image = evtData.target.result;
                renderTimelineEditorList();
            };
            reader.readAsDataURL(file);
        });

        // Attach image remove handler
        const removeImgBtn = card.querySelector('.btn-remove-time-img');
        if (removeImgBtn) {
            removeImgBtn.onclick = () => {
                localEditState.timeline[idx].image = '';
                renderTimelineEditorList();
            };
        }

        container.appendChild(card);
    });
}

function saveTimelineInputs() {
    const cards = document.querySelectorAll('#timeline-editor-list .editor-item-card');
    cards.forEach((card, idx) => {
        if (!localEditState.timeline[idx]) return;

        localEditState.timeline[idx].title = card.querySelector('.time-title-input').value;
        localEditState.timeline[idx].subtitle = card.querySelector('.time-sub-input').value;
        localEditState.timeline[idx].date = card.querySelector('.time-date-input').value;
        localEditState.timeline[idx].stage = card.querySelector('.time-stage-select').value;
        localEditState.timeline[idx].link = card.querySelector('.time-link-input').value;
        localEditState.timeline[idx].text = card.querySelector('.time-text-input').value;
    });
}

// 7.7 Contact Tab Logic
function setupContactTab() {
    document.getElementById('contact-email').value = localEditState.contact.email;
    document.getElementById('contact-phone').value = localEditState.contact.phone;
    document.getElementById('contact-address').value = localEditState.contact.address;
    document.getElementById('contact-linkedin').value = localEditState.contact.linkedin;
    document.getElementById('contact-github').value = localEditState.contact.github;
}

function saveContactInputs() {
    localEditState.contact.email = document.getElementById('contact-email').value;
    localEditState.contact.phone = document.getElementById('contact-phone').value;
    localEditState.contact.address = document.getElementById('contact-address').value;
    localEditState.contact.linkedin = document.getElementById('contact-linkedin').value;
    localEditState.contact.github = document.getElementById('contact-github').value;
}

// 7.8 Backup Tab Logic
function setupBackupsTab() {
    // Export configuration to JSON
    document.getElementById('export-json-btn').onclick = () => {
        // Force save current active inputs first
        saveAllFormsWorkingStates();

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localEditState, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "portfolio_data_backup.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast("JSON Backup downloaded successfully!");
    };

    // Import configuration from JSON file
    document.getElementById('import-json-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const parsed = JSON.parse(evt.target.result);
                // Basic validation checklist
                if (parsed.hero && parsed.specializations && parsed.skills && parsed.projects && parsed.certificates && parsed.timeline && parsed.contact) {
                    localEditState = parsed;
                    savePortfolioData(localEditState);
                    showToast("Configuration imported and saved successfully!");
                    // Reload inputs
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    showToast("Invalid JSON schema checklist. Import aborted.", true);
                }
            } catch (err) {
                showToast("Failed to parse JSON file.", true);
            }
        };
        reader.readAsText(file);
    });

    // Reset Defaults
    document.getElementById('reset-default-btn').onclick = () => {
        if (confirm("Are you sure you want to revert all customizations? This will overwrite your current settings.")) {
            localEditState = resetPortfolioData();
            showToast("Factory defaults restored!");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };
}

// 7.9 Save Operations
function saveAllFormsWorkingStates() {
    // 1. Hero text fields (automatically bound, photos bound)
    localEditState.hero.name = document.getElementById('hero-name-input').value;
    localEditState.hero.titles = document.getElementById('hero-titles-input').value;
    localEditState.hero.summary = document.getElementById('hero-summary-input').value;

    // 2. Specializations
    saveCurrentSpecFormData();

    // 3. Skills (chips actions are live updated in localEditState)

    // 4. Projects
    saveProjectsInputs();

    // 5. Certificates
    saveCertificatesInputs();

    // 6. Timeline
    saveTimelineInputs();

    // 6.5 Hobbies
    saveHobbiesInputs();

    // 7. Contact
    saveContactInputs();
}

function saveAllData() {
    try {
        saveAllFormsWorkingStates();
        savePortfolioData(localEditState);
        showToast("All portfolio sections saved successfully!");
    } catch (e) {
        console.error("Save failed", e);
        showToast("Error saving data changes.", true);
    }
}

// 7.85 Hobbies Tab Logic
function setupHobbiesTab() {
    renderHobbiesEditorList();

    document.getElementById('hobby-add-new-btn').onclick = () => {
        const newHobby = {
            id: Date.now(),
            icon: "fa-solid fa-heart",
            title: "New Hobby",
            desc: "A brief description of your hobby or interest..."
        };
        if (!localEditState.hobbies) {
            localEditState.hobbies = [];
        }
        localEditState.hobbies.unshift(newHobby);
        renderHobbiesEditorList();
    };
}

function renderHobbiesEditorList() {
    const container = document.getElementById('hobbies-editor-list');
    if (!container) return;

    container.innerHTML = '';

    if (!localEditState.hobbies) {
        localEditState.hobbies = [];
    }

    localEditState.hobbies.forEach((hobby, idx) => {
        const card = document.createElement('div');
        card.className = 'editor-item-card';
        card.innerHTML = `
            <div class="editor-card-header">
                <span class="editor-card-title">${hobby.title}</span>
                <button type="button" class="btn-delete-item" data-index="${idx}"><i class="fa-solid fa-trash"></i> Delete</button>
            </div>
            <div class="panel-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" class="hobby-title-input" value="${hobby.title}">
                    </div>
                    <div class="form-group">
                        <label>FontAwesome Icon Class (e.g. fa-solid fa-gamepad)</label>
                        <input type="text" class="hobby-icon-input" value="${hobby.icon}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="hobby-desc-input" rows="2">${hobby.desc}</textarea>
                </div>
            </div>
        `;

        card.querySelector('.btn-delete-item').onclick = () => {
            localEditState.hobbies.splice(idx, 1);
            renderHobbiesEditorList();
        };

        container.appendChild(card);
    });
}

function saveHobbiesInputs() {
    const cards = document.querySelectorAll('#hobbies-editor-list .editor-item-card');
    cards.forEach((card, idx) => {
        if (!localEditState.hobbies[idx]) return;

        localEditState.hobbies[idx].title = card.querySelector('.hobby-title-input').value;
        localEditState.hobbies[idx].icon = card.querySelector('.hobby-icon-input').value;
        localEditState.hobbies[idx].desc = card.querySelector('.hobby-desc-input').value;
    });
}
