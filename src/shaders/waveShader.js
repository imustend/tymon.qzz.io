import * as THREE from "three";

const waveShader = new THREE.ShaderMaterial( {
    side: THREE.DoubleSide,

    uniforms: {
        time: {value: 0.0},
        useed: {value: 0.0},
    },

    vertexShader: `
    varying vec2 vUv;
    uniform float time;
    uniform float useed;
    varying vec3 vWorldPos;

		void main() {
		    vUv = uv;
		    vec3 newPosition = position;
		    
		    float amplitude = 3.;
            float frequency = .33;
            float y = sin(newPosition.x * frequency);
            float t = 0.01*((useed-time)*100.0);
            y += sin(newPosition.x*frequency*2.1 + t)*4.5;
            y += sin(newPosition.x*frequency*1.72 + t*1.121)*4.0;
            y += sin(newPosition.x*frequency*2.221 + t*0.437)*5.0;
            y += sin(newPosition.x*frequency*3.1122+ t*4.269)*2.5;
            y *= amplitude*0.06;
            
            newPosition.z += y;
		    
            vec4 worldPos = modelMatrix * vec4(newPosition, 1.0);
            vWorldPos = worldPos.xyz;

            gl_Position = projectionMatrix * viewMatrix * worldPos;
		}
    `,
    fragmentShader: `
    #ifdef GL_OES_standard_derivatives
    #extension GL_OES_standard_derivatives : enable
    #endif

    varying vec3 vWorldPos;
    varying vec2 vUv;

    void main() {
        vec3 dx = dFdx(vWorldPos);
        vec3 dy = dFdy(vWorldPos);

        vec3 N = vec3(0.0, 0.0, 1.0);
        N += vec3(dx.z, dy.z, 0.0);
        N = normalize(N);
        
        gl_FragColor = vec4(N * 0.5 + 0.5, 1.0);

    }
`,
});

export {waveShader};