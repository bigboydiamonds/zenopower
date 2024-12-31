precision highp float;
#include '../glsl/constants.glsl'
#include '../glsl/simplex.glsl'

uniform float u_time;
uniform vec3 u_color_dark1;
uniform vec3 u_color_dark2;

varying vec2 v_uv;

void main() {
    float ns = simplex3d(vec3(v_uv * .5, u_time));

    vec3 color = mix(u_color_dark1, u_color_dark2, ns);


    // gl_FragColor.rgb = vec3(v_uv, 1.);
    gl_FragColor.rgb = vec3(ns, ns, ns);
    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
}
