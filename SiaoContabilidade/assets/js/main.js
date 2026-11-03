"use strict";

if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
    window.scrollTo(0, 0);
    updateHeaderState();
    updateCurrentNavigation();
}, { once: true });

const navigationLinks = document.querySelectorAll(".site-nav > ul > li > a");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector(".site-nav");
const navigationSections = [...navigationLinks]
    .map((link) => ({
        link,
        section: document.querySelector(link.getAttribute("href")),
    }))
    .filter(({ section }) => section);

function setCurrentNavigation(activeLink) {
    navigationLinks.forEach((link) => {
        if (link === activeLink) {
            link.setAttribute("aria-current", "page");
            return;
        }

        link.removeAttribute("aria-current");
    });
}

function updateCurrentNavigation() {
    const headerHeight = document.querySelector(".site-header")?.offsetHeight ?? 0;
    const activationLine = headerHeight + 110;
    let activeNavigation = navigationSections[0];

    navigationSections.forEach((navigationItem) => {
        if (navigationItem.section.getBoundingClientRect().top <= activationLine) {
            activeNavigation = navigationItem;
        }
    });

    if (activeNavigation) {
        setCurrentNavigation(activeNavigation.link);
    }
}

function closeMobileNavigation() {
    primaryNavigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && primaryNavigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = primaryNavigation.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
        setCurrentNavigation(link);

        if (menuToggle && primaryNavigation) {
            closeMobileNavigation();
        }
    });
});

const siteHeader = document.querySelector(".site-header");

function updateHeaderState() {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeaderState();
updateCurrentNavigation();
window.addEventListener("scroll", () => {
    updateHeaderState();
    updateCurrentNavigation();
}, { passive: true });

const faqItems = document.querySelectorAll(".faq__item");

faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
        if (!item.open) {
            return;
        }

        faqItems.forEach((otherItem) => {
            if (otherItem !== item) {
                otherItem.removeAttribute("open");
            }
        });
    });
});

const serviceSwitcher = document.querySelector(".service-switcher");

if (serviceSwitcher) {
    const serviceTrack = serviceSwitcher.querySelector(".service-switcher__track");
    const serviceGroup = serviceSwitcher.querySelector(".service-switcher__group");
    const previousButton = serviceSwitcher.querySelector('[aria-label="Categoria anterior"]');
    const nextButton = serviceSwitcher.querySelector('[aria-label="Próxima categoria"]');

    const duplicateGroup = serviceGroup.cloneNode(true);
    duplicateGroup.setAttribute("aria-hidden", "true");
    duplicateGroup.querySelectorAll("a").forEach((link) => {
        link.setAttribute("tabindex", "-1");
    });
    serviceTrack.append(duplicateGroup);

    previousButton.addEventListener("click", () => {
        serviceTrack.style.animationDirection = "reverse";
    });

    nextButton.addEventListener("click", () => {
        serviceTrack.style.animationDirection = "normal";
    });
}

const testimonialsViewport = document.querySelector(".testimonials__viewport");
const testimonialButtons = document.querySelectorAll("[data-testimonial-direction]");

if (testimonialsViewport && testimonialButtons.length) {
    const scrollTestimonials = (direction) => {
        const testimonialCard = testimonialsViewport.querySelector(".testimonial-card");
        const testimonialTrack = testimonialsViewport.querySelector(".testimonials__track");
        const gap = Number.parseFloat(window.getComputedStyle(testimonialTrack).gap) || 0;
        const amount = (testimonialCard?.offsetWidth ?? 0) + gap;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        testimonialsViewport.scrollBy({
            left: direction * amount,
            behavior: reducedMotion ? "auto" : "smooth",
        });
    };

    testimonialButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const direction = button.dataset.testimonialDirection === "next" ? 1 : -1;
            scrollTestimonials(direction);
        });
    });

    testimonialsViewport.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
            return;
        }

        event.preventDefault();
        scrollTestimonials(event.key === "ArrowRight" ? 1 : -1);
    });
}
