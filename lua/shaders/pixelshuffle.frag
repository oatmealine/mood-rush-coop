#version 120

#define PI 3.1415

varying vec2 imageCoord;
uniform vec2 textureSize;
uniform vec2 imageSize;
uniform sampler2D sampler0;
uniform float time;

uniform float amp = 0.05;
uniform float smoothen = 0.05;

float inOutSine(float x) {
  return 0.5 - 0.5 * cos(x * PI);
}

float rand( vec2 n ) {
  return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

float smoothRand(float x, float t) {
  return mix(rand(vec2(floor(x), t)), rand(vec2(ceil(x), t)), inOutSine(fract(x)));
}

vec2 img2tex( vec2 v ) { return clamp(v, 0.0 + 1.0 / imageSize.x, 1.0 - 1.0 / imageSize.x) / textureSize * imageSize; }

void main() {
  vec2 uv = imageCoord;

  uv.x += smoothRand(uv.y * imageSize.y * smoothen, time / 10.0) * amp;

  vec3 col = texture2D(sampler0, img2tex(uv)).rgb;
  gl_FragColor = vec4(col,1.0);
}