// Theme Toggle
const themeToggle = document.getElementById('themetoggle');
const body = document.body;

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

// Floating Particles Effect
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
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
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
        particles.forEach(p => { p.update(); p.draw(); });
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
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
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
        particles.forEach(p => { p.color = getParticleColor(); });
    });
});

// Mobile Navigation Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.links');

hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
document.addEventListener('click', (e) => {
    if (!e.target.closest('.links') && !e.target.closest('#hamburger')) {
        navLinks.classList.remove('active');
    }
});

document.querySelectorAll('.links a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#') && !link.hasAttribute('download')) {
            e.preventDefault();
            document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            navLinks.classList.remove('active');
        }
    });
});

// ============================================
// Ultra-Smooth 1:1 Hardware-Accelerated Carousel
// ============================================
const projectsContainer = document.querySelector('.projects-container');
const projectCards = document.querySelectorAll('.project-card');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const dotsContainer = document.querySelector('.project-dots');

let currentIndex = 0;
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let hasMoved = false;

// Generate dots
projectCards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('project-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToProject(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.project-dot');

function updateUI() {
    projectCards.forEach((card, i) => card.classList.toggle('active', i === currentIndex));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    
    if (leftArrow && rightArrow) {
        leftArrow.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
        rightArrow.style.visibility = currentIndex === projectCards.length - 1 ? 'hidden' : 'visible';
    }
}

function setSliderPosition() {
    projectsContainer.style.transform = `translateX(${currentTranslate}px)`;
}

function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
}

function goToProject(index) {
    currentIndex = Math.max(0, Math.min(index, projectCards.length - 1));
    currentTranslate = -currentIndex * projectsContainer.offsetWidth;
    prevTranslate = currentTranslate;
    setSliderPosition();
    updateUI();
}

// Pointer Events (Touch + Mouse unified)
function pointerDown(e) {
    isDragging = true;
    hasMoved = false;
    startX = e.clientX;
    projectsContainer.classList.add('is-dragging');
    animationID = requestAnimationFrame(animation);
}

function pointerMove(e) {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    
    if (Math.abs(diff) > 5) hasMoved = true;
    currentTranslate = prevTranslate + diff;
}

function pointerUp() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);
    projectsContainer.classList.remove('is-dragging');
    
    const movedBy = currentTranslate - prevTranslate;
    const swipeThreshold = projectsContainer.offsetWidth * 0.18; // 18% drag triggers slide

    if (movedBy < -swipeThreshold && currentIndex < projectCards.length - 1) {
        currentIndex += 1;
    } else if (movedBy > swipeThreshold && currentIndex > 0) {
        currentIndex -= 1;
    }

    goToProject(currentIndex);
}

// Prevent button/link clicks if the user was actively dragging
projectsContainer.addEventListener('click', (e) => {
    if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
    }
}, true);

projectsContainer.addEventListener('pointerdown', pointerDown);
window.addEventListener('pointermove', pointerMove);
window.addEventListener('pointerup', pointerUp);
window.addEventListener('pointercancel', pointerUp);

// Arrow buttons
if (leftArrow) leftArrow.addEventListener('click', () => currentIndex > 0 && goToProject(currentIndex - 1));
if (rightArrow) rightArrow.addEventListener('click', () => currentIndex < projectCards.length - 1 && goToProject(currentIndex + 1));

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) goToProject(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < projectCards.length - 1) goToProject(currentIndex + 1);
});

// Window resize sync
window.addEventListener('resize', () => goToProject(currentIndex));

// Scroll Animations
const animateOnScroll = () => {
    const animatedElements = document.querySelectorAll(
        '.animate-fade, .animate-slide-left, .animate-slide-right, .animate-slide-up'
    );
    const skillsBoxes = document.querySelectorAll('.skills-details .box');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('reset-animation');
                void entry.target.offsetWidth;
                entry.target.classList.add(entry.target.classList[0]);
                
                if (entry.target.classList.contains('skills')) {
                    skillsBoxes.forEach((box, i) => setTimeout(() => box.classList.add('show'), i * 200));
                }
            } else {
                entry.target.classList.add('reset-animation');
                if (entry.target.classList.contains('skills')) {
                    skillsBoxes.forEach(box => box.classList.remove('show'));
                }
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) observer.observe(skillsSection);
};

document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    document.querySelector('.profile-image').classList.add('animate-slide-left');
    document.querySelector('.intro-text').classList.add('animate-slide-right', 'delay-1');
});

// Initialize
goToProject(0);
