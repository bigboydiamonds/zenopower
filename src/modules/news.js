export class News {
  current = 0;

  constructor(el) {
    this.el = el;

    this.btns = this.el.querySelectorAll('[data-news="btn"]');
    this.articles = this.el.querySelectorAll('[data-news="article"]');
    this.corners = [...this.el.querySelectorAll('[data-corners="news"]')];

    this.btns.forEach((btn, index) => {
      btn.onclick = () => {
        if (this.current === index) return;

        this.articles[this.current].style.display = "none";
        this.current = index;
        this.articles[this.current].style.display = "block";
      };
    });
  }

  destroy() {
    this.btns.forEach((btn) => {
      btn.onclick = null;
    });

    this.btns = null;
    this.articles = null;
  }
}
