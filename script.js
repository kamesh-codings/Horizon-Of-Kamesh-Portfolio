/* ============================================
   HORIZON OF KAMESH — Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ========== Loading Screen ==========
  const loadingScreen = document.getElementById('loading-screen');
  
  const hideLoader = () => {
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = '';
        initAllAnimations();
      }
    }, 400); // Small delay to prevent instant flash
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  document.body.style.overflow = 'hidden';

  // ========== Particle Background ==========
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x -= dx * 0.005;
          this.y -= dy * 0.005;
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 143, 247, ${this.opacity})`;
        ctx.fill();
      }
    }

    const particleCount = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 15000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(79, 143, 247, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animateParticles);
    }

    animateParticles();

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  }

  // ========== Navbar Scroll Effect ==========
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    const sectionIcons = {
      'home': './Icons/Webpage Icon.png',
      'about': './Icons/About Icon.png',
      'skills': './Icons/Skills Icon.png',
      'certificates': './Icons/Certificates Icon.png',
      'projects': './Icons/Webpage Icon.png',
      'education': './Icons/Education Icon.png',
      'interests': './Icons/Interests.png',
      'contact': './Icons/Contact Icon.png'
    };

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href*="#${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');

        // Update Favicon
        const iconUrl = sectionIcons[sectionId];
        if (iconUrl) {
          let iconLink = document.querySelector('link[rel="icon"]');
          let shortcutIconLink = document.querySelector('link[rel="shortcut icon"]');
          if (iconLink) iconLink.href = iconUrl;
          if (shortcutIconLink) shortcutIconLink.href = iconUrl;
        }
      }
    });

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      if (scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll);

  // ========== Mobile Menu ==========
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Theme toggle removed – light mode fixed
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateThemeIcon(theme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }

  // ========== Typewriter Effect ==========
  const typewriterEl = document.querySelector('.typewriter-text');
  const phrases = [
    'Engineering Student',
    'Future AI & Data Science Professional',
    'AI Tool Expert',
    'Tech Enthusiast',
    'Artificial Intelligence',
    'Data Analysis',
    'Data Science',
    'Motor Sports Enthusiast',
    'Programmer',
    'Web Developer',
    'Music'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeWriter() {
    if (!typewriterEl) return;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000; // pause before deleting
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; // pause before typing new
    }

    setTimeout(typeWriter, typeSpeed);
  }

  // ========== Scroll Reveal ==========
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // ========== Skill Bar Animation ==========
  function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width');
          setTimeout(() => {
            bar.style.width = targetWidth + '%';
            bar.classList.add('animated');
          }, 200);
          observer.unobserve(bar);
        }
      });
    }, {
      threshold: 0.5
    });

    skillBars.forEach(bar => observer.observe(bar));
  }

  // ========== Course & Certificate Modals ==========
  const courseModal = document.getElementById('course-modal');
  const courseModalClose = document.getElementById('course-modal-close');
  const modalCourseTitle = document.getElementById('modal-course-title');
  const modalCourseIssuer = document.getElementById('modal-course-issuer');
  const modalCourseDuration = document.getElementById('modal-course-duration');
  const modalCourseObjective = document.getElementById('modal-course-objective');
  const modalCourseOutcomes = document.getElementById('modal-course-outcomes');
  const modalCourseThumb = document.getElementById('modal-course-thumb');
  const modalCourseThumbContainer = document.getElementById('modal-course-thumb-container');

  const certModal = document.getElementById('certificate-modal');
  const certModalImg = document.getElementById('cert-modal-img');
  const certModalClose = document.getElementById('cert-modal-close');
  
  const certCards = document.querySelectorAll('.certificate-card');

  // Open Course Details Modal
  certCards.forEach(card => {
    card.addEventListener('click', () => {
      if (!courseModal) return;
      
      const title = card.getAttribute('data-title') || card.querySelector('.certificate-title').textContent;
      const issuer = card.getAttribute('data-issuer') || card.querySelector('.certificate-issuer').textContent;
      const duration = card.getAttribute('data-duration') || 'Duration not specified';
      const objective = card.getAttribute('data-objective') || 'Objective not specified';
      const outcomesStr = card.getAttribute('data-outcomes') || '';
      const imgSrc = card.querySelector('img').src;

      if (modalCourseTitle) modalCourseTitle.textContent = title;
      if (modalCourseIssuer) {
        modalCourseIssuer.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/></svg> <strong>Course Providers & Platform :</strong> ${issuer.trim()}`;
      }
      if (modalCourseDuration) modalCourseDuration.textContent = 'Duration: ' + duration;
      if (modalCourseObjective) modalCourseObjective.textContent = objective;
      if (modalCourseThumb) modalCourseThumb.src = imgSrc;

      // Populate outcomes list
      if (modalCourseOutcomes) {
        modalCourseOutcomes.innerHTML = '';
        const outcomes = outcomesStr.split('|');
        outcomes.forEach(outcome => {
          if (outcome.trim()) {
            const li = document.createElement('li');
            li.textContent = outcome.trim();
            modalCourseOutcomes.appendChild(li);
          }
        });
      }

      courseModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Open Full Certificate Image Modal from Thumbnail
  if (modalCourseThumbContainer) {
    modalCourseThumbContainer.addEventListener('click', () => {
      if (certModal && certModalImg && modalCourseThumb) {
        certModalImg.src = modalCourseThumb.src;
        certModal.classList.add('active');
        // Do not alter overflow as it is already hidden by course modal
      }
    });
  }

  // Close Functions
  function closeCourseModal() {
    if (courseModal) {
      courseModal.classList.remove('active');
      // Only restore overflow if full image modal is also closed
      if (!certModal || !certModal.classList.contains('active')) {
        document.body.style.overflow = '';
      }
    }
  }

  function closeCertModal() {
    if (certModal) {
      certModal.classList.remove('active');
      // Keep overflow hidden if course modal is still open
      if (courseModal && courseModal.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  // Close Event Listeners
  if (courseModalClose) courseModalClose.addEventListener('click', closeCourseModal);
  if (certModalClose) certModalClose.addEventListener('click', closeCertModal);

  if (courseModal) {
    courseModal.addEventListener('click', (e) => {
      if (e.target === courseModal) closeCourseModal();
    });
  }
  
  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (certModal && certModal.classList.contains('active')) {
        closeCertModal();
      } else if (courseModal && courseModal.classList.contains('active')) {
        closeCourseModal();
      }
    }
  });

  // ========== Contact Form (Mailto fallback) ==========
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !subject || !message) {
        formStatus.textContent = 'Please fill in all fields.';
        formStatus.className = 'form-status error';
        return;
      }

      // Use mailto as fallback (no backend needed)
      const mailtoLink = `mailto:kamesh552024@gmail.com?subject=${encodeURIComponent(subject + ' — from ' + name)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;
      window.location.href = mailtoLink;

      formStatus.textContent = 'Opening your email client...';
      formStatus.className = 'form-status success';

      setTimeout(() => {
        contactForm.reset();
        formStatus.textContent = '';
      }, 3000);
    });
  }

  // ========== Back to Top ==========
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========== Smooth Scroll for nav links ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ========== Initialize all animations ==========
  function initAllAnimations() {
    typeWriter();
    initScrollReveal();
    initSkillBars();
    handleScroll(); // check initial scroll position
  }

  // ========== Nav logo click — scroll to top ==========
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========== Result Modal ==========
  const resultModal = document.getElementById('result-modal');
  const viewResultBtn = document.getElementById('view-sem1-result');
  const resultModalClose = document.getElementById('result-modal-close');
  const resultModalBackdrop = document.getElementById('result-modal-backdrop');

  function openResultModal() {
    if (resultModal) {
      resultModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResultModal() {
    if (resultModal) {
      resultModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (viewResultBtn) {
    viewResultBtn.addEventListener('click', openResultModal);
  }
  if (resultModalClose) {
    resultModalClose.addEventListener('click', closeResultModal);
  }
  if (resultModalBackdrop) {
    resultModalBackdrop.addEventListener('click', closeResultModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resultModal && resultModal.classList.contains('active')) {
      closeResultModal();
    }
  });

  // ========== Skill Tooltip Popup ==========
  const skillTooltip = document.getElementById('skill-tooltip');
  const skillTooltipOverlay = document.getElementById('skill-tooltip-overlay');
  const skillTooltipName = document.getElementById('skill-tooltip-name');
  const skillTooltipDesc = document.getElementById('skill-tooltip-desc');
  const skillTooltipClose = document.getElementById('skill-tooltip-close');

  function openSkillTooltip(name, desc) {
    if (!skillTooltip) return;
    skillTooltipName.textContent = name;
    skillTooltipDesc.textContent = desc;
    skillTooltip.setAttribute('aria-hidden', 'false');
    skillTooltipOverlay.classList.add('active');
    // Force reflow for animation
    skillTooltip.style.display = 'block';
    requestAnimationFrame(() => skillTooltip.classList.add('active'));
  }

  function closeSkillTooltip() {
    if (!skillTooltip) return;
    skillTooltip.classList.remove('active');
    skillTooltipOverlay.classList.remove('active');
    skillTooltip.setAttribute('aria-hidden', 'true');
    setTimeout(() => { skillTooltip.style.display = ''; }, 250);
  }

  document.querySelectorAll('.skill-interactive').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = el.dataset.skillName;
      const desc = el.dataset.skillDesc;
      if (name && desc) openSkillTooltip(name, desc);
    });
  });

  if (skillTooltipClose) skillTooltipClose.addEventListener('click', closeSkillTooltip);
  if (skillTooltipOverlay) skillTooltipOverlay.addEventListener('click', closeSkillTooltip);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSkillTooltip();
  });

});
