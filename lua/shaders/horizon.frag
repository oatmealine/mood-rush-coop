#version 120

uniform float time;
uniform float amp;

varying vec2 textureCoord;
varying vec2 imageCoord;

varying vec4 color;

uniform vec2 textureSize;
uniform vec2 imageSize;

vec2 texCoord2imgCoord( vec2 uv )
{
  return fract(uv) / textureSize * imageSize;
}

uniform sampler2D sampler0;
#define saturate(i) clamp(i,0.,1.)

float noise( float _i ) {
	return fract( sin( _i * 3287.5456 + 92.44 ) * 32.45344 );
}

void main (void)
{
  vec2 uv = imageCoord;
  
  float timer = time;

	float phaseY = uv.y * 1000.0 + timer * 10.0;
	float phaseOut = noise( floor( ( phaseY + ( 2.0 + sin( phaseY * 0.1 ) ) * noise( timer ) * 20.0 ) * 0.07 + noise( floor( phaseY * 1.1 ) ) ) );
  float phase3 = phaseOut * 182.43 + floor( timer * 30.0 ) / 3.0 * 0.1;

  float amp2 = amp * ( 1.0 + 40.0 * pow( abs( uv.y * 2.0 - 1.0 ), 120.0 ) );

  vec3 glitchUvx = vec3(
		fract( uv.x+( 0.4 * sin( phase3 ) ) * amp2 ),
		fract( uv.x+( 0.4 * sin( phase3 + 0.4 ) ) * amp2 ),
		fract( uv.x+( 0.4 * sin( phase3 + 0.8 ) ) * amp2 )
	);

  gl_FragColor = vec4(saturate( vec3(
  	texture2D( sampler0, texCoord2imgCoord(vec2( glitchUvx.x, uv.y )) ).x,
  	texture2D( sampler0, texCoord2imgCoord(vec2( glitchUvx.y, uv.y )) ).y,
  	texture2D( sampler0, texCoord2imgCoord(vec2( glitchUvx.z, uv.y )) ).z
  ) ), 1)*color;
  
}