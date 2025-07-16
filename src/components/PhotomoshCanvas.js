import React, { useRef, useEffect, forwardRef, useImperativeHandle, useCallback, useMemo } from 'react';
import * as Effects from './effects/index.js';

const PhotomoshCanvas = forwardRef(({ 
  image, 
  effects = [], 
  animationSettings = { duration: 5.0, isPlaying: false, currentTime: 0, speed: 1.0, loop: true },
  onAnimationTimeUpdate 
}, ref) => {
  const canvasRef = useRef();
  const ctxRef = useRef();
  const imageRef = useRef();
  const originalImageData = useRef();
  const animationFrameRef = useRef();
  const animationStartTime = useRef(0);
  const lastRenderTime = useRef(0); // NOWE: czas ostatniego renderowania
  const isAnimating = useRef(false);
  const lastAppliedTime = useRef(-1); // NOWE: zapobiega wielokrotnym wywołaniom

  // Detect animated effects
  const hasTemporalEffects = useMemo(() => {
    return effects.some(effect => {
      const effectInfo = Effects.EFFECT_REGISTRY[effect.name];
      return effectInfo && effectInfo.animated;
    });
  }, [effects]);

  const animatedEffects = useMemo(() => 
    effects.filter(effect => {
      const effectInfo = Effects.EFFECT_REGISTRY[effect.name];
      return effectInfo && effectInfo.animated;
    }),
    [effects]
  );

  // Load image onto canvas
  const loadImage = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctxRef.current = ctx;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Store original image data
      originalImageData.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      imageRef.current = img;
      
      // Apply effects after image loads
      if (hasTemporalEffects) {
        applyEffectsWithTime(animationSettings.currentTime);
      } else {
        applyEffects();
      }
    };
    img.src = image;
  }, [image, hasTemporalEffects, animationSettings.currentTime]);

  // Apply static effects (no time parameter)
  const applyEffects = useCallback(() => {
    if (!ctxRef.current || !originalImageData.current) return;
    
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    
    // Reset to original
    ctx.putImageData(originalImageData.current, 0, 0);
    
    // Apply only static effects
    effects.forEach((effect) => {
      const params = effect.params || {};
      
      try {
        const effectInfo = Effects.EFFECT_REGISTRY[effect.name];
        
        if (effectInfo && !effectInfo.animated) {
          const effectFunction = Effects[effectInfo.func];
          
          if (effectFunction) {
            console.log(`🎨 Applying static effect: ${effect.name}`);
            effectFunction(canvas, ctx, params);
          } else {
            console.warn(`⚠️ Effect function not implemented: ${effectInfo.func}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error applying effect ${effect.name}:`, error);
      }
    });
  }, [effects]);

  // Apply effects with time for animation - POPRAWIONA LOGIKA
  const applyEffectsWithTime = useCallback((timeInSeconds) => {
    if (!ctxRef.current || !originalImageData.current) return;
    
    // POPRAWKA: Zapobiega wielokrotnym wywołaniom z tym samym czasem
    if (Math.abs(timeInSeconds - lastAppliedTime.current) < 0.01) {
      return;
    }
    lastAppliedTime.current = timeInSeconds;
    
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    
    console.log(`🎨 applyEffectsWithTime called with time: ${timeInSeconds.toFixed(2)}s`);
    console.log(`🎨 Effects to apply:`, effects.map(e => ({ name: e.name, animated: Effects.EFFECT_REGISTRY[e.name]?.animated })));
    
    // Reset to original
    ctx.putImageData(originalImageData.current, 0, 0);
    
    // Apply ALL effects in correct order
    effects.forEach((effect) => {
      const params = effect.params || {};
      
      try {
        const effectInfo = Effects.EFFECT_REGISTRY[effect.name];
        
        if (effectInfo) {
          const isAnimated = effectInfo.animated;
          
          console.log(`🎨 Processing effect: ${effect.name}, animated: ${isAnimated}`);
          
          if (isAnimated && effectInfo.funcWithTime) {
            // Use animated version with time
            const timeFunction = Effects[effectInfo.funcWithTime];
            if (timeFunction) {
              const adjustedTime = timeInSeconds * animationSettings.speed;
              console.log(`🎬 Applying animated effect: ${effect.name} at time ${adjustedTime.toFixed(2)}s`);
              timeFunction(canvas, ctx, params, adjustedTime);
            } else {
              console.warn(`⚠️ Animated function not found: ${effectInfo.funcWithTime}`);
              // Fallback to static version
              const staticFunction = Effects[effectInfo.func];
              if (staticFunction) {
                staticFunction(canvas, ctx, params);
              }
            }
          } else {
            // Use static version for non-animated effects
            const effectFunction = Effects[effectInfo.func];
            if (effectFunction) {
              console.log(`🎨 Applying static effect: ${effect.name}`);
              effectFunction(canvas, ctx, params);
            }
          }
        } else {
          console.warn(`⚠️ Effect info not found for: ${effect.name}`);
        }
      } catch (error) {
        console.error(`❌ Error applying effect ${effect.name}:`, error);
      }
    });
  }, [effects, animationSettings.speed]);

  // POPRAWIONA: Główna pętla animacji - usunięte wielokrotne useEffect
  useEffect(() => {
    // Cleanup previous animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Jeśli nie ma efektów animowanych, zatrzymaj animację
    if (!hasTemporalEffects) {
      isAnimating.current = false;
      // Aplikuj tylko statyczne efekty
      if (originalImageData.current) {
        applyEffects();
      }
      return;
    }

    if (animationSettings.isPlaying) {
      isAnimating.current = true;
      animationStartTime.current = performance.now();
      lastRenderTime.current = animationSettings.currentTime; // Synchronizuj z aktualnym czasem

      const animate = (timestamp) => {
        if (!isAnimating.current || !animationSettings.isPlaying) {
          return;
        }
        
        // POPRAWIONA LOGIKA OBLICZANIA CZASU
        const elapsed = (timestamp - animationStartTime.current) / 1000; // w sekundach
        let currentTime = lastRenderTime.current + elapsed * animationSettings.speed;
        
        // POPRAWIONA LOGIKA ZAPĘTLANIA
        if (animationSettings.loop) {
          // Zapętlenie - użyj modulo
          currentTime = currentTime % animationSettings.duration;
        } else {
          // Bez zapętlenia - zatrzymaj na końcu
          if (currentTime >= animationSettings.duration) {
            currentTime = animationSettings.duration;
            isAnimating.current = false;
            
            // Powiadom rodzica o zakończeniu
            if (onAnimationTimeUpdate) {
              onAnimationTimeUpdate(currentTime);
            }
            
            // Aplikuj ostatnią klatkę
            applyEffectsWithTime(currentTime);
            return;
          }
        }
        
        // Upewnij się, że czas nie jest ujemny
        currentTime = Math.max(0, currentTime);
        
        // Powiadom rodzica o aktualnym czasie
        if (onAnimationTimeUpdate) {
          onAnimationTimeUpdate(currentTime);
        }
        
        // Aplikuj efekty z aktualnym czasem
        applyEffectsWithTime(currentTime);
        
        // Kontynuuj animację
        if (isAnimating.current && animationSettings.isPlaying) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      if (originalImageData.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    } else {
      // Animacja zatrzymana - renderuj na aktualnym czasie
      if (originalImageData.current) {
        applyEffectsWithTime(animationSettings.currentTime);
      }
    }

    return () => {
      isAnimating.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [hasTemporalEffects, animationSettings.isPlaying, animationSettings.speed, animationSettings.duration, animationSettings.loop, applyEffectsWithTime, onAnimationTimeUpdate]);

  // POPRAWIONA: Obsługa ręcznej zmiany czasu (np. przez slider) - tylko gdy animacja zatrzymana
  useEffect(() => {
    if (!animationSettings.isPlaying && hasTemporalEffects && originalImageData.current) {
      // Reset last applied time to force re-render
      lastAppliedTime.current = -1;
      applyEffectsWithTime(animationSettings.currentTime);
    }
  }, [animationSettings.currentTime, hasTemporalEffects, animationSettings.isPlaying, applyEffectsWithTime]);

  // Load image when component mounts or image changes
  useEffect(() => {
    loadImage();
  }, [loadImage]);

  // POPRAWIONA: Obsługa zmian efektów - tylko dla statycznych efektów
  useEffect(() => {
    if (originalImageData.current && !hasTemporalEffects) {
      applyEffects();
    }
  }, [effects, applyEffects, hasTemporalEffects]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      isAnimating.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Expose canvas operations via ref
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    getImageData: () => {
      if (ctxRef.current && canvasRef.current) {
        return ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      return null;
    },
    downloadImage: (filename = 'photomosh.png') => {
      if (canvasRef.current) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvasRef.current.toDataURL();
        link.click();
      }
    },
    resetToOriginal: () => {
      if (ctxRef.current && originalImageData.current) {
        ctxRef.current.putImageData(originalImageData.current, 0, 0);
      }
    },
    applyEffectsManually: () => {
      if (hasTemporalEffects) {
        applyEffectsWithTime(animationSettings.currentTime);
      } else {
        applyEffects();
      }
    },
    // NOWE: Funkcja do zastosowania efektów z określonym czasem
    applyEffectsWithTime: (time) => {
      if (hasTemporalEffects) {
        applyEffectsWithTime(time);
      } else {
        applyEffects();
      }
    }
  }));

  return (
    <div className="photomosh-canvas-container">
      <canvas 
        ref={canvasRef} 
        className="photomosh-canvas"
        style={{
          maxWidth: '100%',
          height: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
      {hasTemporalEffects && (
        <div className="animation-indicator">
          🎬 {animationSettings.isPlaying ? 'Animacja odtwarzana' : 'Animacja wstrzymana'} 
          ({animatedEffects.length} efekt{animatedEffects.length > 1 ? 'ów' : ''})
          <br />
          <small>⏱️ {animationSettings.currentTime.toFixed(1)}s / {animationSettings.duration.toFixed(1)}s</small>
        </div>
      )}
    </div>
  );
});

PhotomoshCanvas.displayName = 'PhotomoshCanvas';

export default PhotomoshCanvas; 