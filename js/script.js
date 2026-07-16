/* =========================================================
   CROWNKINGS™ V6
   FINAL INTERACTION SYSTEM
   Safe image fade-in version
========================================================= */

"use strict";

/*
  Confirms that JavaScript is running.

  The CSS uses this class to enable enhanced image fade effects.
  If JavaScript ever fails, images remain visible by default.
*/

document.documentElement.classList.add("js");

/* =========================================================
   GLOBAL REFERENCES
========================================================= */

const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

function prefersReducedMotion() {
  return reducedMotionQuery.matches;
}

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function openNavigation() {
  if (!navToggle || !siteNav) {
    return;
  }

  siteNav.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close menu");
  body.classList.add("menu-open");
}

function closeNavigation({ restoreFocus = false } = {}) {
  if (!navToggle || !siteNav) {
    return;
  }

  siteNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
  body.classList.remove("menu-open");

  if (restoreFocus) {
    navToggle.focus();
  }
}

function toggleNavigation() {
  if (!navToggle || !siteNav) {
    return;
  }

  const isOpen =
    navToggle.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closeNavigation();
  } else {
    openNavigation();
  }
}

if (navToggle && siteNav) {
  navToggle.addEventListener(
    "click",
    toggleNavigation
  );

  siteNav
    .querySelectorAll("a")
    .forEach((link) => {
      link.addEventListener("click", () => {
        closeNavigation();
      });
    });
}

document.addEventListener("click", (event) => {
  if (!navToggle || !siteNav) {
    return;
  }

  if (!siteNav.classList.contains("is-open")) {
    return;
  }

  const clickedInsideNavigation =
    siteNav.contains(event.target) ||
    navToggle.contains(event.target);

  if (!clickedInsideNavigation) {
    closeNavigation();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    closeNavigation();
  }
});

/* =========================================================
   HEADER SCROLL STATE
========================================================= */

let headerFrameRequested = false;

function updateHeaderState() {
  if (!header) {
    return;
  }

  header.classList.toggle(
    "is-scrolled",
    window.scrollY > 24
  );

  headerFrameRequested = false;
}

function requestHeaderUpdate() {
  if (headerFrameRequested) {
    return;
  }

  headerFrameRequested = true;

  window.requestAnimationFrame(
    updateHeaderState
  );
}

updateHeaderState();

window.addEventListener(
  "scroll",
  requestHeaderUpdate,
  {
    passive: true
  }
);

/* =========================================================
   ACTIVE NAVIGATION PAGE
========================================================= */

function normalizePageName(pathname) {
  const pageName =
    pathname.split("/").pop() ||
    "index.html";

  return pageName === ""
    ? "index.html"
    : pageName;
}

const currentPage = normalizePageName(
  window.location.pathname
);

document
  .querySelectorAll(
    ".site-nav a:not(.button)"
  )
  .forEach((link) => {
    const href =
      link.getAttribute("href");

    if (!href) {
      return;
    }

    const linkURL = new URL(
      href,
      window.location.href
    );

    const linkPage = normalizePageName(
      linkURL.pathname
    );

    if (
      linkURL.origin ===
        window.location.origin &&
      linkPage === currentPage
    ) {
      link.setAttribute(
        "aria-current",
        "page"
      );
    } else if (
      link.getAttribute(
        "aria-current"
      ) === "page"
    ) {
      link.removeAttribute(
        "aria-current"
      );
    }
  });

/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

const revealElements =
  document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right"
  );

function revealAllElements() {
  revealElements.forEach((element) => {
    element.classList.add(
      "is-visible"
    );
  });
}

if (
  "IntersectionObserver" in window &&
  !prefersReducedMotion()
) {
  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.12,
        rootMargin:
          "0px 0px -50px 0px"
      }
    );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealAllElements();
}

/* =========================================================
   SIGNATURE GOLD LINES
========================================================= */

const signatureLines =
  document.querySelectorAll(
    ".signature-line"
  );

function showAllSignatureLines() {
  signatureLines.forEach((line) => {
    line.classList.add(
      "is-visible"
    );
  });
}

if (
  "IntersectionObserver" in window &&
  !prefersReducedMotion()
) {
  const signatureObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.3
      }
    );

  signatureLines.forEach((line) => {
    signatureObserver.observe(line);
  });
} else {
  showAllSignatureLines();
}

/* =========================================================
   SMOOTH SAME-PAGE LINKS
========================================================= */

document
  .querySelectorAll('a[href^="#"]')
  .forEach((anchor) => {
    anchor.addEventListener(
      "click",
      (event) => {
        const targetSelector =
          anchor.getAttribute("href");

        if (
          !targetSelector ||
          targetSelector === "#"
        ) {
          return;
        }

        let targetElement;

        try {
          targetElement =
            document.querySelector(
              targetSelector
            );
        } catch (error) {
          return;
        }

        if (!targetElement) {
          return;
        }

        event.preventDefault();

        closeNavigation();

        targetElement.scrollIntoView({
          behavior:
            prefersReducedMotion()
              ? "auto"
              : "smooth",
          block: "start"
        });

        if (
          !targetElement.hasAttribute(
            "tabindex"
          )
        ) {
          targetElement.setAttribute(
            "tabindex",
            "-1"
          );
        }

        window.setTimeout(
          () => {
            targetElement.focus({
              preventScroll: true
            });
          },
          prefersReducedMotion()
            ? 0
            : 450
        );
      }
    );
  });

/* =========================================================
   SAFE IMAGE LOADING AND FADE-IN
========================================================= */

/*
  Images are visible by default in CSS.

  When JavaScript is active:
  1. The .js class enables the enhanced hidden state.
  2. Each image receives .is-loaded when it is ready.
  3. The image fades and rises gently into view.
  4. Broken images receive .has-error and remain visible
     with a neutral background.

  This prevents images from remaining permanently invisible.
*/

const siteImages =
  document.querySelectorAll(
    "img:not(.brand-icon):not(.footer-icon)"
  );

function markImageLoaded(image) {
  image.classList.remove(
    "has-error"
  );

  /*
    Using requestAnimationFrame ensures the browser
    registers the initial state before revealing the image.
  */

  window.requestAnimationFrame(() => {
    image.classList.add(
      "is-loaded"
    );
  });
}

function markImageError(image) {
  image.classList.remove(
    "is-loaded"
  );

  image.classList.add(
    "has-error"
  );

  console.warn(
    "CrownKings image could not load:",
    image.currentSrc || image.src
  );
}

function prepareImage(image) {
  /*
    If the browser has already loaded the image,
    reveal it immediately.
  */

  if (
    image.complete &&
    image.naturalWidth > 0
  ) {
    markImageLoaded(image);
    return;
  }

  /*
    If the image has finished attempting to load
    but has no natural width, treat it as an error.
  */

  if (
    image.complete &&
    image.naturalWidth === 0
  ) {
    markImageError(image);
    return;
  }

  /*
    Otherwise, wait for the normal load or error event.
  */

  image.addEventListener(
    "load",
    () => {
      markImageLoaded(image);
    },
    {
      once: true
    }
  );

  image.addEventListener(
    "error",
    () => {
      markImageError(image);
    },
    {
      once: true
    }
  );

  /*
    Safety fallback:
    after several seconds, reveal any image that loaded
    successfully but whose load event was missed.
  */

  window.setTimeout(() => {
    if (
      image.naturalWidth > 0 &&
      !image.classList.contains(
        "is-loaded"
      )
    ) {
      markImageLoaded(image);
    }
  }, 4000);
}

siteImages.forEach((image) => {
  prepareImage(image);
});

/*
  Final production safeguard.

  If an unusual browser prevents the image-loading logic
  from completing, reveal all successfully loaded images.
*/

window.addEventListener(
  "load",
  () => {
    siteImages.forEach((image) => {
      if (image.naturalWidth > 0) {
        markImageLoaded(image);
      } else if (
        image.complete &&
        image.naturalWidth === 0
      ) {
        markImageError(image);
      }
    });
  },
  {
    once: true
  }
);

/* =========================================================
   GALLERY LIGHTBOX
========================================================= */

const galleryItems = Array.from(
  document.querySelectorAll(
    ".gallery-item"
  )
);

let lightbox = null;
let lightboxImage = null;
let lightboxCaption = null;
let lightboxClose = null;
let lightboxPrevious = null;
let lightboxNext = null;
let currentGalleryIndex = 0;
let lastFocusedElement = null;

function getGalleryItemData(item) {
  const image =
    item.querySelector("img");

  const title =
    item.querySelector(
      ".gallery-item__caption strong"
    );

  const description =
    item.querySelector(
      ".gallery-item__caption span"
    );

  return {
    src:
      image?.currentSrc ||
      image?.src ||
      "",

    alt:
      image?.alt ||
      title?.textContent?.trim() ||
      "CrownKings finished space",

    caption: [
      title?.textContent?.trim(),
      description?.textContent?.trim()
    ]
      .filter(Boolean)
      .join(" — ")
  };
}

function createLightbox() {
  if (
    lightbox ||
    galleryItems.length === 0
  ) {
    return;
  }

  lightbox =
    document.createElement("div");

  lightbox.className = "lightbox";

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );

  lightbox.innerHTML = `
    <div
      class="lightbox__dialog"
      role="dialog"
      aria-modal="true"
      aria-label="Finished space image viewer"
    >
      <button
        class="lightbox__close"
        type="button"
        aria-label="Close image viewer"
      >
        ×
      </button>

      <button
        class="lightbox__previous"
        type="button"
        aria-label="View previous image"
      >
        ‹
      </button>

      <img
        class="lightbox__image"
        src=""
        alt=""
      >

      <button
        class="lightbox__next"
        type="button"
        aria-label="View next image"
      >
        ›
      </button>

      <p
        class="lightbox__caption"
        aria-live="polite"
      ></p>
    </div>
  `;

  document.body.appendChild(
    lightbox
  );

  lightboxImage =
    lightbox.querySelector(
      ".lightbox__image"
    );

  lightboxCaption =
    lightbox.querySelector(
      ".lightbox__caption"
    );

  lightboxClose =
    lightbox.querySelector(
      ".lightbox__close"
    );

  lightboxPrevious =
    lightbox.querySelector(
      ".lightbox__previous"
    );

  lightboxNext =
    lightbox.querySelector(
      ".lightbox__next"
    );

  lightboxClose.addEventListener(
    "click",
    closeLightbox
  );

  lightboxPrevious.addEventListener(
    "click",
    () => moveLightbox(-1)
  );

  lightboxNext.addEventListener(
    "click",
    () => moveLightbox(1)
  );

  lightbox.addEventListener(
    "click",
    (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    }
  );
}

function updateLightbox(index) {
  if (
    !lightbox ||
    galleryItems.length === 0
  ) {
    return;
  }

  currentGalleryIndex =
    (
      index +
      galleryItems.length
    ) %
    galleryItems.length;

  const item =
    galleryItems[
      currentGalleryIndex
    ];

  const data =
    getGalleryItemData(item);

  lightboxImage.src = data.src;
  lightboxImage.alt = data.alt;
  lightboxCaption.textContent =
    data.caption;

  /*
    The lightbox image is dynamically created,
    so reveal it without relying on the initial image list.
  */

  lightboxImage.classList.add(
    "is-loaded"
  );

  const hasMultipleImages =
    galleryItems.length > 1;

  lightboxPrevious.hidden =
    !hasMultipleImages;

  lightboxNext.hidden =
    !hasMultipleImages;
}

function openLightbox(index) {
  createLightbox();

  if (!lightbox) {
    return;
  }

  lastFocusedElement =
    document.activeElement;

  updateLightbox(index);

  lightbox.classList.add(
    "is-open"
  );

  lightbox.setAttribute(
    "aria-hidden",
    "false"
  );

  body.classList.add(
    "lightbox-open"
  );

  window.requestAnimationFrame(() => {
    lightboxClose.focus();
  });
}

function closeLightbox() {
  if (
    !lightbox ||
    !lightbox.classList.contains(
      "is-open"
    )
  ) {
    return;
  }

  lightbox.classList.remove(
    "is-open"
  );

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );

  body.classList.remove(
    "lightbox-open"
  );

  if (
    lastFocusedElement &&
    typeof lastFocusedElement.focus ===
      "function"
  ) {
    lastFocusedElement.focus();
  }
}

function moveLightbox(direction) {
  updateLightbox(
    currentGalleryIndex +
      direction
  );
}

function trapLightboxFocus(event) {
  if (
    !lightbox ||
    !lightbox.classList.contains(
      "is-open"
    ) ||
    event.key !== "Tab"
  ) {
    return;
  }

  const focusableElements =
    Array.from(
      lightbox.querySelectorAll(
        'button:not([hidden]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => {
      return !element.disabled;
    });

  if (
    focusableElements.length === 0
  ) {
    return;
  }

  const firstElement =
    focusableElements[0];

  const lastElement =
    focusableElements[
      focusableElements.length - 1
    ];

  if (
    event.shiftKey &&
    document.activeElement ===
      firstElement
  ) {
    event.preventDefault();
    lastElement.focus();
  } else if (
    !event.shiftKey &&
    document.activeElement ===
      lastElement
  ) {
    event.preventDefault();
    firstElement.focus();
  }
}

galleryItems.forEach(
  (item, index) => {
    item.setAttribute(
      "tabindex",
      "0"
    );

    item.setAttribute(
      "role",
      "button"
    );

    const itemTitle =
      item
        .querySelector(
          ".gallery-item__caption strong"
        )
        ?.textContent?.trim();

    item.setAttribute(
      "aria-label",
      itemTitle
        ? `Open ${itemTitle} image`
        : "Open finished space image"
    );

    item.addEventListener(
      "click",
      (event) => {
        const clickedLink =
          event.target.closest("a");

        if (clickedLink) {
          return;
        }

        openLightbox(index);
      }
    );

    item.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();

          openLightbox(index);
        }
      }
    );
  }
);

/* =========================================================
   BEFORE / AFTER SLIDERS
========================================================= */

const beforeAfterSliders =
  document.querySelectorAll(
    ".before-after"
  );

function updateBeforeAfterSlider(
  slider,
  percentage
) {
  const clampedPercentage =
    Math.min(
      100,
      Math.max(0, percentage)
    );

  const afterLayer =
    slider.querySelector(
      ".before-after__after"
    );

  const divider =
    slider.querySelector(
      ".before-after__divider"
    );

  const handle =
    slider.querySelector(
      ".before-after__handle"
    );

  if (afterLayer) {
    afterLayer.style.width =
      `${clampedPercentage}%`;
  }

  if (divider) {
    divider.style.left =
      `${clampedPercentage}%`;
  }

  if (handle) {
    handle.style.left =
      `${clampedPercentage}%`;
  }

  slider.style.setProperty(
    "--before-after-position",
    `${clampedPercentage}%`
  );
}

beforeAfterSliders.forEach(
  (slider) => {
    const range =
      slider.querySelector(
        ".before-after__range, .before-after__input, input[type='range']"
      );

    if (!range) {
      return;
    }

    range.min = "0";
    range.max = "100";
    range.value =
      range.value || "50";

    updateBeforeAfterSlider(
      slider,
      Number(range.value)
    );

    range.addEventListener(
      "input",
      () => {
        updateBeforeAfterSlider(
          slider,
          Number(range.value)
        );
      }
    );
  }
);

/* =========================================================
   TALLY EMBED SUPPORT
========================================================= */

function initializeTallyEmbeds() {
  if (
    typeof window.Tally !==
      "undefined" &&
    typeof window.Tally.loadEmbeds ===
      "function"
  ) {
    window.Tally.loadEmbeds();
  }
}

if (
  document.readyState ===
  "complete"
) {
  initializeTallyEmbeds();
} else {
  window.addEventListener(
    "load",
    initializeTallyEmbeds,
    {
      once: true
    }
  );
}

/* =========================================================
   EXTERNAL LINK SAFETY
========================================================= */

document
  .querySelectorAll(
    'a[target="_blank"]'
  )
  .forEach((link) => {
    const currentRel =
      link.getAttribute("rel") ||
      "";

    const relValues = new Set(
      currentRel
        .split(/\s+/)
        .filter(Boolean)
    );

    relValues.add("noopener");
    relValues.add("noreferrer");

    link.setAttribute(
      "rel",
      Array.from(
        relValues
      ).join(" ")
    );
  });

/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      if (
        lightbox &&
        lightbox.classList.contains(
          "is-open"
        )
      ) {
        closeLightbox();
        return;
      }

      if (
        siteNav &&
        siteNav.classList.contains(
          "is-open"
        )
      ) {
        closeNavigation({
          restoreFocus: true
        });
      }
    }

    if (
      lightbox &&
      lightbox.classList.contains(
        "is-open"
      )
    ) {
      if (
        event.key === "ArrowLeft"
      ) {
        moveLightbox(-1);
      }

      if (
        event.key === "ArrowRight"
      ) {
        moveLightbox(1);
      }

      trapLightboxFocus(event);
    }
  }
);

/* =========================================================
   REDUCED-MOTION CHANGES
========================================================= */

function handleReducedMotionChange() {
  if (!prefersReducedMotion()) {
    return;
  }

  revealAllElements();
  showAllSignatureLines();

  siteImages.forEach((image) => {
    if (image.naturalWidth > 0) {
      markImageLoaded(image);
    }
  });
}

if (
  typeof reducedMotionQuery
    .addEventListener ===
  "function"
) {
  reducedMotionQuery.addEventListener(
    "change",
    handleReducedMotionChange
  );
} else if (
  typeof reducedMotionQuery
    .addListener ===
  "function"
) {
  reducedMotionQuery.addListener(
    handleReducedMotionChange
  );
}
