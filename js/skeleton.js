// js/skeleton.js

// Show skeleton shimmer
function showSkeleton() {
  // Add shimmer to visible content sections
  document.querySelectorAll(
    ".page-hero, .about-wrap, .about-card, header, footer"
  ).forEach(el => el.classList.add("skeleton-wrap", "loading-blur"));
}

// Hide skeleton shimmer (with a short visible delay)
function fadeOutSkeleton() {
  setTimeout(() => {
    document.querySelectorAll(".skeleton-wrap").forEach(el => {
      el.classList.remove("loading-blur");
      el.classList.remove("skeleton-wrap");
    });
  }, 1000); // stays visible for 1 second minimum
}
