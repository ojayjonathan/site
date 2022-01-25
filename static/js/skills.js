import { easeInOutBounce, easeOutBounce } from "./easing.js";
import {  anime } from "./work.js";


class CircleAnimation {
  circles = [];
  constructor() {
    this.svg = document.querySelector(".expertise svg");
    this.rect = this.svg.getBoundingClientRect();
    this.circleRadius = this.rect.width / 3 / 2;
    this.initCircles();
    requestAnimationFrame(this.animate);

    setInterval(() => requestAnimationFrame(this.animate), 10000);
  }
  initCircles() {
    let x = 0;
    let y = 0;
    for (let i = 0; i < 6; ++i) {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      if (x + this.circleRadius > this.rect.width) {
        x = 0;
        y -= this.circleRadius * 2;
      }
      circle.setAttribute("r", this.circleRadius);
      circle.setAttribute("cx", x + this.circleRadius);
      circle.setAttribute("cy", y);
      this.svg.appendChild(circle);
      this.circles.push({
        x: x + this.circleRadius,
        y: y,
        sY: y,
        sX: x,
        circle: circle,
      });
      this.svg.appendChild(circle);
      x += this.circleRadius * 2;
    }
  }
  drop = () => {
    for (let i = 0; i < this.circles.length; ++i) {
      anime({
        timingFunction: easeOutBounce,
        duration: 3000 + 1000 * Math.random(),
        draw: (progess) => {
          let y = progess * this.rect.height - this.circleRadius;
          this.circles[i].y += y;
          this.circles[
            i
          ].circle.style.transform = `translate3d(0px,${y}px,0px)`;
        },
      });
    }
  };
  raise = () => {
    for (let i = 0; i < this.circles.length; ++i) {
      anime({
        timingFunction: easeInOutBounce,
        duration: 3000 + 1000 * Math.random(),
        draw: (progess) => {
          let y = (1 - progess) * this.rect.height - this.circleRadius * 2;
          this.circles[i].y += y;
          this.circles[
            i
          ].circle.style.transform = `translate3d(0px,${y}px,0px)`;
        },
      });
    }
  };
  animate = () => {
    this.drop();
    setTimeout(() => {
      this.raise();
    }, 5000);
  };
}
const circles = new CircleAnimation();


