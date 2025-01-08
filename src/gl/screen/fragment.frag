precision highp float;
#include '../glsl/constants.glsl'
#include '../glsl/simplex.glsl'

uniform float u_time;
uniform vec3 u_color_dark1;
uniform vec3 u_color_dark2;
uniform vec3 u_color_light1;
uniform vec3 u_color_light2;
uniform float u_a_dark;

varying vec2 v_uv;
uniform vec2 u_a_mouse;

const vec2 light_focus = vec2(0.75, 0.5);

void main() {
    float ns = smoothstep(0., 1., simplex3d(vec3(v_uv, u_time)));

    vec3 col1 = mix(u_color_light1, u_color_dark1, u_a_dark);
    vec3 col2 = mix(u_color_light2, u_color_dark2, u_a_dark);

    vec3 color = mix(col1, col2, ns);

    // mix with light focus
    // vec2 focus_uv = mix(vec2(ns), v_uv, .8);
    float dist = distance(v_uv, light_focus * (u_a_mouse + .5));
    dist = smoothstep(.5, .0, dist);

    color += dist * .3;

    // float ho_grad = smoothstep(.0, .5, v_uv.x);
    // color += ho_grad * .1;


    color = mix(u_color_light1, color, u_a_dark);

    // gl_FragColor.rgb = col1;
    gl_FragColor.rgb = color;
    // gl_FragColor.rgb = vec3(ho_grad);

    gl_FragColor.a = 1.0;
}
