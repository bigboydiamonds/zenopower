import gsap, { ANIMATION } from "../gsap";
import Hey from "../hey";
import { App } from "../app";

export class Nav {
  wrapper = document.querySelector("[data-nav='w']");
  links = [...document.querySelectorAll("[data-nav='link']")];

  isTop = true;

  constructor() {
    this.input = this.wrapper.querySelector("input");
    Hey.on("PAGE", (page) => this.handleColor(page));
    Hey.on("LOAD", (state) => this.onLoad(state));
    this.handleColor(Hey.PAGE);

    // console.log(this.input);

    queueMicrotask(() => {
      App.scroll.subscribe(this.onScroll);
    });
  }

  onScroll = (e) => {
    // console.log(e.progress);
    if (e.progress < 0.01) {
      if (!this.isTop) {
        this.isTop = true;
        this.wrapper.classList.remove("scrolled");
        // console.log("top");
      }
    } else {
      if (this.isTop) {
        this.isTop = false;
        this.wrapper.classList.add("scrolled");
        // console.log("not top");
      }
    }
  };

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
    this.input.checked = false;

    // console.log(this.links, page);
    this.links.forEach((link) => {
      let pathName = new URL(link.href).pathname;
      if (pathName === "/") pathName = "/home";

      // console.log(pathName, "/" + page, pathName === "/" + page);

      if (pathName === "/" + page) {
        link.classList.add("w--current");
      } else {
        link.classList.remove("w--current");
      }

      // if
    });

    if (page !== "home") {
      this.wrapper.classList.add("dark");
      // console.log("not home");
    } else {
      this.wrapper.classList.remove("dark");
      // console.log("home");
    }
  }
}
