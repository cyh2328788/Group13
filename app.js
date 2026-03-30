(() => {
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = Array.from(document.querySelectorAll(".nav a"));
  const scrollLinks = Array.from(document.querySelectorAll(".scroll-link"));
  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const panels = Array.from(document.querySelectorAll(".service-panel"));
  const progress = document.querySelector(".progress");
  const toTop = document.querySelector(".to-top");

  const safeScrollToTarget = (selector) => {
    if (!selector || !selector.startsWith("#")) {
      return;
    }
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (nav) {
        nav.classList.remove("open");
      }
    });
  });

  scrollLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      safeScrollToTarget(link.getAttribute("href"));
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.tab;
      tabs.forEach((item) => {
        item.classList.toggle("is-active", item === tab);
        item.setAttribute("aria-selected", item === tab ? "true" : "false");
      });
      panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.panel === key);
      });
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const onScroll = () => {
    const position = window.scrollY + 120;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    if (progress) {
      progress.style.width = `${ratio * 100}%`;
    }

    if (toTop) {
      toTop.classList.toggle("show", window.scrollY > 460);
    }

    sections.forEach((section, index) => {
      if (section.offsetTop <= position && section.offsetTop + section.offsetHeight > position) {
        navLinks.forEach((link) => link.classList.remove("active"));
        navLinks[index].classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", onScroll);
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
