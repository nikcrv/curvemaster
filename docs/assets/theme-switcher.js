// Theme switcher for CurveMaster - Curve Style
(function() {
  'use strict';
  
  const THEMES = ['light', 'dark', 'chad'];
  const STORAGE_KEY = 'curvemaster-theme';
  
  // SVG Icons - Curve style
  const ICONS = {
    light: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`,
    dark: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>`,
    chad: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="8" cy="8" r="1.5"/>
      <circle cx="16" cy="8" r="1.5"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M5 2L7 4M19 2L17 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  };
  
  // Get current theme index
  function getCurrentThemeIndex() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const index = THEMES.indexOf(saved);
    return index >= 0 ? index : 0;
  }
  
  // Get theme name from index
  function getThemeName(index) {
    return THEMES[index % THEMES.length];
  }
  
  // Apply theme
  function applyTheme(themeName) {
    // Map theme names to color schemes
    const schemeMap = {
      'light': 'default',
      'dark': 'slate',
      'chad': 'curve-chad'
    };
    
    const scheme = schemeMap[themeName] || 'default';
    document.body.setAttribute('data-md-color-scheme', scheme);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, themeName);
  }
  
  // Create theme toggle button
  function createThemeToggle() {
    // Check if already exists
    if (document.querySelector('.curve-theme-toggle-btn')) return;
    
    // Find the search container
    const searchContainer = document.querySelector('.md-search');
    if (!searchContainer) {
      setTimeout(createThemeToggle, 100);
      return;
    }
    
    // Create button
    const toggleBtn = createButton();
    
    // Insert before search container
    searchContainer.parentNode.insertBefore(toggleBtn, searchContainer);
  }
  
  function createButton() {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'curve-theme-toggle-btn md-header__button md-icon';
    toggleBtn.setAttribute('aria-label', 'Переключить тему');
    toggleBtn.setAttribute('title', 'Переключить тему');
    
    // Set initial icon
    const currentIndex = getCurrentThemeIndex();
    const currentTheme = getThemeName(currentIndex);
    toggleBtn.innerHTML = ICONS[currentTheme];
    
    // Handle click - cycle through themes
    toggleBtn.addEventListener('click', () => {
      const currentIndex = getCurrentThemeIndex();
      const nextIndex = (currentIndex + 1) % THEMES.length;
      const nextTheme = getThemeName(nextIndex);
      
      // Apply theme
      applyTheme(nextTheme);
      
      // Update icon with animation
      toggleBtn.classList.add('rotating');
      setTimeout(() => {
        toggleBtn.innerHTML = ICONS[nextTheme];
        toggleBtn.classList.remove('rotating');
      }, 200);
    });
    
    return toggleBtn;
  }
  
  // Add styles
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Hide default Material theme toggles */
      .md-header__button.md-icon[for^="__palette"] {
        display: none !important;
      }
      
      /* Remove old theme switcher styles */
      .theme-switcher-header,
      .theme-selector {
        display: none !important;
      }
      
      /* Curve theme toggle button */
      .curve-theme-toggle-btn {
        width: 2.2rem !important;
        height: 2.2rem !important;
        padding: 0.4rem !important;
        margin: 0 !important;
        color: var(--md-primary-bg-color) !important;
        background: transparent !important;
        border: none !important;
        cursor: pointer !important;
        transition: opacity 0.25s !important;
      }
      
      .curve-theme-toggle-btn:hover {
        opacity: 0.7 !important;
      }
      
      .curve-theme-toggle-btn svg {
        width: 20px;
        height: 20px;
        display: block;
        fill: currentColor;
        transition: transform 0.3s ease;
      }
      
      .curve-theme-toggle-btn.rotating svg {
        transform: rotate(360deg);
      }
      
      /* Theme-specific button colors */
      .md-header .curve-theme-toggle-btn {
        color: var(--md-primary-bg-color) !important;
      }
      
      [data-md-color-scheme="curve-chad"] .curve-theme-toggle-btn {
        animation: chadPulse 2s infinite;
      }
      
      @keyframes chadPulse {
        0%, 100% { 
          transform: scale(1);
          filter: brightness(1);
        }
        50% { 
          transform: scale(1.05);
          filter: brightness(1.2);
        }
      }
      
      /* Mobile responsive */
      @media screen and (max-width: 768px) {
        .curve-theme-toggle-btn {
          width: 2rem !important;
          height: 2rem !important;
          padding: 0.3rem !important;
        }
        
        .curve-theme-toggle-btn svg {
          width: 18px;
          height: 18px;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize
  function init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    // Add styles
    addStyles();
    
    // Apply saved theme
    const currentIndex = getCurrentThemeIndex();
    const currentTheme = getThemeName(currentIndex);
    applyTheme(currentTheme);
    
    // Create toggle button
    setTimeout(createThemeToggle, 500);
    
    // Re-apply after navigation (MkDocs instant loading)
    if (typeof app !== 'undefined' && app.document$) {
      app.document$.subscribe(() => {
        const currentIndex = getCurrentThemeIndex();
        const currentTheme = getThemeName(currentIndex);
        applyTheme(currentTheme);
        setTimeout(createThemeToggle, 500);
      });
    }
  }
  
  init();
})();