export class Dropdowns {
  current = null;

  constructor(el) {
    this.el = el;
    this.items = [...this.el.children];

    this.items.forEach((item, i) => {
      item.querySelector("input").onchange = this.onChange.bind(this, i);
    });
  }

  onChange(i, e) {
    if (this.current !== null) {
      this.items[this.current].querySelector("input").checked = false;
    }

    this.current = i;
  }

  destroy() {
    this.items.forEach((item) => {
      item.querySelector("input").onchange = null;
    });
  }
}
