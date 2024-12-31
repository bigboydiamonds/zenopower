precision highp float;
#include '../glsl/constants.glsl'
#include '../glsl/simplex.glsl'

uniform float u_time;
uniform vec3 u_color_dark1;
uniform vec3 u_color_dark2;
uniform vec3 u_color_light1;
uniform float u_a_dark;

varying vec2 v_uv;

void main() {
    float ns = simplex3d(vec3(v_uv , u_time));

    vec3 col1 = mix(u_color_light1,u_color_dark1,  u_a_dark);
    vec3 col2 = mix(u_color_light1, u_color_dark2, u_a_dark);

    vec3 color = mix(col1, col2, ns);

    color = mix(u_color_light1,color, u_a_dark);


    // gl_FragColor.rgb = vec3(v_uv, 1.);
    gl_FragColor.rgb = vec3(ns, ns, ns);
    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
}
