// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ===== ACTIVE NAV LINK HIGHLIGHT =====
function initNavHighlight() {
  const sections = document.querySelectorAll('.section, footer');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.35
  });

  sections.forEach(sec => observer.observe(sec));
}

// ===== MOBILE NAV TOGGLE =====
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });
}

// ===== FLOATING PARTICLES =====
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.3 + 0.05;
      this.hue = Math.random() > 0.5 ? 187 : 220; // cyan or blue
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(187, 100%, 60%, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => {
      if (p.x > canvas.width) p.x = canvas.width;
      if (p.y > canvas.height) p.y = canvas.height;
    });
  });

  init();
  animate();
}

// ===== SMOOTH SCROLL FOR NAV =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===== NAVBAR SHRINK ON SCROLL =====
function initNavShrink() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.style.padding = '10px 40px';
      nav.style.borderBottomColor = 'rgba(0, 229, 255, 0.25)';
    } else {
      nav.style.padding = '16px 40px';
      nav.style.borderBottomColor = 'rgba(0, 229, 255, 0.15)';
    }
  });
}

// ===== COUNTER ANIMATION FOR STATS =====
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();

        // Only animate numeric values
        if (/^\d+%?$/.test(text)) {
          const isPercent = text.includes('%');
          const target = parseInt(text);
          let current = 0;
          const step = Math.ceil(target / 40);
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            el.textContent = current + (isPercent ? '%' : '');
          }, 30);
        }

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

// ===== PIE CHART ANIMATION =====
function initPieAnimation() {
  const pie = document.querySelector('.pie-chart');
  if (!pie) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let deg = 0;
        const targetDeg = 342;
        const interval = setInterval(() => {
          deg += 6;
          if (deg >= targetDeg) {
            deg = targetDeg;
            clearInterval(interval);
          }
          pie.style.background = `conic-gradient(
            #00e5ff 0deg ${deg}deg,
            #334155 ${deg}deg 360deg
          )`;
        }, 16);
        observer.unobserve(pie);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(pie);
}

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavHighlight();
  initMobileNav();
  initParticles();
  initSmoothScroll();
  initNavShrink();
  initCounterAnimation();
  initPieAnimation();
});
