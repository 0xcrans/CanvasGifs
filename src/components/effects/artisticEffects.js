/**
 * Artistic Effects Module
 * Contains all artistic and painterly effects
 */

export const applyOilPaint = (canvas, ctx, params = {}) => {
  const { radius = 3, intensity = 20 } = params;
  console.log('🎨 Oil Paint effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = radius; y < canvas.height - radius; y++) {
    for (let x = radius; x < canvas.width - radius; x++) {
      const histogram = {};
      let maxCount = 0;
      let dominantColor = { r: 0, g: 0, b: 0 };
      
      // Sample surrounding pixels
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const sampleX = x + dx;
          const sampleY = y + dy;
          const sampleIndex = (sampleY * canvas.width + sampleX) * 4;
          
          const r = Math.floor(data[sampleIndex] / intensity) * intensity;
          const g = Math.floor(data[sampleIndex + 1] / intensity) * intensity;
          const b = Math.floor(data[sampleIndex + 2] / intensity) * intensity;
          
          const colorKey = `${r},${g},${b}`;
          histogram[colorKey] = (histogram[colorKey] || 0) + 1;
          
          if (histogram[colorKey] > maxCount) {
            maxCount = histogram[colorKey];
            dominantColor = { r, g, b };
          }
        }
      }
      
      const targetIndex = (y * canvas.width + x) * 4;
      newData[targetIndex] = dominantColor.r;
      newData[targetIndex + 1] = dominantColor.g;
      newData[targetIndex + 2] = dominantColor.b;
      newData[targetIndex + 3] = data[targetIndex + 3];
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyEmboss = (canvas, ctx, params = {}) => {
  const { strength = 1.0, direction = 45 } = params;
  console.log('⛰️ Emboss effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data.length);
  
  const angle = (direction * Math.PI) / 180;
  const offsetX = Math.round(Math.cos(angle));
  const offsetY = Math.round(Math.sin(angle));
  
  for (let y = 1; y < canvas.height - 1; y++) {
    for (let x = 1; x < canvas.width - 1; x++) {
      const i = (y * canvas.width + x) * 4;
      const iOffset = ((y + offsetY) * canvas.width + (x + offsetX)) * 4;
      
      const gray1 = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const gray2 = (data[iOffset] + data[iOffset + 1] + data[iOffset + 2]) / 3;
      
      const diff = (gray1 - gray2) * strength + 128;
      const embossValue = Math.max(0, Math.min(255, diff));
      
      newData[i] = embossValue;
      newData[i + 1] = embossValue;
      newData[i + 2] = embossValue;
      newData[i + 3] = data[i + 3];
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyEdgeDetect = (canvas, ctx) => {
  console.log('🔍 Edge Detect effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data.length);
  
  // Sobel operator
  const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
  
  for (let y = 1; y < canvas.height - 1; y++) {
    for (let x = 1; x < canvas.width - 1; x++) {
      let pixelX = 0;
      let pixelY = 0;
      
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixelIndex = ((y + ky) * canvas.width + (x + kx)) * 4;
          const gray = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
          
          pixelX += gray * sobelX[ky + 1][kx + 1];
          pixelY += gray * sobelY[ky + 1][kx + 1];
        }
      }
      
      const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
      const edgeValue = Math.min(255, magnitude);
      
      const targetIndex = (y * canvas.width + x) * 4;
      newData[targetIndex] = edgeValue;
      newData[targetIndex + 1] = edgeValue;
      newData[targetIndex + 2] = edgeValue;
      newData[targetIndex + 3] = data[targetIndex + 3];
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyMosaic = (canvas, ctx, params = {}) => {
  const { tileSize = 10, gap = 1 } = params;
  console.log('🧩 Mosaic effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let y = 0; y < canvas.height; y += tileSize) {
    for (let x = 0; x < canvas.width; x += tileSize) {
      // Calculate average color for tile
      let avgR = 0, avgG = 0, avgB = 0, count = 0;
      
      for (let dy = 0; dy < tileSize && y + dy < canvas.height; dy++) {
        for (let dx = 0; dx < tileSize && x + dx < canvas.width; dx++) {
          const i = ((y + dy) * canvas.width + (x + dx)) * 4;
          avgR += data[i];
          avgG += data[i + 1];
          avgB += data[i + 2];
          count++;
        }
      }
      
      avgR = Math.floor(avgR / count);
      avgG = Math.floor(avgG / count);
      avgB = Math.floor(avgB / count);
      
      // Apply average color to tile (with gap)
      for (let dy = gap; dy < tileSize - gap && y + dy < canvas.height; dy++) {
        for (let dx = gap; dx < tileSize - gap && x + dx < canvas.width; dx++) {
          const i = ((y + dy) * canvas.width + (x + dx)) * 4;
          data[i] = avgR;
          data[i + 1] = avgG;
          data[i + 2] = avgB;
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyCrystallize = (canvas, ctx, params = {}) => {
  const { cellSize = 20, edgeThickness = 2 } = params;
  console.log('💎 Crystallize effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Generate random seed points
  const seeds = [];
  for (let y = cellSize / 2; y < canvas.height; y += cellSize) {
    for (let x = cellSize / 2; x < canvas.width; x += cellSize) {
      seeds.push({
        x: x + (Math.random() - 0.5) * cellSize * 0.5,
        y: y + (Math.random() - 0.5) * cellSize * 0.5
      });
    }
  }
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      // Find closest seed
      let minDistance = Infinity;
      let closestSeed = null;
      
      for (const seed of seeds) {
        const distance = Math.sqrt((x - seed.x) ** 2 + (y - seed.y) ** 2);
        if (distance < minDistance) {
          minDistance = distance;
          closestSeed = seed;
        }
      }
      
      if (closestSeed) {
        const sourceIndex = (Math.floor(closestSeed.y) * canvas.width + Math.floor(closestSeed.x)) * 4;
        const targetIndex = (y * canvas.width + x) * 4;
        
        if (sourceIndex >= 0 && sourceIndex < data.length - 3) {
          data[targetIndex] = data[sourceIndex];
          data[targetIndex + 1] = data[sourceIndex + 1];
          data[targetIndex + 2] = data[sourceIndex + 2];
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyHalftone = (canvas, ctx, params = {}) => {
  const { dotSize = 4, angle = 45 } = params;
  console.log('⚫ Halftone effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const angleRad = (angle * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  
  for (let y = 0; y < canvas.height; y += dotSize) {
    for (let x = 0; x < canvas.width; x += dotSize) {
      // Calculate average brightness
      let avgBrightness = 0;
      let count = 0;
      
      for (let dy = 0; dy < dotSize && y + dy < canvas.height; dy++) {
        for (let dx = 0; dx < dotSize && x + dx < canvas.width; dx++) {
          const i = ((y + dy) * canvas.width + (x + dx)) * 4;
          avgBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
          count++;
        }
      }
      
      avgBrightness = avgBrightness / count / 255;
      const dotRadius = (dotSize / 2) * avgBrightness;
      
      // Draw halftone dot
      const centerX = x + dotSize / 2;
      const centerY = y + dotSize / 2;
      
      for (let dy = 0; dy < dotSize && y + dy < canvas.height; dy++) {
        for (let dx = 0; dx < dotSize && x + dx < canvas.width; dx++) {
          const pixelX = x + dx - centerX;
          const pixelY = y + dy - centerY;
          
          // Rotate coordinates
          const rotatedX = pixelX * cos - pixelY * sin;
          const rotatedY = pixelX * sin + pixelY * cos;
          
          const distance = Math.sqrt(rotatedX * rotatedX + rotatedY * rotatedY);
          const dotValue = distance <= dotRadius ? 0 : 255;
          
          const i = ((y + dy) * canvas.width + (x + dx)) * 4;
          data[i] = dotValue;
          data[i + 1] = dotValue;
          data[i + 2] = dotValue;
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyCrosshatch = (canvas, ctx, params = {}) => {
  const { lineSpacing = 5, angle1 = 45, angle2 = 135 } = params;
  console.log('✏️ Crosshatch effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Convert to grayscale first
  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
  
  // Apply crosshatch pattern
  const angle1Rad = (angle1 * Math.PI) / 180;
  const angle2Rad = (angle2 * Math.PI) / 180;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      const brightness = data[i] / 255;
      
      // Calculate line positions
      const pos1 = (x * Math.cos(angle1Rad) + y * Math.sin(angle1Rad)) / lineSpacing;
      const pos2 = (x * Math.cos(angle2Rad) + y * Math.sin(angle2Rad)) / lineSpacing;
      
      const line1 = Math.floor(pos1) % 2;
      const line2 = Math.floor(pos2) % 2;
      
      let lineValue = 255;
      
      if (brightness < 0.25) {
        lineValue = line1 && line2 ? 0 : 255;
      } else if (brightness < 0.5) {
        lineValue = line1 ? 0 : 255;
      } else if (brightness < 0.75) {
        lineValue = line1 && (Math.floor(pos1 * 2) % 2) ? 0 : 255;
      }
      
      data[i] = lineValue;
      data[i + 1] = lineValue;
      data[i + 2] = lineValue;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyStippling = (canvas, ctx, params = {}) => {
  const { dotDensity = 0.1, dotSize = 2 } = params;
  console.log('🔸 Stippling effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Create white background
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
  }
  
  // Place dots based on original image brightness
  const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      const brightness = (originalData[i] + originalData[i + 1] + originalData[i + 2]) / 3 / 255;
      
      if (Math.random() < (1 - brightness) * dotDensity) {
        // Draw dot
        for (let dy = -dotSize; dy <= dotSize; dy++) {
          for (let dx = -dotSize; dx <= dotSize; dx++) {
            const px = x + dx;
            const py = y + dy;
            
            if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance <= dotSize) {
                const dotIndex = (py * canvas.width + px) * 4;
                data[dotIndex] = 0;
                data[dotIndex + 1] = 0;
                data[dotIndex + 2] = 0;
              }
            }
          }
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyWatercolor = (canvas, ctx, params = {}) => {
  const { bleedAmount = 1.0, paperTexture = 0.3 } = params;
  console.log('🎨 Watercolor effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Apply watercolor bleeding effect
  for (let pass = 0; pass < 3; pass++) {
    const newData = new Uint8ClampedArray(data);
    
    for (let y = 1; y < canvas.height - 1; y++) {
      for (let x = 1; x < canvas.width - 1; x++) {
        let avgR = 0, avgG = 0, avgB = 0;
        
        // Average with neighbors (bleeding effect)
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const i = ((y + dy) * canvas.width + (x + dx)) * 4;
            avgR += data[i];
            avgG += data[i + 1];
            avgB += data[i + 2];
          }
        }
        
        avgR /= 9;
        avgG /= 9;
        avgB /= 9;
        
        const targetIndex = (y * canvas.width + x) * 4;
        const blendFactor = bleedAmount * 0.3;
        
        newData[targetIndex] = data[targetIndex] * (1 - blendFactor) + avgR * blendFactor;
        newData[targetIndex + 1] = data[targetIndex + 1] * (1 - blendFactor) + avgG * blendFactor;
        newData[targetIndex + 2] = data[targetIndex + 2] * (1 - blendFactor) + avgB * blendFactor;
      }
    }
    
    data.set(newData);
  }
  
  // Add paper texture
  for (let i = 0; i < data.length; i += 4) {
    const texture = (Math.random() - 0.5) * paperTexture * 50;
    data[i] = Math.max(0, Math.min(255, data[i] + texture));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + texture));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + texture));
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyPencilSketch = (canvas, ctx, params = {}) => {
  const { lineIntensity = 1.0, shading = 0.5 } = params;
  console.log('✏️ Pencil Sketch effect applied');
  
  // First apply edge detection
  applyEdgeDetect(canvas, ctx);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Invert and adjust intensity
  for (let i = 0; i < data.length; i += 4) {
    const edge = data[i];
    const inverted = 255 - edge;
    const adjusted = Math.max(0, Math.min(255, inverted * lineIntensity));
    
    data[i] = adjusted;
    data[i + 1] = adjusted;
    data[i + 2] = adjusted;
  }
  
  // Add shading based on original image
  const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  
  for (let i = 0; i < data.length; i += 4) {
    const originalBrightness = (originalData[i] + originalData[i + 1] + originalData[i + 2]) / 3;
    const shadingValue = originalBrightness * shading;
    
    data[i] = Math.max(0, Math.min(255, data[i] - (255 - shadingValue)));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] - (255 - shadingValue)));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] - (255 - shadingValue)));
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyCharcoal = (canvas, ctx, params = {}) => {
  const { grainSize = 3, darkness = 1.0 } = params;
  console.log('⚫ Charcoal effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Convert to grayscale and increase contrast
  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const enhanced = Math.pow(gray / 255, 1 / darkness) * 255;
    
    data[i] = enhanced;
    data[i + 1] = enhanced;
    data[i + 2] = enhanced;
  }
  
  // Add charcoal grain texture
  for (let y = 0; y < canvas.height; y += grainSize) {
    for (let x = 0; x < canvas.width; x += grainSize) {
      const grainValue = Math.random() * 50 - 25;
      
      for (let dy = 0; dy < grainSize && y + dy < canvas.height; dy++) {
        for (let dx = 0; dx < grainSize && x + dx < canvas.width; dx++) {
          const i = ((y + dy) * canvas.width + (x + dx)) * 4;
          data[i] = Math.max(0, Math.min(255, data[i] + grainValue));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grainValue));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grainValue));
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyLinocut = (canvas, ctx, params = {}) => {
  const { thickness = 3, simplification = 0.5 } = params;
  console.log('🖨️ Linocut effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  // Simplify colors first
  const colorLevels = Math.floor(255 / (1 + simplification * 10));
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      
      // Quantize colors
      const r = Math.floor(data[i] / colorLevels) * colorLevels;
      const g = Math.floor(data[i + 1] / colorLevels) * colorLevels;
      const b = Math.floor(data[i + 2] / colorLevels) * colorLevels;
      
      // Create high contrast black and white
      const gray = (r + g + b) / 3;
      const bw = gray > 128 ? 255 : 0;
      
      newData[i] = bw;
      newData[i + 1] = bw;
      newData[i + 2] = bw;
      newData[i + 3] = data[i + 3];
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyASCIIArt = (canvas, ctx, params = {}) => {
  const { size = 8, brightness = 1.0, characters = ' .:-=+*#%@' } = params;
  console.log('🖥️ ASCII Art effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Create a new canvas for ASCII output
  const asciiCanvas = document.createElement('canvas');
  const asciiCtx = asciiCanvas.getContext('2d');
  
  // Calculate ASCII dimensions
  const asciiWidth = Math.floor(canvas.width / size);
  const asciiHeight = Math.floor(canvas.height / size);
  
  asciiCanvas.width = asciiWidth;
  asciiCanvas.height = asciiHeight;
  
  // Clear ASCII canvas with white background
  asciiCtx.fillStyle = 'white';
  asciiCtx.fillRect(0, 0, asciiWidth, asciiHeight);
  
  // Set font for ASCII characters
  asciiCtx.font = `${size}px monospace`;
  asciiCtx.fillStyle = 'black';
  asciiCtx.textAlign = 'center';
  asciiCtx.textBaseline = 'middle';
  
  // Convert image to ASCII
  for (let y = 0; y < asciiHeight; y++) {
    for (let x = 0; x < asciiWidth; x++) {
      // Sample the center pixel of each ASCII block
      const sampleX = Math.floor(x * size + size / 2);
      const sampleY = Math.floor(y * size + size / 2);
      
      if (sampleX < canvas.width && sampleY < canvas.height) {
        const i = (sampleY * canvas.width + sampleX) * 4;
        
        // Calculate brightness
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = (r + g + b) / 3;
        
        // Apply brightness adjustment
        const adjustedGray = Math.min(255, gray * brightness);
        
        // Map brightness to character
        const charIndex = Math.floor((adjustedGray / 255) * (characters.length - 1));
        const char = characters[charIndex];
        
        // Draw character
        asciiCtx.fillText(char, x, y);
      }
    }
  }
  
  // Scale ASCII canvas back to original size
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(asciiCanvas, 0, 0, canvas.width, canvas.height);
}; 