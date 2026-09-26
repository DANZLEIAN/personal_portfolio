// Sync both desktop sidebar and mobile theme toggles
const themeToggles = [
    document.getElementById('themetoggle'),
    document.getElementById('themetoggle-mobile')
].filter(Boolean);

const rootElement = document.documentElement;
const body = document.body;

function updateThemeIcon(theme) {
    themeToggles.forEach(toggle => {
        toggle.innerHTML = theme === 'dark' 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    });
}

function applyTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
}

const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
        const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
});

// ======================
// Sidebar Mobile Toggle & Smooth Scroll
// ======================
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');

if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// Sidebar link click handling
const navLinks = document.querySelectorAll('.sidebar-link');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            if (sidebar) sidebar.classList.remove('active');
        }
    });
});

// ======================
// Scroll Animations
// ======================
const animateOnScroll = () => {
    const animatedElements = document.querySelectorAll(
        '.animate-fade, .animate-slide-left, .animate-slide-right, .animate-slide-up'
    );

    const skillsBoxes = document.querySelectorAll('.skills-details .box');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('animate-fade') || 
                    entry.target.classList.contains('animate-slide-left') || 
                    entry.target.classList.contains('animate-slide-right') || 
                    entry.target.classList.contains('animate-slide-up')) {
                    
                    entry.target.classList.remove('reset-animation');
                    void entry.target.offsetWidth;
                    
                    if (entry.target.classList.contains('animate-fade')) {
                        entry.target.classList.add('animate-fade');
                    } else if (entry.target.classList.contains('animate-slide-left')) {
                        entry.target.classList.add('animate-slide-left');
                    } else if (entry.target.classList.contains('animate-slide-right')) {
                        entry.target.classList.add('animate-slide-right');
                    } else if (entry.target.classList.contains('animate-slide-up')) {
                        entry.target.classList.add('animate-slide-up');
                    }
                }
                
                if (entry.target.classList.contains('skills') || entry.target.classList.contains('skills-card')) {
                    skillsBoxes.forEach((box, index) => {
                        setTimeout(() => {
                            box.classList.add('show');
                        }, (index + 1) * 350);
                    });
                }
            } else {
                if (entry.target.classList.contains('animate-slide-left')) {
                    entry.target.classList.add('reset-animation', 'slide-left');
                } else if (entry.target.classList.contains('animate-slide-right')) {
                    entry.target.classList.add('reset-animation', 'slide-right');
                } else if (entry.target.classList.contains('animate-slide-up')) {
                    entry.target.classList.add('reset-animation', 'slide-up');
                } else if (entry.target.classList.contains('animate-fade')) {
                    entry.target.classList.add('reset-animation');
                }
                
            }
        });
    }, {
        threshold: 0.35
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    const skillsSection = document.querySelector('.skills, .skills-card');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    const heroImg = document.querySelector('.hero-image-wrapper');
    const heroTxt = document.querySelector('.hero-text');
    if (heroImg) heroImg.classList.add('animate-slide-left');
    if (heroTxt) heroTxt.classList.add('animate-slide-right', 'delay-1');
});

// Copy Email to Clipboard
const copyEmailBtn = document.getElementById('copy-email-btn');
const copyBadge = document.getElementById('copy-badge');

if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
        const email = copyEmailBtn.getAttribute('data-email');
        navigator.clipboard.writeText(email).then(() => {
            if (copyBadge) {
                copyBadge.classList.add('visible');
                setTimeout(() => {
                    copyBadge.classList.remove('visible');
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy email:', err);
        });
    });
}

// ======================
// Experience / Education Tab Switcher
// ======================
function switchTab(tab, btn) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length) {
        tabButtons.forEach(b => b.classList.remove('active'));
    }
    if (btn) btn.classList.add('active');

    const edu = document.getElementById('education-content');
    const work = document.getElementById('work-content');

    if (edu && work) {
        if (tab === 'education') {
            edu.style.display = 'block';
            work.style.display = 'none';
        } else {
            edu.style.display = 'none';
            work.style.display = 'block';
        }
    }
}

// ======================
// Certification Filter
// ======================
function filterCerts(category, btn) {
    const filterButtons = document.querySelectorAll('.filter-nav .filter-btn');
    if (filterButtons.length) {
        filterButtons.forEach(b => b.classList.remove('active'));
    }
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const cardCat = card.getAttribute('data-category') || '';
        if (category === 'all' || cardCat.includes(category)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// ======================
// Document Preview Modal (Resume & CV)
// ======================
const docModalOverlay = document.getElementById('docModalOverlay');
const docModalTitle = document.getElementById('docModalTitle');
const docModalFrame = document.getElementById('docModalFrame');
const docModalDownloadBtn = document.getElementById('docModalDownloadBtn');
const docModalExternalBtn = document.getElementById('docModalExternalBtn');

function openDocModal(docPath, docTitle) {
    if (!docModalOverlay || !docModalFrame) return;

    docModalTitle.textContent = docTitle;
    docModalFrame.src = docPath;
    
    // Set up download and new tab URLs
    if (docModalDownloadBtn) {
        docModalDownloadBtn.href = docPath;
        docModalDownloadBtn.setAttribute('download', docTitle.toLowerCase().replace(/\s+/g, '_') + '.pdf');
    }
    if (docModalExternalBtn) {
        docModalExternalBtn.href = docPath;
    }

    docModalOverlay.classList.add('active');
    docModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Stop background page scrolling
}

function closeDocModal() {
    if (!docModalOverlay || !docModalFrame) return;

    docModalOverlay.classList.remove('active');
    docModalOverlay.setAttribute('aria-hidden', 'true');
    docModalFrame.src = ''; // Clear iframe to stop background PDF processes
    document.body.style.overflow = '';
}

// Close when clicking anywhere on the dim background overlay
if (docModalOverlay) {
    docModalOverlay.addEventListener('click', (e) => {
        if (e.target === docModalOverlay) {
            closeDocModal();
        }
    });
}

// Close on Escape key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && docModalOverlay && docModalOverlay.classList.contains('active')) {
        closeDocModal();
    }
});

// ======================
// Project Details Modal System
// ======================
const projectModalOverlay = document.getElementById('projectModalOverlay');
const projModalTitle = document.getElementById('projModalTitle');
const projModalIcon = document.getElementById('projModalIcon');
const projModalPrimaryBtn = document.getElementById('projModalPrimaryBtn');
const projModalPrimaryIcon = document.getElementById('projModalPrimaryIcon');
const projModalPrimaryText = document.getElementById('projModalPrimaryText');
const projModalBody = document.getElementById('projModalBody');

const projectDetailsData = {
    'escape': {
        title: 'ESCAPE — Mobile Game',
        icon: 'fas fa-gamepad',
        primaryBtnText: 'Download APK',
        primaryBtnIcon: 'fas fa-download',
        primaryBtnHref: 'APKs/app-release.apk',
        downloadAttr: true,
        content: `
            <div class="proj-modal-video-container">
                <!-- Replace src with your gameplay video file path or embed link -->
                <video controls poster="images/escape.png">
                    <source src="videos/project2.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
            <div class="proj-modal-info">
                <h4>About ESCAPE</h4>
                <p>A snakes-and-ladders-inspired mobile board game built with Flutter featuring dynamic warp portals, customized movement tiles, and interactive board mechanics. Download the APK above to test it on your Android device.</p>
            </div>
        `
    },
    'ebakiosk': {
        title: 'EBA KIOSK — 3D CAD Model',
        icon: 'fas fa-cube',
        primaryBtnText: 'Download CAD PDF',
        primaryBtnIcon: 'fas fa-file-pdf',
        primaryBtnHref: '3d_Design/kioskdesign.pdf',
        downloadAttr: true,
        content: `<iframe src="3d_Design/kioskdesign.pdf" class="proj-modal-pdf-frame" title="EBA Kiosk CAD Model"></iframe>`
    },
    'elders': {
        title: 'Elder Rehabilitation Unit — 3D Model',
        icon: 'fas fa-cube',
        primaryBtnText: 'Download CAD PDF',
        primaryBtnIcon: 'fas fa-file-pdf',
        primaryBtnHref: '3d_Design/eldersdesign.pdf',
        downloadAttr: true,
        content: `<iframe src="3d_Design/eldersdesign.pdf" class="proj-modal-pdf-frame" title="Elder Rehabilitation Unit CAD Model"></iframe>`
    },
    'liblocker': {
        title: 'Smart Library Locker — 3D Model',
        icon: 'fas fa-cube',
        primaryBtnText: 'Download CAD PDF',
        primaryBtnIcon: 'fas fa-file-pdf',
        primaryBtnHref: '3d_Design/liblocker.pdf',
        downloadAttr: true,
        content: `<iframe src="3d_Design/liblocker.pdf" class="proj-modal-pdf-frame" title="Smart Library Locker CAD Model"></iframe>`
    },
    'lockify': {
        title: 'LOCKIFY — IoT Project Documentation',
        icon: 'fas fa-microchip',
        primaryBtnText: 'Download Document',
        primaryBtnIcon: 'fas fa-file-pdf',
        primaryBtnHref: 'Projects/lockify.pdf',
        downloadAttr: true,
        content: `<iframe src="Projects/lockify.pdf" class="proj-modal-pdf-frame" title="Lockify Project Documentation"></iframe>`
    }
};

function openProjectModal(projectId) {
    const data = projectDetailsData[projectId];
    if (!data || !projectModalOverlay) return;

    projModalTitle.textContent = data.title;
    projModalIcon.className = data.icon;
    projModalPrimaryText.textContent = data.primaryBtnText;
    projModalPrimaryIcon.className = data.primaryBtnIcon;
    projModalPrimaryBtn.href = data.primaryBtnHref;
    
    if (data.downloadAttr) {
        projModalPrimaryBtn.setAttribute('download', '');
    } else {
        projModalPrimaryBtn.removeAttribute('download');
    }

    projModalBody.innerHTML = data.content;

    projectModalOverlay.classList.add('active');
    projectModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    if (!projectModalOverlay) return;
    projectModalOverlay.classList.remove('active');
    projectModalOverlay.setAttribute('aria-hidden', 'true');
    projModalBody.innerHTML = ''; // Clear content to stop media/iframe loading
    document.body.style.overflow = '';
}

if (projectModalOverlay) {
    projectModalOverlay.addEventListener('click', (e) => {
        if (e.target === projectModalOverlay) closeProjectModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModalOverlay && projectModalOverlay.classList.contains('active')) {
        closeProjectModal();
    }
});