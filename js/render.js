document.addEventListener("DOMContentLoaded", async () => {
  try {
    await (window.Data?.prime?.() || Promise.resolve());

    const $  = s => document.querySelector(s);
    const $$ = s => [...document.querySelectorAll(s)];
    const putText = (sel, v='') => { const el=$(sel); if (el) el.textContent = v; };
    const putHTML = (sel, v='') => { const el=$(sel); if (el) el.innerHTML = v; };
    const putSrc  = (sel, v)     => { const el=$(sel); if (el && v) el.src = v; };
    const show    = (sel, ok)    => { const el=$(sel); if (el) el.style.display = ok?'':'none'; };

    // ====== EXAMPLES: guard every access so no "Cannot set properties of null" ======
    // ABOUT
    if ($('[data-page="about"]')) {
      const a = Data.get('about');
      putText('#about_name', a.about_name);
      putText('#about_role', a.about_role);
      putHTML('#about_hero_desc', a.about_hero_desc);
      putSrc('#about_image', a.about_image);
      // …repeat for whatever selectors you actually have
    }

    // CONTACT
    if ($('[data-page="contact"]')) {
      const c = Data.get('contact');
      putText('#c_pill', c.c_pill);
      putText('#c_title', c.c_title);
      putText('#c_sub', c.c_sub);
      putSrc('#c_image', c.c_image);
      // …and so on (only set if the element exists)
    }

    // PORTFOLIO LIST
    if ($('[data-page="portfolio"]')) {
      const listHost = $('#projects_list');
      if (listHost) {
        const items = Data.projects().filter(p => (p.status||'active') === 'active');
        listHost.innerHTML = items.map(p => `
          <a class="card" href="portfolio-details.html?id=${encodeURIComponent(p.id)}">
            <img loading="lazy" src="${p.hero||''}" alt="">
            <div class="t">${p.title||''}</div>
            <div class="tag">${p.tag||''}</div>
          </a>
        `).join('');
      }
    }

    // PORTFOLIO DETAILS
    if ($('[data-page="portfolio-details"]')) {
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      const p = Data.projects().find(x => x.id===id);
      if (p) {
        putText('#p_title', p.title);
        putText('#p_tag', p.tag);
        putText('#p_date', p.date);
        putHTML('#p_desc', p.desc || '');
        putSrc('#p_hero', p.hero);
        const secHost = $('#p_sections');
        if (secHost) {
          secHost.innerHTML = (p.sections||[]).map(s=>{
            if (s.type==='img') return `<figure class="img"><img src="${s.value||''}" alt="${s.alt||''}"></figure>`;
            if (s.type==='h2')  return `<h2>${s.value||''}</h2>`;
            return `<p>${s.value||''}</p>`;
          }).join('');
        }
      } else {
        // optional: show 404 block on this page
        show('#p_not_found', true);
      }
    }

    // BLOG LIST
    if ($('[data-page="blog"]')) {
      const host = $('#blog_list');
      if (host) {
        const posts = Data.blogs().filter(b => (b.status||'active')==='active');
        host.innerHTML = posts.map(b=>`
          <a class="post" href="blog-details.html?id=${encodeURIComponent(b.id)}">
            <img loading="lazy" src="${b.hero||''}" alt="">
            <div class="t">${b.title||''}</div>
            <div class="sub">${b.subtitle||''}</div>
          </a>
        `).join('');
      }
    }

    // BLOG DETAILS
    if ($('[data-page="blog-details"]')) {
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      const b = Data.blogs().find(x => x.id===id);
      if (b) {
        putText('#b_title', b.title);
        putText('#b_tag', b.tag);
        putText('#b_date', b.date);
        putHTML('#b_sub', b.subtitle || '');
        putSrc('#b_hero', b.hero);
        const secHost = $('#b_sections');
        if (secHost) {
          secHost.innerHTML = (b.sections||[]).map(s=>{
            if (s.type==='img') return `<figure class="img"><img src="${s.value||''}" alt="${s.alt||''}"></figure>`;
            if (s.type==='h2')  return `<h2>${s.value||''}</h2>`;
            return `<p>${s.value||''}</p>`;
          }).join('');
        }
      } else {
        show('#b_not_found', true);
      }
    }

    // 404 PAGE (optional)
    if ($('[data-page="four"]')) {
      const d = Data.get('404');
      putText('#four_title', d.title || 'Hmmm…');
      // …map any other fields if your 404.html has them
    }
  } catch (e) {
    console.warn('Render init failed', e);
  }
});
