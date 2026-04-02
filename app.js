(() => {
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = Array.from(document.querySelectorAll(".nav a"));
  const scrollLinks = Array.from(document.querySelectorAll(".scroll-link"));
  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
  const bidiTabs = Array.from(document.querySelectorAll(".bidi-tab"));
  const bidiPanels = Array.from(document.querySelectorAll(".bidi-panel"));
  const storySteps = Array.from(document.querySelectorAll(".story-step"));
  const layerNodes = Array.from(document.querySelectorAll("[data-layer]"));
  const motionVideos = Array.from(document.querySelectorAll(".showcase-video"));
  const showcase = document.querySelector("[data-video-showcase]");
  const showcaseStageVideo = showcase?.querySelector("[data-stage-video]");
  const showcaseStageKicker = showcase?.querySelector("[data-stage-kicker]");
  const showcaseStageTitle = showcase?.querySelector("[data-stage-title]");
  const showcaseStageProgress = showcase?.querySelector("[data-stage-progress]");
  const showcaseChips = showcase ? Array.from(showcase.querySelectorAll(".video-chip")) : [];
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

  const setActiveLayer = (layer) => {
    if (!layer) {
      return;
    }
    layerNodes.forEach((node) => {
      node.classList.toggle("is-current", node.dataset.layer === layer);
    });
  };

  bidiTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.bidiTarget;
      bidiTabs.forEach((t) => {
        t.classList.toggle("is-active", t === tab);
      });
      bidiPanels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.id === target);
      });
    });
  });

  layerNodes.forEach((node) => {
    node.addEventListener("mouseenter", () => {
      if (node.dataset.layer) {
        setActiveLayer(node.dataset.layer);
      }
    });
    node.addEventListener("focus", () => {
      if (node.dataset.layer) {
        setActiveLayer(node.dataset.layer);
      }
    });
  });

  const playVideo = (video) => {
    if (!video) {
      return;
    }
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  const updateStageProgress = () => {
    if (!showcaseStageVideo || !showcaseStageProgress) {
      return;
    }
    const duration = showcaseStageVideo.duration;
    const current = showcaseStageVideo.currentTime;
    const ratio = Number.isFinite(duration) && duration > 0 ? Math.min(current / duration, 1) : 0;
    showcaseStageProgress.style.width = `${ratio * 100}%`;
  };

  const applyShowcaseChip = (chip) => {
    if (!chip || !showcaseStageVideo) {
      return;
    }
    const source = chip.dataset.videoSrc;
    const kicker = chip.dataset.videoKicker;
    const title = chip.dataset.videoTitle;

    showcaseChips.forEach((item) => {
      item.classList.toggle("is-active", item === chip);
    });

    if (showcaseStageKicker && kicker) {
      showcaseStageKicker.textContent = kicker;
    }

    if (showcaseStageTitle && title) {
      showcaseStageTitle.textContent = title;
    }

    if (source && showcaseStageVideo.getAttribute("src") !== source) {
      showcaseStageVideo.classList.add("is-switching");
      showcaseStageVideo.setAttribute("src", source);
      showcaseStageVideo.load();
      showcaseStageVideo.addEventListener(
        "loadeddata",
        () => {
          showcaseStageVideo.classList.remove("is-switching");
          playVideo(showcaseStageVideo);
          updateStageProgress();
        },
        { once: true }
      );
    } else {
      playVideo(showcaseStageVideo);
      updateStageProgress();
    }
  };

  let showcaseRotationTimer = null;
  const startShowcaseRotation = () => {
    if (!showcase || showcaseChips.length < 2) {
      return;
    }
    if (showcaseRotationTimer) {
      clearInterval(showcaseRotationTimer);
    }
    showcaseRotationTimer = setInterval(() => {
      const activeIndex = showcaseChips.findIndex((chip) => chip.classList.contains("is-active"));
      const nextIndex = activeIndex >= 0 ? (activeIndex + 1) % showcaseChips.length : 0;
      applyShowcaseChip(showcaseChips[nextIndex]);
    }, 5200);
  };

  showcaseChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      applyShowcaseChip(chip);
      startShowcaseRotation();
    });
  });

  if (showcaseStageVideo) {
    showcaseStageVideo.addEventListener("timeupdate", updateStageProgress);
    showcaseStageVideo.addEventListener("loadedmetadata", updateStageProgress);
    showcaseStageVideo.addEventListener("play", updateStageProgress);
  }

  if (showcase) {
    showcase.addEventListener("mouseenter", () => {
      if (showcaseRotationTimer) {
        clearInterval(showcaseRotationTimer);
      }
    });
    showcase.addEventListener("mouseleave", () => {
      startShowcaseRotation();
    });
  }

  if (showcaseChips[0]) {
    applyShowcaseChip(showcaseChips.find((chip) => chip.classList.contains("is-active")) || showcaseChips[0]);
    startShowcaseRotation();
  }

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

    const stepObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        storySteps.forEach((step) => step.classList.remove("is-current"));

        if (visibleEntries[0]?.target) {
          visibleEntries[0].target.classList.add("is-current");

          if (visibleEntries[0].target.dataset.layer) {
            setActiveLayer(visibleEntries[0].target.dataset.layer);
          }
        }
      },
      { threshold: [0.35, 0.6, 0.85], rootMargin: "-12% 0px -30% 0px" }
    );

    storySteps.forEach((item) => stepObserver.observe(item));

    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo(entry.target);
          } else if (!entry.target.paused) {
            entry.target.pause();
          }
        });
      },
      { threshold: 0.35 }
    );

    motionVideos.forEach((video) => videoObserver.observe(video));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    motionVideos.forEach((video) => playVideo(video));
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
  setActiveLayer("propfinx");
  storySteps[0]?.classList.add("is-current");

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
