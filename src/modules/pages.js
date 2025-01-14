import { Core } from "@unseenco/taxi";
import { App } from "../app";
import { Gl } from "../gl/gl";
import Hey from "../hey";

export class Pages extends Core {
  current = document.querySelector("[data-page]").dataset.page;
  constructor() {
    super({
      links: "a:not([target]):not([href^=\\#]):not([data-taxi-ignore])",
      removeOldContent: true,
      allowInterruption: false,
      bypassCache: false,
      transitions: {
        default: Tra,
      },
    });

    // console.log(":p:", this.current);

    Hey.PAGE = this.current;
  }

  async transitionOut(page) {
    Hey.PAGE_OUT = page.dataset.page;

    await Promise.allSettled([
      App.dom.transitionOut(page),
      Gl.transitionOut(page),
    ]);

    App.scroll.top();

    // console.log("finished OUT");
  }

  async transitionIn(page) {
    this.current = page.dataset.page;
    Hey.PAGE = this.current;
    // console.log(":p:", this.current);

    await Promise.allSettled([
      App.dom.transitionIn(page),
      Gl.transitionIn(page),
    ]);

    // console.log("finished");
  }
}

/* -- Transition */
class Tra {
  constructor({ wrapper }) {
    this.wrapper = wrapper;
  }

  leave(props) {
    return new Promise((resolve) => {
      this.onLeave({ ...props, done: resolve });
    });
  }

  enter(props) {
    return new Promise((resolve) => {
      this.onEnter({ ...props, done: resolve });
    });
  }

  onLeave({ from, trigger, done }) {
    App.pages.transitionOut(from).then(() => done());
  }

  onEnter({ to, trigger, done }) {
    App.pages.transitionIn(to).then(() => done());
  }
}

// initEvents() {
//   this.on("NAVIGATE_OUT", ({ from, trigger }) => {
//     // console.log("OUT", from, trigger);
//   });

//   this.on("NAVIGATE_IN", ({ to, trigger }) => {
//     // console.log("IN", to, trigger);
//   });

//   this.on("NAVIGATE_END", ({ to, from, trigger }) => {
//     // console.log("END", to, from, trigger);
//   });
// }
