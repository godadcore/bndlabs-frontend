/* ===========================================================
   UNIVERSAL SKELETON LOADER
   Works across all BNDLabs pages: Home, About, Portfolio, Blog, Contact
   =========================================================== */

// Apply shimmer placeholders to key sections
function showSkeleton() {
  const selectors = [
    '.hero-card',
    '.about-body',
    '.profile',
    '.projects-grid',
    '.project-details',
    '.blog-container',
    '.contact-form',
    '.page-section'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('skeleton-wrap');
    });
  });
}

// Remove shimmer immediately
function hideSkeleton() {
  document.querySelectorAll('.skeleton-wrap').forEach(el =>
    el.classList.remove('skeleton-wrap')
  );
}

// Fade shimmer out smoothly when data arrives
function fadeOutSkeleton() {
  const elements = document.querySelectorAll('.skeleton-wrap');
  elements.forEach(el => {
    el.style.transition = 'opacity 0.4s ease';
    el.style.opacity = '0';
    setTimeout(() => {
      el.classList.remove('skeleton-wrap');
      el.style.opacity = '';
    }, 400);
  });
}

// Optional helper for blur overlays (useful on hero or body)
function showBlur() {
  document.querySelectorAll('.hero-card, .about-body').forEach(el =>
    el.classList.add('loading-blur')
  );
}
function hideBlur() {
  document.querySelectorAll('.loading-blur').forEach(el =>
    el.classList.remove('loading-blur')
  );
}

// Export functions globally
window.showSkeleton = showSkeleton;
window.fadeOutSkeleton = fadeOutSkeleton;
window.hideSkeleton = hideSkeleton;
window.showBlur = showBlur;
window.hideBlur = hideBlur;
