import Hey from "../../hey";
import { Mesh, Program as P, Transform } from "ogl";
import { Gl } from "../gl";
import vertex from "./vertex.vert";
import fragment from "./fragment.frag";
import gsap from "../../gsap";

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

    this.rotation.x = Gl.mouse.ey * 0.5;
    this.rotation.y = Gl.mouse.ex * Math.PI + t;
  }

  resize() {
    this.position.x = Gl.vp.viewSize.w / 5;
    const hsize = Gl.vp.viewSize.h / 2;
    this.scale.set(hsize, hsize, hsize);
    this.battery?.resize();
  }
}

class BatteryModel extends Mesh {
  constructor(gl) {
    super(gl, {
      geometry: Gl.scene.assets.model.scenes[0][0].children[0].geometry,
      program: new Program(gl),
      frustumCulled: false,
    });

    this.scale.set(0, 0, 0);
    this.position.y = -Gl.vp.viewSize.h;

    // this.position.z = 1;
    // console.log(Gl.scene.assets.model.scenes[0][0].children[0].geometry);

    // this.gl = gl;

    Hey.on("LOAD", (state) => {
      gsap.to(this.scale, {
        x: 1,
        y: 1,
        z: 1,
        delay: 0.5,
      });

      gsap.to(this.position, {
        y: 0,
        delay: 0.5,
      });
    });
  }

  resize() {}

  render(t) {
    this.program.time = t;

    // this.rotation.y = t * 0.5;
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
        u_light: { value: Gl.scene.assets.light },
      },
      // depthTest: false,
    });
  }

  set time(t) {
    this.uniforms.u_time.value = t;
  }
}
