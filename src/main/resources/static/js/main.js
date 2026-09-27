/**
 * Team Z — main.js
 * Рендерит секции из данных в data.js, управляет мобильным меню
 * и лёгкой reveal-анимацией при скролле.
 */

// Inline lucide icon paths (currentColor-friendly). Держим здесь, а не как
// внешние <img>, чтобы иконки красились в цвет карточки/hover без доп. запросов.
const LUCIDE = {
    "book-open":
        '<path d="M12 5v16"/><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"/>',
    "code-2": '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
    brain:
        '<path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/>',
    "message-circle":
        '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>',
    rocket:
        '<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/>',
    boxes:
        '<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/>',
    lightbulb:
        '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    terminal: '<path d="M12 19h8"/><path d="m4 17 6-6-6-6"/>',
    menu: '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
};

function icon(name, extraClass = "") {
    const inner = LUCIDE[name] || "";
    return `<svg class="icon ${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
}

/* ---------- Nav ---------- */
function renderNav() {
    const desktop = document.getElementById("nav-desktop");
    const mobile = document.getElementById("nav-mobile");
    NAV_LINKS.forEach(({ label, href }) => {
        desktop.appendChild(el(`<a href="${href}">${label}</a>`));
        mobile.appendChild(el(`<a href="${href}">${label}</a>`));
    });
}

function initMobileMenu() {
    const header = document.querySelector(".site-header");
    const toggle = document.getElementById("nav-toggle");
    toggle.addEventListener("click", () => {
        const isOpen = header.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.innerHTML = icon(isOpen ? "x" : "menu");
    });
    document.getElementById("nav-mobile").addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
            header.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.innerHTML = icon("menu");
        }
    });
}

/* ---------- Courses ---------- */
function renderCourses() {
    const grid = document.getElementById("courses-grid");
    COURSES.forEach((c) => {
        grid.appendChild(
            el(`
      <article class="course-card reveal">
        <div class="course-top">
          <div class="course-badge"><img src="${c.icon}" alt="" width="28" height="28" /></div>
          <span class="course-tag">${c.tag}</span>
        </div>
        <h3>${c.title}</h3>
        <p class="course-desc">${c.summary}</p>
        <p class="course-desc-more">${c.description}</p>
        <ul class="course-features">
          ${c.features.map((f) => `<li>${f}</li>`).join("")}
        </ul>
        <a class="btn btn-secondary" href="${c.href}">Подробнее о курсе</a>
      </article>
    `)
        );
    });
}

/* ---------- Advantages ---------- */
function renderAdvantages() {
    const grid = document.getElementById("advantages-grid");
    ADVANTAGES.forEach((a) => {
        grid.appendChild(
            el(`
      <article class="advantage-card reveal">
        <div class="advantage-icon">${icon(a.icon)}</div>
        <h3>${a.title}</h3>
        <p>${a.text}</p>
      </article>
    `)
        );
    });
}

/* ---------- Team ---------- */
function initials(name) {
    return name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function renderTeam() {
    const grid = document.getElementById("team-grid");
    TEAM.forEach((m) => {
        grid.appendChild(
            el(`
      <article class="team-card reveal">
        <div class="avatar-placeholder" aria-hidden="true">${initials(m.name)}</div>
        <div>
          <h3>${m.name}</h3>
          <p class="team-role">${m.role}</p>
          <div class="team-focus">
            ${m.focus.map((f) => `<span>${f}</span>`).join("")}
          </div>
          <span class="team-tg">${icon("send")} ${m.tg}</span>
        </div>
      </article>
    `)
        );
    });
}

/* ---------- Reviews ---------- */
function renderReviews() {
    const track = document.getElementById("reviews-track");
    REVIEWS.forEach((r) => {
        track.appendChild(
            el(`
      <article class="review-card reveal">
        <p class="review-quote">${r.quote}</p>
        <div class="review-footer">
          <div class="review-avatar" aria-hidden="true"></div>
          <span class="review-name">${r.name}</span>
        </div>
      </article>
    `)
        );
    });
}

/* ---------- FAQ ---------- */
function renderFaq() {
    const list = document.getElementById("faq-list");
    FAQ.forEach((item, i) => {
        list.appendChild(
            el(`
      <details class="faq-item reveal" ${i === 0 ? "open" : ""}>
        <summary>
          <span>${item.q}</span>
          ${icon("chevron-down")}
        </summary>
        <div class="faq-answer">${item.a}</div>
      </details>
    `)
        );
    });
}

/* ---------- Socials ---------- */
function renderSocials(targetId) {
    const row = document.getElementById(targetId);
    if (!row) return;
    SOCIALS.forEach((s) => {
        row.appendChild(
            el(`
      <a class="social-link" href="${s.href}" target="_blank" rel="noopener noreferrer">
        <img src="${s.icon}" alt="" width="22" height="22" />
        <span>${s.name}</span>
      </a>
    `)
        );
    });
}

function renderFooterLinks() {
    const nav = document.getElementById("footer-nav");
    NAV_LINKS.forEach(({ label, href }) => nav.appendChild(el(`<a href="${href}">${label}</a>`)));

    const courses = document.getElementById("footer-courses");
    COURSES.forEach((c) => courses.appendChild(el(`<a href="${c.href}">${c.title}</a>`)));

    const socials = document.getElementById("footer-socials");
    SOCIALS.forEach((s) => socials.appendChild(el(`<a href="${s.href}">${s.name}</a>`)));
}

/* ---------- Reveal on scroll (single restrained pattern) ---------- */
function initReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
        targets.forEach((t) => t.classList.add("is-visible"));
        return;
    }
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((t) => io.observe(t));
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("nav-toggle").innerHTML = icon("menu");

    renderNav();
    renderCourses();
    renderAdvantages();
    renderTeam();
    renderReviews();
    renderFaq();
    renderSocials("socials-row");
    renderFooterLinks();

    initMobileMenu();
    initReveal();

    document.getElementById("year").textContent = new Date().getFullYear();
});
