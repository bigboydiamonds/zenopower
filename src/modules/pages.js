import { Core } from "@unseenco/taxi";
import { App } from "../app";
import { Gl } from "../gl/gl";

export class Pages extends Core {
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
  }

  async transitionOut(page) {
    await Promise.allSettled([
      App.dom.transitionOut(page),
      Gl.transitionOut(page),
    ]);
  }

  async transitionIn(page) {
    await Promise.allSettled([
      App.dom.transitionIn(page),
      Gl.transitionIn(page),
    ]);
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
