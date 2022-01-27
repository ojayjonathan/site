import { easeOutBounce } from "./easing.js";
import { projectData } from "./projectsData.js";

export const anime = ({
  duration = 500,
  draw = () => {},
  timingFunction = (t) => t,
  oncomplete = () => {},
}) => {
  if (duration == 0) {
    draw();
    return;
  }
  let start = performance.now();
  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    timeFraction = Math.min(1, timeFraction);
    let progress = timingFunction(timeFraction);
    draw(progress);
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    } else {
      oncomplete();
    }
  });
};
export class TimeLine {
  delay = 0;
  constructor(duration) {
    this.duration = duration;
  }
  add({
    duration = 0,
    timingFunction = (t) => t,
    draw = () => {},
    delay = 0,
    oncomplete = () => {},
  }) {
    this.delay += delay;
    setTimeout(
      () =>
        anime({
          duration: duration,
          timingFunction: timingFunction,
          draw: draw,
          oncomplete: oncomplete,
        }),
      this.delay
    );
    this.delay += duration;
  }
}

(function main() {
  const projectDetailContainer = document.querySelector(".project-details");
  const projectDetailTop = projectDetailContainer.querySelector(
    "#project-description-top"
  );
  const projectDetailBottom = projectDetailContainer.querySelector(
    "#project-description-bottom"
  );
  const transitionElements = document.querySelectorAll(".transition li");
  const closeButton = document.querySelector(".close");

  class ProjectItem {
    animationStarted = false;
    width = 0;
    frame;
    direction = 1;
    cloneNode;
    isOpen = false;
    constructor(ele) {
      this.element = ele;
      this.tl = new TimeLine();
      this.image = ele.querySelector("img");
      this.image.onclick = () => openProject(this);
      this.element.querySelector("svg").onclick = () => openProject(this);
      this.canvas = ele.querySelector("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.image.complete ? this.init() : (this.image.onload = this.init);
      this.data = projectData[ele.dataset.name];
    }

    render(progress) {
      this.width = this.canvasWidth * progress;
      this.canvas.width = this.width;
      this.ctx.drawImage(
        this.image,
        0,
        0,
        this.width / this.wScale,
        this.sHeight,
        0,
        0,
        this.width,
        this.canvasHeight
      );
    }

    init = () => {
      this.canvasWidth = this.image.width;
      this.sHeight = this.image.naturalHeight;
      this.sWidth = this.image.naturalWidth;
      this.canvasHeight = this.image.height;
      this.canvas.width = this.canvasWidth;
      this.wScale = this.canvasWidth / this.sWidth;
      this.canvas.height = this.canvasHeight;
      // this.anmateText();
    };
    clone() {
      this.cloneNode = this.element.cloneNode(true);
      this.canvas = this.cloneNode.querySelector("canvas");
      this.ctx = this.canvas.getContext("2d");
    }

    enter(duration = 1000, oncomplete = () => {}) {
      this.width = 0;
      this.direction = 1;
      this.tl.delay = 0;
      anime({
        oncomplete: oncomplete,
        duration: duration,
        draw: this.render.bind(this),
        timingFunction: (t) => t,
      });
      // this.tl.add({ draw: this.anmateText.bind(this) });
    }
  }
  const textSplit = () => {
    const projectNames = document.querySelectorAll(".project-name");
    projectNames.forEach((textWrapper) => {
      textWrapper.innerHTML = textWrapper.textContent.replace(
        /\S/g,
        "<div><span  id=$&>$&</span></div>"
      );
    });
  };

  function openProject(project) {
    project.clone();
    projectDetailContainer.style.display = "block";
    projectDetailContainer.style.backgroundColor = "transparent";
    closeButton.onclick = () => {
      projectDetailTop.removeChild(project.cloneNode);
      while (projectDetailBottom.firstChild) {
        projectDetailBottom.firstChild.remove();
      }
      projectDetailContainer.style.display = "none";
      projectDetailContainer.querySelector(".footer").style.display = "none";
    };
    function revealAnimation(duration = 1000) {
      let delay = 0;
      const time = duration / transitionElements.length;
      const wWidth = window.innerWidth;
      for (let i = 0; i < transitionElements.length; ++i) {
        transitionElements[i].style.transform = `translateX(-${wWidth}px)`;
        setTimeout(() => {
          anime({
            duration: time,
            draw: (progress) => {
              transitionElements[i].style.transform = `translate3d(${
                -wWidth + progress * wWidth
              }px,0,0)`;
            },
            timingFunction: easeOutBounce,
          });
        }, delay);
        delay += 200;
      }
      return delay + time;
    }

    function genProjectTemplate() {
      const data = project.data;
      const title = ` <h3 class="text-center">${data.title}</h3>`;
      const discription = `<div class="my-1">${data.description
        .map((p) => `<p class="indent">${p}      </p>      `)
        .join("")}</div>`;
      const categories = ` <div class="my-1  ml-2 tc" tc><h4>Categorie</h4>${data.categories}</div>`;
      const technologies = `<div class="my-1 ml-2 tc"><h4>Technologies</h4>${data.technologies
        .map((p) => `<p>${p}</p>`)
        .join("")}</div>`;
      const role = data.roles
        ? `<div class="my-1 ml-2"><h4>Role</h4><p>${data.roles}</p></div>`
        : "";
      const links = `<div class="my-1 ml-2 tc">
    <h4>Links</h4> ${Object.keys(data.links)
      .map(
        (
          key
        ) => `<div> <a  href=${data.links[key]}><span class="p-relative">  ${key} 
        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.94085 24.766L24.3465 8.3604M24.3465 8.3604H10.4648M24.3465 8.3604V22.2421"
            stroke="currentColor"></path></svg></span></a></div>`
      )
      .join("")}
    </div>`;
      const video = `<div class="video" style="animation:slideInUp .5s ease;min-height:${
        data.video.mobile ? 400 : 200
      }px;"><div><video width="${
        data.video.mobile ? 300 : 400
      }" loop autoplay="true" poster="./static/videos/rada.jpg"><source src="${
        data.video.source
      }" type="video/mp4"></video></div></div>`;
      let template =
        '<div class="description" style="animation:slideInUp .5s ease">' +
        title +
        discription +
        categories +
        technologies +
        role +
        links +
        "</div>" +
        video;
      return template;
    }
    let delay = revealAnimation();
    const projectDataHtml = genProjectTemplate(project);

    setTimeout(() => {
      anime({
        duration: 0,
        delay: delay,
        draw: () => {
          projectDetailContainer.style.backgroundColor = "#41443e";
          projectDetailTop.appendChild(project.cloneNode);
          project.enter(750, () => {
            projectDetailContainer.querySelector(".footer").style.display =
              "block";
            projectDetailBottom.innerHTML = projectDataHtml;
          });
        },
      });
    }, delay / 2);
  }

  textSplit();
  document
    .querySelectorAll(".work-item")
    .forEach((ele) => new ProjectItem(ele));
  const cursor = document.querySelector(".cursor");
  if (matchMedia("(pointer:fine)").matches) {
    const cursorRadius = 30;
    window.addEventListener("mousemove", (e) => {
      cursor.style.top = e.clientY - cursorRadius + "px";
      cursor.style.left = e.clientX - cursorRadius + "px";
    });
  }
})();
