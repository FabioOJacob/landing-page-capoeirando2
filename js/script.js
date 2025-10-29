// ===== Navbar / Menu hamburguer =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});


// ===== Helpers para armazenamento local =====
function getStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Inicializa contadores
if (getStorage('clickCounters', null) === null) {
  setStorage('clickCounters', { startClicks: 0, guaranteeClicks: 0, leadSubmits: 0 });
}

// Elementos
const btnStart = document.getElementById('btn-start');
const guaranteeBtn = document.getElementById('guarantee');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');
const leadForm = document.getElementById('lead-form');

// ===== Scroll suave =====
btnStart.addEventListener('click', () => {
  const counters = getStorage('clickCounters', { startClicks: 0, guaranteeClicks: 0, leadSubmits: 0 });
  counters.startClicks++;
  setStorage('clickCounters', counters);

  guaranteeBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
  guaranteeBtn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: 420 });
});

// ===== Modal =====
guaranteeBtn.addEventListener('click', showModal);

function showModal() {
  const counters = getStorage('clickCounters', { startClicks: 0, guaranteeClicks: 0, leadSubmits: 0 });
  counters.guaranteeClicks++;
  setStorage('clickCounters', counters);

  modalBackdrop.style.display = 'flex';
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalBackdrop.style.display = 'none';
  modalBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});

// ===== Coleta de lead =====
leadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('lead-name').value.trim();
  const email = document.getElementById('lead-email').value.trim();

  if (!email) {
    alert('Por favor, informe um e-mail válido.');
    return;
  }

  const leads = getStorage('leads', []);
  leads.push({ name: name || null, email: email, ts: new Date().toISOString() });
  setStorage('leads', leads);

  const counters = getStorage('clickCounters', { startClicks: 0, guaranteeClicks: 0, leadSubmits: 0 });
  counters.leadSubmits++;
  setStorage('clickCounters', counters);

  const submitButton = leadForm.querySelector('.submit');
  submitButton.textContent = 'Inscrição confirmada!';
  submitButton.disabled = true;

  setTimeout(() => {
    closeModal();
    submitButton.textContent = 'Confirmar inscrição';
    submitButton.disabled = false;
    leadForm.reset();
  }, 1200);
});

// ===== Carrossel de depoimentos =====
(function carouselInit() {
  const tests = Array.from(document.querySelectorAll('.testimonials .test'));
  if (!tests.length) return;
  let current = 0;
  const interval = 3000;
  function show(i) {
    tests.forEach((t, idx) => {
      t.classList.toggle('active', idx === i);
    });
  }
  show(0);
  setInterval(() => {
    current = (current + 1) % tests.length;
    show(current);
  }, interval);
})();

// ===== Tecla ESC fecha modal =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalBackdrop.style.display === 'flex') {
    closeModal();
  }
});

// ===== Rolagem suave para qualquer link interno =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Fecha o menu se estiver aberto
      const navLinks = document.getElementById('nav-links');
      const hamburger = document.getElementById('hamburger');
      if (navLinks && hamburger) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      }
    }
  });
});

// ===== Botão "voltar ao topo" =====
const backToTop = document.getElementById('backToTop');

// Mostrar/esconder botão conforme rolagem
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

// Rolar suavemente até o topo ao clicar
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


console.info('Landing carregada. Veja leads e cliques no localStorage.');
