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
    console.log(Hey.page); // init with correct params
    // Hey.on("page", (page) => {
    //   console.log(page);
    // });

    //1. create BG

    // 2. load assets
    await this.load();

    // 3. create model
    this.quad = new Screen(this.gl);
    this.quad.setParent(this);
  }

  render(t) {
    if (!this.isOn) return;
    if (this.quad) this.quad.render(t);
  }

  resize(vp) {
    // if (this.quad) this.quad.resize(vp);
  }
}
