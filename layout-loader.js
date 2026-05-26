/**
 * !NVOLUTION - Shared Layout Framework Loader
 * Dynamically imports isolated header/footer HTML components,
 * synchronizes theme states, binds mobile overlays, and highlights active links automatically.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. LOAD SHARED NAVBAR HEADER
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    fetch('header.html')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load header fragment');
        return response.text();
      })
      .then(html => {
        headerPlaceholder.innerHTML = html;
        initializeNavbarEngine();
      })
      .catch(err => console.error('Header Loader Error:', err));
  }

  // 2. LOAD SHARED BRAND FOOTER
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('footer.html')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load footer fragment');
        return response.text();
      })
      .then(html => {
        footerPlaceholder.innerHTML = html;
        initializeFooterEngine();
      })
      .catch(err => console.error('Footer Loader Error:', err));
  }
});

/**
 * Binds theme swappers, mobile nav drawers, and handles page path highlighting dynamically.
 */
function initializeNavbarEngine() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navbar = document.getElementById('navbar');

  // 1. MOBILE MENU SLIDE-OUT DRAWER BINDINGS
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      
      // Prevent body scroll when drawer is open
      if (navMenu.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close drawer if user clicks anywhere outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== navToggle) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // 2. SCROLL STABILITY TRACKER
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        // Keep navbar permanently scrolled if not on index landing hero view
        const isLanding = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
        if (!isLanding) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    }
  });

  // 3. AUTOMATIC ACTIVE PAGE LINK HIGHLIGHTER
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
  
  let activePageId = page || 'home';
  if (activePageId.startsWith('index') || activePageId === '') activePageId = 'home';
  // If on an event sub-page, highlight the main 'Gigs' tab!
  if (activePageId.startsWith('event-')) activePageId = 'gigs';

  const activeLink = document.querySelector(`.nav-link[data-page="${activePageId}"]`);
  if (activeLink) {
    // Remove active from others
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
  }

  // 4. THEME SWAPPER ENGINE INTEGRATION
  initializeThemeEngine();
}

/**
 * Handles localized calendar year injections inside footer fragment.
 */
function initializeFooterEngine() {
  const footerYearSpan = document.getElementById('copyright-year-fragment');
  if (footerYearSpan) {
    footerYearSpan.textContent = new Date().getFullYear();
  }
}

/**
 * Global Theme Switcher engine bound to dynamic components.
 */
function initializeThemeEngine() {
  const themeSwitcher = document.getElementById('theme-switcher');
  if (!themeSwitcher) return;

  const themeBtns = themeSwitcher.querySelectorAll('.theme-btn');
  
  // Load saved theme from LocalStorage, fallback to default dark
  const savedTheme = localStorage.getItem('selected-theme') || 'dark';
  setGlobalTheme(savedTheme);

  themeBtns.forEach(btn => {
    const btnTheme = btn.getAttribute('data-theme');
    
    // Sync initial button active state
    if (btnTheme === savedTheme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetTheme = btn.getAttribute('data-theme');
      
      // Save choice & set classes
      localStorage.setItem('selected-theme', targetTheme);
      setGlobalTheme(targetTheme);

      // Toggle active button classes
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/**
 * Applies class states to body element globally.
 */
function setGlobalTheme(theme) {
  document.body.classList.remove('theme-dark', 'theme-bright', 'theme-pink');
  
  if (theme === 'dark') {
    document.body.classList.add('theme-dark');
  } else if (theme === 'bright') {
    document.body.classList.add('theme-bright');
  } else if (theme === 'pink') {
    document.body.classList.add('theme-pink');
  }

  // Centralized navbar branding image swap matching active theme
  const logoImgs = document.querySelectorAll('.logo-img');
  logoImgs.forEach(logoImg => {
    if (theme === 'dark') {
      logoImg.src = 'logos/involution%20band%20logo%20bright.png';
    } else if (theme === 'bright') {
      logoImg.src = 'logos/involution%20band%20logo%20dark.png';
    } else if (theme === 'pink') {
      logoImg.src = 'logos/involution%20band%20logo%20pink.png';
    }
  });
}
