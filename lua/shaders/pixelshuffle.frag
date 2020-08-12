#version 120

// diet coke glitch-lines
// made by oat

varying vec2 imageCoord;
uniform vec2 textureSize;
uniform vec2 imageSize;
uniform sampler2D sampler0;
uniform float time;

uniform float amp = 0.02;

vec2 img2tex( vec2 v ) { return fract(v) / textureSize * imageSize; }

float rand( vec2 n ) {
  return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

void main() {
  vec2 uv = imageCoord;
	vec2 offset = vec2(
		rand(vec2(time, uv.y)),
		0.0
	);
	gl_FragColor = texture2D(sampler0, img2tex(uv + offset * amp));
}