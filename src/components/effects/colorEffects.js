/**
 * Color Effects Module
 * Contains all color manipulation effects
 */

export const applyInvert = (canvas, ctx) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];       // Red
    data[i + 1] = 255 - data[i + 1]; // Green
    data[i + 2] = 255 - data[i + 2]; // Blue
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyContrast = (canvas, ctx, params = {}) => {
  const { factor = 2.0 } = params;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, (data[i] - 128) * factor + 128));
    data[i + 1] = Math.max(0, Math.min(255, (data[i + 1] - 128) * factor + 128));
    data[i + 2] = Math.max(0, Math.min(255, (data[i + 2] - 128) * factor + 128));
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applySaturation = (canvas, ctx, params = {}) => {
  const { factor = 2.0 } = params;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to grayscale
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Apply saturation
    data[i] = Math.max(0, Math.min(255, gray + factor * (r - gray)));
    data[i + 1] = Math.max(0, Math.min(255, gray + factor * (g - gray)));
    data[i + 2] = Math.max(0, Math.min(255, gray + factor * (b - gray)));
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyHueShift = (canvas, ctx, params = {}) => {
  const { hueShift = 60 } = params;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    
    // Convert RGB to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    // Apply hue shift
    h = (h + hueShift / 360) % 1;
    if (h < 0) h += 1;
    
    // Convert HSL back to RGB
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    let newR, newG, newB;
    
    if (s === 0) {
      newR = newG = newB = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      newR = hue2rgb(p, q, h + 1/3);
      newG = hue2rgb(p, q, h);
      newB = hue2rgb(p, q, h - 1/3);
    }
    
    data[i] = Math.round(newR * 255);
    data[i + 1] = Math.round(newG * 255);
    data[i + 2] = Math.round(newB * 255);
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applySepia = (canvas, ctx, params = {}) => {
  const { intensity = 1 } = params;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const tr = 0.393 * r + 0.769 * g + 0.189 * b;
    const tg = 0.349 * r + 0.686 * g + 0.168 * b;
    const tb = 0.272 * r + 0.534 * g + 0.131 * b;
    
    data[i] = Math.min(255, tr * intensity + r * (1 - intensity));
    data[i + 1] = Math.min(255, tg * intensity + g * (1 - intensity));
    data[i + 2] = Math.min(255, tb * intensity + b * (1 - intensity));
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyPosterize = (canvas, ctx, params = {}) => {
  const { levels = 8 } = params;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const step = 255 / (levels - 1);
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] / step) * step;
    data[i + 1] = Math.round(data[i + 1] / step) * step;
    data[i + 2] = Math.round(data[i + 2] / step) * step;
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyVintage = (canvas, ctx, params = {}) => {
  const { warmth = 1.2, fade = 0.3 } = params;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Vintage color matrix with warmth
    const vr = 0.6 * r + 0.2 * g + 0.2 * b;
    const vg = 0.1 * r + 0.7 * g + 0.2 * b;
    const vb = 0.2 * r + 0.1 * g + 0.7 * b;
    
    // Apply warmth and fade
    data[i] = Math.min(255, vr * warmth * (1 - fade) + 255 * fade);
    data[i + 1] = Math.min(255, vg * (1 - fade) + 255 * fade);
    data[i + 2] = Math.min(255, vb * 0.8 * (1 - fade) + 255 * fade);
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyDuotone = (canvas, ctx, params = {}) => {
  const { color1 = '#ff0000', color2 = '#0000ff' } = params;
  
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };
  
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const factor = gray / 255;
    
    // Interpolate between two colors based on brightness
    data[i] = r1 * (1 - factor) + r2 * factor;
    data[i + 1] = g1 * (1 - factor) + g2 * factor;
    data[i + 2] = b1 * (1 - factor) + b2 * factor;
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyBlur = (canvas, ctx, params = {}) => {
  const { radius = 2 } = params;
  
  ctx.filter = `blur(${radius}px)`;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, 0, 0);
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.filter = 'none';
};

// Color animation effects
export const applyColorCycleWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { speed = 1.0, saturation = 1.0, brightness = 1.0 } = params;
  console.log('🎨 Color Cycle WithTime effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to HSL
    const hsl = rgbToHsl(r, g, b);
    
    // Cycle hue
    hsl[0] = (hsl[0] + timeInSeconds * speed * 60) % 360;
    
    // Adjust saturation and brightness
    hsl[1] = Math.min(100, hsl[1] * saturation);
    hsl[2] = Math.min(100, hsl[2] * brightness);
    
    // Convert back to RGB
    const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
    
    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// Additional color effects
export const applyCrossProcessing = (canvas, ctx, params = {}) => {
  const { intensity = 1.0 } = params;
  console.log('🎞️ Cross Processing effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Cross processing effect - boost shadows and highlights
    const brightness = (r + g + b) / 3;
    const factor = brightness / 255;
    
    const newR = Math.min(255, r + (255 - r) * factor * intensity);
    const newG = Math.min(255, g + (255 - g) * factor * intensity);
    const newB = Math.min(255, b + (255 - b) * factor * intensity);
    
    data[i] = newR;
    data[i + 1] = newG;
    data[i + 2] = newB;
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyNeon = (canvas, ctx, params = {}) => {
  const { intensity = 1.0, color = '#00ffff' } = params;
  console.log('💡 Neon effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Parse neon color
  const neonColor = hexToRgb(color);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const brightness = (r + g + b) / 3;
    const neonFactor = (brightness / 255) * intensity;
    
    data[i] = Math.min(255, r + neonColor[0] * neonFactor);
    data[i + 1] = Math.min(255, g + neonColor[1] * neonFactor);
    data[i + 2] = Math.min(255, b + neonColor[2] * neonFactor);
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyColorBleed = (canvas, ctx, params = {}) => {
  const { intensity = 1.0, direction = 'horizontal' } = params;
  console.log('🩸 Color Bleed effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      
      if (direction === 'horizontal' && x > 0) {
        // Bleed horizontally
        const prevI = (y * canvas.width + (x - 1)) * 4;
        const bleedFactor = intensity * 0.3;
        
        newData[i] = data[i] * (1 - bleedFactor) + data[prevI] * bleedFactor;
        newData[i + 1] = data[i + 1] * (1 - bleedFactor) + data[prevI + 1] * bleedFactor;
        newData[i + 2] = data[i + 2] * (1 - bleedFactor) + data[prevI + 2] * bleedFactor;
        newData[i + 3] = data[i + 3];
      } else if (direction === 'vertical' && y > 0) {
        // Bleed vertically
        const prevI = ((y - 1) * canvas.width + x) * 4;
        const bleedFactor = intensity * 0.3;
        
        newData[i] = data[i] * (1 - bleedFactor) + data[prevI] * bleedFactor;
        newData[i + 1] = data[i + 1] * (1 - bleedFactor) + data[prevI + 1] * bleedFactor;
        newData[i + 2] = data[i + 2] * (1 - bleedFactor) + data[prevI + 2] * bleedFactor;
        newData[i + 3] = data[i + 3];
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyColorBleedWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { speed = 1.0 } = params;
  const animatedIntensity = (params.intensity || 1.0) * (0.5 + Math.sin(timeInSeconds * speed) * 0.5);
  console.log('🩸 Color Bleed WithTime effect applied');
  applyColorBleed(canvas, ctx, { ...params, intensity: animatedIntensity });
};

// Helper functions
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 255, 255];
} 