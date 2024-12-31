import { Triangle, Mesh, Program as P } from "ogl";
import vertex from "./vertex.vert";
import fragment from "./fragment.frag";

import gsap, { ANIMATION } from "../../gsap";
import Hey from "../../hey";

// import Track

const GRADIENT = {
  dark1: 0x0d151b,
  dark2: 0x71a3b0,
};

export class Screen extends Mesh {
  a = {
    dark: Hey.PAGE === "home" ? 1 : 0,
  };

  constructor(gl) {
    super(gl, { geometry: new Triangle(gl), program: new Program(gl) });
    Hey.on("PAGE", (page) => this.pageChange(page));
    // this.gl = gl;
  }

  resize() {}

  render(t) {
    this.program.time = t * 0.2;
    this.program.uniforms.u_a_dark.value = this.a.dark;
  }

  /* lifecycle */
  pageChange(page) {
    console.log("BG:pageChange", page);

    gsap.to(this.a, {
      dark: page === "home" ? 1 : 0,
      duration: ANIMATION.page.duration,
      ease: ANIMATION.page.ease,
    });

    const track = document.querySelector("[data-track='gradient']");
    console.log("track", track);

    if (track) {
      console.log("found track");
    }
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
        u_color_dark1: { value: hexToVec3(GRADIENT.dark1) },
        u_color_dark2: { value: hexToVec3(GRADIENT.dark2) },
        u_a_dark: { value: 0.5 },
      },
    });
  }

  set time(t) {
    this.uniforms.u_time.value = t;
  }
}

// -- utils
function hexToVec3(hex) {
  return [
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255,
  ];
}
