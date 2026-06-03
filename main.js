/* ── Nav scroll effect ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Hamburger / Mobile Menu ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Particle Canvas ── */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.4 + 0.05,
  };
}

for (let i = 0; i < 90; i++) particles.push(createParticle());

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(247,127,0,${p.alpha})`;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ── Scroll Reveal ── */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

/* ── Counter Animation ── */
function animateCounter(el) {
  const raw = el.dataset.target;
  const target = parseInt(raw, 10);
  const suffix = target === 100 ? '%' : '';
  let current = 0;
  const duration = 1200;
  const steps = 50;
  const increment = target / steps;
  const interval = duration / steps;
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = Math.floor(current) + suffix;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    }
  }, interval);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.about-stats').forEach(el => counterObserver.observe(el));

/* ── FAQ Accordion ── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
    btn.setAttribute('aria-expanded', !isOpen);
  });
});

/* ── Telegram Config — replace these two values ── */
const TG_TOKEN   = '8800322256:AAEKJNUBwygumrDitHIc3u7OksLAtCcFPZ0';
const TG_CHAT_ID = '400383082';

/* ── Contact Form ── */
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const pkg     = document.getElementById('package').value;
  const message = document.getElementById('message').value.trim();

  const text = [
    `🔔 *New Message – RIX VISUALS Website*`,
    ``,
    `👤 *Name:* ${name}`,
    `📧 *Email:* ${email}`,
    `📞 *Phone:* ${phone || 'Not provided'}`,
    `📦 *Package:* ${pkg || 'Not selected'}`,
    `💬 *Message:*\n${message || 'No message'}`,
  ].join('\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text,
        parse_mode: 'Markdown'
      })
    });

    const data = await res.json();

    if (data.ok) {
      form.reset();
      successMsg.classList.add('show');
      setTimeout(() => successMsg.classList.remove('show'), 6000);
    } else {
      alert('Could not send. Check your bot token and chat ID.');
      console.error(data);
    }
  } catch (err) {
    alert('Network error. Please contact us via WhatsApp.');
    console.error(err);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--white)' : '';
  });
}, { passive: true });

/* ── Cursor Glow ── */
const cursorGlow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
}, { passive: true });

/* ── Light / Dark Mode Toggle ── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');

// Light is default — only switch to dark if user previously chose dark
const savedTheme = localStorage.getItem('rix-theme');
if (savedTheme === 'dark') {
  document.body.classList.remove('light');
  themeIcon.textContent = '☀️';
} else {
  document.body.classList.add('light');
  themeIcon.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  themeIcon.textContent = isLight ? '🌙' : '☀️';
  localStorage.setItem('rix-theme', isLight ? 'light' : 'dark');
});

/* ── Back to Top ── */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
