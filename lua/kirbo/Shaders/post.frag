#version 120

#define saturate(x) clamp(x,0.,1.)
#define lofi(x,d) (floor((x)/(d))*(d))

// shoutouts to fms_cat! https://www.youtube.com/channel/UCK1Mn6u0vl3VeW5SCwMT1eg

varying vec2 imageCoord;
uniform vec2 textureSize;
uniform vec2 imageSize;
uniform sampler2D sampler0;
uniform sampler2D samplerRandom;
uniform float time;
uniform float glitchAmp = 0.0;
uniform float hnoise = 0.0;

bool isValidUV( vec2 v ) { return 0.0 < v.x && v.x < 1.0 && 0.0 < v.y && v.y < 1.0; }
vec2 img2tex( vec2 v ) { return v / textureSize * imageSize; }

vec3 rgb2yiq( vec3 rgb ) {
  return mat3( 0.299, 0.596, 0.211, 0.587, -0.274, -0.523, 0.114, -0.322, 0.312 ) * rgb;
}

vec3 yiq2rgb( vec3 yiq ) {
  return mat3( 1.000, 1.000, 1.000, 0.956, -0.272, -1.106, 0.621, -0.647, 1.703 ) * yiq;
}

float fractSin( float x ) {
  return fract( 127.461 * sin( 228.671 * x ) );
}

vec2 doDeform( vec2 uv ) {
  vec2 sum = vec2( 0.0 );
  float p = 1.0;
  if ( glitchAmp != 0.0 ) {
    for ( int i = 0; i < 4; i ++ ) {
      p *= 0.4;
      vec2 v = vec2( 0.0, lofi( uv.y, 0.2 * p ) );
      float modOffset = fractSin( v.y );
      v.x = lofi( uv.x + modOffset, p ) - modOffset;
      vec4 tex = texture2D( samplerRandom, fract( v + 0.1 * time ) );
      sum += mix( 1.0 - glitchAmp, 1.0, p ) < tex.z ? ( tex.xy - 0.5 ) * p : vec2( 0.0 );
    }
  }
  sum.x += 0.0 != hnoise
    ? hnoise * ( texture2D( samplerRandom, vec2( uv.y, fract( time ) ) ).x - 0.5 )
    : 0.0;
  return sum;
}

void main() {
  vec2 uv = imageCoord;
  vec2 deform = doDeform( uv );
  vec3 tex = vec3(
    texture2D( sampler0, img2tex( fract( uv + 0.6 * deform ) ) ).x,
    texture2D( sampler0, img2tex( fract( uv + 0.8 * deform ) ) ).y,
    texture2D( sampler0, img2tex( fract( uv +       deform ) ) ).z
  );

  vec3 col = tex;

  gl_FragColor = vec4( col, 1.0 );
}
