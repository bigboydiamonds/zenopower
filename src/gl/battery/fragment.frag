precision highp float;

uniform sampler2D u_mtc;
uniform sampler2D u_mtc2;

uniform sampler2D u_light;
uniform sampler2D u_light2;

varying vec3 v_normal;
varying vec2 v_uv;
varying vec4 v_color;


varying vec3 v_view;

uniform float u_a_illuminate;


void main() {

    // * matcap uvs
    vec3 x = normalize( vec3(v_view.z, 0., -v_view.x));
    vec3 y = cross(v_view, x);
    vec2 fakeUv = vec2( dot(x, v_normal), dot(y, v_normal)) * .495 + .5;

    
    // * matcap
    vec3 mtc1 = texture2D(u_mtc, fakeUv).rgb;
    vec3 mtc2 = texture2D(u_mtc2, fakeUv).rgb;
    vec3 mtc = mix(mtc1, mtc2, u_a_illuminate * .8 + .2);

    // * light
    vec3 light = mix(
        texture2D(u_light, v_uv).rgb,
        texture2D(u_light2, v_uv).rgb,
        u_a_illuminate * .5
    );

    vec3 color = (mtc * light) * 1.5;




    gl_FragColor.rgb = vec3(fakeUv, 1.);
    gl_FragColor.rgb = mtc;
    gl_FragColor.rgb = light;
    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
}
