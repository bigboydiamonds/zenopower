import Hey from "../hey";

export class Submit {
  field = document.querySelector('[data-newsletter="field"]');
  constructor(el) {
    this.el = el;
    this.receiver = [...this.el.querySelectorAll("input")];

    Hey.on("PAGE", () => this.init());
    this.init();
  }

  init = () => {
    if (this.field) {
      this.field.onchange = null;
    }

    const fld = document.querySelector('[data-newsletter="field"]');
    const sub = document.querySelector('[data-newsletter="subscribe"]');
    if (fld) {
      fld.oninput = () => {
        this.receiver[0].value = fld.value;
      };
    }

    // console.log(this.el);

    if (sub) {
      sub.onclick = (e) => {
        e.preventDefault();
        // console.log("submit", this.receiver[0].value);
        this.receiver[1].click();
        this.handleSuccess(sub);
      };

      this.el.onsubmit = (e) => {
        e.preventDefault();
        // console.log("submit", this.receiver[0].value);
        this.receiver[1].click();
        this.handleSuccess(sub);
      };
    }
  };

  handleSuccess(sub) {
    console.log("success", sub);
    const parent = sub.parentElement;
    parent.style.display = "none";
    parent.nextElementSibling.style.display = "block";
  }

  // onChange() {
  //   console.log("submit change");
  // }
}
