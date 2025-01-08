import { Triangle, Mesh, Program as P } from "ogl";
import vertex from "./vertex.vert";
import fragment from "./fragment.frag";
import { clamp } from "../../util/math";

import gsap, { ANIMATION } from "../../gsap";
import Hey from "../../hey";
import { Gl } from "../gl";

import { Track } from "../../util/track";

const GRADIENT = {
  dark1: 0x0d151b,
  dark2: 0x71a3b0,
  light1: 0xd5e3ed,
};

export class Screen extends Mesh {
  a = {
    dark: Hey.PAGE === "home" ? 1 : 0,
  };

  constructor(gl) {
    super(gl, { geometry: new Triangle(gl), program: new Program(gl) });
    Hey.on("PAGE", (page) => this.pageChange(page));

    this.pageChange(Hey.PAGE);

    // this.position.z = 10;
  }

  resize() {
    this.track?.resize();
  }

  render(t) {
    // if (this.track) console.log(this.track.value); // track homepage color

    this.program.time = t * 0.2;
    this.program.uniforms.u_a_dark.value = clamp(
      0,
      1,
      this.a.dark - this.track?.value || 0
    );
  }

  /* lifecycle */
  pageChange(page) {
    // console.log("BG:pageChange", page);

    gsap.to(this.a, {
      dark: page === "home" ? 1 : 0,
      duration: ANIMATION.page.duration,
      ease: ANIMATION.page.ease,
    });

    // handle homepage track
    const track = document.querySelector("[data-track='gradient']");

    if (track) {
      this.track = new Track({
        element: track,
        config: {
          bottom: "bottom",
        },
      });
    } else {
      if (this.track) {
        this.track.destroy();
      }
    }
  }
}

class Program extends P {
  constructor(gl) {
    super(gl, {
      vertex: vertex,
      fragment: fragment,
      transparent: false,
      cullFace: null,
      uniforms: {
        u_time: { value: 0 },
        u_color_dark1: { value: hexToVec3(GRADIENT.dark1) },
        u_color_dark2: { value: hexToVec3(GRADIENT.dark2) },
        u_color_light1: { value: hexToVec3(GRADIENT.light1) },
        u_a_dark: { value: 0.5 },
        u_a_mouse: { value: [0, 0] },
      },
      depthTest: false,
    });
  }

  set time(t) {
    this.uniforms.u_time.value = t;
    this.uniforms.u_a_mouse.value = [Gl.mouse.ex, Gl.mouse.ey];
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
