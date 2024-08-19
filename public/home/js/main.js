(function () {
    "use strict";

    /**
     * Apply .scrolled class to the body as the page is scrolled down
     */
    function toggleScrolled() {
        const selectBody = document.querySelector("body");
        const selectHeader = document.querySelector("#header");
        if (
            !selectHeader.classList.contains("scroll-up-sticky") &&
            !selectHeader.classList.contains("sticky-top") &&
            !selectHeader.classList.contains("fixed-top")
        )
            return;
        window.scrollY > 100
            ? selectBody.classList.add("scrolled")
            : selectBody.classList.remove("scrolled");
    }

    document.addEventListener("scroll", toggleScrolled);
    window.addEventListener("load", toggleScrolled);

    /**
     * Mobile nav toggle
     */
    const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

    function mobileNavToogle() {
        document.querySelector("body").classList.toggle("mobile-nav-active");
        mobileNavToggleBtn.classList.toggle("bi-list");
        mobileNavToggleBtn.classList.toggle("bi-x");
    }
    mobileNavToggleBtn.addEventListener("click", mobileNavToogle);

    /**
     * Hide mobile nav on same-page/hash links
     */
    document.querySelectorAll("#navmenu a").forEach((navmenu) => {
        navmenu.addEventListener("click", () => {
            if (document.querySelector(".mobile-nav-active")) {
                mobileNavToogle();
            }
        });
    });

    /**
     * Preloader
     */
    const preloader = document.querySelector("#preloader");
    if (preloader) {
        window.addEventListener("load", () => {
            preloader.remove();
        });
    }

    /**
     * Scroll top button
     */
    let scrollTop = document.querySelector(".scroll-top");

    function toggleScrollTop() {
        if (scrollTop) {
            window.scrollY > 100
                ? scrollTop.classList.add("active")
                : scrollTop.classList.remove("active");
        }
    }
    scrollTop.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });

    window.addEventListener("load", toggleScrollTop);
    document.addEventListener("scroll", toggleScrollTop);

    /**
     * Animation on scroll function and init
     */
    function aosInit() {
        AOS.init({
            duration: 600,
            easing: "ease-in-out",
            once: true,
            mirror: false,
        });
    }
    window.addEventListener("load", aosInit);

    /**
     * Correct scrolling position upon page load for URLs containing hash links.
     */
    window.addEventListener("load", function (e) {
        if (window.location.hash) {
            if (document.querySelector(window.location.hash)) {
                setTimeout(() => {
                    let section = document.querySelector(window.location.hash);
                    let scrollMarginTop =
                        getComputedStyle(section).scrollMarginTop;
                    window.scrollTo({
                        top: section.offsetTop - parseInt(scrollMarginTop),
                        behavior: "smooth",
                    });
                }, 100);
            }
        }
    });

    /**
     * Navmenu Scrollspy
     */
    let navmenulinks = document.querySelectorAll(".navmenu a");

    function navmenuScrollspy() {
        navmenulinks.forEach((navmenulink) => {
            if (!navmenulink.hash) return;
            let section = document.querySelector(navmenulink.hash);
            if (!section) return;
            let position = window.scrollY + 200;
            if (
                position >= section.offsetTop &&
                position <= section.offsetTop + section.offsetHeight
            ) {
                document
                    .querySelectorAll(".navmenu a.active")
                    .forEach((link) => link.classList.remove("active"));
                navmenulink.classList.add("active");
            } else {
                navmenulink.classList.remove("active");
            }
        });
    }
    window.addEventListener("load", navmenuScrollspy);
    document.addEventListener("scroll", navmenuScrollspy);
})();

/**
 * Search Function
 */
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".form-control");
    const featureItems = Array.from(
        document.querySelectorAll(".features-item")
    );

    let debounceTimeout;
    let animationFrameId;
    let batchIndex = 0;
    const batchSize = 10;

    searchInput.addEventListener("input", function () {
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
            const query = searchInput.value.toLowerCase();

            // Reset batch processing
            batchIndex = 0;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            function processBatch() {
                const endIndex = Math.min(
                    batchIndex + batchSize,
                    featureItems.length
                );

                for (let i = batchIndex; i < endIndex; i++) {
                    const item = featureItems[i];
                    const title = item
                        .querySelector("h3")
                        .textContent.toLowerCase();
                    if (title.includes(query)) {
                        item.style.visibility = "visible";
                        item.style.position = "relative";
                        item.style.opacity = "1"; // Ensure it's fully visible
                        item.style.transform = "scale(1)"; // Reset any transformation
                    } else {
                        item.style.visibility = "hidden";
                        item.style.position = "absolute";
                        item.style.opacity = "0"; // Hide with opacity
                        item.style.transform = "scale(0.95)"; // Slightly scale down hidden items
                    }
                }

                batchIndex = endIndex;
                if (batchIndex < featureItems.length) {
                    animationFrameId = requestAnimationFrame(processBatch);
                }
            }

            processBatch();
        }, 150); // Slightly shorter debounce delay
    });
});
