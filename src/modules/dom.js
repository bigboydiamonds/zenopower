import { Text } from "./animation/text";
import gsap from "../gsap";
import Hey from "../hey";

// import { Track } from "../util/track";
// import { Alpha } from "./animation/alpha";

const lib = [
  {
    selector: '[data-a="char"],[data-a="word"],[data-a="line"]',
    class: Text,
  },
];

export class Dom {
  wrapper = document.querySelector("[data-taxi]");
  constructor() {
    this.create();
  }

  resize() {}

  render(t) {
    this.children.forEach((child) => {
      if (child.render) child.render();
    });
  }

  get _children() {
    const arr = lib.map((item) => {
      const { selector, class: Class } = item;
      const elements = [...document.querySelectorAll(selector)];

      if (elements.length === 0) return null;
      return elements.map((element) => new Class(element));
    });

    return arr;
  }

  create() {
    this.children = this._children.flat().filter((child) => child !== null);

    this.start();
  }

  start() {
    this.children.forEach((child) => {
      if (child.start) child.start();
    });
  }

  destroy() {
    this.texts.forEach((text) => text.animateOut());
  }

  /* --  Pages */
  async transitionOut(page) {
    await gsap.to(this.wrapper, { autoAlpha: 0, duration: 0.5 });
    // console.log("DOM::transitionOut", page);
  }

  async transitionIn(page) {
    await gsap.to(this.wrapper, { autoAlpha: 1, duration: 0.5 });
    // console.log("DOM::transitionIn", page);
  }
}
