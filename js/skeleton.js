// js/skeleton.js
function showSkeleton() {
  const pageContent = document.querySelector('.page-content');
  if (pageContent) {
    pageContent.classList.add('skeleton-wrap', 'loading-blur');
  }
}

function fadeOutSkeleton() {
  const pageContent = document.querySelector('.page-content');
  if (!pageContent) return;

  setTimeout(() => {
    pageContent.classList.remove('loading-blur');
    pageContent.classList.remove('skeleton-wrap');
  }, 800);
}
