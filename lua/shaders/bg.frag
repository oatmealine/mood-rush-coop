// written by oatmealine

varying vec4 color;
varying vec2 imageCoord;
uniform vec2 resolution;
uniform float time;

const float lines = 1.8;
const float aa = 0.09;
const float width = 0.01;

void main() {
	vec2 uv = imageCoord + vec2(time * 0.1, time * 0.05);
	
	uv.x *= resolution.x / resolution.y;
	
	vec3 col = vec3(0.0);
	
	// this is terrible and im sorry
	// please never use this, i am begging you
	// like, its worse than an if(). just, dont
	// you can feel free to refer to me as jill "doesn't know what a smoothstep is" oatmealine
	col += clamp(vec3(0.5 - (resolution.y * aa) * clamp(-width * 0.5 + abs(fract((uv.y) * (lines * 2.0)) - (width + 0.5)), 0.0, 1.0)), 0.0, 1.0);
	col += clamp(vec3(0.5 - (resolution.y * aa) * clamp(-width * 0.5 + abs(fract((uv.y) * (lines * 2.0) + 0.5) - (width + 0.5)), 0.0, 1.0)), 0.0, 1.0);
	col += clamp(vec3(0.5 - (resolution.y * aa) * clamp(-width + abs(fract((uv.y + uv.x * 1.5) * lines * 2.0) - (width + 0.5)), 0.0, 1.0)), 0.0, 1.0);
	col += clamp(vec3(0.5 - (resolution.y * aa) * clamp(-width + abs(fract((uv.y - uv.x * 1.5) * lines * 2.0) - (width + 0.5)), 0.0, 1.0)), 0.0, 1.0);
	
	col = clamp(col, 0.02, 0.2);
	
	gl_FragColor = vec4(col, 1.0) * color;
}