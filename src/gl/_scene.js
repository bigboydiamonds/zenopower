import { Transform } from "ogl";
import { Quad } from "./_quad.js";
// import { loadAssets } from "./util/loader.js";

export class Scene extends Transform {
  isOn = true;

  constructor(gl, data = {}) {
    super();
    this.gl = gl;

    queueMicrotask(() => this.create(data));
  }

  async load() {}

  async create() {
    await this.load();

    this.quad = new Quad(this.gl);
    this.quad.setParent(this);

    // const ass = await loadAssets(this.gl);
    // console.log(ass);
  }

  render(t) {
    if (!this.isOn) return;
    if (this.quad) this.quad.render(t);
  }

  resize(vp) {
    // if (this.quad) this.quad.resize(vp);
  }
}
