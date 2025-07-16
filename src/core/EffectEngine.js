class EffectEngine {
  constructor(svgElement) {
    // Sprawdź, czy element SVG jest prawidłowy
    if (!svgElement) {
      console.warn('EffectEngine: Nieprawidłowy element SVG podczas tworzenia');
    }
    
    this.svgElement = svgElement;
    this.effectModules = new Map();
    this.activeEffects = [];
    this.timeline = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.animationFrame = null;
  }

  // Rejestrowanie modułów efektów
  registerEffectModule(name, module) {
    // Sprawdź, czy SVG element jest dostępny przed inicjalizacją modułu
    if (!this.svgElement) {
      console.warn(`EffectEngine: Nie można zarejestrować modułu ${name} - brak elementu SVG`);
      return;
    }

    try {
      this.effectModules.set(name, module);
      module.initialize(this.svgElement);
      console.log(`📦 Zarejestrowano moduł efektów: ${name}`);
    } catch (error) {
      console.error(`❌ Błąd podczas rejestracji modułu ${name}:`, error);
    }
  }

  // Aplikowanie efektów do elementów
  applyEffects(effects, elements) {
    // Zatrzymaj poprzednie efekty
    this.clearActiveEffects();

    effects.forEach(effect => {
      const module = this.effectModules.get(effect.module);
      if (module) {
        // Filtruj elementy na podstawie selektora efektu
        const targetElements = this.selectElements(elements, effect.selector);
        
        if (targetElements.length > 0) {
          const appliedEffect = module.applyEffect(effect.type, targetElements, effect.params);
          this.activeEffects.push({
            id: `${effect.module}-${effect.type}-${Date.now()}`,
            module: effect.module,
            type: effect.type,
            effect: appliedEffect,
            elements: targetElements
          });
          
          console.log(`✨ Zastosowano efekt ${effect.module}.${effect.type} do ${targetElements.length} elementów`);
        }
      }
    });
  }

  // Selekcja elementów na podstawie kryteriów
  selectElements(elements, selector) {
    if (!selector) return elements;

    let filtered = elements;

    // Filtruj po kategorii
    if (selector.category) {
      filtered = filtered.filter(el => el.category === selector.category);
    }

    // Filtruj po złożoności
    if (selector.complexity) {
      const { min = 1, max = 10 } = selector.complexity;
      filtered = filtered.filter(el => el.complexity >= min && el.complexity <= max);
    }

    // Filtruj po kolorze
    if (selector.color) {
      const { target, tolerance = 50 } = selector.color;
      filtered = filtered.filter(el => {
        return el.colors.some(color => {
          try {
            const distance = chroma.deltaE(target, color.hex);
            return distance < tolerance;
          } catch (e) {
            return false;
          }
        });
      });
    }

    // Filtruj po rozmiarze
    if (selector.size) {
      const { min = 0, max = Infinity } = selector.size;
      filtered = filtered.filter(el => {
        const area = el.bbox.width * el.bbox.height;
        return area >= min && area <= max;
      });
    }

    // Losowy wybór
    if (selector.random && typeof selector.random === 'number') {
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      filtered = shuffled.slice(0, selector.random);
    }

    // Procent elementów
    if (selector.percentage && typeof selector.percentage === 'number') {
      const count = Math.floor(filtered.length * (selector.percentage / 100));
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      filtered = shuffled.slice(0, count);
    }

    return filtered;
  }

  // Timeline management
  playTimeline(timelineSteps) {
    this.timeline = timelineSteps;
    this.isPlaying = true;
    this.currentTime = 0;
    this.duration = this.calculateTimelineDuration(timelineSteps);
    
    this.startTimelineLoop();
    console.log(`▶️ Odtwarzanie timeline (${this.duration}s)`);
  }

  pauseTimeline() {
    this.isPlaying = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    console.log(`⏸️ Timeline zatrzymany`);
  }

  stopTimeline() {
    this.pauseTimeline();
    this.currentTime = 0;
    this.clearActiveEffects();
    console.log(`⏹️ Timeline zatrzymany i zresetowany`);
  }

  startTimelineLoop() {
    const startTime = performance.now();
    
    const loop = (timestamp) => {
      if (!this.isPlaying) return;
      
      const elapsed = (timestamp - startTime) / 1000; // Convert to seconds
      this.currentTime = elapsed;
      
      // Wykonaj kroki timeline
      this.executeTimelineStep(elapsed);
      
      // Kontynuuj loop jeśli nie skończył się timeline
      if (elapsed < this.duration) {
        this.animationFrame = requestAnimationFrame(loop);
      } else {
        this.onTimelineComplete();
      }
    };
    
    this.animationFrame = requestAnimationFrame(loop);
  }

  executeTimelineStep(currentTime) {
    if (!this.timeline) return;
    
    this.timeline.forEach(step => {
      const { startTime, duration, effects, elements } = step;
      
      // Sprawdź czy krok powinien być aktywny
      if (currentTime >= startTime && currentTime <= startTime + duration) {
        const progress = (currentTime - startTime) / duration;
        
        // Wykonaj efekty dla tego kroku
        effects.forEach(effect => {
          const module = this.effectModules.get(effect.module);
          if (module && module.updateEffect) {
            module.updateEffect(effect.id, progress, effect.params);
          }
        });
      }
    });
  }

  calculateTimelineDuration(timelineSteps) {
    let maxDuration = 0;
    
    timelineSteps.forEach(step => {
      const endTime = step.startTime + step.duration;
      if (endTime > maxDuration) {
        maxDuration = endTime;
      }
    });
    
    return maxDuration;
  }

  onTimelineComplete() {
    this.isPlaying = false;
    console.log(`🏁 Timeline zakończony`);
  }

  // Zatrzymanie wszystkich aktywnych efektów
  clearActiveEffects() {
    this.activeEffects.forEach(effect => {
      const module = this.effectModules.get(effect.module);
      if (module && module.clearEffect) {
        module.clearEffect(effect.effect);
      }
    });
    
    this.activeEffects = [];
  }

  // Helper function to safely import libraries
  async safeImportGif() {
    try {
      // Try to import gif.js with proper error handling
      const gifModule = await import('gif.js');
      return gifModule.default || gifModule;
    } catch (error) {
      console.error('❌ Błąd podczas importu gif.js:', error);
      // Fallback - try to use global GIF if available
      if (window.GIF) {
        return window.GIF;
      }
      throw new Error('Nie można załadować biblioteki gif.js. Sprawdź czy jest poprawnie zainstalowana.');
    }
  }

  async safeImportHtml2Canvas() {
    try {
      // Try to import html2canvas with proper error handling
      const html2canvasModule = await import('html2canvas');
      return html2canvasModule.default || html2canvasModule;
    } catch (error) {
      console.error('❌ Błąd podczas importu html2canvas:', error);
      // Fallback - try to use global html2canvas if available
      if (window.html2canvas) {
        return window.html2canvas;
      }
      throw new Error('Nie można załadować biblioteki html2canvas. Sprawdź czy jest poprawnie zainstalowana.');
    }
  }

  async createGIF(settings) {
    const GIF = await this.safeImportGif();
    
    // Try with workers first
    try {
      return new GIF({
        workers: 2,
        quality: settings.quality,
        width: settings.width,
        height: settings.height,
        repeat: settings.repeat,
        workerScript: '/gif.worker.js'
      });
    } catch (workerError) {
      console.warn('⚠️ Worker nie załadował się, używam fallback bez worker\'ów:', workerError);
      // Fallback without workers
      return new GIF({
        workers: 0, // No workers
        quality: settings.quality,
        width: settings.width,
        height: settings.height,
        repeat: settings.repeat
      });
    }
  }

  // Export funkcjonalności
  async exportAsGIF(options = {}) {
    console.log('🎬 Export do GIF...');
    
    const {
      width = 800,
      height = 600,
      duration = 3000,
      fps = 15,
      quality = 10
    } = options;

    try {
      // Create GIF with safe worker loading
      const gif = await this.createGIF({
        quality: quality,
        width: width,
        height: height,
        repeat: 0
      });

      // Create a temporary canvas for rendering
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      const frameDuration = 1000 / fps;
      const totalFrames = Math.floor(duration / frameDuration);
      
      console.log(`📊 Renderowanie ${totalFrames} klatek...`);

      for (let frame = 0; frame < totalFrames; frame++) {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Set white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        try {
          // Safe import and use html2canvas to capture SVG
          const html2canvas = await this.safeImportHtml2Canvas();
          const svgCanvas = await html2canvas(this.svgElement, {
            canvas: canvas,
            width: width,
            height: height,
            backgroundColor: '#ffffff',
            scale: 1,
            logging: false
          });

          // Add frame to GIF
          gif.addFrame(svgCanvas, { delay: frameDuration });
          
          // Update progress if callback provided
          if (options.onProgress) {
            options.onProgress((frame + 1) / totalFrames);
          }

          // Small delay to allow animations to progress
          await new Promise(resolve => setTimeout(resolve, frameDuration / 10));
          
        } catch (frameError) {
          console.warn(`⚠️ Błąd renderowania klatki ${frame}:`, frameError);
        }
      }

      return new Promise((resolve, reject) => {
        gif.on('finished', (blob) => {
          console.log('✅ Export GIF zakończony pomyślnie!');
          resolve(blob);
        });

        gif.on('error', (error) => {
          console.error('❌ Błąd eksportu GIF:', error);
          reject(error);
        });

        gif.render();
      });

    } catch (error) {
      console.error('❌ Błąd podczas eksportu GIF:', error);
      throw error;
    }
  }

  async exportAsMP4(options = {}) {
    console.log('🎬 Export do MP4...');
    
    const {
      width = 800,
      height = 600,
      duration = 3000,
      fps = 30,
      mimeType = 'video/mp4'
    } = options;

    try {
      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        throw new Error('MediaRecorder API nie jest obsługiwana w tej przeglądarce');
      }

      // Create a temporary canvas for recording
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Get canvas stream
      const stream = canvas.captureStream(fps);
      
      // Check MIME type support
      const supportedMimeType = MediaRecorder.isTypeSupported(mimeType) 
        ? mimeType 
        : MediaRecorder.isTypeSupported('video/webm') 
          ? 'video/webm' 
          : 'video/webm;codecs=vp8';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: supportedMimeType,
        videoBitsPerSecond: 2500000
      });

      const chunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      return new Promise((resolve, reject) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: supportedMimeType });
          console.log('✅ Export MP4 zakończony pomyślnie!');
          resolve(blob);
        };

        mediaRecorder.onerror = (error) => {
          console.error('❌ Błąd eksportu MP4:', error);
          reject(error);
        };

        // Start recording
        mediaRecorder.start();

        // Animation loop for recording
        const startTime = Date.now();
        const animate = async () => {
          const elapsed = Date.now() - startTime;
          
          if (elapsed < duration) {
            // Clear canvas
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);

            try {
              // Safe import and render SVG to canvas using html2canvas
              const html2canvas = await this.safeImportHtml2Canvas();
              await html2canvas(this.svgElement, {
                canvas: canvas,
                width: width,
                height: height,
                backgroundColor: '#ffffff',
                scale: 1,
                logging: false
              });
            } catch (renderError) {
              console.warn('⚠️ Błąd renderowania klatki:', renderError);
            }

            // Update progress
            if (options.onProgress) {
              options.onProgress(elapsed / duration);
            }

            requestAnimationFrame(animate);
          } else {
            // Stop recording
            mediaRecorder.stop();
          }
        };

        animate();
      });

    } catch (error) {
      console.error('❌ Błąd podczas eksportu MP4:', error);
      throw error;
    }
  }

  async exportAsWebGL(options = {}) {
    console.log('🎬 Export do WebGL...');
    
    const {
      format = 'json',
      includeShaders = true,
      includeAnimations = true
    } = options;

    try {
      // Create WebGL export data structure
      const webglData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        format: 'webgl-scene',
        data: {
          scene: {
            background: '#000000',
            camera: {
              type: 'orthographic',
              left: -1,
              right: 1,
              top: 1,
              bottom: -1,
              near: 0.1,
              far: 1000
            }
          },
          objects: [],
          materials: [],
          effects: []
        }
      };

      // Convert SVG elements to WebGL-compatible format
      const svgElements = this.svgElement.querySelectorAll('*');
      
      svgElements.forEach((element, index) => {
        if (element.tagName) {
          const elementData = {
            id: `element_${index}`,
            type: this.getWebGLElementType(element.tagName),
            geometry: this.extractGeometry(element),
            material: this.extractMaterial(element),
            transform: this.extractTransform(element)
          };

          webglData.data.objects.push(elementData);
        }
      });

      // Include active effects if requested
      if (includeAnimations && this.activeEffects.length > 0) {
        webglData.data.effects = this.activeEffects.map(effect => ({
          id: effect.id,
          type: effect.type,
          module: effect.module,
          params: effect.effect?.params || {},
          elements: effect.elements.map(el => el.id || `element_${Array.from(svgElements).indexOf(el)}`)
        }));
      }

      // Include shader information if requested
      if (includeShaders) {
        webglData.data.shaders = {
          vertex: this.generateVertexShader(),
          fragment: this.generateFragmentShader()
        };
      }

      console.log('✅ Export WebGL zakończony pomyślnie!');
      
      if (format === 'json') {
        const jsonString = JSON.stringify(webglData, null, 2);
        return new Blob([jsonString], { type: 'application/json' });
      } else {
        return webglData;
      }

    } catch (error) {
      console.error('❌ Błąd podczas eksportu WebGL:', error);
      throw error;
    }
  }

  // Helper methods for WebGL export
  getWebGLElementType(tagName) {
    const typeMap = {
      'rect': 'quad',
      'circle': 'circle', 
      'ellipse': 'ellipse',
      'line': 'line',
      'polyline': 'polyline',
      'polygon': 'polygon',
      'path': 'path',
      'text': 'text'
    };
    return typeMap[tagName.toLowerCase()] || 'generic';
  }

  extractGeometry(element) {
    const tagName = element.tagName.toLowerCase();
    
    switch (tagName) {
      case 'rect':
        return {
          width: parseFloat(element.getAttribute('width') || 0),
          height: parseFloat(element.getAttribute('height') || 0)
        };
      case 'circle':
        return {
          radius: parseFloat(element.getAttribute('r') || 0)
        };
      case 'ellipse':
        return {
          radiusX: parseFloat(element.getAttribute('rx') || 0),
          radiusY: parseFloat(element.getAttribute('ry') || 0)
        };
      case 'line':
        return {
          x1: parseFloat(element.getAttribute('x1') || 0),
          y1: parseFloat(element.getAttribute('y1') || 0),
          x2: parseFloat(element.getAttribute('x2') || 0),
          y2: parseFloat(element.getAttribute('y2') || 0)
        };
      default:
        return {};
    }
  }

  extractMaterial(element) {
    return {
      fill: element.getAttribute('fill') || '#000000',
      stroke: element.getAttribute('stroke') || 'none',
      strokeWidth: parseFloat(element.getAttribute('stroke-width') || 0),
      opacity: parseFloat(element.getAttribute('opacity') || 1)
    };
  }

  extractTransform(element) {
    const transform = element.getAttribute('transform') || '';
    return {
      x: parseFloat(element.getAttribute('x') || 0),
      y: parseFloat(element.getAttribute('y') || 0),
      transform: transform
    };
  }

  generateVertexShader() {
    return `
      attribute vec3 position;
      attribute vec2 uv;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
  }

  generateFragmentShader() {
    return `
      precision mediump float;
      uniform vec3 color;
      uniform float opacity;
      varying vec2 vUv;
      
      void main() {
        gl_FragColor = vec4(color, opacity);
      }
    `;
  }

  // Getters dla stanu
  getActiveEffectsCount() {
    return this.activeEffects.length;
  }

  getTimelineProgress() {
    if (!this.duration) return 0;
    return Math.min(this.currentTime / this.duration, 1);
  }

  getRegisteredModules() {
    return Array.from(this.effectModules.keys());
  }
}

export default EffectEngine; 