/* =====================================================
   BECKY HIRST · beckyhirst.world
   script.js — Complete Interactions & Animations
   ===================================================== */

'use strict';

// ===================== CUSTOM CURSOR =====================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor && cursorFollower) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  document.querySelectorAll('a, button, .world-card, .media-card, .insight-card, .he-card, .service-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ===================== NAVIGATION =====================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Scroll behaviour
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// Mobile toggle
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    nav.classList.toggle('nav-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      nav.classList.remove('nav-open');
    });
  });
}

// ===================== HERO IMAGE LOAD =====================
const heroImageWrap = document.querySelector('.hero-image-wrap');
const heroImage = document.querySelector('.hero-image');

if (heroImage) {
  if (heroImage.complete) {
    heroImageWrap && heroImageWrap.classList.add('loaded');
  } else {
    heroImage.addEventListener('load', () => {
      heroImageWrap && heroImageWrap.classList.add('loaded');
    });
  }
}

// ===================== SCROLL REVEAL (Intersection Observer) =====================
const revealEls = document.querySelectorAll('.reveal-up');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ===================== ANIMATED COUNTERS =====================
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const increment = target / (duration / 16);
  const suffix = el.dataset.suffix || '';

  const step = () => {
    start += increment;
    if (start >= target) {
      el.textContent = target + suffix;
    } else {
      el.textContent = Math.floor(start) + suffix;
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}

// Hero stats
const heroCounters = document.querySelectorAll('[data-count]');
const heroCounterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count);
      animateCounter(entry.target, target);
      heroCounterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

heroCounters.forEach(el => heroCounterObserver.observe(el));

// Speaking stats
const speakingCounters = document.querySelectorAll('.counter');
const speakingCounterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count);
      const suffix = entry.target.dataset.count === '98' ? '+' : '+';
      animateCounter(entry.target, target, 1600);
      speakingCounterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

speakingCounters.forEach(el => speakingCounterObserver.observe(el));

// ===================== PARALLAX =====================
const parallaxImages = document.querySelectorAll('.parallax-img');

function handleParallax() {
  parallaxImages.forEach(img => {
    const rect = img.closest('section') ? img.closest('section').getBoundingClientRect() : img.getBoundingClientRect();
    const viewH = window.innerHeight;
    const progress = (viewH - rect.top) / (viewH + rect.height);
    const offset = (progress - 0.5) * 60;
    img.style.transform = `translateY(${offset}px) scale(1.08)`;
  });
}

window.addEventListener('scroll', handleParallax, { passive: true });
handleParallax();

// ===================== MEDIA FILTERS =====================
const filterBtns = document.querySelectorAll('.media-filter');
const mediaCards = document.querySelectorAll('.media-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    mediaCards.forEach(card => {
      if (filter === 'all' || card.dataset.type === filter) {
        card.classList.remove('hidden');
        // Animate in
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===================== TESTIMONIALS CAROUSEL =====================
const track = document.getElementById('testimonialsTrack');
const prevBtn = document.getElementById('testiPrev');
const nextBtn = document.getElementById('testiNext');
const dotsContainer = document.getElementById('testiDots');

if (track && prevBtn && nextBtn && dotsContainer) {
  const slides = track.querySelectorAll('.testimonial-slide');
  let current = 0;
  let autoplayTimer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('testi-dot');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetAutoplay();
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(current + 1), 5500);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  resetAutoplay();
}

// ===================== CONTACT FORM =====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#4A7A4A';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 4000);
  });
}

// ===================== NEWSLETTER FORMS =====================
document.querySelectorAll('.newsletter-form, .footer-form').forEach(form => {
  const btn = form.querySelector('button') || form.querySelector('.newsletter-btn');
  const input = form.querySelector('input[type="email"]');

  if (btn && input) {
    btn.addEventListener('click', () => {
      if (input.value && input.value.includes('@')) {
        const originalText = btn.textContent;
        btn.textContent = '✓ Subscribed';
        btn.disabled = true;
        input.value = '';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 3500);
      } else {
        input.focus();
        input.style.borderColor = '#B5714A';
        setTimeout(() => { input.style.borderColor = ''; }, 1500);
      }
    });
  }
});

// ===================== HeyEngage PROGRESS BARS =====================
const progressBars = document.querySelectorAll('.he-card-progress');

const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const targetWidth = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = targetWidth; }, 200);
      progressObserver.unobserve(bar);
    }
  });
}, { threshold: 0.5 });

progressBars.forEach(bar => progressObserver.observe(bar));

// ===================== SMOOTH SCROLL FOR ANCHOR LINKS =====================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===================== WORLD CARD TOUCH SUPPORT =====================
// On touch devices, first tap reveals the back, second tap follows the link
document.querySelectorAll('.world-card').forEach(card => {
  let tapped = false;
  card.addEventListener('touchstart', (e) => {
    if (!tapped) {
      e.preventDefault();
      tapped = true;
      // Reset all others
      document.querySelectorAll('.world-card').forEach(c => {
        if (c !== card) c.classList.remove('touch-active');
      });
      card.classList.add('touch-active');
    }
  }, { passive: false });
});

// CSS for touch active state (injected)
const touchStyle = document.createElement('style');
touchStyle.textContent = `
  .world-card.touch-active .world-card-front { opacity: 0; transform: translateY(-8px); }
  .world-card.touch-active .world-card-back  { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(touchStyle);

// ===================== SECTION ACTIVE HIGHLIGHTING =====================
// Highlight the appropriate nav section as user scrolls
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('nav-link--active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('nav-link--active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ===================== PAGE LOAD ANIMATION =====================
// Body starts hidden via inline style injected immediately (see below),
// then fades in once the load event fires.
(function () {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
})();

window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
