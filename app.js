/**
 * !nvolution Band Website Controller
 * Implements custom Web Audio synthesizer for live playback, interactive UI modals,
 * mobile menu toggle, active scroll highlights, and form submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // Initialize dynamic copyright year
  const yearSpan = document.getElementById('copyright-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ==========================================
   * MOBILE MENU TOGGLE
   * ========================================== */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      
      // Prevent scroll when menu is open
      if (navMenu.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ==========================================
   * NAVBAR SCROLL EFFECT
   * ========================================== */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Highlight active menu item on scroll
    const scrollPosition = window.scrollY + 150;
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run initially



  /* ==========================================
   * INTERACTIVE TICKET CHECKOUT MODAL
   * ========================================== */
  const modalOverlay = document.getElementById('ticket-modal');
  const modalShowTitle = document.getElementById('modal-show-title');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const checkoutForm = document.getElementById('form-checkout');
  const checkoutFeedback = document.getElementById('checkout-feedback');
  
  const buyButtons = document.querySelectorAll('.btn-tour[data-show]');
  
  const openModal = (showName) => {
    modalShowTitle.textContent = showName;
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // lock body scroll
    checkoutFeedback.style.display = 'none';
    checkoutForm.reset();
  };
  
  const closeModal = () => {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // restore body scroll
  };
  
  buyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const showName = btn.getAttribute('data-show');
      openModal(showName);
    });
  });
  
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  
  // Close on clicking background overlay
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }
  
  // Close on pressing escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Checkout submission simulation
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('modal-email');
      const qtyInput = document.getElementById('modal-qty');
      
      if (!emailInput.value) return;
      
      const submitBtn = document.getElementById('btn-checkout-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Processing transaction...";
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        checkoutFeedback.textContent = `Success! ${qtyInput.value} tickets sent to ${emailInput.value}. Escape the grid!`;
        checkoutFeedback.className = "form-message success";
        checkoutFeedback.style.display = "block";
        
        setTimeout(() => {
          closeModal();
        }, 2500);
      }, 1500);
    });
  }

  /* ==========================================
   * NEWSLETTER / CONTACT FORM VALIDATION
   * ========================================== */
  const newsletterForm = document.getElementById('form-newsletter');
  const feedbackMessage = document.getElementById('form-feedback');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameVal = document.getElementById('input-name').value.trim();
      const emailVal = document.getElementById('input-email').value.trim();
      const submitBtn = document.getElementById('btn-submit-newsletter');
      
      if (!nameVal || !emailVal) {
        feedbackMessage.textContent = "Please provide a valid name and email address.";
        feedbackMessage.className = "form-message error";
        feedbackMessage.style.display = "block";
        return;
      }
      
      // Simulate request transition state
      submitBtn.textContent = "Decrypting access keys...";
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = "Request Access";
        submitBtn.disabled = false;
        
        feedbackMessage.textContent = `Welcome to the anti-involution grid, ${nameVal}. Secure keys dispatched to ${emailVal}.`;
        feedbackMessage.className = "form-message success";
        feedbackMessage.style.display = "block";
        
        newsletterForm.reset();
      }, 1800);
    });
  }

  /* ==========================================
   * THEME SWITCHING SYSTEM
   * ========================================== */
  const themeBtns = document.querySelectorAll('.theme-btn');
  
  const applyTheme = (theme) => {
    // Remove existing theme classes from body
    document.body.classList.remove('theme-dark', 'theme-bright', 'theme-pink');
    
    // Apply chosen theme class
    if (theme === 'bright' || theme === 'pink') {
      document.body.classList.add(`theme-${theme}`);
    } else {
      document.body.classList.add('theme-dark'); // default
    }
    
    // Swap logos to match theme scene
    const logos = document.querySelectorAll('.logo-img');
    logos.forEach(img => {
      if (theme === 'bright') {
        img.src = 'logos/involution%20band%20logo%20bright.png';
      } else if (theme === 'pink') {
        img.src = 'logos/involution%20band%20logo%20pink.png';
      } else {
        img.src = 'logos/involution%20band%20logo%20dark.png'; // dark theme uses dark logo
      }
    });
    
    // Update switcher button active state
    themeBtns.forEach(btn => {
      if (btn.getAttribute('data-theme') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Save to local storage
    localStorage.setItem('involution-theme', theme);
  };

  // Event listeners for switcher buttons
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const chosenTheme = btn.getAttribute('data-theme');
      applyTheme(chosenTheme);
    });
  });

  // Initialize saved theme on load
  const savedTheme = localStorage.getItem('involution-theme') || 'dark';
  applyTheme(savedTheme);
});
