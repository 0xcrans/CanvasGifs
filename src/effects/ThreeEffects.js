import * as THREE from 'three';

export class ThreeEffects {
  constructor() {
    this.svgElement = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.activeEffects = new Map();
  }

  initialize(svgElement) {
    // Sprawdź, czy element SVG jest prawidłowy
    if (!svgElement) {
      console.warn('ThreeEffects: Nieprawidłowy element SVG podczas inicjalizacji');
      return;
    }
    
    this.svgElement = svgElement;
    this.setupThreeJS();
  }

  setupThreeJS() {
    // Sprawdź, czy svgElement jest dostępny
    if (!this.svgElement) {
      console.warn('ThreeEffects: SVG element nie jest dostępny dla setupThreeJS');
      return;
    }

    try {
      // Tworzy overlay canvas dla efektów Three.js
      this.canvas = document.createElement('canvas');
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';wac,
      this.canvas.style.left = '0';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '10';
      
      // Wstaw canvas jako overlay
      const parent = this.svgElement.parentElement;
      if (parent) {
        parent.appendChild(this.canvas);
      } else {
        console.warn('ThreeEffects: Nie znaleziono elementu nadrzędnego dla canvas overlay');
      }

      // Setup Three.js scene
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      this.renderer = new THREE.WebGLRenderer({ 
        canvas: this.canvas, 
        alpha: true,
        premultipliedAlpha: false
      });
      
      this.renderer.setSize(800, 600); // Domyślny rozmiar
      this.renderer.setClearColor(0x000000, 0); // Przezroczyste tło
    } catch (error) {
      console.error('ThreeEffects: Błąd podczas konfiguracji Three.js:', error);
    }
  }

  applyEffect(effectType, elements, params = {}) {
    const method = this[effectType];
    if (method) {
      return method.call(this, elements, params);
    } else {
      console.warn(`ThreeEffects: Nieznany efekt ${effectType}`);
      return null;
    }
  }

  // Fragment shader displacement
  displacementMap(elements, params = {}) {
    const {
      amplitude = 0.1,
      frequency = 5.0,
      speed = 1.0,
      type = 'wave' // wave, noise, spiral
    } = params;

    const geometry = new THREE.PlaneGeometry(2, 2);
    
    // Custom vertex shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    
    // Custom fragment shader z displacement
    const fragmentShader = `
      uniform float time;
      uniform float amplitude;
      uniform float frequency;
      uniform sampler2D svgTexture;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        
        // ${type} displacement
        ${this.getDisplacementCode(type)}
        
        vec4 color = texture2D(svgTexture, uv);
        gl_FragColor = color;
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        amplitude: { value: amplitude },
        frequency: { value: frequency },
        svgTexture: { value: this.createSVGTexture() }
      },
      vertexShader,
      fragmentShader,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    // Animacja
    const animate = () => {
      material.uniforms.time.value += 0.016 * speed;
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    };
    animate();

    const effectId = `three-displacement-${Date.now()}`;
    this.activeEffects.set(effectId, { mesh, material, type: 'displacement' });
    
    console.log(`🌊 Three.js Displacement Map zastosowany`);
    return effectId;
  }

  // Particle system overlay
  particleSystem(elements, params = {}) {
    const {
      count = 1000,
      size = 2.0,
      color = '#ffffff',
      speed = 1.0,
      behavior = 'float' // float, swirl, explode
    } = params;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    // Inicjalizacja pozycji i prędkości
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 4;
      positions[i3 + 1] = (Math.random() - 0.5) * 4;
      positions[i3 + 2] = 0;
      
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = 0;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
      color: color,
      size: size,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);

    // Animacja cząsteczek
    const animate = () => {
      const positions = particles.geometry.attributes.position.array;
      const velocities = particles.geometry.attributes.velocity.array;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        switch (behavior) {
          case 'float':
            positions[i3] += velocities[i3] * speed;
            positions[i3 + 1] += velocities[i3 + 1] * speed;
            break;
          case 'swirl':
            const angle = Math.atan2(positions[i3 + 1], positions[i3]) + 0.02 * speed;
            const radius = Math.sqrt(positions[i3] * positions[i3] + positions[i3 + 1] * positions[i3 + 1]);
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = Math.sin(angle) * radius;
            break;
          case 'explode':
            positions[i3] += velocities[i3] * speed * 2;
            positions[i3 + 1] += velocities[i3 + 1] * speed * 2;
            velocities[i3 + 1] -= 0.001; // Grawitacja
            break;
        }
        
        // Reset jeśli wyjdzie poza granice
        if (Math.abs(positions[i3]) > 2 || Math.abs(positions[i3 + 1]) > 2) {
          positions[i3] = (Math.random() - 0.5) * 0.1;
          positions[i3 + 1] = (Math.random() - 0.5) * 0.1;
        }
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    };
    animate();

    const effectId = `three-particles-${Date.now()}`;
    this.activeEffects.set(effectId, { particles, material, type: 'particles' });
    
    console.log(`✨ Three.js Particle System zastosowany (${count} cząsteczek)`);
    return effectId;
  }

  // Psychedelic geometry overlay
  psychedelicGeometry(elements, params = {}) {
    const {
      shape = 'sphere', // sphere, torus, icosahedron
      color = '#ff006e',
      wireframe = true,
      rotationSpeed = 1.0,
      scale = 1.0
    } = params;

    let geometry;
    switch (shape) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(0.5, 32, 32);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(0.4, 0.2, 16, 100);
        break;
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(0.5, 2);
        break;
      default:
        geometry = new THREE.SphereGeometry(0.5, 32, 32);
    }

    const material = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: wireframe,
      transparent: true,
      opacity: 0.6
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(scale);
    this.scene.add(mesh);

    // Animacja rotacji
    const animate = () => {
      mesh.rotation.x += 0.01 * rotationSpeed;
      mesh.rotation.y += 0.02 * rotationSpeed;
      mesh.rotation.z += 0.005 * rotationSpeed;
      
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    };
    animate();

    const effectId = `three-geometry-${Date.now()}`;
    this.activeEffects.set(effectId, { mesh, material, type: 'geometry' });
    
    console.log(`🔮 Three.js Psychedelic Geometry zastosowany`);
    return effectId;
  }

  // Shader-based color distortion
  colorDistortion(elements, params = {}) {
    const {
      intensity = 0.5,
      speed = 1.0,
      hueShift = true,
      saturationBoost = 1.5
    } = params;

    const geometry = new THREE.PlaneGeometry(2, 2);
    
    const fragmentShader = `
      uniform float time;
      uniform float intensity;
      uniform float saturationBoost;
      uniform bool hueShift;
      uniform sampler2D svgTexture;
      varying vec2 vUv;
      
      vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
      }
      
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      
      void main() {
        vec2 uv = vUv;
        
        // Distoruj UV coords
        uv.x += sin(uv.y * 10.0 + time) * intensity * 0.1;
        uv.y += cos(uv.x * 10.0 + time) * intensity * 0.1;
        
        vec4 color = texture2D(svgTexture, uv);
        
        if (hueShift && color.a > 0.1) {
          vec3 hsv = rgb2hsv(color.rgb);
          hsv.x += time * 0.1; // Hue shift
          hsv.y *= saturationBoost; // Saturation boost
          color.rgb = hsv2rgb(hsv);
        }
        
        gl_FragColor = color;
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: intensity },
        saturationBoost: { value: saturationBoost },
        hueShift: { value: hueShift },
        svgTexture: { value: this.createSVGTexture() }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    const animate = () => {
      material.uniforms.time.value += 0.016 * speed;
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    };
    animate();

    const effectId = `three-colordist-${Date.now()}`;
    this.activeEffects.set(effectId, { mesh, material, type: 'colorDistortion' });
    
    console.log(`🎨 Three.js Color Distortion zastosowany`);
    return effectId;
  }

  // Helper methods
  getDisplacementCode(type) {
    switch (type) {
      case 'wave':
        return `
          uv.x += sin(uv.y * frequency + time) * amplitude;
          uv.y += cos(uv.x * frequency + time) * amplitude;
        `;
      case 'noise':
        return `
          float noise = fract(sin(dot(uv.xy, vec2(12.9898,78.233))) * 43758.5453);
          uv += noise * amplitude * sin(time);
        `;
      case 'spiral':
        return `
          float angle = atan(uv.y - 0.5, uv.x - 0.5);
          float radius = length(uv - 0.5);
          angle += time + radius * frequency;
          uv = vec2(cos(angle), sin(angle)) * radius + 0.5;
        `;
      default:
        return 'uv.x += sin(uv.y * frequency + time) * amplitude;';
    }
  }

  createSVGTexture() {
    // Sprawdź, czy svgElement jest dostępny
    if (!this.svgElement) {
      console.warn('ThreeEffects: SVG element nie jest dostępny dla createSVGTexture');
      return new THREE.Texture(); // Zwróć pustą teksturę
    }

    try {
      // Stwórz teksturę z SVG
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Rasteryzuj SVG do canvas
      const svgData = new XMLSerializer().serializeToString(this.svgElement);
      const img = new Image();
      const svg = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svg);
      
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 512, 512);
        URL.revokeObjectURL(url);
      };
      img.src = url;
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    } catch (error) {
      console.error('ThreeEffects: Błąd podczas tworzenia tekstury SVG:', error);
      return new THREE.Texture(); // Zwróć pustą teksturę
    }
  }

  // Effect management
  clearEffect(effectId) {
    const effect = this.activeEffects.get(effectId);
    if (effect) {
      if (effect.mesh) {
        this.scene.remove(effect.mesh);
      }
      if (effect.particles) {
        this.scene.remove(effect.particles);
      }
      this.activeEffects.delete(effectId);
    }
  }

  updateEffect(effectId, progress, params) {
    const effect = this.activeEffects.get(effectId);
    if (effect && effect.material && effect.material.uniforms) {
      // Update shader uniforms based on timeline progress
      if (effect.material.uniforms.time) {
        effect.material.uniforms.time.value = progress * 10;
      }
    }
  }

  // Resize handling
  resize(width, height) {
    if (this.renderer) {
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  // Cleanup
  dispose() {
    this.activeEffects.forEach(effect => {
      if (effect.mesh) this.scene.remove(effect.mesh);
      if (effect.particles) this.scene.remove(effect.particles);
    });
    this.activeEffects.clear();
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
  }
} 