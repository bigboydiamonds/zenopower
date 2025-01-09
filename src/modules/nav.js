import gsap, { ANIMATION } from "../gsap";
import Hey from "../hey";
import { App } from "../app";

export class Nav {
  wrapper = document.querySelector("[data-nav='w']");
  links = [...document.querySelectorAll("[data-nav='link']")];
  anchor = document.querySelector("[data-nav='anchor']");
  anchorTarget = document.querySelector("[data-s='news']");
  shouldScrollToAnchor = false;

  isTop = true;

  constructor() {
    this.input = this.wrapper.querySelector("input");
    Hey.on("PAGE", (page) => this.handleColor(page));
    Hey.on("LOAD", (state) => this.onLoad(state));
    this.handleColor(Hey.PAGE);

    console.log(this.anchor, this.anchorTarget);

    queueMicrotask(() => {
      App.scroll.subscribe(this.onScroll);

      this.anchor.onclick = () => this.handleAnchorClick();
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

  handleAnchorClick() {
    // console.log("handleClick", Hey.PAGE, this.anchor);

    if (Hey.PAGE === "home") {
      App.scroll.scrollTo(this.anchorTarget);
    } else {
      this.anchor.querySelector("a").click();
      this.shouldScrollToAnchor = true;
    }
  }

  handleColor(page) {
    this.input.checked = false;

    this.anchorTarget = document.querySelector("[data-s='news']");

    if (this.shouldScrollToAnchor) {
      setTimeout(
        () =>
          App.scroll.scrollTo(this.anchorTarget, {
            duration: 2.2,
            // immediate: true,
          }),
        300
      );
      this.shouldScrollToAnchor = false;
    }

    if (page === "news") {
      this.anchor.classList.add("w--current");
    } else {
      this.anchor.classList.remove("w--current");
    }

    // console.log(this.links, page);
    this.links.forEach((link) => {
      let pathName = new URL(link.href).pathname;
      if (pathName === "/") pathName = "/home";

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
