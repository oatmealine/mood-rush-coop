attribute vec4 TextureMatrixScale;
varying vec3 position;
varying vec3 normal;
varying vec4 color;
varying vec2 textureCoord;
varying vec2 imageCoord;
uniform vec2 textureSize;
uniform vec2 imageSize;
uniform mat4 textureMatrix;

uniform float amp;
uniform float time;

vec3 hash33(vec3 p3) {
	p3 = fract(p3 * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yxz+33.33);
	return fract((p3.xxy + p3.yxx)*p3.zyx);
}

vec4 hash44(vec4 p4) {
	p4 = fract(p4  * vec4(.1031, .1030, .0973, .1099));
  p4 += dot(p4, p4.wzxy+33.33);
  return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}

vec4 offset(vec4 p4, float amp) {
	return p4 + hash44(p4 + vec4(time)) * amp;
}

void main() {
	normal = gl_NormalMatrix * gl_Normal * vec3(1.0, -1.0, 1.0);
	gl_Position = offset(gl_ModelViewProjectionMatrix * gl_Vertex, amp);
	position = gl_Vertex.xyz;
	vec4 texCoord = (textureMatrix * gl_MultiTexCoord0 * TextureMatrixScale) + (gl_MultiTexCoord0 * (vec4(1)-TextureMatrixScale));
	gl_TexCoord[0] = texCoord;
	textureCoord = texCoord.xy;
	imageCoord = textureCoord * textureSize / imageSize;

	vec4 col = vec4(1.0);

	gl_FrontColor = col;
	color = col;
}
