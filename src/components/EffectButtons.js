import React, { useState } from 'react';
import { EFFECT_REGISTRY } from './effects/index.js';

const EffectButtons = ({ 
  onEffectClick, 
  effects = [], 
  onUpdateEffect, 
  onRemoveEffect, 
  onReorderEffects 
}) => {
  const [expandedEffects, setExpandedEffects] = useState(new Set());

  const availableEffects = [
    // 1. EFEKTY BAZOWE (Muszą być pierwsze - całkowicie zmieniają obraz)
    { name: 'Edge Detect', emoji: '🔍', description: 'Wykrywanie krawędzi', category: 'bazowe' },
    { name: 'ASCII Art', emoji: '🖥️', description: 'Zamiana na ASCII art', category: 'bazowe' },
    { name: 'Dithering', emoji: '⚫', description: 'Floyd-Steinberg dithering', category: 'bazowe' },

    // 2. EFEKTY GEOMETRYCZNE/DEFORMACJE (Zmiana pozycji pikseli)
    { name: 'Displacement', emoji: '🌊', description: 'Przemieszczenie pikseli', category: 'geometryczne' },
    { name: 'Wave', emoji: '〰️', description: 'Fale (z opcją animacji)', category: 'geometryczne' },
    { name: 'Ripple', emoji: '💧', description: 'Fale wodne (z opcją animacji)', category: 'geometryczne' },
    { name: 'Swirl', emoji: '🌀', description: 'Zakręcenie spiralne', category: 'geometryczne' },
    { name: 'Pinch', emoji: '🤏', description: 'Ściągnięcie do punktu', category: 'geometryczne' },
    { name: 'Fisheye', emoji: '🐟', description: 'Rybie oko', category: 'geometryczne' },
    { name: 'Spiral', emoji: '🐚', description: 'Spirala (z opcją animacji)', category: 'geometryczne' },
    { name: 'Vortex', emoji: '🌪️', description: 'Wir (z opcją animacji)', category: 'geometryczne' },
    { name: 'Kaleidoscope', emoji: '🔮', description: 'Kalejdoskop (z opcją animacji)', category: 'geometryczne' },
    { name: 'Mirror', emoji: '🪞', description: 'Efekt lustra', category: 'geometryczne' },
    { name: 'Pixelsort', emoji: '🎨', description: 'Sortowanie pikseli', category: 'geometryczne' },
    { name: 'Liquid Pixels', emoji: '💧', description: 'Płynne piksele', category: 'geometryczne' },
    { name: 'Morph', emoji: '🧬', description: 'Morfowanie (z opcją animacji)', category: 'geometryczne' },

    // 3. EFEKTY ARTYSTYCZNE (Stylizacja)
    { name: 'Oil Paint', emoji: '🎨', description: 'Malarstwo olejne', category: 'artystyczne' },
    { name: 'Emboss', emoji: '⛰️', description: 'Relief/wytłoczenie', category: 'artystyczne' },
    { name: 'Mosaic', emoji: '🧩', description: 'Mozaika kaflowa', category: 'artystyczne' },
    { name: 'Crystallize', emoji: '💎', description: 'Krystalizacja', category: 'artystyczne' },
    { name: 'Halftone', emoji: '⚫', description: 'Rastrowanie drukarskie', category: 'artystyczne' },
    { name: 'Crosshatch', emoji: '✏️', description: 'Kreskowanie krzyżowe', category: 'artystyczne' },
    { name: 'Stippling', emoji: '🔸', description: 'Punktkowanie', category: 'artystyczne' },
    { name: 'Watercolor', emoji: '🎨', description: 'Akwarela', category: 'artystyczne' },
    { name: 'Pencil Sketch', emoji: '✏️', description: 'Szkic ołówkiem', category: 'artystyczne' },
    { name: 'Charcoal', emoji: '⚫', description: 'Węgiel rysunkowy', category: 'artystyczne' },
    { name: 'Linocut', emoji: '🖨️', description: 'Linoryt', category: 'artystyczne' },

    // 4. EFEKTY GEOMETRYCZNE WZORY
    { name: 'Voronoi Diagram', emoji: '🔺', description: 'Diagram Voronoi', category: 'wzory' },
    { name: 'Tessellation', emoji: '🔶', description: 'Teselacja geometryczna', category: 'wzory' },
    { name: 'Triangulation', emoji: '📐', description: 'Triangulacja Delaunaya', category: 'wzory' },
    { name: 'Hexagonal Grid', emoji: '⬡', description: 'Siatka heksagonalna', category: 'wzory' },

    // 5. EFEKTY KOLORÓW (Modyfikacja kolorów)
    { name: 'Invert', emoji: '🔄', description: 'Inwersja kolorów', category: 'kolory' },
    { name: 'Hue Shift', emoji: '🎭', description: 'Przesunięcie odcienia', category: 'kolory' },
    { name: 'Saturation', emoji: '🌈', description: 'Nasycenie kolorów', category: 'kolory' },
    { name: 'Contrast', emoji: '⚫', description: 'Zwiększony kontrast', category: 'kolory' },
    { name: 'Posterize', emoji: '🎯', description: 'Posteryzacja kolorów', category: 'kolory' },
    { name: 'Sepia', emoji: '🟤', description: 'Efekt sepii', category: 'kolory' },
    { name: 'Vintage', emoji: '📸', description: 'Vintage look', category: 'kolory' },
    { name: 'Cross Processing', emoji: '🎞️', description: 'Przetwarzanie krzyżowe', category: 'kolory' },
    { name: 'Duotone', emoji: '🔵', description: 'Dwukolorowy efekt', category: 'kolory' },
    { name: 'Neon', emoji: '💡', description: 'Neonowe świecenie', category: 'kolory' },
    { name: 'Color Cycle', emoji: '🎨', description: 'Cykl kolorów (z opcją animacji)', category: 'kolory' },
    { name: 'Color Bleed', emoji: '🩸', description: 'Wyciekanie kolorów (z opcją animacji)', category: 'kolory' },

    // 6. EFEKTY GLITCH/ZNIEKSZTAŁCENIA
    { name: 'RGB Split', emoji: '🔴', description: 'Rozdzielenie RGB (z opcją animacji)', category: 'glitch' },
    { name: 'Glitch', emoji: '⚡', description: 'Klasyczny glitch (z opcją animacji)', category: 'glitch' },
    { name: 'Datamosh', emoji: '📱', description: 'Korupcja danych (z opcją animacji)', category: 'glitch' },
    { name: 'VHS', emoji: '📼', description: 'Retro VHS glitch', category: 'glitch' },
    { name: 'Corruption', emoji: '💥', description: 'Cyfrowa korupcja', category: 'glitch' },
    { name: 'Compression Artifacts', emoji: '📦', description: 'Artefakty kompresji JPEG', category: 'glitch' },
    { name: 'Bad Reception', emoji: '📡', description: 'Zły odbiór TV', category: 'glitch' },
    { name: 'LCD Damage', emoji: '💔', description: 'Uszkodzony ekran LCD', category: 'glitch' },
    { name: 'Bitcrush', emoji: '🔢', description: 'Redukcja głębi bitowej', category: 'glitch' },
    { name: 'Pixel Drift', emoji: '⬆️', description: 'Dryfowanie pikseli (z opcją animacji)', category: 'glitch' },

    // 7. EFEKTY OPTYCZNE
    { name: 'Lens Flare', emoji: '🌟', description: 'Refleksy obiektywu', category: 'optyczne' },
    { name: 'Depth of Field', emoji: '🎯', description: 'Głębia ostrości', category: 'optyczne' },
    { name: 'Chromostereopsis', emoji: '👁️', description: 'Efekt 3D przez kolory', category: 'optyczne' },
    { name: 'Anaglyph 3D', emoji: '🥽', description: 'Czerwono-niebieskie 3D', category: 'optyczne' },

    // 8. EFEKTY NAKŁADKOWE (Dodają elementy)
    { name: 'Scanlines', emoji: '📺', description: 'Linie skanowania CRT', category: 'nakładkowe' },
    { name: 'Interlacing', emoji: '📟', description: 'Przeplatanie linii CRT', category: 'nakładkowe' },
    { name: 'Noise', emoji: '📺', description: 'Szum analogowy (z opcją animacji)', category: 'nakładkowe' },
    { name: 'Film Grain', emoji: '🎞️', description: 'Ziarnistość filmowa', category: 'nakładkowe' },
    { name: 'CRT TV', emoji: '📺', description: 'Efekt starego telewizora', category: 'nakładkowe' },
    { name: 'Particle System', emoji: '✨', description: 'System cząstek', category: 'nakładkowe' },
    { name: 'Fractal Zoom', emoji: '🌀', description: 'Fraktalny zoom (z opcją animacji)', category: 'nakładkowe' },

    // 9. EFEKTY ŚWIETLNE/KOŃCOWE
    { name: 'Blur', emoji: '🌫️', description: 'Rozmycie (zawsze ostatni)', category: 'świetlne' },

    // 10. EFEKTY ANIMACJI RUCHU
    { name: 'Breathing', emoji: '🫁', description: 'Oddychanie obrazu', category: 'animacja' },
    { name: 'Shake', emoji: '📳', description: 'Trzęsienie obrazu', category: 'animacja' },
    { name: 'Oscillate', emoji: '〰️', description: 'Oscylacja', category: 'animacja' },
    { name: 'Strobe', emoji: '💡', description: 'Stroboskop', category: 'animacja' },

    // 11. NOWE EFEKTY FRAKTALNE
    { name: 'Fractal Patterns', emoji: '🔮', description: 'Generowanie wzorów fraktalnych', category: 'fraktalne' },
    { name: 'Mandelbrot Zoom', emoji: '🌌', description: 'Nieskończone przybliżanie fraktala Mandelbrota', category: 'fraktalne' },
    { name: 'Julia Sets', emoji: '🌟', description: 'Animowane zbiory Julii', category: 'fraktalne' },

    // 12. NOWE EFEKTY ŚWIETLNE
    { name: 'Light Trails', emoji: '✨', description: 'Smugi świetlne za poruszającymi się elementami', category: 'świetlne' },
    { name: 'Neon Glow', emoji: '💡', description: 'Świecenie neonowe z intensywnym glow', category: 'świetlne' },
    { name: 'Laser Beams', emoji: '🔴', description: 'Wiązki laserowe', category: 'świetlne' },
    { name: 'Prism Effect', emoji: '🌈', description: 'Rozszczepienie światła jak w pryzmacie', category: 'świetlne' },

    // 13. NOWE EFEKTY WIZUALNE
    { name: 'Melt Effect', emoji: '🫠', description: 'Topnienie obrazu', category: 'wizualne' },
    { name: 'Liquid Metal', emoji: '🥈', description: 'Efekt ciekłego metalu', category: 'wizualne' },
    { name: 'Plasma Effect', emoji: '🔥', description: 'Plazma/lawa lamp', category: 'wizualne' },
    { name: 'Tie Dye', emoji: '🎨', description: 'Efekt barwienia koszulek', category: 'wizualne' },
    { name: 'Oil Spill', emoji: '🌊', description: 'Tęczowe plamy oleju', category: 'wizualne' },
    { name: 'Bubble Distortion', emoji: '🫧', description: 'Zniekształcenia bąbelkowe', category: 'wizualne' },

    // 14. NOWE EFEKTY CZASOPRZESTRZENNE
    { name: 'Time Echo', emoji: '⏰', description: 'Echo czasowe (powidoki)', category: 'czasoprzestrzenne' },
    { name: 'Motion Blur Trails', emoji: '💨', description: 'Smugi ruchu', category: 'czasoprzestrzenne' },
    { name: 'Feedback Loop', emoji: '🔄', description: 'Pętla sprzężenia zwrotnego', category: 'czasoprzestrzenne' },
    { name: 'Infinite Mirror', emoji: '🪞', description: 'Nieskończone lustro', category: 'czasoprzestrzenne' },
    { name: 'Wormhole', emoji: '🕳️', description: 'Tunel czasoprzestrzenny', category: 'czasoprzestrzenne' }
  ];

  // Skrócona wersja parametrów (przykład - pełna będzie dodana osobno)
  const effectParameters = {
    // 1. EFEKTY BAZOWE
    'Edge Detect': [],
    
    'ASCII Art': [
      { name: 'size', label: 'Rozmiar znaku', type: 'range', min: 4, max: 32, default: 8 },
      { name: 'brightness', label: 'Jasność', type: 'range', min: 0.1, max: 3.0, default: 1.0, step: 0.1 },
      { name: 'characters', label: 'Zestaw znaków', type: 'select', options: [
        { value: ' .:-=+*#%@', label: 'Klasyczne' },
        { value: ' ░▒▓█', label: 'Bloki' },
        { value: ' .oO0', label: 'Koła' },
        { value: ' /\\|', label: 'Linie' }
      ], default: ' .:-=+*#%@' }
    ],

    'Dithering': [
      { name: 'levels', label: 'Poziomy kolorów', type: 'range', min: 2, max: 16, default: 4 },
      { name: 'method', label: 'Metoda', type: 'select', options: [
        { value: 'floyd-steinberg', label: 'Floyd-Steinberg' },
        { value: 'ordered', label: 'Uporządkowany' }
      ], default: 'floyd-steinberg' }
    ],

    // 2. EFEKTY GEOMETRYCZNE/DEFORMACJE
    'Displacement': [
      { name: 'amplitude', label: 'Amplituda', type: 'range', min: 5, max: 50, default: 20 },
      { name: 'frequency', label: 'Częstotliwość', type: 'range', min: 0.01, max: 0.5, step: 0.01, default: 0.1 }
    ],

    'Wave': [
      { name: 'amplitude', label: 'Amplituda', type: 'range', min: 5, max: 80, default: 25 },
      { name: 'frequency', label: 'Częstotliwość', type: 'range', min: 0.01, max: 0.3, step: 0.01, default: 0.08 },
      { name: 'direction', label: 'Kierunek', type: 'select', options: ['horizontal', 'vertical'], default: 'horizontal' },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: false },
      { name: 'waveSpeed', label: 'Prędkość fal', type: 'range', min: 0.1, max: 3.0, default: 1.2, step: 0.1, showIf: 'animated' },
      { name: 'sparkle', label: 'Iskrzenie pikseli', type: 'checkbox', default: true, showIf: 'animated' }
    ],

    'Ripple': [
      { name: 'amplitude', label: 'Amplituda', type: 'range', min: 10, max: 100, default: 30 },
      { name: 'frequency', label: 'Częstotliwość', type: 'range', min: 0.01, max: 0.2, step: 0.01, default: 0.05 },
      { name: 'centerX', label: 'Centrum X', type: 'range', min: 0, max: 1, step: 0.1, default: 0.5 },
      { name: 'centerY', label: 'Centrum Y', type: 'range', min: 0, max: 1, step: 0.1, default: 0.5 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: false },
      { name: 'speed', label: 'Prędkość fal', type: 'range', min: 0.1, max: 3.0, default: 1.0, step: 0.1, showIf: 'animated' },
      { name: 'damping', label: 'Tłumienie', type: 'range', min: 0.8, max: 1.0, default: 0.95, step: 0.01, showIf: 'animated' }
    ],

    'Swirl': [
      { name: 'angle', label: 'Kąt obrotu', type: 'range', min: 0, max: 360, default: 45 },
      { name: 'radius', label: 'Promień', type: 'range', min: 0.1, max: 1.0, step: 0.1, default: 0.5 },
      { name: 'centerX', label: 'Centrum X', type: 'range', min: 0, max: 1, step: 0.1, default: 0.5 },
      { name: 'centerY', label: 'Centrum Y', type: 'range', min: 0, max: 1, step: 0.1, default: 0.5 }
    ],

    'Pinch': [
      { name: 'strength', label: 'Siła ściągnięcia', type: 'range', min: -2.0, max: 2.0, step: 0.1, default: 0.5 },
      { name: 'radius', label: 'Promień efektu', type: 'range', min: 0.1, max: 1.0, step: 0.1, default: 0.5 },
      { name: 'centerX', label: 'Centrum X', type: 'range', min: 0, max: 1, step: 0.1, default: 0.5 },
      { name: 'centerY', label: 'Centrum Y', type: 'range', min: 0, max: 1, step: 0.1, default: 0.5 }
    ],

    'Fisheye': [
      { name: 'strength', label: 'Siła efektu', type: 'range', min: 0.1, max: 3.0, step: 0.1, default: 1.0 },
      { name: 'zoom', label: 'Przybliżenie', type: 'range', min: 0.5, max: 2.0, step: 0.1, default: 1.0 }
    ],

    'Kaleidoscope': [
      { name: 'segments', label: 'Segmenty', type: 'range', min: 3, max: 12, default: 6 },
      { name: 'angle', label: 'Kąt obrotu', type: 'range', min: 0, max: 360, default: 0 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: false },
      { name: 'rotationSpeed', label: 'Prędkość obrotu', type: 'range', min: 0.1, max: 5.0, default: 1.0, step: 0.1, showIf: 'animated' }
    ],

    'Mirror': [
      { name: 'direction', label: 'Kierunek', type: 'select', options: [
        { value: 'horizontal', label: 'Poziomy' },
        { value: 'vertical', label: 'Pionowy' },
        { value: 'both', label: 'Oba' }
      ], default: 'horizontal' }
    ],

    'Pixelsort': [
      { name: 'threshold', label: 'Próg sortowania', type: 'range', min: 0, max: 255, default: 100 },
      { name: 'direction', label: 'Kierunek', type: 'select', options: ['horizontal', 'vertical'], default: 'horizontal' },
      { name: 'mode', label: 'Tryb', type: 'select', options: [
        { value: 'brightness', label: 'Jasność' },
        { value: 'hue', label: 'Odcień' },
        { value: 'saturation', label: 'Nasycenie' }
      ], default: 'brightness' }
    ],

    'Liquid Pixels': [
      { name: 'viscosity', label: 'Lepkość', type: 'range', min: 0.1, max: 2.0, step: 0.1, default: 0.8 },
      { name: 'flow', label: 'Przepływ', type: 'range', min: 0.1, max: 3.0, step: 0.1, default: 1.0 },
      { name: 'turbulence', label: 'Turbulencja', type: 'range', min: 0, max: 50, default: 10 }
    ],

    'Morph': [
      { name: 'intensity', label: 'Intensywność', type: 'range', min: 0.1, max: 2.0, step: 0.1, default: 1.0 },
      { name: 'speed', label: 'Prędkość', type: 'range', min: 0.1, max: 5.0, step: 0.1, default: 1.0 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: false }
    ],

    // 3. EFEKTY ARTYSTYCZNE
    'Oil Paint': [
      { name: 'radius', label: 'Promień pędzla', type: 'range', min: 1, max: 10, default: 3 },
      { name: 'intensity', label: 'Intensywność', type: 'range', min: 5, max: 50, default: 20 }
    ],

    'Emboss': [
      { name: 'strength', label: 'Siła efektu', type: 'range', min: 0.5, max: 3.0, step: 0.1, default: 1.0 },
      { name: 'direction', label: 'Kierunek światła', type: 'range', min: 0, max: 360, default: 45 }
    ],

    'Mosaic': [
      { name: 'tileSize', label: 'Rozmiar kafelka', type: 'range', min: 2, max: 50, default: 10 },
      { name: 'gap', label: 'Odstęp', type: 'range', min: 0, max: 5, default: 1 }
    ],

    'Crystallize': [
      { name: 'cellSize', label: 'Rozmiar kryształu', type: 'range', min: 5, max: 100, default: 20 },
      { name: 'edgeThickness', label: 'Grubość krawędzi', type: 'range', min: 1, max: 5, default: 2 }
    ],

    'Halftone': [
      { name: 'dotSize', label: 'Rozmiar kropki', type: 'range', min: 2, max: 20, default: 4 },
      { name: 'angle', label: 'Kąt rastera', type: 'range', min: 0, max: 90, default: 45 }
    ],

    'Crosshatch': [
      { name: 'lineSpacing', label: 'Odstęp linii', type: 'range', min: 2, max: 20, default: 5 },
      { name: 'angle1', label: 'Kąt 1', type: 'range', min: 0, max: 180, default: 45 },
      { name: 'angle2', label: 'Kąt 2', type: 'range', min: 0, max: 180, default: 135 }
    ],

    'Stippling': [
      { name: 'dotDensity', label: 'Gęstość kropek', type: 'range', min: 0.01, max: 0.5, step: 0.01, default: 0.1 },
      { name: 'dotSize', label: 'Rozmiar kropek', type: 'range', min: 1, max: 10, default: 2 }
    ],

    'Watercolor': [
      { name: 'bleedAmount', label: 'Wyciekanie farby', type: 'range', min: 0.1, max: 3.0, step: 0.1, default: 1.0 },
      { name: 'paperTexture', label: 'Tekstura papieru', type: 'range', min: 0, max: 1, step: 0.1, default: 0.3 }
    ],

    'Pencil Sketch': [
      { name: 'lineIntensity', label: 'Intensywność linii', type: 'range', min: 0.1, max: 3.0, step: 0.1, default: 1.0 },
      { name: 'shading', label: 'Cieniowanie', type: 'range', min: 0, max: 1, step: 0.1, default: 0.5 }
    ],

    'Charcoal': [
      { name: 'grainSize', label: 'Wielkość ziarna', type: 'range', min: 1, max: 10, default: 3 },
      { name: 'darkness', label: 'Ciemność', type: 'range', min: 0.1, max: 2.0, step: 0.1, default: 1.0 }
    ],

    'Linocut': [
      { name: 'thickness', label: 'Grubość linii', type: 'range', min: 1, max: 10, default: 3 },
      { name: 'simplification', label: 'Uproszczenie', type: 'range', min: 0.1, max: 1.0, step: 0.1, default: 0.5 }
    ],

    // 4. EFEKTY WZORÓW
    'Voronoi Diagram': [
      { name: 'cellCount', label: 'Liczba komórek', type: 'range', min: 10, max: 200, default: 50 },
      { name: 'colorMode', label: 'Tryb kolorów', type: 'select', options: [
        { value: 'original', label: 'Oryginalne' },
        { value: 'random', label: 'Losowe' },
        { value: 'gradient', label: 'Gradient' }
      ], default: 'original' }
    ],

    'Tessellation': [
      { name: 'pattern', label: 'Wzór', type: 'select', options: [
        { value: 'triangle', label: 'Trójkąty' },
        { value: 'square', label: 'Kwadraty' },
        { value: 'hexagon', label: 'Sześciokąty' }
      ], default: 'triangle' },
      { name: 'size', label: 'Rozmiar', type: 'range', min: 5, max: 100, default: 20 }
    ],

    'Triangulation': [
      { name: 'pointCount', label: 'Liczba punktów', type: 'range', min: 50, max: 1000, default: 200 },
      { name: 'edgeLength', label: 'Długość krawędzi', type: 'range', min: 10, max: 200, default: 50 }
    ],

    'Hexagonal Grid': [
      { name: 'size', label: 'Rozmiar sześciokąta', type: 'range', min: 5, max: 50, default: 15 },
      { name: 'strokeWidth', label: 'Grubość linii', type: 'range', min: 1, max: 5, default: 2 }
    ],

    // 5. EFEKTY KOLORÓW
    'Invert': [],
    
    'Hue Shift': [
      { name: 'hueShift', label: 'Przesunięcie (°)', type: 'range', min: -180, max: 180, default: 60 }
    ],
    
    'Saturation': [
      { name: 'factor', label: 'Nasycenie', type: 'range', min: 0.1, max: 5, step: 0.1, default: 2.0 }
    ],
    
    'Contrast': [
      { name: 'factor', label: 'Siła kontrastu', type: 'range', min: 0.5, max: 5, step: 0.1, default: 2.0 }
    ],

    'Posterize': [
      { name: 'levels', label: 'Poziomy kolorów', type: 'range', min: 2, max: 32, default: 8 }
    ],

    'Sepia': [
      { name: 'intensity', label: 'Intensywność', type: 'range', min: 0.1, max: 2.0, step: 0.1, default: 1.0 }
    ],

    'Vintage': [
      { name: 'warmth', label: 'Ciepłość', type: 'range', min: 0.1, max: 2.0, step: 0.1, default: 1.2 },
      { name: 'fade', label: 'Wyblakłość', type: 'range', min: 0, max: 1, step: 0.1, default: 0.3 }
    ],

    'Cross Processing': [
      { name: 'style', label: 'Styl', type: 'select', options: [
        { value: 'vintage', label: 'Vintage' },
        { value: 'bleach', label: 'Bleach Bypass' },
        { value: 'cool', label: 'Cool' }
      ], default: 'vintage' },
      { name: 'intensity', label: 'Intensywność', type: 'range', min: 0.1, max: 2.0, step: 0.1, default: 0.8 }
    ],

    'Duotone': [
      { name: 'color1', label: 'Kolor ciemny', type: 'color', default: '#ff0000' },
      { name: 'color2', label: 'Kolor jasny', type: 'color', default: '#0000ff' }
    ],

    'Neon': [
      { name: 'glowIntensity', label: 'Intensywność świecenia', type: 'range', min: 1, max: 10, default: 3 },
      { name: 'glowColor', label: 'Kolor świecenia', type: 'color', default: '#00ffff' }
    ],

    'Color Cycle': [
      { name: 'speed', label: 'Prędkość', type: 'range', min: 0.1, max: 5.0, step: 0.1, default: 1.0 },
      { name: 'range', label: 'Zakres', type: 'range', min: 30, max: 360, default: 180 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true }
    ],

    'Color Bleed': [
      { name: 'intensity', label: 'Intensywność', type: 'range', min: 0.1, max: 3.0, step: 0.1, default: 1.0 },
      { name: 'direction', label: 'Kierunek', type: 'select', options: ['down', 'up', 'left', 'right'], default: 'down' },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: false }
    ],

    // 6. EFEKTY GLITCH
    'RGB Split': [
      { name: 'offset', label: 'Offset RGB', type: 'range', min: 1, max: 50, default: 10 },
      { name: 'redShift', label: 'Czerwony', type: 'range', min: -20, max: 20, default: 0 },
      { name: 'blueShift', label: 'Niebieski', type: 'range', min: -20, max: 20, default: 0 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: false },
      { name: 'delay', label: 'Opóźnienie (ms)', type: 'range', min: 10, max: 200, default: 30, showIf: 'animated' },
      { name: 'intensity', label: 'Intensywność separacji', type: 'range', min: 1, max: 20, default: 12, showIf: 'animated' },
      { name: 'speed', label: 'Prędkość animacji', type: 'range', min: 0.1, max: 3.0, default: 1.5, step: 0.1, showIf: 'animated' }
    ],

    'Glitch': [
      { name: 'intensity', label: 'Intensywność', type: 'range', min: 5, max: 50, default: 20 },
      { name: 'length', label: 'Długość', type: 'range', min: 50, max: 500, default: 200 },
      { name: 'offset', label: 'Offset', type: 'range', min: 100, max: 1000, default: 500 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: false },
      { name: 'frequency', label: 'Częstotliwość glitchy', type: 'range', min: 0.1, max: 2.0, default: 0.5, step: 0.1, showIf: 'animated' },
      { name: 'types', label: 'Rodzaje glitchy', type: 'select', options: [
        { value: 'all', label: 'Wszystkie' },
        { value: 'rgb', label: 'Tylko RGB Split' },
        { value: 'noise', label: 'Tylko szum' },
        { value: 'displacement', label: 'Tylko przemieszczenie' }
      ], default: 'all', showIf: 'animated' }
    ],

    'Datamosh': [
      { name: 'probability', label: 'Prawdopodobieństwo', type: 'range', min: 0.01, max: 0.5, step: 0.01, default: 0.1 },
      { name: 'range', label: 'Zakres', type: 'range', min: 100, max: 2000, default: 1000 }
    ],

    'VHS': [
      { name: 'lineProbability', label: 'Częstość linii', type: 'range', min: 0.01, max: 0.3, step: 0.01, default: 0.1 },
      { name: 'maxShift', label: 'Maks. przesunięcie', type: 'range', min: 5, max: 50, default: 20 }
    ],

    'Corruption': [
      { name: 'severity', label: 'Stopień korupcji', type: 'range', min: 0.01, max: 0.5, step: 0.01, default: 0.1 },
      { name: 'blockSize', label: 'Rozmiar bloku', type: 'range', min: 1, max: 20, default: 4 }
    ],

    'Compression Artifacts': [
      { name: 'quality', label: 'Jakość (niższa = więcej artefaktów)', type: 'range', min: 10, max: 90, default: 30 },
      { name: 'blockiness', label: 'Blokowanie', type: 'range', min: 1, max: 10, default: 5 }
    ],

    'Bad Reception': [
      { name: 'noiseLevel', label: 'Poziom szumu', type: 'range', min: 0.1, max: 1.0, step: 0.1, default: 0.5 },
      { name: 'lineDistortion', label: 'Zniekształcenie linii', type: 'range', min: 0.1, max: 2.0, step: 0.1, default: 1.0 }
    ],

    'LCD Damage': [
      { name: 'deadPixels', label: 'Martwe piksele', type: 'range', min: 0.001, max: 0.1, step: 0.001, default: 0.01 },
      { name: 'colorShift', label: 'Przesunięcie kolorów', type: 'range', min: 0, max: 50, default: 10 }
    ],

    'Bitcrush': [
      { name: 'bitDepth', label: 'Głębia bitowa', type: 'range', min: 1, max: 8, default: 4 },
      { name: 'ditherAmount', label: 'Ilość ditheringu', type: 'range', min: 0, max: 1, step: 0.1, default: 0.5 }
    ],

    'Pixel Drift': [
      { name: 'driftAmount', label: 'Siła dryfowania', type: 'range', min: 1, max: 20, default: 5 },
      { name: 'direction', label: 'Kierunek', type: 'select', options: ['up', 'down', 'left', 'right', 'random'], default: 'up' },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true }
    ],

    // 7. EFEKTY OPTYCZNE
    'Lens Flare': [
      { name: 'intensity', label: 'Intensywność', type: 'range', min: 0.1, max: 3.0, step: 0.1, default: 1.0 },
      { name: 'positionX', label: 'Pozycja X', type: 'range', min: 0, max: 1, step: 0.1, default: 0.7 },
      { name: 'positionY', label: 'Pozycja Y', type: 'range', min: 0, max: 1, step: 0.1, default: 0.3 }
    ],

    'Depth of Field': [
      { name: 'focusDistance', label: 'Odległość ostrości', type: 'range', min: 0.1, max: 1.0, step: 0.1, default: 0.5 },
      { name: 'blurAmount', label: 'Siła rozmycia', type: 'range', min: 1, max: 20, default: 5 }
    ],

    'Chromostereopsis': [
      { name: 'separation', label: 'Separacja', type: 'range', min: 1, max: 20, default: 3 },
      { name: 'redShift', label: 'Przesunięcie czerwieni', type: 'range', min: -10, max: 10, default: 2 },
      { name: 'blueShift', label: 'Przesunięcie błękitu', type: 'range', min: -10, max: 10, default: -2 }
    ],

    'Anaglyph 3D': [
      { name: 'separation', label: 'Separacja 3D', type: 'range', min: 1, max: 20, default: 5 },
      { name: 'method', label: 'Metoda', type: 'select', options: [
        { value: 'redblue', label: 'Czerwono-niebieska' },
        { value: 'redgreen', label: 'Czerwono-zielona' }
      ], default: 'redblue' }
    ],

    // 8. EFEKTY NAKŁADKOWE
    'Scanlines': [
      { name: 'lineHeight', label: 'Wysokość linii', type: 'range', min: 1, max: 10, default: 2 },
      { name: 'opacity', label: 'Przezroczystość', type: 'range', min: 0.1, max: 1.0, step: 0.1, default: 0.5 }
    ],

    'Interlacing': [
      { name: 'lineSpacing', label: 'Odstęp linii', type: 'range', min: 1, max: 10, default: 2 },
      { name: 'shift', label: 'Przesunięcie', type: 'range', min: 0, max: 10, default: 1 }
    ],

    'Noise': [
      { name: 'probability', label: 'Częstość szumu', type: 'range', min: 0.01, max: 0.5, step: 0.01, default: 0.1 },
      { name: 'strength', label: 'Siła szumu', type: 'range', min: 10, max: 150, default: 50 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: false },
      { name: 'speed', label: 'Prędkość szumu', type: 'range', min: 0.1, max: 3.0, default: 1.0, step: 0.1, showIf: 'animated' }
    ],

    'Film Grain': [
      { name: 'intensity', label: 'Intensywność', type: 'range', min: 0.1, max: 2.0, step: 0.1, default: 0.5 },
      { name: 'size', label: 'Rozmiar ziarna', type: 'range', min: 0.5, max: 3.0, step: 0.1, default: 1.0 }
    ],

    'CRT TV': [
      { name: 'curvature', label: 'Krzywizna', type: 'range', min: 0, max: 1, step: 0.1, default: 0.3 },
      { name: 'scanlineIntensity', label: 'Intensywność linii', type: 'range', min: 0.1, max: 1.0, step: 0.1, default: 0.5 }
    ],

    'Particle System': [
      { name: 'particleCount', label: 'Liczba cząstek', type: 'range', min: 10, max: 500, default: 100 },
      { name: 'speed', label: 'Prędkość', type: 'range', min: 0.1, max: 5.0, step: 0.1, default: 1.0 },
      { name: 'size', label: 'Rozmiar', type: 'range', min: 1, max: 10, default: 3 }
    ],

    'Fractal Zoom': [
      { name: 'zoomSpeed', label: 'Prędkość zoom', type: 'range', min: 0.1, max: 3.0, step: 0.1, default: 1.0 },
      { name: 'complexity', label: 'Złożoność', type: 'range', min: 1, max: 10, default: 5 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true }
    ],

    // 9. EFEKTY ŚWIETLNE
    'Blur': [
      { name: 'radius', label: 'Promień rozmycia', type: 'range', min: 1, max: 20, default: 2 }
    ],

    // 10. EFEKTY ANIMACJI RUCHU
    'Breathing': [
      { name: 'intensity', label: 'Intensywność', type: 'range', min: 0.05, max: 0.3, default: 0.15, step: 0.01 },
      { name: 'speed', label: 'Prędkość', type: 'range', min: 0.1, max: 5.0, default: 1.5, step: 0.1 },
      { name: 'centerX', label: 'Centrum X', type: 'range', min: 0, max: 1, default: 0.5, step: 0.1 },
      { name: 'centerY', label: 'Centrum Y', type: 'range', min: 0, max: 1, default: 0.5, step: 0.1 }
    ],

    'Shake': [
      { name: 'intensity', label: 'Intensywność', type: 'range', min: 1, max: 20, default: 5 },
      { name: 'speed', label: 'Prędkość', type: 'range', min: 0.1, max: 10.0, step: 0.1, default: 3.0 }
    ],

    'Oscillate': [
      { name: 'frequency', label: 'Częstotliwość', type: 'range', min: 0.1, max: 5.0, step: 0.1, default: 1.0 },
      { name: 'amplitude', label: 'Amplituda', type: 'range', min: 5, max: 50, default: 20 },
      { name: 'direction', label: 'Kierunek', type: 'select', options: ['horizontal', 'vertical', 'both'], default: 'horizontal' }
    ],

    'Strobe': [
      { name: 'speed', label: 'Prędkość', type: 'range', min: 0.5, max: 10.0, default: 3.0, step: 0.1 },
      { name: 'intensity', label: 'Intensywność', type: 'range', min: 0.1, max: 2.0, default: 0.8, step: 0.1 }
    ],

    // 11. NOWE EFEKTY FRAKTALNE
    'Fractal Patterns': [
      { name: 'type', label: 'Typ fraktala', type: 'select', options: [
        { value: 'mandelbrot', label: 'Mandelbrot' },
        { value: 'julia', label: 'Julia' },
        { value: 'sierpinski', label: 'Sierpinski' },
        { value: 'dragon', label: 'Dragon Curve' }
      ], default: 'mandelbrot' },
      { name: 'iterations', label: 'Iteracje', type: 'range', min: 10, max: 200, default: 100 },
      { name: 'zoom', label: 'Przybliżenie', type: 'range', min: 0.1, max: 10.0, default: 1.0, step: 0.1 },
      { name: 'colorScheme', label: 'Schemat kolorów', type: 'select', options: [
        { value: 'rainbow', label: 'Tęczowy' },
        { value: 'fire', label: 'Ogień' },
        { value: 'ice', label: 'Lód' },
        { value: 'plasma', label: 'Plazma' }
      ], default: 'rainbow' }
    ],

    'Mandelbrot Zoom': [
      { name: 'zoomSpeed', label: 'Prędkość zoom', type: 'range', min: 0.1, max: 3.0, default: 1.0, step: 0.1 },
      { name: 'centerX', label: 'Centrum X', type: 'range', min: -2, max: 2, default: -0.5, step: 0.01 },
      { name: 'centerY', label: 'Centrum Y', type: 'range', min: -2, max: 2, default: 0, step: 0.01 },
      { name: 'iterations', label: 'Iteracje', type: 'range', min: 50, max: 500, default: 150 },
      { name: 'colorCycle', label: 'Cykl kolorów', type: 'checkbox', default: true },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true }
    ],

    'Julia Sets': [
      { name: 'cReal', label: 'C rzeczywista', type: 'range', min: -2, max: 2, default: -0.4, step: 0.01 },
      { name: 'cImag', label: 'C urojona', type: 'range', min: -2, max: 2, default: 0.6, step: 0.01 },
      { name: 'animateC', label: 'Animuj parametr C', type: 'checkbox', default: true },
      { name: 'animationSpeed', label: 'Prędkość animacji', type: 'range', min: 0.1, max: 2.0, default: 0.5, step: 0.1, showIf: 'animateC' },
      { name: 'iterations', label: 'Iteracje', type: 'range', min: 50, max: 300, default: 100 },
      { name: 'zoom', label: 'Przybliżenie', type: 'range', min: 0.5, max: 5.0, default: 1.5, step: 0.1 }
    ],

    // 12. NOWE EFEKTY ŚWIETLNE
    'Light Trails': [
      { name: 'trailLength', label: 'Długość śladu', type: 'range', min: 5, max: 50, default: 15 },
      { name: 'brightness', label: 'Jasność', type: 'range', min: 0.1, max: 2.0, default: 1.0, step: 0.1 },
      { name: 'trailColor', label: 'Kolor śladu', type: 'color', default: '#ffffff' },
      { name: 'fadeSpeed', label: 'Prędkość zanikania', type: 'range', min: 0.1, max: 1.0, default: 0.3, step: 0.1 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true }
    ],

    'Neon Glow': [
      { name: 'glowIntensity', label: 'Intensywność świecenia', type: 'range', min: 1, max: 15, default: 5 },
      { name: 'glowRadius', label: 'Promień świecenia', type: 'range', min: 5, max: 30, default: 10 },
      { name: 'glowColor', label: 'Kolor świecenia', type: 'color', default: '#00ffff' },
      { name: 'pulsate', label: 'Pulsowanie', type: 'checkbox', default: true },
      { name: 'pulseSpeed', label: 'Prędkość pulsu', type: 'range', min: 0.5, max: 5.0, default: 2.0, step: 0.1, showIf: 'pulsate' },
      { name: 'innerGlow', label: 'Wewnętrzne świecenie', type: 'checkbox', default: true }
    ],

    'Laser Beams': [
      { name: 'beamCount', label: 'Liczba wiązek', type: 'range', min: 1, max: 10, default: 3 },
      { name: 'beamWidth', label: 'Szerokość wiązki', type: 'range', min: 1, max: 10, default: 3 },
      { name: 'beamColor', label: 'Kolor lasera', type: 'color', default: '#ff0000' },
      { name: 'intensity', label: 'Intensywność', type: 'range', min: 0.5, max: 3.0, default: 1.5, step: 0.1 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true },
      { name: 'rotationSpeed', label: 'Prędkość rotacji', type: 'range', min: 0.1, max: 2.0, default: 0.5, step: 0.1, showIf: 'animated' }
    ],

    'Prism Effect': [
      { name: 'dispersion', label: 'Rozproszenie', type: 'range', min: 5, max: 50, default: 20 },
      { name: 'prismAngle', label: 'Kąt pryzmatu', type: 'range', min: 0, max: 360, default: 45 },
      { name: 'intensity', label: 'Intensywność', type: 'range', min: 0.5, max: 2.0, default: 1.0, step: 0.1 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: false },
      { name: 'rotateAngle', label: 'Rotacja kąta', type: 'checkbox', default: true, showIf: 'animated' }
    ],

    // 13. NOWE EFEKTY WIZUALNE
    'Melt Effect': [
      { name: 'meltSpeed', label: 'Prędkość topnienia', type: 'range', min: 0.1, max: 3.0, default: 1.0, step: 0.1 },
      { name: 'viscosity', label: 'Lepkość', type: 'range', min: 0.1, max: 2.0, default: 0.8, step: 0.1 },
      { name: 'temperature', label: 'Temperatura', type: 'range', min: 0.1, max: 2.0, default: 1.0, step: 0.1 },
      { name: 'direction', label: 'Kierunek', type: 'select', options: ['down', 'up', 'left', 'right'], default: 'down' },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true }
    ],

    'Liquid Metal': [
      { name: 'reflectivity', label: 'Odbicia', type: 'range', min: 0.1, max: 2.0, default: 1.5, step: 0.1 },
      { name: 'fluidity', label: 'Płynność', type: 'range', min: 0.1, max: 2.0, default: 1.0, step: 0.1 },
      { name: 'metalType', label: 'Typ metalu', type: 'select', options: [
        { value: 'silver', label: 'Srebro' },
        { value: 'gold', label: 'Złoto' },
        { value: 'copper', label: 'Miedź' },
        { value: 'chrome', label: 'Chrom' }
      ], default: 'silver' },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true },
      { name: 'waveSpeed', label: 'Prędkość fal', type: 'range', min: 0.1, max: 3.0, default: 1.0, step: 0.1, showIf: 'animated' }
    ],

    'Plasma Effect': [
      { name: 'complexity', label: 'Złożoność', type: 'range', min: 1, max: 10, default: 5 },
      { name: 'speed', label: 'Prędkość', type: 'range', min: 0.1, max: 3.0, default: 1.0, step: 0.1 },
      { name: 'colorScheme', label: 'Schemat kolorów', type: 'select', options: [
        { value: 'fire', label: 'Ogień' },
        { value: 'electric', label: 'Elektryczny' },
        { value: 'toxic', label: 'Toksyczny' },
        { value: 'cosmic', label: 'Kosmiczny' }
      ], default: 'fire' },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true }
    ],

    'Tie Dye': [
      { name: 'colorCount', label: 'Liczba kolorów', type: 'range', min: 2, max: 8, default: 4 },
      { name: 'swirl', label: 'Zawirowanie', type: 'range', min: 0.1, max: 3.0, default: 1.5, step: 0.1 },
      { name: 'blendMode', label: 'Tryb mieszania', type: 'select', options: [
        { value: 'smooth', label: 'Gładki' },
        { value: 'sharp', label: 'Ostry' },
        { value: 'radial', label: 'Promienisty' }
      ], default: 'smooth' },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: false },
      { name: 'animationSpeed', label: 'Prędkość animacji', type: 'range', min: 0.1, max: 2.0, default: 0.5, step: 0.1, showIf: 'animated' }
    ],

    'Oil Spill': [
      { name: 'iridescence', label: 'Opalizacja', type: 'range', min: 0.5, max: 3.0, default: 1.5, step: 0.1 },
      { name: 'thickness', label: 'Grubość warstwy', type: 'range', min: 0.1, max: 2.0, default: 1.0, step: 0.1 },
      { name: 'flowSpeed', label: 'Prędkość przepływu', type: 'range', min: 0.1, max: 2.0, default: 0.8, step: 0.1 },
      { name: 'colorShift', label: 'Przesunięcie kolorów', type: 'range', min: 0, max: 360, default: 0 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true }
    ],

    'Bubble Distortion': [
      { name: 'bubbleCount', label: 'Liczba bąbelków', type: 'range', min: 5, max: 50, default: 20 },
      { name: 'bubbleSize', label: 'Rozmiar bąbelków', type: 'range', min: 10, max: 100, default: 30 },
      { name: 'distortionStrength', label: 'Siła zniekształcenia', type: 'range', min: 0.1, max: 2.0, default: 0.8, step: 0.1 },
      { name: 'refraction', label: 'Załamanie światła', type: 'range', min: 0.5, max: 2.0, default: 1.2, step: 0.1 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true },
      { name: 'floatSpeed', label: 'Prędkość unoszenia', type: 'range', min: 0.1, max: 2.0, default: 0.5, step: 0.1, showIf: 'animated' }
    ],

    // 14. NOWE EFEKTY CZASOPRZESTRZENNE
    'Time Echo': [
      { name: 'echoCount', label: 'Liczba ech', type: 'range', min: 2, max: 10, default: 5 },
      { name: 'echoDelay', label: 'Opóźnienie echa', type: 'range', min: 50, max: 500, default: 150 },
      { name: 'fadeRate', label: 'Prędkość zanikania', type: 'range', min: 0.1, max: 0.9, default: 0.7, step: 0.1 },
      { name: 'blendMode', label: 'Tryb mieszania', type: 'select', options: [
        { value: 'overlay', label: 'Nakładka' },
        { value: 'screen', label: 'Ekran' },
        { value: 'multiply', label: 'Pomnażanie' }
      ], default: 'overlay' },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true }
    ],

    'Motion Blur Trails': [
      { name: 'trailLength', label: 'Długość smugi', type: 'range', min: 3, max: 20, default: 8 },
      { name: 'blurIntensity', label: 'Intensywność rozmycia', type: 'range', min: 1, max: 10, default: 5 },
      { name: 'direction', label: 'Kierunek', type: 'select', options: [
        { value: 'auto', label: 'Automatyczny' },
        { value: 'horizontal', label: 'Poziomy' },
        { value: 'vertical', label: 'Pionowy' },
        { value: 'diagonal', label: 'Ukośny' }
      ], default: 'auto' },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true },
      { name: 'speed', label: 'Prędkość', type: 'range', min: 0.1, max: 3.0, default: 1.0, step: 0.1, showIf: 'animated' }
    ],

    'Feedback Loop': [
      { name: 'feedbackStrength', label: 'Siła sprzężenia', type: 'range', min: 0.1, max: 0.95, default: 0.7, step: 0.05 },
      { name: 'delay', label: 'Opóźnienie', type: 'range', min: 1, max: 10, default: 3 },
      { name: 'zoom', label: 'Zoom sprzężenia', type: 'range', min: 0.9, max: 1.1, default: 1.02, step: 0.001 },
      { name: 'rotation', label: 'Rotacja', type: 'range', min: -5, max: 5, default: 0, step: 0.1 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true }
    ],

    'Infinite Mirror': [
      { name: 'mirrorCount', label: 'Liczba odbić', type: 'range', min: 3, max: 20, default: 8 },
      { name: 'perspective', label: 'Perspektywa', type: 'range', min: 0.1, max: 2.0, default: 1.0, step: 0.1 },
      { name: 'fadeDistance', label: 'Zanikanie z odległością', type: 'range', min: 0.1, max: 0.9, default: 0.8, step: 0.1 },
      { name: 'mirrorAngle', label: 'Kąt luster', type: 'range', min: 0, max: 360, default: 0 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true },
      { name: 'rotationSpeed', label: 'Prędkość rotacji', type: 'range', min: 0.1, max: 2.0, default: 0.5, step: 0.1, showIf: 'animated' }
    ],

    'Wormhole': [
      { name: 'tunnelDepth', label: 'Głębokość tunelu', type: 'range', min: 5, max: 50, default: 20 },
      { name: 'distortionStrength', label: 'Siła zniekształcenia', type: 'range', min: 0.1, max: 3.0, default: 1.5, step: 0.1 },
      { name: 'centerX', label: 'Centrum X', type: 'range', min: 0, max: 1, default: 0.5, step: 0.1 },
      { name: 'centerY', label: 'Centrum Y', type: 'range', min: 0, max: 1, default: 0.5, step: 0.1 },
      { name: 'animated', label: 'Animacja', type: 'checkbox', default: true },
      { name: 'rotationSpeed', label: 'Prędkość rotacji', type: 'range', min: 0.1, max: 3.0, default: 1.0, step: 0.1, showIf: 'animated' },
      { name: 'pulsate', label: 'Pulsowanie', type: 'checkbox', default: true, showIf: 'animated' }
    ]
  };

  const categories = [
    { name: 'bazowe', label: '1️⃣ Efekty Bazowe', description: 'Całkowicie zmieniają strukturę obrazu' },
    { name: 'geometryczne', label: '2️⃣ Deformacje', description: 'Zmieniają pozycję pikseli' },
    { name: 'artystyczne', label: '3️⃣ Artystyczne', description: 'Stylizacja malarska i graficzna' },
    { name: 'wzory', label: '4️⃣ Wzory Geometryczne', description: 'Geometryczne struktury' },
    { name: 'kolory', label: '5️⃣ Kolory', description: 'Modyfikacja kolorów i tonów' },
    { name: 'glitch', label: '6️⃣ Glitch', description: 'Efekty błędów cyfrowych' },
    { name: 'optyczne', label: '7️⃣ Optyczne', description: 'Symulacja zjawisk optycznych' },
    { name: 'nakładkowe', label: '8️⃣ Nakładkowe', description: 'Dodają elementy do obrazu' },
    { name: 'świetlne', label: '9️⃣ Świetlne', description: 'Efekty końcowe (po wszystkim)' },
    { name: 'animacja', label: '🔟 Animacja Ruchu', description: 'Efekty ruchu i animacji' },
    { name: 'fraktalne', label: '1️⃣1️⃣ Fraktalne', description: 'Wzory fraktalne i matematyczne' },
    { name: 'wizualne', label: '1️⃣2️⃣ Wizualne', description: 'Zaawansowane efekty wizualne' },
    { name: 'czasoprzestrzenne', label: '1️⃣3️⃣ Czasoprzestrzenne', description: 'Efekty czasu i przestrzeni' }
  ];

  // Sprawdź czy efekt jest aktywny
  const isEffectActive = (effectName) => {
    return effects.some(effect => effect.name === effectName);
  };

  // Sprawdź czy parametr ma być pokazany
  const shouldShowParameter = (param, effectParams) => {
    if (!param.showIf) return true;
    return effectParams?.[param.showIf] === true;
  };

  // Znajdź aktywny efekt
  const getActiveEffect = (effectName) => {
    return effects.find(effect => effect.name === effectName);
  };

  // Obsługa kliknięcia na efekt
  const handleEffectClick = (effectName) => {
    const activeEffect = getActiveEffect(effectName);
    
    if (activeEffect) {
      // Efekt jest aktywny - sprawdź czy jest rozwinięty
      if (expandedEffects.has(activeEffect.id)) {
        // Jest rozwinięty - usuń go i zwiń
        onRemoveEffect(activeEffect.id);
        setExpandedEffects(prev => {
          const newSet = new Set(prev);
          newSet.delete(activeEffect.id);
          return newSet;
        });
      } else {
        // Nie jest rozwinięty - rozwiń
        setExpandedEffects(prev => new Set(prev).add(activeEffect.id));
      }
    } else {
      // Efekt nie jest aktywny - dodaj go z domyślnymi parametrami animacji
      
      // POPRAWKA: Automatycznie włącz animację dla efektów animowanych
      const defaultParams = {};
      const effectParams = effectParameters[effectName] || [];
      
      // Sprawdź czy efekt jest animowany w rejestrze
      const effectInfo = EFFECT_REGISTRY?.[effectName];
      const isInherentlyAnimated = effectInfo?.animated === true;
      
      effectParams.forEach(param => {
        if (param.name === 'animated') {
          // Automatycznie włącz animację dla efektów które ją obsługują
          defaultParams[param.name] = isInherentlyAnimated || param.default === true;
        } else {
          defaultParams[param.name] = param.default;
        }
      });
      
      onEffectClick(effectName, defaultParams);
      
      // Poczekaj chwilę i rozwiń (efekt musi być najpierw dodany)
      setTimeout(() => {
        const newEffect = effects.find(effect => effect.name === effectName);
        if (newEffect) {
          setExpandedEffects(prev => new Set(prev).add(newEffect.id));
        }
      }, 100);
    }
  };

  // Aktualizacja parametru
  const updateParameter = (effectId, paramName, value) => {
    onUpdateEffect(effectId, paramName, value);
  };

  return (
    <div className="effect-buttons-panel">
      <h3>🎛️ Efekty Graficzne</h3>
      
      {/* Aktywne efekty na górze */}
      {effects.length > 0 && (
        <div className="active-effects-section">
          <h4>✅ Aktywne efekty ({effects.length})</h4>
          <div className="active-effects-list">
            {effects.map((effect, index) => {
              const effectInfo = availableEffects.find(e => e.name === effect.name);
              const isExpanded = expandedEffects.has(effect.id);
              
              return (
                <div key={effect.id} className={`active-effect-item ${isExpanded ? 'expanded' : ''}`}>
                  <div 
                    className="active-effect-header"
                    onClick={() => handleEffectClick(effect.name)}
                  >
                    <div className="effect-order-number">#{index + 1}</div>
                    <span className="effect-emoji">{effectInfo?.emoji || '⚡'}</span>
                    <span className="effect-name">{effect.name}</span>
                    <button className="expand-btn">
                      {isExpanded ? '🗑️' : '⚙️'}
                    </button>
                  </div>
                  
                  {isExpanded && effectParameters[effect.name] && (
                    <div className="effect-parameters">
                      {effectParameters[effect.name].length === 0 ? (
                        <p className="no-params">Ten efekt nie ma parametrów do dostrojenia</p>
                      ) : (
                        effectParameters[effect.name]
                          .filter(param => shouldShowParameter(param, effect.params))
                          .map((param) => (
                          <div key={param.name} className="parameter-control">
                            <label className="parameter-label">
                              {param.label}:
                            </label>
                            
                            {param.type === 'range' && (
                              <div className="range-control">
                                <input
                                  type="range"
                                  min={param.min}
                                  max={param.max}
                                  step={param.step || 1}
                                  value={effect.params?.[param.name] ?? param.default}
                                  onChange={(e) => updateParameter(effect.id, param.name, parseFloat(e.target.value))}
                                  className="range-slider"
                                />
                                <span className="range-value">
                                  {effect.params?.[param.name] ?? param.default}
                                </span>
                              </div>
                            )}
                            
                            {param.type === 'select' && (
                              <select
                                value={effect.params?.[param.name] ?? param.default}
                                onChange={(e) => updateParameter(effect.id, param.name, e.target.value)}
                                className="select-control"
                              >
                                {param.options.map(option => {
                                  if (typeof option === 'string') {
                                    return (
                                      <option key={option} value={option}>
                                        {option === 'horizontal' ? 'Poziomo' : 
                                         option === 'vertical' ? 'Pionowo' : option}
                                      </option>
                                    );
                                  } else {
                                    return (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    );
                                  }
                                })}
                              </select>
                            )}

                            {param.type === 'color' && (
                              <div className="color-control">
                                <input
                                  type="color"
                                  value={effect.params?.[param.name] ?? param.default}
                                  onChange={(e) => updateParameter(effect.id, param.name, e.target.value)}
                                  className="color-picker"
                                />
                                <span className="color-value">
                                  {effect.params?.[param.name] ?? param.default}
                                </span>
                              </div>
                            )}
                            
                            {param.type === 'checkbox' && (
                              <div className="checkbox-control">
                                <input
                                  type="checkbox"
                                  checked={effect.params?.[param.name] ?? param.default}
                                  onChange={(e) => updateParameter(effect.id, param.name, e.target.checked)}
                                  className="checkbox-input"
                                />
                                <span className="checkbox-label">
                                  {effect.params?.[param.name] ?? param.default ? 'Włączony' : 'Wyłączony'}
                                </span>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Wszystkie dostępne efekty */}
      <div className="all-effects-section">
        <h4>🎯 Dodaj nowe efekty</h4>
        
        {categories.map(category => {
          const categoryEffects = availableEffects.filter(effect => effect.category === category.name);
          
          return (
            <div key={category.name} className={`effect-category category-${category.name}`}>
              <div className="category-header">
                <h4>{category.label}</h4>
                <p className="category-description">{category.description}</p>
              </div>
              
              <div className="effect-buttons-grid">
                {categoryEffects.map(effect => {
                  const isActive = isEffectActive(effect.name);
                  
                  return (
                    <button
                      key={effect.name}
                      className={`effect-btn effect-btn-${category.name} ${isActive ? 'active' : ''}`}
                      onClick={() => handleEffectClick(effect.name)}
                      title={`${effect.description} ${isActive ? '(AKTYWNY)' : ''}`}
                    >
                      <span className="effect-emoji">{effect.emoji}</span>
                      <span className="effect-name">{effect.name}</span>
                      {isActive && <span className="active-indicator">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EffectButtons; 