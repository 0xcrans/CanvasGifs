/**
 * Effects Module Index
 * Central export point for all effect functions
 */

// Color effects
export {
  applyInvert,
  applyContrast,
  applySaturation,
  applyHueShift,
  applySepia,
  applyPosterize,
  applyVintage,
  applyDuotone,
  applyBlur,
  applyColorCycleWithTime,
  applyColorBleed,
  applyColorBleedWithTime,
  applyCrossProcessing,
  applyNeon
} from './colorEffects.js';

// New effects (fractal, light, visual, spacetime)
export {
  // Fractal effects
  applyFractalPatterns,
  applyMandelbrotZoom,
  applyJuliaSets,
  applyFractalZoom,
  applyMandelbrotZoomWithTime,
  applyJuliaSetsWithTime,
  applyFractalZoomWithTime,
  
  // Light effects
  applyLightTrails,
  applyNeonGlow,
  applyLaserBeams,
  applyPrismEffect,
  applyLightTrailsWithTime,
  applyNeonGlowWithTime,
  applyLaserBeamsWithTime,
  applyPrismEffectWithTime,
  
  // Visual effects
  applyMeltEffect,
  applyLiquidMetal,
  applyPlasmaEffect,
  applyTieDye,
  applyOilSpill,
  applyBubbleDistortion,
  applyMeltEffectWithTime,
  applyLiquidMetalWithTime,
  applyPlasmaEffectWithTime,
  applyTieDyeWithTime,
  applyOilSpillWithTime,
  applyBubbleDistortionWithTime,
  
  // Spacetime effects
  applyTimeEcho,
  applyMotionBlurTrails,
  applyFeedbackLoop,
  applyInfiniteMirror,
  applyWormhole,
  applyTimeEchoWithTime,
  applyMotionBlurTrailsWithTime,
  applyFeedbackLoopWithTime,
  applyInfiniteMirrorWithTime,
  applyWormholeWithTime
} from './newEffects.js';

// Glitch effects
export {
  applyGlitch,
  applyRGBSplit,
  applyDatamosh,
  applyVHS,
  applyPixelSort,
  applyNoise,
  applyCorruption,
  applyGlitchWithTime,
  applyRGBSplitWithTime,
  applyDatamoshWithTime,
  applyVHSWithTime,
  applyPixelSortWithTime,
  applyNoiseWithTime,
  applyCorruptionWithTime,
  applyPixelDrift,
  applyPixelDriftWithTime
} from './glitchEffects.js';

// Geometric effects
export {
  applyWave,
  applyRipple,
  applySwirl,
  applyPinch,
  applyFisheye,
  applyKaleidoscope,
  applyMirror,
  applyDisplacement,
  applySpiral,
  applyVortex,
  applyLiquidPixels,
  applyMorph,
  applyWaveWithTime,
  applyRippleWithTime,
  applySwirlWithTime,
  applyPinchWithTime,
  applyFisheyeWithTime,
  applyKaleidoscopeWithTime,
  applyDisplacementWithTime,
  applySpiralWithTime,
  applyVortexWithTime,
  applyLiquidPixelsWithTime,
  applyMorphWithTime
} from './geometricEffects.js';

// Artistic effects
export {
  applyOilPaint,
  applyEmboss,
  applyEdgeDetect,
  applyMosaic,
  applyCrystallize,
  applyHalftone,
  applyCrosshatch,
  applyStippling,
  applyWatercolor,
  applyPencilSketch,
  applyCharcoal,
  applyLinocut,
  applyASCIIArt
} from './artisticEffects.js';

// Overlay effects
export {
  applyScanlines,
  applyInterlacing,
  applyFilmGrain,
  applyCRTTV,
  applyParticleSystem,
  applyCompressionArtifacts,
  applyBadReception,
  applyLCDDamage,
  applyBitcrush,
  applyScanlinesWithTime,
  applyInterlacingWithTime,
  applyFilmGrainWithTime,
  applyCRTTVWithTime,
  applyParticleSystemWithTime,
  applyCompressionArtifactsWithTime,
  applyBadReceptionWithTime,
  applyLCDDamageWithTime,
  applyBitcrushWithTime
} from './overlayEffects.js';

// Animation effects
export {
  applyBreathing,
  applyShake,
  applyOscillate,
  applyStrobe,
  applyBreathingWithTime,
  applyShakeWithTime,
  applyOscillateWithTime,
  applyStrobeWithTime
} from './animationEffects.js';

// Pattern effects
export {
  applyVoronoiDiagram,
  applyTessellation,
  applyTriangulation,
  applyHexagonalGrid
} from './patternEffects.js';

// Optical effects
export {
  applyLensFlare,
  applyDepthOfField,
  applyChromostereopsis,
  applyAnaglyph3D
} from './opticalEffects.js';

// Basic effects
export {
  applyDithering
} from './basicEffects.js';

// Effect registry for easy lookup
export const EFFECT_REGISTRY = {
  // Color Effects
  'Invert': { func: 'applyInvert', category: 'color', animated: false },
  'Contrast': { func: 'applyContrast', category: 'color', animated: false },
  'Saturation': { func: 'applySaturation', category: 'color', animated: false },
  'Hue Shift': { func: 'applyHueShift', category: 'color', animated: false },
  'Sepia': { func: 'applySepia', category: 'color', animated: false },
  'Posterize': { func: 'applyPosterize', category: 'color', animated: false },
  'Vintage': { func: 'applyVintage', category: 'color', animated: false },
  'Duotone': { func: 'applyDuotone', category: 'color', animated: false },
  'Blur': { func: 'applyBlur', category: 'color', animated: false },
  'Color Cycle': { func: 'applyColorCycleWithTime', category: 'color', animated: true },

  // Glitch Effects
  'Glitch': { func: 'applyGlitch', funcWithTime: 'applyGlitchWithTime', category: 'glitch', animated: true },
  'RGB Split': { func: 'applyRGBSplit', funcWithTime: 'applyRGBSplitWithTime', category: 'glitch', animated: true },
  'Datamosh': { func: 'applyDatamosh', funcWithTime: 'applyDatamoshWithTime', category: 'glitch', animated: true },
  'VHS': { func: 'applyVHS', funcWithTime: 'applyVHSWithTime', category: 'glitch', animated: true },
  'Pixelsort': { func: 'applyPixelSort', funcWithTime: 'applyPixelSortWithTime', category: 'glitch', animated: true },
  'Noise': { func: 'applyNoise', funcWithTime: 'applyNoiseWithTime', category: 'glitch', animated: true },
  'Corruption': { func: 'applyCorruption', funcWithTime: 'applyCorruptionWithTime', category: 'glitch', animated: true },

  // Geometric Effects
  'Wave': { func: 'applyWave', funcWithTime: 'applyWaveWithTime', category: 'geometric', animated: true },
  'Ripple': { func: 'applyRipple', funcWithTime: 'applyRippleWithTime', category: 'geometric', animated: true },
  'Swirl': { func: 'applySwirl', funcWithTime: 'applySwirlWithTime', category: 'geometric', animated: true },
  'Pinch': { func: 'applyPinch', funcWithTime: 'applyPinchWithTime', category: 'geometric', animated: true },
  'Fisheye': { func: 'applyFisheye', funcWithTime: 'applyFisheyeWithTime', category: 'geometric', animated: true },
  'Kaleidoscope': { func: 'applyKaleidoscope', funcWithTime: 'applyKaleidoscopeWithTime', category: 'geometric', animated: true },
  'Mirror': { func: 'applyMirror', category: 'geometric', animated: false },
  'Displacement': { func: 'applyDisplacement', funcWithTime: 'applyDisplacementWithTime', category: 'geometric', animated: true },

  // Artistic Effects
  'Oil Paint': { func: 'applyOilPaint', category: 'artistic', animated: false },
  'Emboss': { func: 'applyEmboss', category: 'artistic', animated: false },
  'Edge Detect': { func: 'applyEdgeDetect', category: 'artistic', animated: false },
  'Mosaic': { func: 'applyMosaic', category: 'artistic', animated: false },
  'Crystallize': { func: 'applyCrystallize', category: 'artistic', animated: false },
  'Halftone': { func: 'applyHalftone', category: 'artistic', animated: false },
  'Crosshatch': { func: 'applyCrosshatch', category: 'artistic', animated: false },
  'Stippling': { func: 'applyStippling', category: 'artistic', animated: false },
  'Watercolor': { func: 'applyWatercolor', category: 'artistic', animated: false },
  'Pencil Sketch': { func: 'applyPencilSketch', category: 'artistic', animated: false },
  'Charcoal': { func: 'applyCharcoal', category: 'artistic', animated: false },
  'Linocut': { func: 'applyLinocut', category: 'artistic', animated: false },
  'ASCII Art': { func: 'applyASCIIArt', category: 'artistic', animated: false },

  // Geometric Effects (additional)
  'Spiral': { func: 'applySpiral', funcWithTime: 'applySpiralWithTime', category: 'geometric', animated: true },
  'Vortex': { func: 'applyVortex', funcWithTime: 'applyVortexWithTime', category: 'geometric', animated: true },
  'Liquid Pixels': { func: 'applyLiquidPixels', funcWithTime: 'applyLiquidPixelsWithTime', category: 'geometric', animated: true },
  'Morph': { func: 'applyMorph', funcWithTime: 'applyMorphWithTime', category: 'geometric', animated: true },

  // Pattern Effects
  'Voronoi Diagram': { func: 'applyVoronoiDiagram', category: 'pattern', animated: false },
  'Tessellation': { func: 'applyTessellation', category: 'pattern', animated: false },
  'Triangulation': { func: 'applyTriangulation', category: 'pattern', animated: false },
  'Hexagonal Grid': { func: 'applyHexagonalGrid', category: 'pattern', animated: false },

  // Color Effects (additional)
  'Cross Processing': { func: 'applyCrossProcessing', category: 'color', animated: false },
  'Neon': { func: 'applyNeon', category: 'color', animated: false },
  'Color Bleed': { func: 'applyColorBleed', category: 'color', animated: true },

  // Glitch Effects (additional)
  'Pixel Drift': { func: 'applyPixelDrift', funcWithTime: 'applyPixelDriftWithTime', category: 'glitch', animated: true },

  // Optical Effects
  'Lens Flare': { func: 'applyLensFlare', category: 'optical', animated: false },
  'Depth of Field': { func: 'applyDepthOfField', category: 'optical', animated: false },
  'Chromostereopsis': { func: 'applyChromostereopsis', category: 'optical', animated: false },
  'Anaglyph 3D': { func: 'applyAnaglyph3D', category: 'optical', animated: false },

  // Overlay Effects (additional)

  // Basic Effects
  'Dithering': { func: 'applyDithering', category: 'basic', animated: false },

  // Overlay Effects
  'Scanlines': { func: 'applyScanlines', funcWithTime: 'applyScanlinesWithTime', category: 'overlay', animated: true },
  'Interlacing': { func: 'applyInterlacing', funcWithTime: 'applyInterlacingWithTime', category: 'overlay', animated: true },
  'Film Grain': { func: 'applyFilmGrain', funcWithTime: 'applyFilmGrainWithTime', category: 'overlay', animated: true },
  'CRT TV': { func: 'applyCRTTV', funcWithTime: 'applyCRTTVWithTime', category: 'overlay', animated: true },
  'Particle System': { func: 'applyParticleSystem', funcWithTime: 'applyParticleSystemWithTime', category: 'overlay', animated: true },
  'Compression Artifacts': { func: 'applyCompressionArtifacts', funcWithTime: 'applyCompressionArtifactsWithTime', category: 'overlay', animated: true },
  'Bad Reception': { func: 'applyBadReception', funcWithTime: 'applyBadReceptionWithTime', category: 'overlay', animated: true },
  'LCD Damage': { func: 'applyLCDDamage', funcWithTime: 'applyLCDDamageWithTime', category: 'overlay', animated: true },
  'Bitcrush': { func: 'applyBitcrush', funcWithTime: 'applyBitcrushWithTime', category: 'overlay', animated: true },

  // Animation Effects
  'Breathing': { func: 'applyBreathing', funcWithTime: 'applyBreathingWithTime', category: 'animation', animated: true },
  'Shake': { func: 'applyShake', funcWithTime: 'applyShakeWithTime', category: 'animation', animated: true },
  'Oscillate': { func: 'applyOscillate', funcWithTime: 'applyOscillateWithTime', category: 'animation', animated: true },
  'Strobe': { func: 'applyStrobe', funcWithTime: 'applyStrobeWithTime', category: 'animation', animated: true },

  // New Fractal Effects
  'Fractal Patterns': { func: 'applyFractalPatterns', category: 'fractal', animated: false },
  'Mandelbrot Zoom': { func: 'applyMandelbrotZoom', funcWithTime: 'applyMandelbrotZoomWithTime', category: 'fractal', animated: true },
  'Julia Sets': { func: 'applyJuliaSets', funcWithTime: 'applyJuliaSetsWithTime', category: 'fractal', animated: true },
  'Fractal Zoom': { func: 'applyFractalZoom', funcWithTime: 'applyFractalZoomWithTime', category: 'fractal', animated: true },

  // New Light Effects  
  'Light Trails': { func: 'applyLightTrails', funcWithTime: 'applyLightTrailsWithTime', category: 'light', animated: true },
  'Neon Glow': { func: 'applyNeonGlow', funcWithTime: 'applyNeonGlowWithTime', category: 'light', animated: true },
  'Laser Beams': { func: 'applyLaserBeams', funcWithTime: 'applyLaserBeamsWithTime', category: 'light', animated: true },
  'Prism Effect': { func: 'applyPrismEffect', funcWithTime: 'applyPrismEffectWithTime', category: 'light', animated: true },

  // New Visual Effects
  'Melt Effect': { func: 'applyMeltEffect', funcWithTime: 'applyMeltEffectWithTime', category: 'visual', animated: true },
  'Liquid Metal': { func: 'applyLiquidMetal', funcWithTime: 'applyLiquidMetalWithTime', category: 'visual', animated: true },
  'Plasma Effect': { func: 'applyPlasmaEffect', funcWithTime: 'applyPlasmaEffectWithTime', category: 'visual', animated: true },
  'Tie Dye': { func: 'applyTieDye', funcWithTime: 'applyTieDyeWithTime', category: 'visual', animated: true },
  'Oil Spill': { func: 'applyOilSpill', funcWithTime: 'applyOilSpillWithTime', category: 'visual', animated: true },
  'Bubble Distortion': { func: 'applyBubbleDistortion', funcWithTime: 'applyBubbleDistortionWithTime', category: 'visual', animated: true },

  // New Spacetime Effects
  'Time Echo': { func: 'applyTimeEcho', funcWithTime: 'applyTimeEchoWithTime', category: 'spacetime', animated: true },
  'Motion Blur Trails': { func: 'applyMotionBlurTrails', funcWithTime: 'applyMotionBlurTrailsWithTime', category: 'spacetime', animated: true },
  'Feedback Loop': { func: 'applyFeedbackLoop', funcWithTime: 'applyFeedbackLoopWithTime', category: 'spacetime', animated: true },
  'Infinite Mirror': { func: 'applyInfiniteMirror', funcWithTime: 'applyInfiniteMirrorWithTime', category: 'spacetime', animated: true },
  'Wormhole': { func: 'applyWormhole', funcWithTime: 'applyWormholeWithTime', category: 'spacetime', animated: true }
};

// Helper function to get effect function by name
export const getEffectFunction = (effectName, animated = false) => {
  const effectInfo = EFFECT_REGISTRY[effectName];
  if (!effectInfo) {
    console.warn(`Effect "${effectName}" not found in registry`);
    return null;
  }

  const functionName = animated && effectInfo.funcWithTime ? effectInfo.funcWithTime : effectInfo.func;
  
  // Dynamic import would go here if we had lazy loading
  // For now, we assume all functions are imported above
  return functionName;
};

// Helper to check if effect supports animation
export const isEffectAnimated = (effectName) => {
  const effectInfo = EFFECT_REGISTRY[effectName];
  return effectInfo ? effectInfo.animated : false;
};

// Get all effects by category
export const getEffectsByCategory = (category) => {
  return Object.entries(EFFECT_REGISTRY)
    .filter(([name, info]) => info.category === category)
    .map(([name, info]) => ({ name, ...info }));
};

// Get statistics about effects
export const getEffectStats = () => {
  const totalEffects = Object.keys(EFFECT_REGISTRY).length;
  const animatedEffects = Object.values(EFFECT_REGISTRY).filter(effect => effect.animated).length;
  const categories = [...new Set(Object.values(EFFECT_REGISTRY).map(effect => effect.category))];
  
  return {
    totalEffects,
    animatedEffects,
    staticEffects: totalEffects - animatedEffects,
    categories: categories.length,
    categoryList: categories
  };
}; 