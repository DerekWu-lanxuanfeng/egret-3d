attribute vec3 attribute_position;
attribute vec3 attribute_normal;
attribute vec4 attribute_color;
attribute vec2 attribute_uv0;

vec3 e_position = vec3(0.0, 0.0, 0.0);

//shader 中自动识别unifor 和赋予 uniform index
//外部一定要有值传输进来，如果这个index从来没有用过， webgl 会报错
uniform mat4 uniform_ModelMatrix ;
uniform mat4 uniform_ViewMatrix ;
uniform mat4 uniform_ProjectionMatrix ;

varying vec3 varying_ViewPose;
varying vec3 varying_eyeNormal  ;
varying vec2 varying_uv0;
varying vec4 varying_color;

vec4 outPosition ;

mat3 transpose(mat3 m) {
  return mat3(m[0][0], m[1][0], m[2][0],
              m[0][1], m[1][1], m[2][1],
              m[0][2], m[1][2], m[2][2]);
}

mat3 inverse(mat3 m) {
  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];
  float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];
  float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];

  float b01 = a22 * a11 - a12 * a21;
  float b11 = -a22 * a10 + a12 * a20;
  float b21 = a21 * a10 - a11 * a20;

  float det = a00 * b01 + a01 * b11 + a02 * b21;

  return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),
              b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),
              b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;
}

void main(void){
	e_position = attribute_position;
	varying_color = attribute_color;
	varying_uv0 = attribute_uv0;
}