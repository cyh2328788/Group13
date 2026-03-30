const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const navLinks = Array.from(document.querySelectorAll(".nav a"));

const toggleNav = () => {
  nav.classList.toggle("open");
};

navToggle.addEventListener("click", toggleNav);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const onScroll = () => {
  const position = window.scrollY + 140;
  sections.forEach((section, index) => {
    if (section.offsetTop <= position && section.offsetTop + section.offsetHeight > position) {
      navLinks.forEach((navLink) => navLink.classList.remove("active"));
      navLinks[index].classList.add("active");
    }
  });
};

window.addEventListener("scroll", onScroll);
onScroll();
