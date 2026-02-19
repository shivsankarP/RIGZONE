// Sticky Header Logic
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation using Intersection Observer
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Stat Counter Logic
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;

        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.innerText = Math.ceil(current) + (stat.getAttribute('data-target') === '24' ? '/7' : '+');
                setTimeout(updateCount, 20);
            } else {
                stat.innerText = target + (stat.getAttribute('data-target') === '24' ? '/7' : '+');
            }
        };

        updateCount();
    });
}

// Stats Scroll Observer
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Document ready
document.addEventListener('DOMContentLoaded', () => {
    createClouds(); // Initialize cloud effect

    // Add reveal class to elements
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // Observe stats section
    const statsSection = document.querySelector('.stat-item')?.parentElement;
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Cloud Effect Initialization

// Cloud Effect Initialization
function createClouds() {
    const cloudSections = document.querySelectorAll('.section');
    cloudSections.forEach(section => {
        const cloudContainer = document.createElement('div');
        cloudContainer.className = 'cloud-container cloud-divider-top';

        for (let i = 0; i < 8; i++) { // Increased to 8 particles
            const particle = document.createElement('div');
            particle.className = `cloud-particle cloud-${['slow', 'medium', 'fast'][Math.floor(Math.random() * 3)]}`;

            const size = Math.random() * 200 + 150;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            cloudContainer.appendChild(particle);
        }

        section.style.position = 'relative';
        section.appendChild(cloudContainer);
    });
}

// Color Blend Scroll Logic
const blendBg = document.getElementById('blendBg');
const aboutSection = document.getElementById('about');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    // 1. Calculate transition progress (0 to 1) based on Hero height
    const heroHeight = window.innerHeight;
    let progress = scrolled / heroHeight;
    progress = Math.min(1, Math.max(0, progress));

    // 2. Update Blend Background Gradient
    if (blendBg) {
        // Calculate smooth transition between sunset and sea
        // Fade out sunset as we move to About section
        if (progress < 0.8) {
            blendBg.style.background = `linear-gradient(135deg, var(--sunset-start), var(--sunset-end))`;
            // Opacity peaks at transition point (0.5)
            const sunsetOpacity = progress <= 0.5 ?
                0.6 + (progress * 0.4) : // 0.6 to 1.0
                1.0 - ((progress - 0.5) * 2); // 1.0 to 0.4
            blendBg.style.opacity = Math.max(0.4, sunsetOpacity);
        } else {
            blendBg.style.background = `linear-gradient(135deg, var(--sea-start), var(--sea-end))`;
            blendBg.style.opacity = 0.4 + (progress - 0.8) * 2;
        }
    }

    // 3. Update Hero Glass Overlay with smooth color interpolation
    const glassOverlay = document.querySelector('.hero-glass-overlay');
    if (glassOverlay) {
        // Interpolate between orange and blueish colors
        const r = Math.round(255 - (progress * 255));
        const g = Math.round(126 - (progress * 75));
        const b = Math.round(95 + (progress * 7));
        const a = 0.1 + (progress * 0.5);
        glassOverlay.style.background = `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    // Hero Parallax (Already existing but keeping it integrated)
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.2}px)`;
    }

    // Cloud Parallax
    const particles = document.querySelectorAll('.cloud-particle');
    particles.forEach((particle, index) => {
        const speed = 0.05 + (index % 3) * 0.05;
        particle.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Logic
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button');
        const originalText = submitBtn.innerText;

        // Simple validation feedback
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerText = 'Inquiry Sent!';
            submitBtn.style.background = 'var(--secondary-cerulean)';
            contactForm.reset();

            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// Full view check for stats section
const statsSectionCheck = document.querySelector('.stat-item')?.parentElement;
if (statsSectionCheck) {
    statsObserver.observe(statsSectionCheck);
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}
