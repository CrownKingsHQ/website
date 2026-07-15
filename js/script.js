/* ==================================================
   CROWNKINGS™ — V5 INTERACTIONS
================================================== */

const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

/* ==================================================
   MOBILE NAVIGATION
================================================== */

function closeNavigation() {
  if (!navToggle || !siteNav) {
    return;
  }

  siteNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
  body.classList.remove("menu-open");
}

function openNavigation() {
  if (!navToggle || !siteNav) {
    return;
  }

  siteNav.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close menu");
  body.classList.add("menu-open");
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen =
      navToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeNavigation();
    } else {
      openNavigation();
    }
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeNavigation();
    });
  });
}

/* Close the menu when the user clicks outside it. */

document.addEventListener("click", (event) => {
  if (!navToggle || !siteNav) {
    return;
  }

  const clickedInsideNavigation =
    siteNav.contains(event.target) ||
    navToggle.contains(event.target);

  if (
    !clickedInsideNavigation &&
    siteNav.classList.contains("is-open")
  ) {
    closeNavigation();
  }
});

/* Close the menu with the Escape key. */

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    siteNav &&
    siteNav.classList.contains("is-open")
  ) {
    closeNavigation();
    navToggle.focus();
  }
});

/* Close mobile navigation if the viewport becomes desktop-sized. */

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    closeNavigation();
  }
});

/* ==================================================
   SCROLLED HEADER STATE
================================================== */

function updateHeaderState() {
  if (!header) {
    return;
  }

  if (window.scrollY > 24) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
}

updateHeaderState();

window.addEventListener(
  "scroll",
  updateHeaderState,
  { passive: true }
);

/* ==================================================
   REVEAL ANIMATIONS
================================================== */

const revealElements = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right"
);

function showAllRevealElements() {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -55px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  showAllRevealElements();
}

/* ==================================================
   SIGNATURE CROWNKINGS LINES
================================================== */

const signatureLines =
  document.querySelectorAll(".signature-line");

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const lineObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.35
    }
  );

  signatureLines.forEach((line) => {
    lineObserver.observe(line);
  });
} else {
  signatureLines.forEach((line) => {
    line.classList.add("is-visible");
  });
}

/* ==================================================
   ACTIVE NAVIGATION PAGE
================================================== */

const currentFile =
  window.location.pathname.split("/").pop() || "index.html";

document
  .querySelectorAll(".site-nav a:not(.button)")
  .forEach((link) => {
    const linkFile =
      link.getAttribute("href")?.split("/").pop();

    if (linkFile === currentFile) {
      link.setAttribute("aria-current", "page");
    }
  });

/* ==================================================
   SMOOTH SAME-PAGE ANCHOR LINKS
================================================== */

document
  .querySelectorAll('a[href^="#"]')
  .forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const targetElement =
        document.querySelector(targetId);

      if (!targetElement) {
        return;
      }

      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start"
      });
    });
  });

/* ==================================================
   IMAGE LOADING POLISH
================================================== */

const siteImages = document.querySelectorAll(
  "img:not(.brand-icon):not(.footer-icon)"
);

siteImages.forEach((image) => {
  if (image.complete) {
    image.classList.add("is-loaded");
    return;
  }

  image.addEventListener(
    "load",
    () => {
      image.classList.add("is-loaded");
    },
    { once: true }
  );

  image.addEventListener(
    "error",
    () => {
      image.classList.add("has-error");
      console.warn(
        `CrownKings image could not load: ${image.src}`
      );
    },
    { once: true }
  );
});

/* ==================================================
   EXTERNAL LINK SAFETY
================================================== */

document
  .querySelectorAll('a[target="_blank"]')
  .forEach((link) => {
    const currentRel =
      link.getAttribute("rel") || "";

    const relValues = new Set(
      currentRel.split(/\s+/).filter(Boolean)
    );

    relValues.add("noopener");
    relValues.add("noreferrer");

    link.setAttribute(
      "rel",
      Array.from(relValues).join(" ")
    );
  });
