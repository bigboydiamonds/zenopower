import EmblaCarousel from "embla-carousel";

export class Slider {
  options = { loop: false };
  btns = [...document.querySelector("[data-embla='btns']").children];
  constructor(el) {
    this.el = el;

    this.api = EmblaCarousel(this.el, this.options);

    this.btns.forEach((btn, i) => {
      btn.onclick = () =>
        i === 0 ? this.api.scrollPrev() : this.api.scrollNext();
    });
  }

  destroy() {
    this.btns.forEach((btn) => (btn.onclick = null));
    this.api.destroy();
  }
}
