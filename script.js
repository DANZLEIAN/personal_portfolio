// Theme Toggle
const themeToggle = document.getElementById('themetoggle');
const body = document.body;

// Set initial theme
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
themeToggle.innerHTML = savedTheme === 'dark' 
    ? '<i class="fas fa-moon"></i>' 
    : '<i class="fas fa-sun"></i>';

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' 
        ? '<i class="fas fa-moon"></i>' 
        : '<i class="fas fa-sun"></i>';
});

// ======================
// Floating Particles Effect
// ======================
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    function getParticleColor() {
        return body.getAttribute('data-theme') === 'dark' 
            ? 'rgba(255, 255, 255, 0.5)' 
            : 'rgba(0, 0, 0, 0.3)';
    }
    
    class Particle {
        constructor() {
            this.reset();
            this.size = Math.random() * 3 + 1;
            this.color = getParticleColor();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width || 
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    const particles = [];
    const particleCount = Math.floor(window.innerWidth * window.innerHeight / 15000);
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    function connectParticles() {
        const connectionColor = body.getAttribute('data-theme') === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)';
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.strokeStyle = connectionColor;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    animate();
    
    themeToggle.addEventListener('click', () => {
        particles.forEach(particle => {
            particle.color = getParticleColor();
        });
    });
});

// ======================
// Mobile Navigation
// ======================
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.links') && !e.target.closest('#hamburger')) {
        navLinks.classList.remove('active');
    }
});

document.querySelectorAll('.links a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#') && !link.hasAttribute('download')) {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            navLinks.classList.remove('active');
        }
    });
});

// ============================================
// Project Carousel (Smooth Swiping + Mouse Drag)
// ============================================
const projectsContainer = document.querySelector('.projects-container');
const projectCards = document.querySelectorAll('.project-card');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const dotsContainer = document.querySelector('.project-dots');
let currentIndex = 0;

// Create navigation dots
projectCards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('project-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToProject(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.project-dot');

function updateNavigation() {
    projectCards.forEach((card, index) => {
        card.classList.toggle('active', index === currentIndex);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
    
    if (leftArrow && rightArrow) {
        leftArrow.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
        rightArrow.style.visibility = currentIndex === projectCards.length - 1 ? 'hidden' : 'visible';
    }
}

function goToProject(index) {
    currentIndex = Math.max(0, Math.min(index, projectCards.length - 1));
    const cardWidth = projectsContainer.clientWidth;
    
    projectsContainer.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'smooth'
    });
    updateNavigation();
}

if (leftArrow) {
    leftArrow.addEventListener('click', () => {
        if (currentIndex > 0) goToProject(currentIndex - 1);
    });
}

if (rightArrow) {
    rightArrow.addEventListener('click', () => {
        if (currentIndex < projectCards.length - 1) goToProject(currentIndex + 1);
    });
}

// Sync active dots when user swipes natively on mobile
let scrollTimeout;
projectsContainer.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const cardWidth = projectsContainer.clientWidth;
        if (cardWidth > 0) {
            const newIndex = Math.round(projectsContainer.scrollLeft / cardWidth);
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < projectCards.length) {
                currentIndex = newIndex;
                updateNavigation();
            }
        }
    }, 60);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) goToProject(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < projectCards.length - 1) goToProject(currentIndex + 1);
});

// Desktop Drag-to-Scroll
let isMouseDown = false;
let startX = 0;
let initialScrollLeft = 0;
let hasDragged = false;

projectsContainer.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    hasDragged = false;
    startX = e.pageX;
    initialScrollLeft = projectsContainer.scrollLeft;
    projectsContainer.classList.add('is-dragging');
});

window.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    const distance = e.pageX - startX;
    if (Math.abs(distance) > 5) {
        hasDragged = true;
    }
    projectsContainer.scrollLeft = initialScrollLeft - distance;
});

window.addEventListener('mouseup', (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;
    projectsContainer.classList.remove('is-dragging');
    
    if (hasDragged) {
        const cardWidth = projectsContainer.clientWidth;
        const dragOffset = e.pageX - startX;
        
        // If dragged more than 60px, switch page, otherwise snap back
        if (dragOffset < -60 && currentIndex < projectCards.length - 1) {
            goToProject(currentIndex + 1);
        } else if (dragOffset > 60 && currentIndex > 0) {
            goToProject(currentIndex - 1);
        } else {
            goToProject(currentIndex);
        }
    }
});

// Prevent link triggers if the user was dragging
projectsContainer.addEventListener('click', (e) => {
    if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
        hasDragged = false;
    }
}, true);

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
                
                if (entry.target.classList.contains('skills')) {
                    skillsBoxes.forEach((box, index) => {
                        setTimeout(() => {
                            box.classList.add('show');
                        }, index * 200);
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
                
                if (entry.target.classList.contains('skills')) {
                    skillsBoxes.forEach(box => {
                        box.classList.remove('show');
                    });
                }
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    const profileImg = document.querySelector('.profile-image');
    const introTxt = document.querySelector('.intro-text');
    if (profileImg) profileImg.classList.add('animate-slide-left');
    if (introTxt) introTxt.classList.add('animate-slide-right', 'delay-1');
});

// Run initial layout setup
updateNavigation();
