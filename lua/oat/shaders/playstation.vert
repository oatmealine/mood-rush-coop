uniform float rounding;

attribute vec4 TextureMatrixScale;

varying vec3 position;
varying vec3 normal;
varying vec4 color;

varying vec2 textureCoord;
varying vec2 imageCoord;

uniform vec2 textureSize;
uniform vec2 imageSize;

uniform mat4 modelMatrix;
uniform float beat;

void main() {
  normal = gl_NormalMatrix * gl_Normal * vec3( 1.0, -1.0, 1.0 );
  
  gl_Position = (gl_ModelViewProjectionMatrix * gl_Vertex);
  position = gl_Vertex.xyz;
  
  vec3 gpos = gl_Position.xyz;
  float sinf = floor( sin( rounding * floor(gpos.x / rounding) ) * 5);
  float cosf = floor( cos( rounding * floor(gpos.y / rounding) ) * 5);
  
  if (mod(gpos.x, 16) == 0)
  {
	sinf += 5.0;
  }
  
  if (mod(gpos.y, 4) == 0)
  {
	cosf -= 10.0;
  }
  
  gpos.x = rounding * floor(gpos.x / rounding) + sinf;
  gpos.y = rounding * floor(gpos.y / rounding) + cosf;
  gpos.z = rounding * floor(gpos.z / rounding);
  gl_Position = vec4(gpos, gl_Position.w);
  
  gl_TexCoord[0] = (gl_TextureMatrix[0] * gl_MultiTexCoord0 * TextureMatrixScale) + (gl_MultiTexCoord0 * (vec4(1)-TextureMatrixScale));
  textureCoord = ((gl_TextureMatrix[0] * gl_MultiTexCoord0 * TextureMatrixScale) + (gl_MultiTexCoord0 * (vec4(1)-TextureMatrixScale))).xy;
  imageCoord = textureCoord * textureSize / imageSize;
  
  gl_FrontColor = gl_Color;
  color = gl_Color;
}