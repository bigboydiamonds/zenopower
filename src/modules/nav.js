import gsap, { ANIMATION } from "../gsap";
import Hey from "../hey";

export class Nav {
  wrapper = document.querySelector("[data-nav='w']");

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
    if (page !== "home") {
      this.wrapper.classList.add("dark");
    } else {
      this.wrapper.classList.remove("dark");
    }
  }
}
