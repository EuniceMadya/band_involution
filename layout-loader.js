/**
 * !NVOLUTION - Shared Layout Framework Loader
 * Centralized dynamic template fragments engine with automatic relative path resolution.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Path depth resolution
  const isSubpage = window.location.pathname.includes('/events/');
  const prefix = isSubpage ? '../' : '';

  // 1. LOAD SHARED NAVBAR HEADER
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    fetch(prefix + 'components/header.html')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load header fragment');
        return response.text();
      })
      .then(html => {
        headerPlaceholder.innerHTML = html;
        resolveHeaderPaths(isSubpage, prefix);
        initializeNavbarEngine(isSubpage, prefix);
      })
      .catch(err => console.error('Header Loader Error:', err));
  }

  // 2. LOAD SHARED BRAND FOOTER
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch(prefix + 'components/footer.html')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load footer fragment');
        return response.text();
      })
      .then(html => {
        footerPlaceholder.innerHTML = html;
        resolveFooterPaths(isSubpage, prefix);
        initializeFooterEngine();
      })
      .catch(err => console.error('Footer Loader Error:', err));
  }
});

/**
 * Prepend relative paths (../) to all navbar links and logos inside header when on subpages.
 */
function resolveHeaderPaths(isSubpage, prefix) {
  if (!isSubpage) return;

  // Prepend to all nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && href !== '#') {
      link.setAttribute('href', prefix + href);
    }
  });

  // Prepend to logo links and logo images
  const logoLink = document.getElementById('logo');
  if (logoLink) {
    const href = logoLink.getAttribute('href');
    if (href) logoLink.setAttribute('href', prefix + href);
  }
}

/**
 * Prepend relative paths (../) to all links and logos inside footer when on subpages.
 */
function resolveFooterPaths(isSubpage, prefix) {
  if (!isSubpage) return;

  // Prepend to footer Brand Logo link and Image
  const footerBrandImg = document.querySelector('.footer-brand h4 img');
  if (footerBrandImg) {
    const src = footerBrandImg.getAttribute('src');
    if (src) footerBrandImg.setAttribute('src', prefix + src);
  }

  // Prepend to footer links list
  const footerLinks = document.querySelectorAll('.footer-menu a, .footer ul a');
  footerLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && href !== '#') {
      link.setAttribute('href', prefix + href);
    }
  });

  // Prepend to Xiaohongshu profile link in footer
  const socials = document.querySelectorAll('.footer-socials a');
  socials.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('logos/')) {
      link.setAttribute('href', prefix + href);
    }
  });
}

/**
 * Binds theme swappers, mobile nav drawers, and handles page path highlighting dynamically.
 */
function initializeNavbarEngine(isSubpage, prefix) {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navbar = document.getElementById('navbar');

  // 1. MOBILE MENU SLIDE-OUT DRAWER BINDINGS
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      
      if (navMenu.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

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
        // Keep navbar scrolled if not on index landing hero view
        const isLanding = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || (!isSubpage && window.location.pathname === '');
        if (!isLanding || isSubpage) {
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
  if (isSubpage) activePageId = 'gigs';

  const activeLink = document.querySelector(`.nav-link[data-page="${activePageId}"]`);
  if (activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
  }

  // 4. THEME SWAPPER ENGINE INTEGRATION
  initializeThemeEngine(prefix);
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
function initializeThemeEngine(prefix) {
  const themeSwitcher = document.getElementById('theme-switcher');
  if (!themeSwitcher) return;

  const themeBtns = themeSwitcher.querySelectorAll('.theme-btn');
  
  const savedTheme = localStorage.getItem('selected-theme') || 'dark';
  setGlobalTheme(savedTheme, prefix);

  themeBtns.forEach(btn => {
    const btnTheme = btn.getAttribute('data-theme');
    
    if (btnTheme === savedTheme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetTheme = btn.getAttribute('data-theme');
      
      localStorage.setItem('selected-theme', targetTheme);
      setGlobalTheme(targetTheme, prefix);

      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/**
 * Applies class states to body element globally.
 */
function setGlobalTheme(theme, prefix) {
  document.body.classList.remove('theme-dark', 'theme-bright', 'theme-pink');
  
  if (theme === 'dark') {
    document.body.classList.add('theme-dark');
  } else if (theme === 'bright') {
    document.body.classList.add('theme-bright');
  } else if (theme === 'pink') {
    document.body.classList.add('theme-pink');
  }

  // Centralized navbar branding image swap with path depth prefix resolution
  const logoImgs = document.querySelectorAll('.logo-img');
  logoImgs.forEach(logoImg => {
    if (theme === 'dark') {
      logoImg.src = prefix + 'logos/involution%20band%20logo%20bright.png';
    } else if (theme === 'bright') {
      logoImg.src = prefix + 'logos/involution%20band%20logo%20dark.png';
    } else if (theme === 'pink') {
      logoImg.src = prefix + 'logos/involution%20band%20logo%20pink.png';
    }
  });
}
