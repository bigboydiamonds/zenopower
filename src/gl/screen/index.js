import { Triangle, Mesh, Program as P } from "ogl";
import vertex from "./vertex.vert";
import fragment from "./fragment.frag";

const GRADIENT = {
  dark: "0D151B",
  light: "71A3B0",
};

export class Screen extends Mesh {
  constructor(gl) {
    super(gl, { geometry: new Triangle(gl), program: new Program(gl) });
    this.gl = gl;
  }

  resize() {}

  render(t) {
    this.program.time = t;
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
