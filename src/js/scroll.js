class Scroll {
  dx = 0;
  dy = 0;
  scrollX = 0;
  scrollY = 0;
  constructor() {
    this.main = document.querySelector("main");
    // document.querySelector("body").style.height = this.main.clientHeight + "px";
    this.main.style.position = "absolute";

    window.addEventListener("scroll", (e) => {
      this.scrollY = window.pageYOffset;
      this.scrollX = window.pageXOffset;
    });
  }
  lerp = (a, b, n) => a * (1 - n) + b * n;
  scroll() {
    this.dx = this.lerp(this.dx, this.scrollX, 0.02);
    this.dy = this.lerp(this.dy, this.scrollY, 0.02);
    this.dx = Math.floor(this.dx * 100) / 100;
    this.dy = Math.floor(this.dy * 100) / 100;

    this.main.style.transform = `translate3d(-${this.dx}px,-${this.dy}px,0px)`;
    window.requestAnimationFrame(this.scroll.bind(this));
  }
}

scroll = new Scroll();
scroll.scroll();
const hasKeyboard = window.matchMedia("(any-pointer:coarse)").matches; // Check if the device has a keyboard
const keyboardMessage = document.querySelector(".keyboard-message");

if (hasKeyboard) {
  keyboardMessage.style.display = "inline"; // Show the message if keyboard is detected
  keyboardMessage.classList.add("scroll-animation"); // Add scroll animation class
}