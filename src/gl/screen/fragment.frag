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

uniform float u_BG_POWER;

void main() {
    float ns = smoothstep(0., 1., simplex3d(vec3(v_uv * .3, u_time * 1.)));
    float ho_grad = smoothstep(0.5, 1., v_uv.x + ns);

    float grad = (ns + ho_grad) / 2.;

    vec3 col1 = mix(u_color_dark1 * 1.2, u_color_dark2,  grad);
    vec3 col2 = mix(u_color_light2, u_color_light1, grad);

    vec3 color = mix(col2 * u_BG_POWER, col1, u_a_dark);

    
    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
}
