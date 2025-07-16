# 🌀 Psychedelic Animation Framework

**Profesjonalny framework do tworzenia psychodelicznych animacji w React**

Wykorzystuje potęgę czterech najlepszych bibliotek animacji:
- **🌊 Anime.js** - płynne morphingi i elastic easing
- **💫 Unity-style effects** - bloom, chromatic aberration, distortion
- **⚡ GSAP** - zaawansowane timeline i fizyka
- **🔮 Three.js** - 3D efekty i fragment shadery

## ✨ Funkcje

### 🎨 Modułowy System Efektów
- **4 kategorie efektów**: Anime.js, Unity, GSAP, Three.js
- **25+ gotowych efektów** z presetami
- **Inteligentna selekcja elementów** (kategoria, złożoność, kolor, rozmiar)
- **Kombinowanie efektów** dla unikalnych rezultatów

### ⏱️ Zaawansowany Timeline Editor
- **Wizualny timeline** z drag & drop
- **Presety animacji** (Gentle Flow, Psychedelic Burst, etc.)
- **Kontrola timing'u** z precyzją do 0.1s
- **Live preview** podczas edycji

### 💾 Uniwersalny Export
- **GIF** - uniwersalny format animacji
- **MP4/WebM** - wysokiej jakości video
- **SVG** - skalowalne animacje wektorowe
- **JSON** - dane do późniejszej edycji
- **Lottie** - format dla aplikacji mobilnych

### 🧠 Inteligentna Analiza SVG
- **Automatyczna detekcja** elementów i ich właściwości
- **Kategoryzacja** (ścieżki, kształty, grupy)
- **Analiza kolorów** z tolerancją
- **Ocena złożoności** dla lepszego dopasowania efektów

## 🚀 Szybki Start

### Instalacja
```bash
npm install
npm start
```

### Podstawowe Użycie

1. **Załaduj SVG** - umieść swój plik SVG w folderze `public/`
2. **Wybierz efekty** - kliknij kategorię i preset efektu
3. **Skomponuj timeline** - dodaj kroki animacji w czasie
4. **Eksportuj** - wybierz format i pobierz animację

### Przykład: Prosty Psychodeliczny Efekt

```javascript
// 1. Wybierz elementy
const selector = { 
  category: 'complex-shape', // tylko ścieżki
  percentage: 50 // 50% losowych elementów
};

// 2. Zastosuj efekt
const effects = [
  {
    module: 'anime',
    type: 'morphPath',
    params: { duration: 3000, easing: 'easeOutElastic(1, .8)' },
    selector
  },
  {
    module: 'unity', 
    type: 'bloom',
    params: { intensity: 2.5, threshold: 0.7 },
    selector: {} // wszystkie elementy
  }
];

// 3. Stwórz timeline
const timeline = [
  {
    startTime: 0,
    duration: 4,
    effects: ['anime.morphPath', 'unity.bloom']
  }
];
```

## 📖 Dokumentacja Efektów

### 🌊 Anime.js Effects

#### morphPath
Płynna transformacja ścieżek SVG
```javascript
{
  duration: 3000,
  easing: 'easeOutElastic(1, .8)',
  morphSteps: 3,
  direction: 'alternate'
}
```

#### elasticScale  
Elastyczne skalowanie z charakterystycznym odbiciem
```javascript
{
  scale: [1, 1.5, 0.8, 1.2, 1],
  easing: 'easeOutElastic(1, .6)',
  delay: anime.stagger(50)
}
```

#### colorMorph
Płynne przejścia kolorów
```javascript
{
  colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
  duration: 2500,
  delay: anime.stagger(80)
}
```

### 💫 Unity Effects

#### bloom
Efekt świecenia jak w Unity post-processing
```javascript
{
  intensity: 2.5,
  threshold: 0.7,
  radius: 1,
  animateIntensity: true
}
```

#### chromaticAberration
Rozdzielenie kanałów kolorów
```javascript
{
  redOffset: [5, 0],
  greenOffset: [0, 0],
  blueOffset: [-5, 0],
  animate: true
}
```

### ⚡ GSAP Effects

#### professionalMorph
Zaawansowany morphing z custom easing
```javascript
{
  morphType: 'organic', // 'organic', 'geometric', 'liquid'
  intensity: 1,
  ease: 'elastic.out(1, 0.3)'
}
```

#### physicsAnimation
Animacja z symulacją fizyki
```javascript
{
  gravity: 980,
  bounce: 0.7,
  friction: 0.8,
  initialVelocity: { x: 0, y: -500 }
}
```

### 🔮 Three.js Effects

#### displacementMap
Zniekształcenie przez fragment shader
```javascript
{
  amplitude: 0.1,
  frequency: 5.0,
  type: 'wave', // 'wave', 'noise', 'spiral'
  speed: 1.0
}
```

#### particleSystem
3D system cząsteczek
```javascript
{
  count: 1000,
  behavior: 'swirl', // 'float', 'swirl', 'explode'
  color: '#ffffff'
}
```

## 🎯 Selektor Elementów

### Kategorie
- `complex-shape` - ścieżki i złożone kształty
- `simple-shape` - koła, prostokąty, linie
- `group` - grupy elementów
- `text` - elementy tekstowe

### Filtrowanie
```javascript
const selector = {
  category: 'complex-shape',
  complexity: { min: 5, max: 10 },
  color: { target: '#ff0000', tolerance: 50 },
  size: { min: 100, max: 1000 },
  percentage: 25, // 25% elementów
  random: 10 // 10 losowych elementów
};
```

## 🛠️ Zaawansowane Funkcje

### Timeline Presets
- **🌊 Gentle Flow** - spokojne, płynne animacje
- **💥 Psychedelic Burst** - intensywne efekty
- **🔮 Mystical Journey** - mistyczne przejścia  
- **⚡ Electric Storm** - dynamiczne animacje

### Export Settings
```javascript
const exportSettings = {
  format: 'mp4',
  width: 1080,
  height: 1080,
  fps: 30,
  quality: 'high',
  duration: 10,
  loop: true
};
```

### Social Media Presets
- **Instagram Post** - 1080×1080
- **Instagram Story** - 1080×1920
- **Twitter Post** - 1200×675
- **Facebook Post** - 1200×630
- **YouTube Thumbnail** - 1280×720

## 🎨 Przykłady Użycia

### Animacja Logo
```javascript
// Morphing logo z bloom efektem
const logoAnimation = {
  effects: [
    { module: 'anime', type: 'morphPath', selector: { category: 'complex-shape' }},
    { module: 'unity', type: 'bloom', selector: {} }
  ],
  timeline: [
    { startTime: 0, duration: 3, effects: ['anime.morphPath'] },
    { startTime: 1, duration: 4, effects: ['unity.bloom'] }
  ]
};
```

### Social Media Content
```javascript
// Psychodeliczny post na Instagram
const instagramPost = {
  exportSettings: { 
    format: 'mp4', 
    width: 1080, 
    height: 1080,
    duration: 15 
  },
  effects: [
    { module: 'three', type: 'colorDistortion' },
    { module: 'gsap', type: 'staggeredComplex' }
  ]
};
```

### Prezentacja/Slideshow
```javascript
// Efekty przejścia między slajdami
const slideTransition = {
  effects: [
    { module: 'gsap', type: 'dissolveEffect', params: { direction: 'scatter' }},
    { module: 'unity', type: 'chromaticAberration' }
  ]
};
```

## 🔧 Konfiguracja

### Dostosowanie Easing Functions
```javascript
// Własne funkcje easing dla GSAP
gsap.registerEase("customBounce", "M0,0 C0.14,0 0.242,0.438 0.272,0.561 0.313,0.728 0.354,0.963 0.362,1 0.37,0.985 0.414,0.928 0.455,0.767 0.51,0.54 0.572,0.308 0.604,0.194 0.633,0.09 0.666,0.05 0.666,0.05 0.666,0.05 0.683,0.152 0.683,0.152 0.683,0.152 0.717,0.693 0.717,0.693 0.717,0.693 0.75,0.699 0.75,0.699 0.75,0.699 0.767,0.588 0.767,0.588 0.767,0.588 0.8,0.5 0.8,0.5 0.8,0.5 0.817,0.431 0.817,0.431 0.817,0.431 0.833,0.421 0.833,0.421 0.833,0.421 0.85,0.44 0.85,0.44 0.85,0.44 0.867,0.48 0.867,0.48 0.867,0.48 0.883,0.551 0.883,0.551 0.883,0.551 0.9,0.591 0.9,0.591 0.9,0.591 0.917,0.638 0.917,0.638 0.917,0.638 0.933,0.677 0.933,0.677 0.933,0.677 0.95,0.707 0.95,0.707 0.95,0.707 0.967,0.728 0.967,0.728 0.967,0.728 0.983,0.738 0.983,0.738 0.983,0.738 1,0.74 1,0.74");
```

### Custom Shader Effects
```glsl
// Fragment shader dla Three.js
uniform float time;
uniform float intensity;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Psychodeliczny noise
  float noise = sin(uv.x * 10.0 + time) * cos(uv.y * 10.0 + time);
  uv += noise * intensity * 0.1;
  
  // Rainbow colors
  vec3 color = vec3(
    sin(time + uv.x * 3.14159),
    sin(time + uv.y * 3.14159 + 2.0),
    sin(time + (uv.x + uv.y) * 3.14159 + 4.0)
  ) * 0.5 + 0.5;
  
  gl_FragColor = vec4(color, 1.0);
}
```

## 🤝 Rozszerzanie Frameworku

### Tworzenie Własnych Efektów
```javascript
// Nowy moduł efektów
export class CustomEffects {
  initialize(svgElement) {
    this.svgElement = svgElement;
  }
  
  myCustomEffect(elements, params = {}) {
    // Implementacja efektu
    elements.forEach(elementData => {
      // Manipulacja elementu
    });
    
    return effectId;
  }
}

// Rejestracja w EffectEngine
engine.registerEffectModule('custom', new CustomEffects());
```

## 📝 Licencja

MIT License - możesz używać komercyjnie i modyfikować kod.

## 🙏 Podziękowania

- **Anime.js** - https://animejs.com/
- **GSAP** - https://greensock.com/gsap/
- **Three.js** - https://threejs.org/
- **React** - https://reactjs.org/

---

**Stworzony z ❤️ dla psychodelicznych wizualizacji**

🌀 *"Turn your art into mesmerizing animations"* 