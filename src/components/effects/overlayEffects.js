/**
 * Overlay Effects Module
 * Contains effects that add overlays and textures to images
 */

export const applyScanlines = (canvas, ctx, params = {}) => {
  const { lineHeight = 2, opacity = 0.5, color = '#000000' } = params;
  console.log('📺 Scanlines effect applied');
  
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let y = 0; y < canvas.height; y += lineHeight * 2) {
    for (let x = 0; x < canvas.width; x++) {
      for (let ly = 0; ly < lineHeight && y + ly < canvas.height; ly++) {
        const i = ((y + ly) * canvas.width + x) * 4;
        data[i] = data[i] * (1 - opacity) + r * opacity;
        data[i + 1] = data[i + 1] * (1 - opacity) + g * opacity;
        data[i + 2] = data[i + 2] * (1 - opacity) + b * opacity;
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyInterlacing = (canvas, ctx, params = {}) => {
  const { lineHeight = 2, offset = 1 } = params;
  console.log('📟 Interlacing effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let y = 0; y < canvas.height; y += lineHeight) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      
      // Darken even lines
      if (Math.floor(y / lineHeight) % 2 === 0) {
        data[i] *= 0.7;
        data[i + 1] *= 0.7;
        data[i + 2] *= 0.7;
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyFilmGrain = (canvas, ctx, params = {}) => {
  const { intensity = 0.3, size = 1 } = params;
  console.log('🎞️ Film Grain effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let y = 0; y < canvas.height; y += size) {
    for (let x = 0; x < canvas.width; x += size) {
      const grain = (Math.random() - 0.5) * intensity * 255;
      
      for (let dy = 0; dy < size && y + dy < canvas.height; dy++) {
        for (let dx = 0; dx < size && x + dx < canvas.width; dx++) {
          const i = ((y + dy) * canvas.width + (x + dx)) * 4;
          data[i] = Math.max(0, Math.min(255, data[i] + grain));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyCRTTV = (canvas, ctx, params = {}) => {
  const { curvature = 0.1, vignette = 0.3, glow = 0.2 } = params;
  console.log('📺 CRT TV effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      // Apply CRT curvature
      const dx = (x - centerX) / centerX;
      const dy = (y - centerY) / centerY;
      
      const r = Math.sqrt(dx * dx + dy * dy);
      const curve = 1 + curvature * r * r;
      
      const sourceX = Math.floor(centerX + dx * centerX / curve);
      const sourceY = Math.floor(centerY + dy * centerY / curve);
      
      const targetIndex = (y * canvas.width + x) * 4;
      
      if (sourceX >= 0 && sourceX < canvas.width && sourceY >= 0 && sourceY < canvas.height) {
        const sourceIndex = (sourceY * canvas.width + sourceX) * 4;
        newData[targetIndex] = data[sourceIndex];
        newData[targetIndex + 1] = data[sourceIndex + 1];
        newData[targetIndex + 2] = data[sourceIndex + 2];
        newData[targetIndex + 3] = data[sourceIndex + 3];
      }
      
      // Apply vignette
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const vignetteStrength = Math.max(0, 1 - (distance / maxRadius) * vignette);
      
      newData[targetIndex] *= vignetteStrength;
      newData[targetIndex + 1] *= vignetteStrength;
      newData[targetIndex + 2] *= vignetteStrength;
      
      // Add glow
      if (glow > 0) {
        const glowAmount = glow * 50;
        newData[targetIndex] = Math.min(255, newData[targetIndex] + glowAmount);
        newData[targetIndex + 1] = Math.min(255, newData[targetIndex + 1] + glowAmount);
        newData[targetIndex + 2] = Math.min(255, newData[targetIndex + 2] + glowAmount);
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
  
  // Add scanlines
  applyScanlines(canvas, ctx, { lineHeight: 2, opacity: 0.2 });
};

export const applyParticleSystem = (canvas, ctx, params = {}) => {
  const { particleCount = 100, particleSize = 2, color = '#ffffff', speed = 1.0 } = params;
  console.log('✨ Particle System effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  // Generate particles based on bright areas
  for (let i = 0; i < particleCount; i++) {
    let particleX, particleY;
    let attempts = 0;
    
    // Try to place particles on bright areas
    do {
      particleX = Math.floor(Math.random() * canvas.width);
      particleY = Math.floor(Math.random() * canvas.height);
      attempts++;
    } while (attempts < 10);
    
    // Draw particle
    for (let dy = -particleSize; dy <= particleSize; dy++) {
      for (let dx = -particleSize; dx <= particleSize; dx++) {
        const px = particleX + dx;
        const py = particleY + dy;
        
        if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= particleSize) {
            const opacity = (particleSize - distance) / particleSize;
            const particleIndex = (py * canvas.width + px) * 4;
            
            data[particleIndex] = Math.min(255, data[particleIndex] + r * opacity);
            data[particleIndex + 1] = Math.min(255, data[particleIndex + 1] + g * opacity);
            data[particleIndex + 2] = Math.min(255, data[particleIndex + 2] + b * opacity);
          }
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyCompressionArtifacts = (canvas, ctx, params = {}) => {
  const { quality = 30, blockiness = 5 } = params;
  console.log('📦 Compression Artifacts effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const blockSize = 8;
  
  for (let y = 0; y < canvas.height; y += blockSize) {
    for (let x = 0; x < canvas.width; x += blockSize) {
      // Quantize block colors
      let avgR = 0, avgG = 0, avgB = 0, count = 0;
      
      for (let dy = 0; dy < blockSize && y + dy < canvas.height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < canvas.width; dx++) {
          const i = ((y + dy) * canvas.width + (x + dx)) * 4;
          avgR += data[i];
          avgG += data[i + 1];
          avgB += data[i + 2];
          count++;
        }
      }
      
      avgR = Math.floor(avgR / count / quality) * quality;
      avgG = Math.floor(avgG / count / quality) * quality;
      avgB = Math.floor(avgB / count / quality) * quality;
      
      // Apply quantized colors to block
      const blockStrength = blockiness / 10;
      
      for (let dy = 0; dy < blockSize && y + dy < canvas.height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < canvas.width; dx++) {
          const i = ((y + dy) * canvas.width + (x + dx)) * 4;
          data[i] = data[i] * (1 - blockStrength) + avgR * blockStrength;
          data[i + 1] = data[i + 1] * (1 - blockStrength) + avgG * blockStrength;
          data[i + 2] = data[i + 2] * (1 - blockStrength) + avgB * blockStrength;
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyBadReception = (canvas, ctx, params = {}) => {
  const { noiseLevel = 0.5, lineDistortion = 1.0 } = params;
  console.log('📡 Bad Reception effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Add static noise
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < noiseLevel * 0.1) {
      const noise = Math.random() * 255;
      data[i] = noise;
      data[i + 1] = noise;
      data[i + 2] = noise;
    }
  }
  
  // Add line distortion
  for (let y = 0; y < canvas.height; y++) {
    if (Math.random() < lineDistortion * 0.05) {
      const shift = (Math.random() - 0.5) * 20;
      
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

export const applyLCDDamage = (canvas, ctx, params = {}) => {
  const { deadPixels = 0.01, colorShift = 10 } = params;
  console.log('💔 LCD Damage effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Add dead pixels
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < deadPixels) {
      const deadType = Math.random();
      if (deadType < 0.33) {
        // Dead black pixel
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      } else if (deadType < 0.66) {
        // Stuck white pixel
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      } else {
        // Stuck color pixel
        data[i] = 255;
        data[i + 1] = 0;
        data[i + 2] = 0;
      }
    }
  }
  
  // Add color shift
  for (let i = 0; i < data.length; i += 4) {
    const shift = (Math.random() - 0.5) * colorShift;
    data[i] = Math.max(0, Math.min(255, data[i] + shift));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + shift));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + shift));
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyBitcrush = (canvas, ctx, params = {}) => {
  const { bitDepth = 4, ditherAmount = 0.5 } = params;
  console.log('🔢 Bitcrush effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const levels = Math.pow(2, bitDepth);
  const step = 255 / (levels - 1);
  
  for (let i = 0; i < data.length; i += 4) {
    // Apply bit reduction
    data[i] = Math.round(data[i] / step) * step;
    data[i + 1] = Math.round(data[i + 1] / step) * step;
    data[i + 2] = Math.round(data[i + 2] / step) * step;
    
    // Add dithering
    if (ditherAmount > 0) {
      const dither = (Math.random() - 0.5) * ditherAmount * step;
      data[i] = Math.max(0, Math.min(255, data[i] + dither));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + dither));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + dither));
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// Animated versions with time
export const applyScanlinesWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  console.log('📺 Scanlines WithTime effect applied');
  applyScanlines(canvas, ctx, params);
};

export const applyInterlacingWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  console.log('📟 Interlacing WithTime effect applied');
  applyInterlacing(canvas, ctx, params);
};

export const applyFilmGrainWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const animatedIntensity = params.intensity * (0.8 + Math.sin(timeInSeconds * 5) * 0.2);
  console.log('🎞️ Film Grain WithTime effect applied');
  applyFilmGrain(canvas, ctx, { ...params, intensity: animatedIntensity });
};

export const applyCRTTVWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  console.log('📺 CRT TV WithTime effect applied');
  applyCRTTV(canvas, ctx, params);
};

export const applyParticleSystemWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  console.log('✨ Particle System WithTime effect applied');
  applyParticleSystem(canvas, ctx, params);
};

export const applyCompressionArtifactsWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  console.log('📦 Compression Artifacts WithTime effect applied');
  applyCompressionArtifacts(canvas, ctx, params);
};

export const applyBadReceptionWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  console.log('📡 Bad Reception WithTime effect applied');
  applyBadReception(canvas, ctx, params);
};

export const applyLCDDamageWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  console.log('💔 LCD Damage WithTime effect applied');
  applyLCDDamage(canvas, ctx, params);
};

export const applyBitcrushWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  console.log('🔢 Bitcrush WithTime effect applied');
  applyBitcrush(canvas, ctx, params);
}; 