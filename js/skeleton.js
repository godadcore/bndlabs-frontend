// js/skeleton.js

// add shimmer background to all important containers
function showSkeleton() {
  document.body.classList.add("skeleton-active");

  // add skeleton-wrap to every section we want blurred
  document.querySelectorAll(
    ".page-hero, .about-wrap, .about-card, header, footer"
  ).forEach(el => el.classList.add("skeleton-wrap", "loading-blur"));
}

function fadeOutSkeleton() {
  setTimeout(() => {
    const els = document.querySelectorAll(".skeleton-wrap");
    els.forEach(el => {
      el.classList.remove("loading-blur");
      el.classList.remove("skeleton-wrap");
    });
    document.body.classList.remove("skeleton-active");
  }, 1000); // ⏱ keeps shimmer visible for 1 s minimum
}
