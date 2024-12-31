import { Transform } from "ogl";
import { Screen } from "./screen/";

import Hey from "../hey.js";

export class Scene extends Transform {
  isOn = true;

  constructor(gl, data = {}) {
    super();
    this.gl = gl;
    queueMicrotask(() => this.create(data));
  }

  async load() {
    // const ass = await loadAssets(this.gl);
    // console.log(":::", ass);
  }

  async create() {
    // console.log(Hey.page); // init with correct params

    // Hey.on("page", (page) => {
    //   console.log(page);
    // });

    // 1. create BG
    this.bg = new Screen(this.gl);
    this.bg.setParent(this);

    Hey.LOAD = "screen";

    // 2. load assets
    console.time("::load");
    await this.load();

    // 3. create model

    console.timeEnd("::load");
    Hey.LOAD = "full";
  }

  render(t) {
    if (!this.isOn) return;
    if (this.bg) this.bg.render(t);
  }

  resize(vp) {
    // if (this.quad) this.quad.resize(vp);
  }
}
