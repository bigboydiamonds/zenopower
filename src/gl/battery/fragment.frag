precision highp float;

uniform sampler2D u_mtc;
uniform sampler2D u_light;

varying vec3 v_normal;
varying vec2 v_uv;
varying vec4 v_color;

varying vec3 v_view;


void main() {

    // * matcap uvs
    vec3 x = normalize( vec3(v_view.z, 0., -v_view.x));
    vec3 y = cross(v_view, x);
    vec2 fakeUv = vec2( dot(x, v_normal), dot(y, v_normal)) * .495 + .5;

    // * matcap
    vec3 mtc = texture2D(u_mtc, fakeUv).rgb;

    // * light
    vec3 light = texture2D(u_light, v_uv).rgb;




    gl_FragColor.rgb = vec3(fakeUv, 1.);
    gl_FragColor.rgb = mtc;
    gl_FragColor.rgb = light;
    gl_FragColor.a = 1.0;
}
