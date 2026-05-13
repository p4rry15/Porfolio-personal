const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const currentYear = document.querySelector('#current-year');
const progressBar = document.querySelector('.scroll-progress span');
const backToTop = document.querySelector('.back-to-top');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = [...navItems].map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const consoleType = document.querySelector('#console-type');

if (currentYear) currentYear.textContent = new Date().getFullYear();

const updateScrollUI = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (header) header.classList.toggle('scrolled', scrollTop > 24);
  if (backToTop) backToTop.classList.toggle('visible', scrollTop > 520);
};

updateScrollUI();
window.addEventListener('scroll', updateScrollUI, { passive: true });

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuButton.classList.toggle('active', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuButton.classList.remove('active');
      menuButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });
}

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
revealElements.forEach((element) => revealObserver.observe(element));

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navItems.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-42% 0px -48% 0px', threshold: 0 });
sections.forEach((section) => activeSectionObserver.observe(section));

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count || 0);
    const duration = 900;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    counterObserver.unobserve(element);
  });
}, { threshold: 0.65 });
counters.forEach((counter) => counterObserver.observe(counter));

if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const consoleMessages = ['role: estudiante-asir', 'focus: sistemas | redes | web', 'project: 3daura.store', 'status: aprendizaje-activo'];
if (consoleType) {
  let messageIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const tick = () => {
    const currentMessage = consoleMessages[messageIndex];
    if (!deleting) {
      consoleType.textContent = currentMessage.slice(0, charIndex + 1);
      charIndex += 1;
      if (charIndex === currentMessage.length) {
        deleting = true;
        setTimeout(tick, 1200);
        return;
      }
    } else {
      consoleType.textContent = currentMessage.slice(0, charIndex - 1);
      charIndex -= 1;
      if (charIndex === 0) {
        deleting = false;
        messageIndex = (messageIndex + 1) % consoleMessages.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 70);
  };
  tick();
}

const aboutTabs = document.querySelectorAll('[data-about-tab]');
const aboutPanels = document.querySelectorAll('[data-about-panel]');
aboutTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.aboutTab;
    aboutTabs.forEach((item) => item.classList.toggle('active', item === tab));
    aboutPanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.aboutPanel === target));
  });
});

const areaData = {
  sistemas: ['01', 'Sistemas operativos', 'Manejo de entornos Windows Server y distribuciones Linux/Ubuntu con interés en instalación, administración y mantenimiento.'],
  redes: ['02', 'Redes', 'Configuración de redes locales, direccionamiento IPv4, subnetting, VLANs y fundamentos del modelo TCP/IP.'],
  ciberseguridad: ['03', 'Ciberseguridad', 'Área que más me atrae de cara al futuro, especialmente desde la base de sistemas, redes, buenas prácticas y protección de entornos.'],
  virtualizacion: ['04', 'Virtualización', 'Uso de Oracle VM VirtualBox para desplegar máquinas virtuales y crear laboratorios de aprendizaje y pruebas.'],
  bases: ['05', 'Bases de datos', 'Conocimientos de SQL, MySQL y PGAdmin para trabajar consultas básicas y organización de datos.'],
  hardware: ['06', 'Hardware y soporte', 'Montaje, mantenimiento de equipos y resolución de incidencias básicas relacionadas con hardware y funcionamiento del sistema.']
};
const areaChips = document.querySelectorAll('[data-area]');
const areaNumber = document.querySelector('#area-number');
const areaTitle = document.querySelector('#area-title');
const areaText = document.querySelector('#area-text');
areaChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const data = areaData[chip.dataset.area];
    if (!data) return;
    areaChips.forEach((item) => item.classList.toggle('active', item === chip));
    areaNumber.textContent = data[0];
    areaTitle.textContent = data[1];
    areaText.textContent = data[2];
  });
});

const modal = document.querySelector('.gallery-modal');
const modalImage = modal?.querySelector('img');
const modalTitle = modal?.querySelector('p');
const modalClose = modal?.querySelector('.gallery-close');
document.querySelectorAll('[data-gallery-src]').forEach((item) => {
  item.addEventListener('click', () => {
    if (!modal || !modalImage || !modalTitle) return;
    modalImage.src = item.dataset.gallerySrc;
    modalImage.alt = item.dataset.galleryTitle || 'Imagen ampliada';
    modalTitle.textContent = item.dataset.galleryTitle || '';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  });
});
const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
};
modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

// v14: dinamismo profesional extra
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  let glowX = 0;
  let glowY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('pointermove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    document.body.classList.add('pointer-active');
  });

  window.addEventListener('pointerleave', () => {
    document.body.classList.remove('pointer-active');
  });

  const animateGlow = () => {
    glowX += (targetX - glowX) * 0.12;
    glowY += (targetY - glowY) * 0.12;
    cursorGlow.style.transform = `translate(${glowX - 110}px, ${glowY - 110}px)`;
    requestAnimationFrame(animateGlow);
  };

  animateGlow();
}

// Retrasos escalonados para que las secciones aparezcan con más naturalidad
[...document.querySelectorAll('.cards-grid .reveal, .project-details-grid .reveal, .hobby-gallery .gallery-item')].forEach((element, index) => {
  element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 280)}ms`);
});

// Copiar correo desde la tarjeta de contacto
const toast = document.querySelector('.toast');
const copyEmailButton = document.querySelector('[data-copy-email]');
const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => toast.classList.remove('visible'), 2200);
};

if (copyEmailButton) {
  copyEmailButton.addEventListener('click', async () => {
    const email = copyEmailButton.dataset.copyEmail;
    try {
      await navigator.clipboard.writeText(email);
      showToast('Correo copiado al portapapeles');
    } catch (error) {
      window.location.href = `mailto:${email}`;
    }
  });
}
