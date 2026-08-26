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
      if (card.classList.contains('collaged-card') || card.id === 'cert-mongodb-collection') return;
      
      const title = card.getAttribute('data-title') || card.querySelector('.certificate-title').textContent;
      const issuer = card.getAttribute('data-issuer') || card.querySelector('.certificate-issuer').textContent;
      const duration = card.getAttribute('data-duration') || 'Duration not specified';
      const objective = card.getAttribute('data-objective') || 'Objective not specified';
      const outcomesStr = card.getAttribute('data-outcomes') || '';
      const imgSrc = card.querySelector('img').src;

      if (modalCourseTitle) modalCourseTitle.textContent = title;
      if (modalCourseIssuer) modalCourseIssuer.textContent = issuer.trim();
      if (modalCourseDuration) modalCourseDuration.textContent = duration.replace(/^Duration:\s*/i, '').trim();
      if (modalCourseObjective) modalCourseObjective.textContent = objective;

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

      // Populate thumbnail(s) - Supports dynamic multi-certificates stacked vertically
      const certsData = card.getAttribute('data-certs');
      const certLabelsData = card.getAttribute('data-cert-labels');
      if (modalCourseThumbContainer) {
        if (certsData) {
          const certUrls = certsData.split('|').map(s => s.trim()).filter(Boolean);
          const certLabels = certLabelsData ? certLabelsData.split('|').map(s => s.trim()) : [];
          const colors = ['var(--accent-blue)', 'var(--accent-cyan)', 'var(--accent-purple)', 'var(--accent-green)'];

          const itemsHtml = certUrls.map((url, idx) => {
            const label = certLabels[idx] || `Certificate ${idx + 1}`;
            const color = colors[idx % colors.length];
            return `
              <div>
                <div style="font-size: 0.8rem; font-weight: 600; color: ${color}; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.35rem;">
                  <span>${label}</span>
                </div>
                <div class="course-modal-thumbnail individual-thumb" data-src="${url}" style="position: relative; border-radius: var(--radius-md); overflow: hidden; cursor: pointer; border: 1px solid var(--border-glass);">
                  <img src="${url}" alt="${title} - Part ${idx + 1}" style="width: 100%; display: block;"/>
                  <div class="thumb-overlay"><span>View Full Certificate 🔍</span></div>
                </div>
              </div>
            `;
          }).join('');

          modalCourseThumbContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 1.25rem; width: 100%;">
              ${itemsHtml}
            </div>
          `;
          modalCourseThumbContainer.querySelectorAll('.individual-thumb').forEach(thumb => {
            thumb.addEventListener('click', (e) => {
              e.stopPropagation();
              const fullSrc = thumb.getAttribute('data-src');
              if (certModal && certModalImg) {
                certModalImg.src = fullSrc;
                certModal.classList.add('active');
              }
            });
          });
        } else {
          modalCourseThumbContainer.innerHTML = `
            <div class="course-modal-thumbnail individual-thumb" data-src="${imgSrc}" style="position: relative; border-radius: var(--radius-md); overflow: hidden; cursor: pointer; border: 1px solid var(--border-glass);">
              <img alt="Certificate Thumbnail" id="modal-course-thumb" src="${imgSrc}" style="width: 100%; display: block;"/>
              <div class="thumb-overlay"><span>View Full Certificate 🔍</span></div>
            </div>
          `;
          const thumbEl = modalCourseThumbContainer.querySelector('.individual-thumb');
          if (thumbEl) {
            thumbEl.addEventListener('click', (e) => {
              e.stopPropagation();
              if (certModal && certModalImg) {
                certModalImg.src = imgSrc;
                certModal.classList.add('active');
              }
            });
          }
        }
      }

      courseModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

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
      // Keep overflow hidden if course modal or mongodb modal is still open
      const mdbModalEl = document.getElementById('mongodb-modal');
      if ((courseModal && courseModal.classList.contains('active')) || (mdbModalEl && mdbModalEl.classList.contains('active'))) {
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

  const resultModalSem2 = document.getElementById('result-modal-sem2');
  const viewResultBtnSem2 = document.getElementById('view-sem2-result');
  const resultModalCloseSem2 = document.getElementById('result-modal-close-sem2');
  const resultModalBackdropSem2 = document.getElementById('result-modal-backdrop-sem2');

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

  function openResultModalSem2() {
    if (resultModalSem2) {
      resultModalSem2.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResultModalSem2() {
    if (resultModalSem2) {
      resultModalSem2.classList.remove('active');
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

  if (viewResultBtnSem2) {
    viewResultBtnSem2.addEventListener('click', openResultModalSem2);
  }
  if (resultModalCloseSem2) {
    resultModalCloseSem2.addEventListener('click', closeResultModalSem2);
  }
  if (resultModalBackdropSem2) {
    resultModalBackdropSem2.addEventListener('click', closeResultModalSem2);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (resultModal && resultModal.classList.contains('active')) closeResultModal();
      if (resultModalSem2 && resultModalSem2.classList.contains('active')) closeResultModalSem2();
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

  // ========== MongoDB Specialization Modal Logic ==========
  const mongodbCard = document.getElementById('cert-mongodb-collection');
  const mongodbModal = document.getElementById('mongodb-modal');
  const mongodbModalClose = document.getElementById('mongodb-modal-close');
  const mdbThumbCards = document.querySelectorAll('.mdb-thumb-card');

  const mongodbData = [
    {
      title: "MongoDB Basics for Students",
      date: "July 16, 2026",
      duration: "1 Hour",
      objective: "Gain a foundational understanding of NoSQL database concepts, JSON document storage, BSON data types, and fundamental CRUD operations using MongoDB.",
      outcomes: ["NoSQL Database Fundamentals", "JSON & BSON Data Structure", "MongoDB CRUD Operations", "Document Indexing Basics"],
      certImg: "./certificates/mongodb/cert_1_basics.png",
      badgeImg: "./certificates/mongodb/badge_1_basics.png",
      badgeTitle: "MongoDB Skill — Basics for Students"
    },
    {
      title: "AI Data Strategy with MongoDB",
      date: "July 17, 2026",
      duration: "30 Minutes",
      objective: "Formulate modern AI data architectures by leveraging MongoDB Atlas as a unified operational and vector database for enterprise AI workflows.",
      outcomes: ["AI Data Architecture", "MongoDB Atlas Integration", "Operational & Vector Data Synergy", "Scalable AI Data Pipelines"],
      certImg: "./certificates/mongodb/cert_2_ai_data_strategy.png",
      badgeImg: "./certificates/mongodb/badge_2_ai_data_strategy.png",
      badgeTitle: "MongoDB Skill — AI Data Strategy"
    },
    {
      title: "Vector Search Fundamentals",
      date: "July 17, 2026",
      duration: "1 Hour",
      objective: "Master high-dimensional vector embeddings, similarity metrics, and indexing with MongoDB Atlas Vector Search for semantic search and AI applications.",
      outcomes: ["Vector Embeddings & Cosine Distance", "MongoDB Atlas Vector Search", "ANN Indexing & Filtering", "Semantic Search Implementation"],
      certImg: "./certificates/mongodb/cert_3_vector_search.png",
      badgeImg: "./certificates/mongodb/badge_3_vector_search.png",
      badgeTitle: "MongoDB Skill — Vector Search Fundamentals"
    },
    {
      title: "RAG with MongoDB",
      date: "July 19, 2026",
      duration: "1 Hour",
      objective: "Build Retrieval-Augmented Generation (RAG) pipelines combining LLMs with MongoDB Atlas Vector Search to ground AI models in real-time enterprise data.",
      outcomes: ["Retrieval-Augmented Generation (RAG)", "LLM Context Window Grounding", "Hybrid Search & Reranking", "Enterprise AI Knowledge Retrieval"],
      certImg: "./certificates/mongodb/cert_4_rag.png",
      badgeImg: "./certificates/mongodb/badge_4_rag.png",
      badgeTitle: "MongoDB Skill — RAG with MongoDB"
    },
    {
      title: "AI Agents with MongoDB",
      date: "July 19, 2026",
      duration: "1.25 Hours",
      objective: "Design autonomous AI agent frameworks leveraging MongoDB for persistent memory, tool state tracking, and context-aware execution loops.",
      outcomes: ["Autonomous AI Agent Architecture", "Persistent Agent Memory & State", "Multi-Tool Orchestration", "Contextual Decision Making"],
      certImg: "./certificates/mongodb/cert_5_ai_agents.png",
      badgeImg: "./certificates/mongodb/badge_5_ai_agents.png",
      badgeTitle: "MongoDB Skill — AI Agents with MongoDB"
    }
  ];

  function updateMongoDBActiveCert(index) {
    const item = mongodbData[index];
    if (!item) return;

    // Update active thumb card styling
    mdbThumbCards.forEach((card, idx) => {
      const label = card.querySelector('div:last-child');
      if (idx === index) {
        card.classList.add('active');
        card.style.borderColor = '#10b981';
        card.style.background = 'rgba(16, 185, 129, 0.15)';
        if (label) label.style.color = 'var(--text-primary)';
      } else {
        card.classList.remove('active');
        card.style.borderColor = 'transparent';
        card.style.background = 'rgba(255, 255, 255, 0.04)';
        if (label) label.style.color = 'var(--text-muted)';
      }
    });

    // Update fields
    const titleEl = document.getElementById('mdb-active-title');
    const dateEl = document.getElementById('mdb-active-date');
    const durEl = document.getElementById('mdb-active-duration');
    const objEl = document.getElementById('mdb-active-objective');
    const outcomesEl = document.getElementById('mdb-active-outcomes');
    const certImgEl = document.getElementById('mdb-active-cert-img');
    const badgeImgEl = document.getElementById('mdb-active-badge-img');
    const badgeTitleEl = document.getElementById('mdb-active-badge-title');

    if (titleEl) titleEl.textContent = item.title;
    if (dateEl) dateEl.textContent = item.date;
    if (durEl) durEl.textContent = 'Duration: ' + item.duration;
    if (objEl) objEl.textContent = item.objective;
    if (certImgEl) certImgEl.src = item.certImg;
    if (badgeImgEl) badgeImgEl.src = item.badgeImg;
    if (badgeTitleEl) badgeTitleEl.textContent = item.badgeTitle;

    if (outcomesEl) {
      outcomesEl.innerHTML = '';
      item.outcomes.forEach(out => {
        const li = document.createElement('li');
        li.textContent = out;
        outcomesEl.appendChild(li);
      });
    }
  }

  if (mongodbCard && mongodbModal) {
    mongodbCard.addEventListener('click', () => {
      updateMongoDBActiveCert(0);
      mongodbModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  mdbThumbCards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      updateMongoDBActiveCert(idx);
    });
  });

  if (mongodbModalClose && mongodbModal) {
    mongodbModalClose.addEventListener('click', () => {
      mongodbModal.classList.remove('active');
      document.body.style.overflow = '';
    });
    mongodbModal.addEventListener('click', (e) => {
      if (e.target === mongodbModal) {
        mongodbModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Click on active cert img inside mongodb modal to view full cert
  const mdbCertImgWrapper = document.getElementById('mdb-cert-img-wrapper');
  if (mdbCertImgWrapper) {
    mdbCertImgWrapper.addEventListener('click', () => {
      const activeCertImg = document.getElementById('mdb-active-cert-img');
      const certModal = document.getElementById('certificate-modal');
      const certModalImg = document.getElementById('cert-modal-img');
      if (certModal && certModalImg && activeCertImg) {
        certModalImg.src = activeCertImg.src;
        certModal.classList.add('active');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const certModal = document.getElementById('certificate-modal');
      if (certModal && certModal.classList.contains('active')) return;
      if (mongodbModal && mongodbModal.classList.contains('active')) {
        mongodbModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

});
