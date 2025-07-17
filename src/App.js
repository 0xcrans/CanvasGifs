import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import PhotomoshCanvas from './components/PhotomoshCanvas.js';
import EffectButtons from './components/EffectButtons.js';
import './App.css';
import { EFFECT_REGISTRY } from './components/effects/index.js';

function App() {
  // Single image mode state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [currentEffects, setCurrentEffects] = useState([]);
  const [error, setError] = useState(null);
  
  // NOWE: Kontrole animacji z poprawioną synchronizacją
  const [animationSettings, setAnimationSettings] = useState({
    duration: 5.0,     // długość animacji w sekundach
    isPlaying: false,  // czy animacja jest odtwarzana
    currentTime: 0,    // aktualny czas animacji
    loop: true,        // czy zapętlać animację
    speed: 1.0         // prędkość animacji
  });
  
  // NOWE: Opcje renderowania
  const [renderOptions, setRenderOptions] = useState({
    format: 'auto',    // 'auto', 'png', 'gif'
    quality: 'high',   // 'low', 'medium', 'high'
    fps: 15,          // dla GIF
    resolution: 'original' // 'original', 'medium', 'low'
  });
  
  // NOWE: Stan postępu renderowania
  const [renderProgress, setRenderProgress] = useState({
    isRendering: false,
    progress: 0,
    message: ''
  });
  
  const canvasRef = useRef(null);
  
  // PERFORMANCE OPTIMIZATION: Debounced updates
  const updateTimeoutRef = useRef(null);
  const lastTimeUpdate = useRef(0); // NOWE: zapobiega nadmiarowym aktualizacjom

  // POPRAWIONA: Funkcje do kontroli animacji z lepszą synchronizacją
  const playAnimation = useCallback(() => {
    setAnimationSettings(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pauseAnimation = useCallback(() => {
    setAnimationSettings(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const resetAnimation = useCallback(() => {
    setAnimationSettings(prev => ({ 
      ...prev, 
      isPlaying: false, 
      currentTime: 0 
    }));
  }, []);

  const updateAnimationSettings = useCallback((newSettings) => {
    setAnimationSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // POPRAWIONA: Obsługa aktualizacji czasu z debouncing
  const handleAnimationTimeUpdate = useCallback((time) => {
    // Zapobiega nadmiarowym aktualizacjom
    if (Math.abs(time - lastTimeUpdate.current) < 0.05) {
      return;
    }
    lastTimeUpdate.current = time;
    
    setAnimationSettings(prev => ({ ...prev, currentTime: time }));
  }, []);

  // Single image mode handlers
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setCurrentEffects([]); // Reset effects when new image is loaded
        setError(null); // Clear any previous errors
      };
      reader.readAsDataURL(file);
    }
  };

  // NOWE: Referencja do ukrytego input file
  const fileInputRef = useRef(null);

  // NOWE: Funkcja do otwierania dialogu wyboru pliku
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Effect management functions
  const addEffect = useCallback((effectName, params = {}) => {
    const newEffect = {
      id: `${effectName}-${Date.now()}`,
      name: effectName,
      params: params
    };
    
    setCurrentEffects(prev => [...prev, newEffect]);
  }, []);

  const updateEffect = useCallback((effectId, paramName, value) => {
    setCurrentEffects(prev => 
      prev.map(effect => 
        effect.id === effectId 
          ? { ...effect, params: { ...effect.params, [paramName]: value } }
          : effect
      )
    );
  }, []);

  const removeEffect = useCallback((effectId) => {
    setCurrentEffects(prev => prev.filter(effect => effect.id !== effectId));
  }, []);

  const reorderEffects = useCallback((fromIndex, toIndex) => {
    setCurrentEffects(prev => {
      const newEffects = [...prev];
      const [movedEffect] = newEffects.splice(fromIndex, 1);
      newEffects.splice(toIndex, 0, movedEffect);
      return newEffects;
    });
  }, []);

  const clearEffects = useCallback(() => {
    setCurrentEffects([]);
  }, []);

  const downloadImage = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.downloadImage();
    }
  }, []);

  // Check if we have temporal effects - PRZENIESIONE PRZED renderWithOptions
  const hasTemporalEffects = useMemo(() => {
    const temporalEffects = currentEffects.filter(effect => {
      const effectInfo = EFFECT_REGISTRY[effect.name];
      return effectInfo && effectInfo.animated;
    });
    
    console.log('🎬 Temporal effects detected:', temporalEffects.map(e => e.name));
    console.log('🎬 Total effects:', currentEffects.length);
    console.log('🎬 Has temporal effects:', temporalEffects.length > 0);
    
    return temporalEffects.length > 0;
  }, [currentEffects]);

  // NOWE: Funkcja renderowania z opcjami
  const renderWithOptions = useCallback(async () => {
    if (!canvasRef.current) {
      console.error('❌ Canvas ref nie jest dostępny');
      setError('Błąd: Canvas nie jest dostępny');
      return;
    }

    // Ustaw stan renderowania
    setRenderProgress({
      isRendering: true,
      progress: 0,
      message: 'Przygotowywanie renderowania...'
    });

    const canvas = canvasRef.current.getCanvas();
    
    // Sprawdź czy canvas jest prawidłowym elementem
    if (!canvas || typeof canvas.getContext !== 'function') {
      console.error('❌ Canvas nie jest dostępny lub nie jest prawidłowym elementem');
      console.log('Canvas element:', canvas);
      console.log('Canvas type:', typeof canvas);
      setError('Błąd: Canvas nie jest dostępny');
      setRenderProgress({
        isRendering: false,
        progress: 0,
        message: ''
      });
      return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Sprawdź czy canvas ma wymiary
    if (!canvas.width || !canvas.height) {
      console.error('❌ Canvas nie ma wymiarów');
      setError('Błąd: Canvas nie ma wymiarów');
      setRenderProgress({
        isRendering: false,
        progress: 0,
        message: ''
      });
      return;
    }
    
    console.log('✅ Canvas jest dostępny:', canvas.width, 'x', canvas.height);
    
    // Określ format na podstawie efektów i opcji użytkownika
    let targetFormat = renderOptions.format;
    if (targetFormat === 'auto') {
      targetFormat = hasTemporalEffects ? 'gif' : 'png';
    }

    // Określ rozdzielczość
    let targetWidth = canvas.width;
    let targetHeight = canvas.height;
    
    if (renderOptions.resolution !== 'original') {
      const scale = renderOptions.resolution === 'medium' ? 0.7 : 0.5;
      targetWidth = Math.floor(canvas.width * scale);
      targetHeight = Math.floor(canvas.height * scale);
    }

    // Określ jakość
    let quality = 1.0;
    if (renderOptions.quality === 'medium') quality = 0.8;
    else if (renderOptions.quality === 'low') quality = 0.6;

    try {
      if (targetFormat === 'gif' && hasTemporalEffects) {
        // Renderowanie do GIF z animacją
        setRenderProgress(prev => ({ ...prev, message: 'Renderowanie do GIF...' }));
        
        // Importuj gif.js
        const GIF = await import('gif.js').then(module => module.default || module);
        
        // Utwórz GIF z poprawionymi ustawieniami
        const gif = new GIF({
          quality: Math.floor(quality * 10), // gif.js używa 1-10
          width: targetWidth,
          height: targetHeight,
          workers: 2, // Użyj worker'ów
          workerScript: '/gif.worker.js',
          repeat: 0, // Zapętlaj nieskończenie
          debug: false // Wyłącz debug dla lepszej wydajności
        });

        const frameDuration = Math.floor(1000 / renderOptions.fps); // w milisekundach
        const totalFrames = Math.floor(animationSettings.duration * renderOptions.fps);
        
        console.log(`🎬 Będzie renderowane ${totalFrames} klatek z ${frameDuration}ms opóźnieniem każda`);
        
        setRenderProgress(prev => ({ 
          ...prev, 
          message: `Renderowanie ${totalFrames} klatek...` 
        }));

        // Utwórz tymczasowy canvas do skalowania (tylko raz)
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = targetWidth;
        tempCanvas.height = targetHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Ustawienia wysokiej jakości dla skalowania
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';

        // POPRAWIONA pętla renderowania klatek
        for (let frame = 0; frame < totalFrames; frame++) {
          // Oblicz czas dla tej klatki
          const timeInSeconds = (frame / renderOptions.fps) % animationSettings.duration;
          
          console.log(`🎬 Rendering frame ${frame + 1}/${totalFrames} at time ${timeInSeconds.toFixed(2)}s`);
          
          // Zastosuj efekty z czasem
          if (canvasRef.current && canvasRef.current.applyEffectsWithTime) {
            console.log(`🎨 Applying effects with time: ${timeInSeconds.toFixed(2)}s`);
            canvasRef.current.applyEffectsWithTime(timeInSeconds);
          } else {
            console.warn('⚠️ applyEffectsWithTime not available');
          }

          // WAŻNE: Poczekaj na renderowanie efektów
          await new Promise(resolve => {
            requestAnimationFrame(() => {
              // Dodatkowe opóźnienie na renderowanie
              setTimeout(resolve, 100); // Zwiększone z 50ms do 100ms
            });
          });

          // Pobierz aktualny canvas po zastosowaniu efektów
          const currentCanvas = canvasRef.current.getCanvas();
          console.log(`📐 Canvas size: ${currentCanvas.width}x${currentCanvas.height}`);

          // KLUCZOWA ZMIANA: Używaj canvas bezpośrednio
          try {
            // Wyczyść tymczasowy canvas
            tempCtx.clearRect(0, 0, targetWidth, targetHeight);
            
            // Skopiuj obecny canvas na tymczasowy (z odpowiednim skalowaniem)
            tempCtx.drawImage(currentCanvas, 0, 0, targetWidth, targetHeight);
            
            // BEZPOŚREDNIE dodanie canvas do GIF - to jest najniezawodniejsza metoda
            gif.addFrame(tempCanvas, { 
              delay: frameDuration,
              copy: true // Ważne: skopiuj canvas
            });

            console.log(`✅ Frame ${frame + 1} added to GIF successfully`);

          } catch (frameError) {
            console.error(`❌ Błąd dodawania klatki ${frame + 1}:`, frameError);
            
            // Fallback 1: Spróbuj z oryginalnym canvas
            try {
              gif.addFrame(currentCanvas, { delay: frameDuration });
              console.log(`⚠️ Frame ${frame + 1} added via fallback 1 (original canvas)`);
            } catch (fallback1Error) {
              console.error(`❌ Fallback 1 failed for frame ${frame + 1}:`, fallback1Error);
              
              // Fallback 2: Utwórz nowy canvas i skopiuj na niego
              try {
                const fallbackCanvas = document.createElement('canvas');
                fallbackCanvas.width = targetWidth;
                fallbackCanvas.height = targetHeight;
                const fallbackCtx = fallbackCanvas.getContext('2d');
                
                // Białe tło
                fallbackCtx.fillStyle = '#FFFFFF';
                fallbackCtx.fillRect(0, 0, targetWidth, targetHeight);
                
                // Skopiuj obraz
                fallbackCtx.drawImage(currentCanvas, 0, 0, targetWidth, targetHeight);
                
                gif.addFrame(fallbackCanvas, { delay: frameDuration });
                console.log(`⚠️ Frame ${frame + 1} added via fallback 2 (new canvas)`);
              } catch (fallback2Error) {
                console.error(`❌ All fallbacks failed for frame ${frame + 1}:`, fallback2Error);
                
                // Ostateczny fallback: dodaj pustą klatkę
                const emptyCanvas = document.createElement('canvas');
                emptyCanvas.width = targetWidth;
                emptyCanvas.height = targetHeight;
                const emptyCtx = emptyCanvas.getContext('2d');
                emptyCtx.fillStyle = '#FFFFFF';
                emptyCtx.fillRect(0, 0, targetWidth, targetHeight);
                
                gif.addFrame(emptyCanvas, { delay: frameDuration });
                console.log(`⚠️ Frame ${frame + 1} added as empty frame (last resort)`);
              }
            }
          }

          // Aktualizuj postęp
          const progress = (frame + 1) / totalFrames;
          setRenderProgress(prev => ({ 
            ...prev, 
            progress: progress,
            message: `Klatka ${frame + 1}/${totalFrames} (${Math.round(progress * 100)}%)`
          }));
          
          // Małe opóźnienie między klatkami (zapobiega przeciążeniu)
          await new Promise(resolve => setTimeout(resolve, 10));
        }

        // Renderuj GIF
        setRenderProgress(prev => ({ ...prev, message: 'Finalizowanie GIF...' }));
        
        return new Promise((resolve, reject) => {
          // Timeout dla renderowania (zapobiega zawieszeniu)
          const renderTimeout = setTimeout(() => {
            console.error('❌ Timeout renderowania GIF');
            reject(new Error('Timeout renderowania GIF - spróbuj z mniejszą liczbą klatek'));
          }, 60000); // 60 sekund timeout

          gif.on('finished', (blob) => {
            clearTimeout(renderTimeout);
            console.log('✅ Renderowanie GIF zakończone!');
            console.log(`📊 Rozmiar GIF: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
            
            // Sprawdź czy GIF nie jest podejrzanie mały
            if (blob.size < 1000) {
              console.warn('⚠️ GIF jest bardzo mały - może być uszkodzony');
            }
            
            // Pobierz plik
            const link = document.createElement('a');
            link.download = `photomosh_${Date.now()}.gif`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            
            setRenderProgress({
              isRendering: false,
              progress: 0,
              message: ''
            });
            
            resolve(blob);
          });

          gif.on('error', (error) => {
            clearTimeout(renderTimeout);
            console.error('❌ Błąd renderowania GIF:', error);
            setRenderProgress({
              isRendering: false,
              progress: 0,
              message: ''
            });
            reject(error);
          });

          // Event listener dla postępu renderowania GIF
          gif.on('progress', (progress) => {
            setRenderProgress(prev => ({ 
              ...prev, 
              progress: 0.8 + (progress * 0.2), // 80% to klatki, 20% to kompresja
              message: `Kompresowanie GIF... ${Math.round(progress * 100)}%`
            }));
          });

          console.log('🚀 Rozpoczynam renderowanie GIF...');
          console.log(`📊 Parametry: ${totalFrames} klatek, ${frameDuration}ms/klatka, ${targetWidth}x${targetHeight}px`);
          
          try {
            gif.render();
          } catch (renderError) {
            clearTimeout(renderTimeout);
            console.error('❌ Błąd podczas wywołania gif.render():', renderError);
            reject(renderError);
          }
        });
        
      } else {
        // Renderowanie do PNG
        setRenderProgress(prev => ({ ...prev, message: 'Renderowanie do PNG...' }));
        
        // Utwórz tymczasowy canvas z odpowiednią rozdzielczością
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = targetWidth;
        tempCanvas.height = targetHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Skaluj i renderuj
        tempCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
        
        // Pobierz jako PNG z odpowiednią jakością
        const dataURL = tempCanvas.toDataURL('image/png', quality);
        const link = document.createElement('a');
        link.download = `photomosh_${Date.now()}.png`;
        link.href = dataURL;
        link.click();
        
        setRenderProgress({
          isRendering: false,
          progress: 0,
          message: ''
        });
      }
      
    } catch (error) {
      console.error('❌ Błąd podczas renderowania:', error);
      setError(`Błąd renderowania: ${error.message}`);
      setRenderProgress({
        isRendering: false,
        progress: 0,
        message: ''
      });
    }
  }, [canvasRef, renderOptions, hasTemporalEffects, animationSettings.duration, animationSettings.currentTime]);

  // NOWE: Funkcja do aktualizacji opcji renderowania
  const updateRenderOptions = useCallback((newOptions) => {
    setRenderOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="App">
      {/* NOWE: Header z informacjami o Human Autonomous Agent */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">Canvas Gifs</h1>
            <p className="app-subtitle">unstable and power-hungry, but you can still have fun</p>
          </div>
          <div className="header-right">
            <div className="author-info">
              <span className="author-label">Human Autonomous Agent</span>
              <a 
                href="https://github.com/0xcrans/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="github-link"
              >
                <span className="github-icon"></span>
                Fork me on GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Zamknij</button>
        </div>
      )}

      <div className="app-content">
        {!uploadedImage ? (
          <div className="upload-area">
            <div className="upload-box">
              <h2>📸 Wgraj obraz</h2>
              <p>Wybierz JPG, PNG lub inny obraz</p>
              <button onClick={openFileDialog} className="file-input-button">
                📁 Wybierz plik obrazu
              </button>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="file-input"
                ref={fileInputRef}
              />
            </div>
          </div>
        ) : (
          <div className="editor-layout">
            <div className="canvas-area">
              <PhotomoshCanvas 
                ref={canvasRef}
                image={uploadedImage}
                effects={currentEffects}
                animationSettings={animationSettings}
                onAnimationTimeUpdate={handleAnimationTimeUpdate}
              />
              
              {/* NOWE: Wskaźnik postępu renderowania */}
              {renderProgress.isRendering && (
                <div className="render-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${renderProgress.progress * 100}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {renderProgress.message}
                  </div>
                </div>
              )}
            </div>
            
            <div className="effects-panel">
              {/* NOWE: Panel kontroli głównych z opcjami renderowania */}
              <div className="main-controls-panel">
                <h3>🎛️ Kontrola główna</h3>
                
                <div className="main-controls-grid">
                  <button 
                    onClick={() => setUploadedImage(null)} 
                    className="btn-secondary"
                  >
                    📸 Nowy obraz
                  </button>
                  
                  <button onClick={clearEffects} className="btn-secondary">
                    🗑️ Wyczyść efekty
                  </button>
                  
                  <button onClick={renderWithOptions} className="btn-primary">
                    {hasTemporalEffects ? '🎬 Pobierz GIF' : '💾 Pobierz PNG'}
                  </button>
                </div>
                
                {/* NOWE: Opcje renderowania w kontroli głównej */}
                <div className="render-options-section">
                  <h4>⚙️ Opcje renderowania</h4>
                  
                  <div className="render-options-grid">
                    <div className="render-option-group">
                      <label>Format:</label>
                      <select 
                        value={renderOptions.format}
                        onChange={(e) => updateRenderOptions({ format: e.target.value })}
                        className="render-select"
                      >
                        <option value="auto">Auto ({hasTemporalEffects ? 'GIF' : 'PNG'})</option>
                        <option value="png">PNG</option>
                        <option value="gif">GIF</option>
                      </select>
                    </div>
                    
                    <div className="render-option-group">
                      <label>Jakość:</label>
                      <select 
                        value={renderOptions.quality}
                        onChange={(e) => updateRenderOptions({ quality: e.target.value })}
                        className="render-select"
                      >
                        <option value="high">Wysoka</option>
                        <option value="medium">Średnia</option>
                        <option value="low">Niska</option>
                      </select>
                    </div>
                    
                    <div className="render-option-group">
                      <label>Rozdzielczość:</label>
                      <select 
                        value={renderOptions.resolution}
                        onChange={(e) => updateRenderOptions({ resolution: e.target.value })}
                        className="render-select"
                      >
                        <option value="original">Oryginalna</option>
                        <option value="medium">Średnia (70%)</option>
                        <option value="low">Niska (50%)</option>
                      </select>
                    </div>
                    
                    {renderOptions.format === 'gif' && (
                      <div className="render-option-group">
                        <label>FPS (GIF):</label>
                        <select 
                          value={renderOptions.fps}
                          onChange={(e) => updateRenderOptions({ fps: parseInt(e.target.value) })}
                          className="render-select"
                        >
                          <option value={10}>10 FPS</option>
                          <option value={15}>15 FPS</option>
                          <option value={20}>20 FPS</option>
                          <option value={30}>30 FPS</option>
                        </select>
                      </div>
                    )}
                  </div>
                  
                  {/* Usunięte: render-info section z przewidywanym rozmiarem */}
                </div>
              </div>
              
              {/* POPRAWIONY: Panel kontroli animacji z lepszą synchronizacją */}
              {hasTemporalEffects && (
                <div className="animation-controls">
                  <div className="animation-timeline">
                    <div className="timeline-info">
                      <span>⏱️ {animationSettings.currentTime.toFixed(1)}s / {animationSettings.duration.toFixed(1)}s</span>
                    </div>
                    
                    <div className="timeline-slider">
                      <input
                        type="range"
                        min={0}
                        max={animationSettings.duration}
                        step={0.1}
                        value={animationSettings.currentTime}
                        onChange={(e) => {
                          const newTime = parseFloat(e.target.value);
                          updateAnimationSettings({ currentTime: newTime });
                        }}
                        className="timeline-range"
                      />
                    </div>
                    
                    <div className="playback-controls">
                      <button
                        onClick={animationSettings.isPlaying ? pauseAnimation : playAnimation}
                        className="btn-secondary"
                      >
                        {animationSettings.isPlaying ? '⏸️ Pauza' : '▶️ Odtwórz'}
                      </button>
                      
                      <button onClick={resetAnimation} className="btn-secondary">
                        ⏮️ Reset
                      </button>
                    </div>
                    
                    <div className="animation-settings">
                      <div className="setting-group">
                        <label>Długość (s):</label>
                        <input
                          type="number"
                          min={1}
                          max={30}
                          step={0.5}
                          value={animationSettings.duration}
                          onChange={(e) => updateAnimationSettings({ 
                            duration: parseFloat(e.target.value) || 5.0 
                          })}
                          className="duration-input"
                        />
                      </div>
                      
                      <div className="setting-group">
                        <label>Prędkość:</label>
                        <input
                          type="range"
                          min={0.1}
                          max={3.0}
                          step={0.1}
                          value={animationSettings.speed}
                          onChange={(e) => updateAnimationSettings({ 
                            speed: parseFloat(e.target.value) 
                          })}
                          className="speed-range"
                        />
                        <span>{animationSettings.speed.toFixed(1)}x</span>
                      </div>
                      
                      <div className="setting-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={animationSettings.loop}
                            onChange={(e) => updateAnimationSettings({ 
                              loop: e.target.checked 
                            })}
                          />
                          Zapętl
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <EffectButtons 
                onEffectClick={addEffect}
                effects={currentEffects}
                onUpdateEffect={updateEffect}
                onRemoveEffect={removeEffect}
                onReorderEffects={reorderEffects}
              />
              
              <div className="active-effects-summary">
                <h3>📊 Podsumowanie ({currentEffects.length})</h3>
                <div className="effects-list">
                  {currentEffects.map(effect => (
                    <div key={effect.id} className="effect-tag">
                      {effect.name}
                    </div>
                  ))}
                </div>
                {currentEffects.length === 0 && (
                  <p className="no-effects-message">Brak aktywnych efektów</p>
                )}
                
                {/* PERFORMANCE OPTIMIZATION: Show performance tips */}
                {currentEffects.length > 5 && (
                  <div className="performance-tip">
                    💡 <strong>Wskazówka:</strong> Zbyt wiele efektów może spowalniać aplikację. 
                    Spróbuj usunąć niektóre efekty dla lepszej wydajności.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 
