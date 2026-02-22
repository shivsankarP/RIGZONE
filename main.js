// --- Consolidated Website Logic ---

// 1. Core Observers & Global State
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// 2. Main Initialization
document.addEventListener('DOMContentLoaded', () => {
    initEffects();
    initInteractions();

    // Initial reveal elements
    document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

    // Initial stats observer
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) statsObserver.observe(statsGrid);
});

// 3. Effect Initializers
function initEffects() {
    createClouds();
    setupParallaxAndBlend();
}

function createClouds() {
    const cloudSections = document.querySelectorAll('.section');
    cloudSections.forEach(section => {
        const cloudContainer = document.createElement('div');
        cloudContainer.className = 'cloud-container cloud-divider-top';
        for (let i = 0; i < 8; i++) {
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

function setupParallaxAndBlend() {
    const headerEl = document.getElementById('header');
    const blendBg = document.getElementById('blendBg');
    const heroBg = document.querySelector('.hero-bg');
    const glassOverlay = document.querySelector('.hero-glass-overlay');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Header
        if (headerEl) {
            if (scrolled > 50) headerEl.classList.add('scrolled');
            else headerEl.classList.remove('scrolled');
        }

        // Hero Progress
        const heroHeight = window.innerHeight;
        let progress = Math.min(1, Math.max(0, scrolled / heroHeight));

        // Blend Background
        if (blendBg) {
            if (progress < 0.8) {
                blendBg.style.background = `linear-gradient(135deg, var(--sunset-start), var(--sunset-end))`;
                const sunsetOpacity = progress <= 0.5 ? 0.6 + (progress * 0.4) : 1.0 - ((progress - 0.5) * 2);
                blendBg.style.opacity = Math.max(0.4, sunsetOpacity);
            } else {
                blendBg.style.background = `linear-gradient(135deg, var(--sea-start), var(--sea-end))`;
                blendBg.style.opacity = 0.4 + (progress - 0.8) * 2;
            }
        }

        // Hero Glass Interpolation
        if (glassOverlay) {
            const r = Math.round(255 - (progress * 255));
            const g = Math.round(126 - (progress * 75));
            const b = Math.round(95 + (progress * 7));
            const a = 0.1 + (progress * 0.5);
            glassOverlay.style.background = `rgba(${r}, ${g}, ${b}, ${a})`;
        }

        // Parallax - Increased scale for mobile to "zoom in"
        const scale = window.innerWidth < 992 ? 1.4 : 1.1;
        if (heroBg) heroBg.style.transform = `scale(${scale}) translateY(${scrolled * 0.2}px)`;
        document.querySelectorAll('.cloud-particle').forEach((p, i) => {
            const speed = 0.05 + (i % 3) * 0.05;
            p.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// 4. Interaction Engine
function initInteractions() {
    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.onclick = function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        };
    });

    // --- Contact Form ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.onsubmit = function (e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            const original = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerText = 'Inquiry Sent!';
                this.reset();
                setTimeout(() => {
                    btn.innerText = original;
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        };
    }

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.onclick = (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        };
        navLinks.querySelectorAll('a').forEach(link => {
            link.onclick = () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            };
        });
    }

    // --- Product Carousel ---
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentPosition = 0;

    const updateCarouselState = () => {
        if (!track) return;
        const hasActiveCard = document.querySelector('.card-active');
        if (hasActiveCard) track.classList.add('paused');
        else track.classList.remove('paused');
    };

    if (track && prevBtn && nextBtn) {
        const items = track.querySelectorAll('.carousel-item');
        const totalItems = items.length / 2;
        const moveCarousel = (direction) => {
            if (document.querySelector('.card-active')) return;
            track.classList.add('manual-control');
            const itemWidth = items[0].offsetWidth + 30;
            if (direction === 'next') currentPosition -= itemWidth;
            else currentPosition += itemWidth;

            const maxScroll = -(itemWidth * totalItems);
            if (currentPosition < maxScroll) {
                track.style.transition = 'none';
                currentPosition = 0;
                track.style.transform = `translateX(${currentPosition}px)`;
                setTimeout(() => {
                    track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                    currentPosition -= itemWidth;
                    track.style.transform = `translateX(${currentPosition}px)`;
                }, 10);
            } else if (currentPosition > 0) {
                track.style.transition = 'none';
                currentPosition = maxScroll;
                track.style.transform = `translateX(${currentPosition}px)`;
                setTimeout(() => {
                    track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                    currentPosition += itemWidth;
                    track.style.transform = `translateX(${currentPosition}px)`;
                }, 10);
            } else {
                track.style.transform = `translateX(${currentPosition}px)`;
            }
        };
        nextBtn.onclick = () => moveCarousel('next');
        prevBtn.onclick = () => moveCarousel('prev');
    }

    // --- BULLETPROOF CARD LOGIC ---

    // 1. Direct Listeners for Immediate Feedback
    document.querySelectorAll('.service-card, .carousel-item').forEach(card => {
        const closeBtn = card.querySelector('.card-close');

        // Handle Close Button specifically
        if (closeBtn) {
            closeBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                card.classList.remove('card-active');
                updateCarouselState();
            });
            // Also handle click just in case mousedown is skipped
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                card.classList.remove('card-active');
                updateCarouselState();
            });
        }

        // Handle Card Click
        card.addEventListener('click', (e) => {
            // If we clicked the close button, ignore
            if (e.target.closest('.card-close')) return;

            if (card.classList.contains('card-active')) {
                // Clicking an open card closes it
                card.classList.remove('card-active');
            } else {
                // Open this card, close others
                document.querySelectorAll('.card-active').forEach(c => c.classList.remove('card-active'));
                card.classList.add('card-active');
            }
            updateCarouselState();
        });
    });

    // 2. Global "Outside Click" listener
    document.addEventListener('click', (e) => {
        const target = e.target;
        const activeCard = document.querySelector('.card-active');

        if (activeCard && !target.closest('.service-card, .carousel-item')) {
            activeCard.classList.remove('card-active');
            updateCarouselState();
        }

        // Mobile Menu fallback
        if (navLinks && navLinks.classList.contains('active') && !target.closest('#navLinks') && !target.closest('#menuToggle')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // 3. ESC Key Support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.card-active').forEach(c => c.classList.remove('card-active'));
            if (navLinks) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
            updateCarouselState();
        }
    });
}
