document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const themeToggle = document.getElementById('theme-toggle');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const yearSpan = document.getElementById('year');
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  // Set current year in footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  
  // Theme functionality
  function loadTheme() {
    console.log('[Theme] Loading theme preferences...');
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Default to dark mode if no preference saved and system prefers dark
      if (!savedTheme) {
        console.log('[Theme] No saved preference, using system preference:', prefersDark ? 'dark' : 'light');
        document.body.classList.toggle('light-mode', !prefersDark);
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
      } else {
        console.log('[Theme] Found saved theme:', savedTheme);
        document.body.classList.toggle('light-mode', savedTheme === 'light');
      }
      
      updateThemeIcon();
    } catch (error) {
      console.error('[Theme] Error loading theme:', error);
      // Fallback to dark mode if there's an error
      document.body.classList.remove('light-mode');
    }
  }
  
  function toggleTheme() {
    console.log('[Theme] Toggling theme...');
    try {
      // Toggle the light-mode class on the body
      document.body.classList.toggle('light-mode');
      
      // Determine the new theme
      const isLightMode = document.body.classList.contains('light-mode');
      const newTheme = isLightMode ? 'light' : 'dark';
      
      // Save the preference
      localStorage.setItem('theme', newTheme);
      console.log('[Theme] Theme set to:', newTheme);
      
      updateThemeIcon();
      
      // Dispatch event for other components to react to theme change
      document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme: newTheme }
      }));
    } catch (error) {
      console.error('[Theme] Error toggling theme:', error);
    }
  }
  
  function updateThemeIcon() {
    if (!themeToggle) return;
    
    const isLightMode = document.body.classList.contains('light-mode');
    
    if (isLightMode) {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      themeToggle.setAttribute('aria-pressed', 'false');
    } else {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
      themeToggle.setAttribute('aria-pressed', 'true');
    }
    
    console.log('[Theme] Icon updated to:', isLightMode ? 'moon (light mode)' : 'sun (dark mode)');
  }
  
  // Mobile menu functionality
  function toggleMenu() {
    const isOpen = navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    
    // Update hamburger icon
    hamburger.innerHTML = isOpen ? 
      '<i class="fas fa-times"></i>' : 
      '<i class="fas fa-bars"></i>';
    
    console.log('[Menu] Mobile menu', isOpen ? 'opened' : 'closed');
  }
  
  function closeMenuOnLinkClick() {
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
  }
  
  // FAQ functionality
  function setupFAQ() {
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const answer = document.getElementById(question.getAttribute('aria-controls'));
        const isOpen = question.getAttribute('aria-expanded') === 'true';
        
        // Close all answers first
        document.querySelectorAll('.faq-answer').forEach(ans => {
          ans.style.maxHeight = null;
          const q = ans.previousElementSibling;
          q.setAttribute('aria-expanded', 'false');
          q.querySelector('i').className = 'fas fa-chevron-down';
        });
        
        // Open clicked one if it was closed
        if (!isOpen) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
          question.querySelector('i').className = 'fas fa-chevron-up';
        }
        
        console.log('[FAQ] Toggled question:', question.textContent.trim());
      });
    });
  }
  
  // Intersection Observer for animations
  function setupAnimations() {
    const animateElements = document.querySelectorAll('.fade-in, .fade-in-up');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
          console.log('[Animation] Element animated:', entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    animateElements.forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }
  
  // Smooth scrolling for anchor links
  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
          console.log('[Navigation] Scrolled to:', targetId);
        }
      });
    });
  }
  
  // Event listeners
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    console.log('[Theme] Theme toggle button initialized');
  }
  
  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
    console.log('[Menu] Hamburger button initialized');
  }
  
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenuOnLinkClick);
    });
    console.log('[Menu] Nav links initialized');
  }
  
  // Initialize all functionality
  try {
    loadTheme();
    setupFAQ();
    setupAnimations();
    setupSmoothScrolling();
    
    // Add loaded class to body when everything is ready
    setTimeout(() => {
      document.body.classList.add('loaded');
      console.log('[Page] Fully loaded');
    }, 100);
  } catch (error) {
    console.error('[Initialization] Error during setup:', error);
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      console.log('[Theme] System theme changed to:', e.matches ? 'dark' : 'light');
      document.body.classList.toggle('light-mode', !e.matches);
      updateThemeIcon();
    }
  });
});
