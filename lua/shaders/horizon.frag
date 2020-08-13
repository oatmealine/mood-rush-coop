#version 120

uniform float time;
uniform float amp;

varying vec2 textureCoord;
varying vec2 imageCoord;

varying vec4 color;

uniform vec2 textureSize;
uniform vec2 imageSize;

vec2 img2tex( vec2 v ) { return clamp(v, 0.0 + 1.0 / imageSize.x, 1.0 - 1.0 / imageSize.x) / textureSize * imageSize; }

uniform sampler2D sampler0;
#define saturate(i) clamp(i,0.,1.)

float noise( float x ) {
	return fract( sin( x * 3287.0 + 92.0 ) * 325.0 );
}

// this isnt floor, this is trunc but i dont think glsl has trunc so
float cheapFloor(float x) {return x - fract(x); }

// this isnt even sin. this is a fucking ZIG ZAG
// this is the levels of "cheap" we're on
float cheapSin(float x) {return abs(mod(x, 2.0) - 1) * 2.0 - 1.0; }

void main (void)
{
  vec2 uv = imageCoord;
  
  float timer = time;

	float phaseY = uv.y * 1000.0 + timer * 10.0;
	float phaseOut = noise( cheapFloor( ( phaseY + ( 2.0 ) * noise( timer ) * 20.0 ) * 0.07 + noise( cheapFloor( phaseY * 1.1 ) ) ) );
  float phase3 = phaseOut * 182.43 + cheapFloor( timer * 30.0 ) / 3.0 * 0.1;

  float amp2 = amp * ( 1.0 + 40.0 * pow(noise(uv.y + timer), 2.0) );

  vec3 glitchUvx = vec3(
		uv.x+( 0.4 * cheapSin( phase3 ) ) * amp2,
		uv.x+( 0.4 * cheapSin( phase3 + 0.4 ) ) * amp2,
		uv.x+( 0.4 * cheapSin( phase3 + 0.8 ) ) * amp2
	);

  gl_FragColor = vec4(saturate( vec3(
  	texture2D( sampler0, img2tex(vec2( glitchUvx.x, uv.y )) ).x,
  	texture2D( sampler0, img2tex(vec2( glitchUvx.y, uv.y )) ).y,
  	texture2D( sampler0, img2tex(vec2( glitchUvx.z, uv.y )) ).z
  ) ), 1)*color;
  
}