let shaders = [
    {
        // wave thingy
        //=========================================================================================
        vert:
                `
                varying vec2 vUv;
                uniform float utime;
                uniform float useed;
                varying vec3 vWorldPos;
            
                    void main() {
                        vUv = uv;
                        vec3 newPosition = position;
                        
                        float amplitude = 3.;
                        float frequency = .33;
                        float y = sin(newPosition.x * frequency);
                        float t = 0.01*((useed-utime)*100.0);
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
        frag: `
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
            `
    },
    {
        // land thingy
        //=========================================================================================
        vert: `
                varying vec2 vUv;
                uniform float utime;
                uniform float useed;
                varying vec3 vWorldPos;
                
                    
                
                    float random (in vec2 st, in float seed ) {
                        return fract(sin(dot(st.xy,
                                         vec2(12.9898,78.233)))*
                        43758.5453123 + seed);
                    }
                
                
                    // Based on Morgan McGuire @morgan3d
                    // https://www.shadertoy.com/view/4dS3Wd
                    float noise (in vec2 st, in float seed) {
                        vec2 i = floor(st);
                        vec2 f = fract(st);
                    
                        // Four corners in 2D of a tile
                        float a = random(i, seed);
                        float b = random(i + vec2(1.0, 0.0), seed);
                        float c = random(i + vec2(0.0, 1.0), seed);
                        float d = random(i + vec2(1.0, 1.0), seed);
                    
                        vec2 u = f * f * (3.0 - 2.0 * f);
                    
                        return mix(a, b, u.x) +
                                (c - a)* u.y * (1.0 - u.x) +
                                (d - b) * u.x * u.y;
                    }
            
                    void main() {
                        vUv = uv;
                        
                        float stime = mod(utime, 5.);
                        float period = 5.;
                        float n = floor(utime/period);
                        float newseed = (useed + n * period * 1000.12312312)*5.123123;
                        float prevseed = (useed + (n-1.) * period * 1000.12312312)*5.123123;
                        
                        vec3 newPosition = position;
                        vec3 oldPosition = position;
                        
                        
                        float mixv = smoothstep(0., .6, stime);
                        
                        if (mixv != 1.) {
                            oldPosition.z -= 5.;
                            oldPosition.z +=  6. * noise(vec2(newPosition.x * .2, newPosition.y * .2), prevseed);
                            oldPosition.z +=  .7 * noise(vec2(newPosition.x * .8, newPosition.y * .8), prevseed);
                            oldPosition.z +=  .25 * noise(vec2(newPosition.x * 1.6, newPosition.y * 1.6), prevseed);
                            oldPosition.z +=  .125 * noise(vec2(newPosition.x * 2.5, newPosition.y * 2.5), prevseed);
                        }
                        
                
                 
                        
                        newPosition.z -= 5.;
                        newPosition.z +=  6. * noise(vec2(newPosition.x * .2, newPosition.y * .2), newseed);
                        newPosition.z +=  .7 * noise(vec2(newPosition.x * .8, newPosition.y * .8), newseed);
                        newPosition.z +=  .25 * noise(vec2(newPosition.x * 1.6, newPosition.y * 1.6), newseed);
                        newPosition.z +=  .125 * noise(vec2(newPosition.x * 2.5, newPosition.y * 2.5), newseed);
                        
                        
                        vec3 fpos = mix(oldPosition, newPosition, mixv);
                        
                        vec4 worldPos = modelMatrix * vec4(fpos, 1.0);
                        vWorldPos = worldPos.xyz;
            
                        gl_Position = projectionMatrix * viewMatrix * worldPos;
                    }
                `,
        frag:  `
                #ifdef GL_OES_standard_derivatives
                #extension GL_OES_standard_derivatives : enable
                #endif
            
                #define PI 3.141592
            
                varying vec3 vWorldPos;
                varying vec2 vUv;
            
                void main() {
                    vec3 dx = dFdx(vWorldPos);
                    vec3 dy = dFdy(vWorldPos);
                    vec3 N = normalize(cross(dx, dy));
                    vec3 up = vec3(0.,0.,1.);
                    
                    
                    float angle = acos(dot(N, up)) * (180. / PI);
                    
                    vec3 color = vec3(0.0,0.0,0.0);
                    
                    if(angle > 40. && N.z < 50.) {
                        color = vec3(.5,3.,0.);
                    }        
                              
                    gl_FragColor = vec4(N, 1.0);
                    
                }
            `,

    }
];

export {shaders}