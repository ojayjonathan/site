import { easeOutBounce, easeOutQuart } from "./easing.js";
import { anime } from "./work.js";

(function menu() {
  let centerX,  start, end, h;
  const canvas = document.getElementById("transition-overlay");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  const ctx = canvas.getContext("2d");
  const navToggler = document.querySelector(".nav-toggler");
  const menuItems = document.querySelector(".menu-items");
  let isNavOpen = false;
  let easing = (t) => t;

  h = window.innerHeight / 5;

  centerX = window.innerWidth / 2;
  let r = h / 2;
  ctx.fillStyle = "#41443e";
  let delay = 10;

  const draw = (i) => {
    const y = h * i;
    setTimeout(
      () =>
        anime({
          timingFunction: easing,
          duration: 1000,
          oncomplete: () => {
            i == 3 && isNavOpen && menuItems.classList.add("d-block");
          },
          draw: (progress) => {
            ctx.beginPath();
            let newStart = centerX + progress * -centerX;
            let newEnd = centerX + progress * centerX;
            ctx.moveTo(newStart, y);
            ctx.quadraticCurveTo(newStart - r, y + r, newStart, y + h);
            ctx.lineTo(newEnd, y + h);
            ctx.quadraticCurveTo(newEnd + r, y + r, newEnd, y);
            ctx.lineTo(newStart, y);
            ctx.closePath();
            ctx.fill();
          },
        }),
      delay * 10 * i
    );
  };

  const menuToggle = (e) => {
    if (isNavOpen) {
      easing = easeOutQuart;
      ctx.globalCompositeOperation = "destination-out";
      menuItems.classList.remove("d-block");
    } else {
      easing = easeOutBounce;
      ctx.globalCompositeOperation = "source-over";
    }

    for (let i = 0; i < 5; ++i) {
      draw(i);
    }
    isNavOpen = !isNavOpen;
  };
  navToggler.onclick = menuToggle;
  document.querySelectorAll(".menu-items a").forEach((element) => {
    element.onclick = (e) => {
      e.preventDefault();
      const link = element.getAttribute("href");
      history.pushState(null, null, link);
      document.querySelector(link).scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
      menuToggle();
    };
  });
})();
