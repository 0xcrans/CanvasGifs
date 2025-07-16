/**
 * Glitch Effects Module
 * Contains all glitch and distortion effects
 */

export const applyGlitch = (canvas, ctx, params = {}) => {
  const { intensity = 20, length = 200, offset = 500 } = params;
  console.log('⚡ Glitch effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Apply random line distortions
  for (let i = 0; i < intensity; i++) {
    const y = Math.floor(Math.random() * canvas.height);
    const lineStart = y * canvas.width * 4;
    const lineEnd = lineStart + canvas.width * 4;
    const shift = Math.floor(Math.random() * offset) - offset / 2;
    
    // Shift RGB channels randomly
    for (let j = lineStart; j < lineEnd; j += 4) {
      if (Math.random() < 0.1) {
        data[j] = Math.min(255, data[j] + shift); // Red
        data[j + 2] = Math.max(0, data[j + 2] - shift); // Blue
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyRGBSplit = (canvas, ctx, params = {}) => {
  const { offset = 10, redShift = 0, blueShift = 0 } = params;
  console.log('🔴 RGB Split effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      
      // Red channel offset
      const redX = Math.max(0, Math.min(canvas.width - 1, x + offset + redShift));
      const redIndex = (y * canvas.width + redX) * 4;
      
      // Blue channel offset
      const blueX = Math.max(0, Math.min(canvas.width - 1, x - offset + blueShift));
      const blueIndex = (y * canvas.width + blueX) * 4;
      
      newData[i] = data[redIndex]; // Red from shifted position
      newData[i + 1] = data[i + 1]; // Green stays
      newData[i + 2] = data[blueIndex + 2]; // Blue from shifted position
      newData[i + 3] = data[i + 3]; // Alpha stays
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyDatamosh = (canvas, ctx, params = {}) => {
  const { probability = 0.1, range = 1000 } = params;
  console.log('📱 Datamosh effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < probability) {
      const targetIndex = Math.floor(Math.random() * (data.length / 4)) * 4;
      if (targetIndex < data.length - 4) {
        data[i] = data[targetIndex];
        data[i + 1] = data[targetIndex + 1];
        data[i + 2] = data[targetIndex + 2];
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyVHS = (canvas, ctx, params = {}) => {
  const { lineProbability = 0.1, maxShift = 20 } = params;
  console.log('📼 VHS effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let y = 0; y < canvas.height; y++) {
    if (Math.random() < lineProbability) {
      const shift = Math.floor(Math.random() * maxShift * 2) - maxShift;
      
      for (let x = 0; x < canvas.width; x++) {
        const sourceX = Math.max(0, Math.min(canvas.width - 1, x + shift));
        const targetIndex = (y * canvas.width + x) * 4;
        const sourceIndex = (y * canvas.width + sourceX) * 4;
        
        data[targetIndex] = data[sourceIndex];
        data[targetIndex + 1] = data[sourceIndex + 1];
        data[targetIndex + 2] = data[sourceIndex + 2];
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyPixelSort = (canvas, ctx, params = {}) => {
  const { threshold = 100, direction = 'horizontal', mode = 'brightness' } = params;
  console.log('🎨 Pixel Sort effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const getBrightness = (r, g, b) => (r + g + b) / 3;
  const getHue = (r, g, b) => {
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    let h = 0;
    
    if (max !== min) {
      const d = max - min;
      switch (max) {
        case r / 255: h = (g - b) / 255 / d + (g < b ? 6 : 0); break;
        case g / 255: h = (b - r) / 255 / d + 2; break;
        case b / 255: h = (r - g) / 255 / d + 4; break;
      }
      h /= 6;
    }
    return h * 360;
  };
  
  if (direction === 'horizontal') {
    for (let y = 0; y < canvas.height; y++) {
      const pixels = [];
      
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        let sortValue;
        switch (mode) {
          case 'hue': sortValue = getHue(r, g, b); break;
          case 'saturation': sortValue = Math.max(r, g, b) - Math.min(r, g, b); break;
          default: sortValue = getBrightness(r, g, b); break;
        }
        
        pixels.push({ r, g, b, a, sortValue, x });
      }
      
      // Sort pixels based on sort value
      pixels.sort((a, b) => a.sortValue - b.sortValue);
      
      // Apply sorted pixels back
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const pixel = pixels[x];
        
        data[i] = pixel.r;
        data[i + 1] = pixel.g;
        data[i + 2] = pixel.b;
        data[i + 3] = pixel.a;
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyNoise = (canvas, ctx, params = {}) => {
  const { intensity = 0.5 } = params;
  console.log('📺 Noise effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity * 255;
    
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyCorruption = (canvas, ctx, params = {}) => {
  const { severity = 0.1, blockSize = 4 } = params;
  console.log('💥 Corruption effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let y = 0; y < canvas.height; y += blockSize) {
    for (let x = 0; x < canvas.width; x += blockSize) {
      if (Math.random() < severity) {
        const corruptValue = Math.floor(Math.random() * 256);
        
        for (let dy = 0; dy < blockSize; dy++) {
          for (let dx = 0; dx < blockSize; dx++) {
            const px = x + dx;
            const py = y + dy;
            
            if (px < canvas.width && py < canvas.height) {
              const i = (py * canvas.width + px) * 4;
              data[i] = corruptValue;
              data[i + 1] = corruptValue;
              data[i + 2] = corruptValue;
            }
          }
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// Animated versions with time
export const applyGlitchWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { frequency = 0.5, types = 'all', intensity = 20 } = params;
  
  // Pulsujący glitch z okresami intensywności
  const glitchWave = Math.sin(timeInSeconds * frequency * Math.PI * 2);
  const shouldGlitch = glitchWave > 0.3; // Glitch pojawia się okresowo
  
  if (shouldGlitch) {
    const animatedIntensity = intensity * (0.5 + Math.abs(glitchWave) * 1.5);
    console.log('⚡ Glitch WithTime effect applied');
    applyGlitch(canvas, ctx, { ...params, intensity: animatedIntensity });
  }
};

export const applyRGBSplitWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { speed = 1.5, intensity = 12, delay = 30 } = params;
  
  // Bardziej dramatyczna animacja z większym ruchem
  const animatedOffset = Math.sin(timeInSeconds * speed) * intensity * 2;
  const animatedRedShift = Math.cos(timeInSeconds * speed * 1.3) * intensity;
  const animatedBlueShift = Math.sin(timeInSeconds * speed * 0.8) * intensity;
  
  console.log('🔴 RGB Split WithTime effect applied');
  applyRGBSplit(canvas, ctx, { 
    ...params, 
    offset: Math.abs(animatedOffset) + 5, // Zawsze widoczne przesunięcie
    redShift: animatedRedShift,
    blueShift: animatedBlueShift
  });
};

export const applyDatamoshWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { probability = 0.1, range = 1000, speed = 1.0 } = params;
  const animatedTime = timeInSeconds * speed;
  
  console.log('📱 Datamosh WithTime effect applied');
  console.log('📱 Animated time:', animatedTime);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Animate the datamosh effect with time
  const animatedProbability = probability * (0.5 + Math.sin(animatedTime * 2) * 0.5);
  
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < animatedProbability) {
      const targetIndex = Math.floor(Math.random() * (data.length / 4)) * 4;
      if (targetIndex < data.length - 4) {
        data[i] = data[targetIndex];
        data[i + 1] = data[targetIndex + 1];
        data[i + 2] = data[targetIndex + 2];
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyVHSWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  console.log('📼 VHS WithTime effect applied');
  applyVHS(canvas, ctx, params);
};

export const applyPixelSortWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { threshold = 100, direction = 'horizontal', mode = 'brightness', speed = 1.0 } = params;
  const animatedTime = timeInSeconds * speed;
  
  console.log('🎨 Pixel Sort WithTime effect applied');
  console.log('🎨 Animated time:', animatedTime);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const getBrightness = (r, g, b) => (r + g + b) / 3;
  const getHue = (r, g, b) => {
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    let h = 0;
    
    if (max !== min) {
      const d = max - min;
      switch (max) {
        case r / 255: h = (g - b) / 255 / d + (g < b ? 6 : 0); break;
        case g / 255: h = (b - r) / 255 / d + 2; break;
        case b / 255: h = (r - g) / 255 / d + 4; break;
      }
      h /= 6;
    }
    return h * 360;
  };
  
  // Animate the sorting threshold
  const animatedThreshold = threshold * (0.8 + Math.sin(animatedTime * 3) * 0.2);
  
  if (direction === 'horizontal') {
    for (let y = 0; y < canvas.height; y++) {
      const pixels = [];
      
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        let sortValue;
        switch (mode) {
          case 'hue': sortValue = getHue(r, g, b); break;
          case 'saturation': sortValue = Math.max(r, g, b) - Math.min(r, g, b); break;
          default: sortValue = getBrightness(r, g, b); break;
        }
        
        pixels.push({ r, g, b, a, sortValue, x });
      }
      
      // Sort pixels based on sort value with animated threshold
      pixels.sort((a, b) => {
        if (a.sortValue > animatedThreshold && b.sortValue > animatedThreshold) {
          return a.sortValue - b.sortValue;
        }
        return 0;
      });
      
      // Apply sorted pixels back
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const pixel = pixels[x];
        
        data[i] = pixel.r;
        data[i + 1] = pixel.g;
        data[i + 2] = pixel.b;
        data[i + 3] = pixel.a;
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyNoiseWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const animatedIntensity = params.intensity * (0.5 + Math.sin(timeInSeconds * 5) * 0.5);
  console.log('📺 Noise WithTime effect applied');
  applyNoise(canvas, ctx, { ...params, intensity: animatedIntensity });
};

export const applyCorruptionWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  console.log('💥 Corruption WithTime effect applied');
  applyCorruption(canvas, ctx, params);
};

// Additional glitch effects
export const applyPixelDrift = (canvas, ctx, params = {}) => {
  const { intensity = 1.0, direction = 'horizontal' } = params;
  console.log('⬆️ Pixel Drift effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      
      if (direction === 'horizontal') {
        // Drift horizontally
        const driftX = Math.sin(x * 0.01) * intensity * 5;
        const sourceX = Math.floor(x + driftX);
        
        if (sourceX >= 0 && sourceX < canvas.width) {
          const sourceI = (y * canvas.width + sourceX) * 4;
          newData[i] = data[sourceI];
          newData[i + 1] = data[sourceI + 1];
          newData[i + 2] = data[sourceI + 2];
          newData[i + 3] = data[sourceI + 3];
        }
      } else {
        // Drift vertically
        const driftY = Math.sin(y * 0.01) * intensity * 5;
        const sourceY = Math.floor(y + driftY);
        
        if (sourceY >= 0 && sourceY < canvas.height) {
          const sourceI = (sourceY * canvas.width + x) * 4;
          newData[i] = data[sourceI];
          newData[i + 1] = data[sourceI + 1];
          newData[i + 2] = data[sourceI + 2];
          newData[i + 3] = data[sourceI + 3];
        }
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyPixelDriftWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { speed = 1.0 } = params;
  const animatedIntensity = (params.intensity || 1.0) * (0.5 + Math.sin(timeInSeconds * speed) * 0.5);
  console.log('⬆️ Pixel Drift WithTime effect applied');
  applyPixelDrift(canvas, ctx, { ...params, intensity: animatedIntensity });
}; 