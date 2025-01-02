import gsap, { ANIMATION } from "../gsap";
import Hey from "../hey";

export class Nav {
  wrapper = document.querySelector("[data-nav='w']");
  links = [...document.querySelectorAll("[data-nav='link']")];

  constructor() {
    Hey.on("PAGE", (page) => this.handleColor(page));
    Hey.on("LOAD", (state) => this.onLoad(state));
    this.handleColor(Hey.PAGE);
  }

  onLoad(state) {
    switch (state) {
      //   case "full":
      // this.onLoadFull();
      // break;
      case "screen":
        gsap.to(this.wrapper, {
          autoAlpha: 1,
          duration: ANIMATION.load.duration,
          ease: ANIMATION.load.ease,
          delay: ANIMATION.load.delay,
        });
        break;
      default:
        break;
    }
  }

  handleColor(page) {
    // console.log(this.links, page);
    this.links.forEach((link) => {
      let pathName = new URL(link.href).pathname;
      if (pathName === "/") pathName = "home";

      if (pathName === "/" + page) {
        link.classList.add("w--current");
      } else {
        link.classList.remove("w--current");
      }

      // if
    });

    if (page !== "home") {
      this.wrapper.classList.add("dark");
    } else {
      this.wrapper.classList.remove("dark");
    }
  }
}
