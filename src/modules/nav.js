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

    queueMicrotask(() => {
      App.scroll.subscribe(this.onScroll);
      this.anchor.onclick = () => this.handleAnchorClick();
    });
  }

  onScroll = (e) => {
    if (e.progress < 0.01) {
      if (!this.isTop) {
        this.isTop = true;
        this.wrapper.classList.remove("scrolled");
      }
    } else {
      if (this.isTop) {
        this.isTop = false;
        this.wrapper.classList.add("scrolled");
      }
    }
  };

  onLoad(state) {
    switch (state) {
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
    if (Hey.PAGE === "home") {
      App.scroll.scrollTo(this.anchorTarget, {
        offset: -50,
      });
    } else {
      this.anchor.querySelector("a").click();
      this.shouldScrollToAnchor = true;
    }
  }

  handleColor(page) {
    this.input.checked = false;

    // news anchor behaviour
    const footerLink = document.querySelector("[data-ftlink='anchor']");
    const newsLink = document.querySelector("[data-nslink='anchor']");
    footerLink.onclick = () => this.handleAnchorClick();
    if (newsLink) newsLink.onclick = () => this.handleAnchorClick();
    this.anchorTarget = document.querySelector("[data-s='news']");

    if (this.shouldScrollToAnchor) {
      setTimeout(
        () =>
          App.scroll.scrollTo(this.anchorTarget, {
            duration: 2.2,
            offset: -50,
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

    this.links.forEach((link) => {
      let pathName = new URL(link.href).pathname;
      if (pathName === "/") pathName = "/home";

      if (pathName === "/" + page) {
        link.classList.add("w--current");
      } else {
        link.classList.remove("w--current");
      }
    });

    if (page !== "home") {
      this.wrapper.classList.add("dark");
    } else {
      this.wrapper.classList.remove("dark");
    }
  }
}
