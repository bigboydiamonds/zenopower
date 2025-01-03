import { Mesh, Program as P, Transform } from "ogl";
import { Gl } from "../gl";
import vertex from "./vertex.vert";
import fragment from "./fragment.frag";

export class Battery extends Transform {
  constructor(gl) {
    super();
    this.gl = gl;
    this.create();
  }

  async create() {
    this.battery = new BatteryModel(this.gl);
    this.resize();
    this.battery.setParent(this);
  }

  render(t) {
    this.battery?.render(t);
  }

  resize() {
    this.position.x = Gl.vp.viewSize.w / 5;
    this.battery?.resize();
  }
}

class BatteryModel extends Mesh {
  constructor(gl) {
    super(gl, {
      geometry: Gl.scene.assets.model.scenes[0][0].children[0].geometry,
      program: new Program(gl),
    });

    // this.position.z = 1;
    // console.log(Gl.scene.assets.model.scenes[0][0].children[0].geometry);

    // this.gl = gl;
  }

  resize() {}

  render(t) {
    this.program.time = t;

    this.rotation.y = t * 0.1;
  }
}

class Program extends P {
  constructor(gl) {
    super(gl, {
      vertex: vertex,
      fragment: fragment,
      transparent: true,
      cullFace: null,
      uniforms: {
        u_time: { value: 0 },
        u_mtc: { value: Gl.scene.assets.matcap },
      },
      // depthTest: false,
    });
  }

  set time(t) {
    this.uniforms.u_time.value = t;
  }
}
