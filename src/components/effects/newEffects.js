/**
 * New Effects Module
 * Contains all the newly added effects that were missing implementations
 */

// ===========================================
// FRACTAL EFFECTS  
// ===========================================

export const applyFractalPatterns = (canvas, ctx, params = {}) => {
  const { type = 'mandelbrot', iterations = 100, zoom = 1.0, colorScheme = 'rainbow' } = params;
  console.log('🔮 Fractal Patterns effect applied:', { type, iterations, zoom, colorScheme });
  
  // Simple fractal overlay implementation
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const cx = (x - canvas.width / 2) / zoom / 100;
      const cy = (y - canvas.height / 2) / zoom / 100;
      
      let zx = 0, zy = 0;
      let i = 0;
      
      while (zx * zx + zy * zy < 4 && i < iterations) {
        const tmp = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = tmp;
        i++;
      }
      
      if (i < iterations) {
        const colorPhase = i * 0.1;
        const r = Math.sin(colorPhase) * 127 + 128;
        const g = Math.sin(colorPhase + 2) * 127 + 128;
        const b = Math.sin(colorPhase + 4) * 127 + 128;
        
        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            if (x + dx < canvas.width && y + dy < canvas.height) {
              const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
              data[idx] = Math.min(255, data[idx] * 0.7 + r * 0.3);
              data[idx + 1] = Math.min(255, data[idx + 1] * 0.7 + g * 0.3);
              data[idx + 2] = Math.min(255, data[idx + 2] * 0.7 + b * 0.3);
            }
          }
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyMandelbrotZoom = (canvas, ctx, params = {}) => {
  const { centerX = -0.5, centerY = 0, iterations = 150, colorCycle = true } = params;
  console.log('🌌 Mandelbrot Zoom effect applied');
  
  // Static version - uses basic zoom simulation
  const time = Date.now() * 0.001;
  const zoom = Math.pow(1.1, time * 0.1);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let y = 0; y < canvas.height; y += 3) {
    for (let x = 0; x < canvas.width; x += 3) {
      const cx = centerX + (x - canvas.width / 2) / zoom / 200;
      const cy = centerY + (y - canvas.height / 2) / zoom / 200;
      
      let zx = 0, zy = 0;
      let i = 0;
      
      while (zx * zx + zy * zy < 4 && i < iterations) {
        const tmp = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = tmp;
        i++;
      }
      
      if (i < iterations) {
        const colorPhase = colorCycle ? time + i * 0.1 : i * 0.1;
        const r = Math.sin(colorPhase) * 127 + 128;
        const g = Math.sin(colorPhase + 2) * 127 + 128;
        const b = Math.sin(colorPhase + 4) * 127 + 128;
        
        for (let dy = 0; dy < 3; dy++) {
          for (let dx = 0; dx < 3; dx++) {
            if (x + dx < canvas.width && y + dy < canvas.height) {
              const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
              data[idx] = Math.min(255, r);
              data[idx + 1] = Math.min(255, g);
              data[idx + 2] = Math.min(255, b);
            }
          }
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyJuliaSets = (canvas, ctx, params = {}) => {
  const { cReal = -0.4, cImag = 0.6, iterations = 100, zoom = 1.5 } = params;
  console.log('🌟 Julia Sets effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      let zx = (x - canvas.width / 2) / zoom / 150;
      let zy = (y - canvas.height / 2) / zoom / 150;
      let i = 0;
      
      while (zx * zx + zy * zy < 4 && i < iterations) {
        const tmp = zx * zx - zy * zy + cReal;
        zy = 2 * zx * zy + cImag;
        zx = tmp;
        i++;
      }
      
      if (i < iterations) {
        const colorPhase = i * 0.15;
        const r = Math.sin(colorPhase) * 127 + 128;
        const g = Math.sin(colorPhase + 1) * 127 + 128;
        const b = Math.sin(colorPhase + 2) * 127 + 128;
        
        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            if (x + dx < canvas.width && y + dy < canvas.height) {
              const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
              data[idx] = Math.min(255, data[idx] * 0.5 + r * 0.5);
              data[idx + 1] = Math.min(255, data[idx + 1] * 0.5 + g * 0.5);
              data[idx + 2] = Math.min(255, data[idx + 2] * 0.5 + b * 0.5);
            }
          }
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// ===========================================
// LIGHT EFFECTS
// ===========================================

export const applyLightTrails = (canvas, ctx, params = {}) => {
  const { trailLength = 15, brightness = 1.0, trailColor = '#ffffff', fadeSpeed = 0.3, speed = 1.0 } = params;
  const animatedTime = Date.now() * 0.001 * speed;
  
  console.log('✨ Light Trails effect applied');
  console.log('✨ Animated time:', animatedTime);
  
  const r = parseInt(trailColor.slice(1, 3), 16);
  const g = parseInt(trailColor.slice(3, 5), 16);
  const b = parseInt(trailColor.slice(5, 7), 16);
  
  ctx.globalCompositeOperation = 'screen';
  
  // Create multiple moving light trails
  for (let i = 0; i < 3; i++) {
    const offset = i * Math.PI * 2 / 3;
    const x = canvas.width / 2 + Math.cos(animatedTime + offset) * canvas.width * 0.3;
    const y = canvas.height / 2 + Math.sin(animatedTime * 1.5 + offset) * canvas.height * 0.3;
    
    // Create trail effect
    for (let j = 0; j < trailLength; j++) {
      const fade = Math.pow(fadeSpeed, j);
      const trailX = x - Math.cos(animatedTime + offset) * j * 5;
      const trailY = y - Math.sin(animatedTime * 1.5 + offset) * j * 5;
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness * fade * 0.3})`;
      ctx.beginPath();
      ctx.arc(trailX, trailY, 3 - j * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  ctx.globalCompositeOperation = 'source-over';
};

export const applyNeonGlow = (canvas, ctx, params = {}) => {
  const { glowIntensity = 5, glowRadius = 10, glowColor = '#00ffff', innerGlow = true } = params;
  console.log('💡 Neon Glow effect applied');
  
  // Create glow effect using shadow blur
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, 0, 0);
  
  for (let i = 1; i <= glowIntensity; i++) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowRadius * i;
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.3 / i;
    ctx.drawImage(tempCanvas, 0, 0);
  }
  
  if (innerGlow) {
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = glowColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
};

export const applyLaserBeams = (canvas, ctx, params = {}) => {
  const { beamCount = 3, beamWidth = 3, beamColor = '#ff0000', intensity = 1.5 } = params;
  console.log('🔴 Laser Beams effect applied');
  
  const r = parseInt(beamColor.slice(1, 3), 16);
  const g = parseInt(beamColor.slice(3, 5), 16);
  const b = parseInt(beamColor.slice(5, 7), 16);
  
  ctx.globalCompositeOperation = 'screen';
  
  for (let i = 0; i < beamCount; i++) {
    const angle = (i / beamCount) * Math.PI * 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const endX = centerX + Math.cos(angle) * Math.max(canvas.width, canvas.height);
    const endY = centerY + Math.sin(angle) * Math.max(canvas.width, canvas.height);
    
    const gradient = ctx.createLinearGradient(centerX, centerY, endX, endY);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${intensity})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = beamWidth;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  
  ctx.globalCompositeOperation = 'source-over';
};

export const applyPrismEffect = (canvas, ctx, params = {}) => {
  const { dispersion = 20, prismAngle = 45, intensity = 1.0 } = params;
  console.log('🌈 Prism Effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const angle = (prismAngle * Math.PI) / 180;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 50) {
        const disperseR = Math.sin(angle) * dispersion * 0.8;
        const disperseB = Math.sin(angle + Math.PI) * dispersion * 0.8;
        
        const sourceRX = Math.max(0, Math.min(canvas.width - 1, x + disperseR));
        const sourceRY = Math.max(0, Math.min(canvas.height - 1, y));
        const sourceBX = Math.max(0, Math.min(canvas.width - 1, x + disperseB));
        const sourceBY = Math.max(0, Math.min(canvas.height - 1, y));
        
        const targetIndex = (y * canvas.width + x) * 4;
        const sourceRIndex = (Math.floor(sourceRY) * canvas.width + Math.floor(sourceRX)) * 4;
        const sourceBIndex = (Math.floor(sourceBY) * canvas.width + Math.floor(sourceBX)) * 4;
        
        newData[targetIndex] = data[sourceRIndex];
        newData[targetIndex + 1] = data[targetIndex + 1];
        newData[targetIndex + 2] = data[sourceBIndex + 2];
        newData[targetIndex + 3] = data[targetIndex + 3];
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

// ===========================================
// VISUAL EFFECTS
// ===========================================

export const applyMeltEffect = (canvas, ctx, params = {}) => {
  const { meltSpeed = 1.0, viscosity = 0.8, temperature = 1.0, direction = 'down' } = params;
  console.log('🫠 Melt Effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const time = Date.now() * 0.001 * meltSpeed;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let sourceX = x;
      let sourceY = y;
      
      const meltAmount = Math.sin(x * 0.02 + time) * temperature * 10;
      
      switch (direction) {
        case 'down':
          sourceY = Math.max(0, y - Math.floor(meltAmount * viscosity));
          break;
        case 'up':
          sourceY = Math.min(canvas.height - 1, y + Math.floor(meltAmount * viscosity));
          break;
      }
      
      const targetIndex = (y * canvas.width + x) * 4;
      const sourceIndex = (sourceY * canvas.width + sourceX) * 4;
      
      newData[targetIndex] = data[sourceIndex];
      newData[targetIndex + 1] = data[sourceIndex + 1];
      newData[targetIndex + 2] = data[sourceIndex + 2];
      newData[targetIndex + 3] = data[sourceIndex + 3];
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyLiquidMetal = (canvas, ctx, params = {}) => {
  const { reflectivity = 1.5, fluidity = 1.0, metalType = 'silver' } = params;
  console.log('🥈 Liquid Metal effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const metalColors = {
    silver: [192, 192, 192],
    gold: [255, 215, 0],
    copper: [184, 115, 51],
    chrome: [160, 160, 160]
  };
  
  const metalColor = metalColors[metalType] || metalColors.silver;
  const time = Date.now() * 0.001;
  
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const reflection = Math.sin(time + i * 0.001) * reflectivity;
    
    data[i] = Math.min(255, brightness * 0.3 + metalColor[0] * 0.7 + reflection * 30);
    data[i + 1] = Math.min(255, brightness * 0.3 + metalColor[1] * 0.7 + reflection * 30);
    data[i + 2] = Math.min(255, brightness * 0.3 + metalColor[2] * 0.7 + reflection * 30);
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyPlasmaEffect = (canvas, ctx, params = {}) => {
  const { complexity = 5, speed = 1.0, colorScheme = 'fire' } = params;
  console.log('🔥 Plasma Effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const time = Date.now() * 0.001 * speed;
  
  const colorSchemes = {
    fire: [(t) => Math.sin(t) * 127 + 128, (t) => Math.sin(t + 1) * 60 + 60, (t) => 0],
    electric: [(t) => 0, (t) => Math.sin(t) * 127 + 128, (t) => Math.sin(t + 2) * 127 + 128],
    toxic: [(t) => Math.sin(t + 1) * 80 + 80, (t) => Math.sin(t) * 127 + 128, (t) => 0],
    cosmic: [(t) => Math.sin(t) * 100 + 100, (t) => Math.sin(t + 2) * 100 + 100, (t) => Math.sin(t + 4) * 127 + 128]
  };
  
  const scheme = colorSchemes[colorScheme] || colorSchemes.fire;
  
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const plasma = Math.sin(x * 0.02 + time) + 
                    Math.sin(y * 0.02 + time * 1.5) + 
                    Math.sin((x + y) * 0.01 + time * 0.5) + 
                    Math.sin(Math.sqrt(x * x + y * y) * 0.02 + time * 2);
      
      const normalizedPlasma = (plasma + 4) / 8;
      
      for (let dy = 0; dy < 2; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          if (x + dx < canvas.width && y + dy < canvas.height) {
            const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
            const originalBrightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            
            data[idx] = Math.min(255, scheme[0](normalizedPlasma * Math.PI) * (originalBrightness / 255));
            data[idx + 1] = Math.min(255, scheme[1](normalizedPlasma * Math.PI) * (originalBrightness / 255));
            data[idx + 2] = Math.min(255, scheme[2](normalizedPlasma * Math.PI) * (originalBrightness / 255));
          }
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyTieDye = (canvas, ctx, params = {}) => {
  const { colorCount = 4, swirl = 1.5, blendMode = 'smooth' } = params;
  console.log('🎨 Tie Dye effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const colors = [
    [255, 0, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255],
    [0, 0, 255], [255, 0, 255], [255, 128, 0], [128, 0, 255]
  ];
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      const swirlAngle = angle + (distance * swirl * 0.01);
      const colorIndex = Math.floor((swirlAngle + Math.PI) / (2 * Math.PI) * colorCount) % colorCount;
      const nextColorIndex = (colorIndex + 1) % colorCount;
      
      const blend = ((swirlAngle + Math.PI) / (2 * Math.PI) * colorCount) % 1;
      
      const color1 = colors[colorIndex % colors.length];
      const color2 = colors[nextColorIndex % colors.length];
      
      const targetIndex = (y * canvas.width + x) * 4;
      const originalBrightness = (data[targetIndex] + data[targetIndex + 1] + data[targetIndex + 2]) / 3;
      const factor = originalBrightness / 255;
      
      data[targetIndex] = Math.min(255, (color1[0] * (1 - blend) + color2[0] * blend) * factor);
      data[targetIndex + 1] = Math.min(255, (color1[1] * (1 - blend) + color2[1] * blend) * factor);
      data[targetIndex + 2] = Math.min(255, (color1[2] * (1 - blend) + color2[2] * blend) * factor);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyOilSpill = (canvas, ctx, params = {}) => {
  const { iridescence = 1.5, thickness = 1.0, flowSpeed = 0.8, colorShift = 0 } = params;
  console.log('🌊 Oil Spill effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const time = Date.now() * 0.001 * flowSpeed;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const wave1 = Math.sin(x * 0.03 + time);
      const wave2 = Math.sin(y * 0.03 + time * 1.2);
      const interference = wave1 + wave2;
      
      const hue = (interference + 2) / 4 * 360 + colorShift;
      const saturation = iridescence * thickness;
      const lightness = 0.5;
      
      // Simple HSL to RGB conversion
      const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
      const x_val = c * (1 - Math.abs((hue / 60) % 2 - 1));
      const m = lightness - c / 2;
      
      let r = 0, g = 0, b = 0;
      if (hue >= 0 && hue < 60) { r = c; g = x_val; b = 0; }
      else if (hue >= 60 && hue < 120) { r = x_val; g = c; b = 0; }
      else if (hue >= 120 && hue < 180) { r = 0; g = c; b = x_val; }
      else if (hue >= 180 && hue < 240) { r = 0; g = x_val; b = c; }
      else if (hue >= 240 && hue < 300) { r = x_val; g = 0; b = c; }
      else if (hue >= 300 && hue < 360) { r = c; g = 0; b = x_val; }
      
      const targetIndex = (y * canvas.width + x) * 4;
      const originalBrightness = (data[targetIndex] + data[targetIndex + 1] + data[targetIndex + 2]) / 3;
      const factor = originalBrightness / 255;
      
      data[targetIndex] = Math.min(255, ((r + m) * 255) * factor);
      data[targetIndex + 1] = Math.min(255, ((g + m) * 255) * factor);
      data[targetIndex + 2] = Math.min(255, ((b + m) * 255) * factor);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyBubbleDistortion = (canvas, ctx, params = {}) => {
  const { bubbleCount = 20, bubbleSize = 30, distortionStrength = 0.8, refraction = 1.2 } = params;
  console.log('🫧 Bubble Distortion effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  // Generate bubble positions
  const bubbles = [];
  for (let i = 0; i < bubbleCount; i++) {
    bubbles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: bubbleSize * (0.5 + Math.random() * 0.5)
    });
  }
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let sourceX = x;
      let sourceY = y;
      
      for (const bubble of bubbles) {
        const dx = x - bubble.x;
        const dy = y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < bubble.radius) {
          const distortionFactor = (1 - distance / bubble.radius) * distortionStrength * refraction;
          const angle = Math.atan2(dy, dx);
          
          sourceX += Math.cos(angle) * distortionFactor * 10;
          sourceY += Math.sin(angle) * distortionFactor * 10;
          
          sourceX = Math.max(0, Math.min(canvas.width - 1, sourceX));
          sourceY = Math.max(0, Math.min(canvas.height - 1, sourceY));
        }
      }
      
      const targetIndex = (y * canvas.width + x) * 4;
      const sourceIndex = (Math.floor(sourceY) * canvas.width + Math.floor(sourceX)) * 4;
      
      newData[targetIndex] = data[sourceIndex];
      newData[targetIndex + 1] = data[sourceIndex + 1];
      newData[targetIndex + 2] = data[sourceIndex + 2];
      newData[targetIndex + 3] = data[sourceIndex + 3];
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

// ===========================================
// SPACETIME EFFECTS
// ===========================================

export const applyTimeEcho = (canvas, ctx, params = {}) => {
  const { echoCount = 5, echoDelay = 150, fadeRate = 0.7, blendMode = 'overlay' } = params;
  console.log('⏰ Time Echo effect applied');
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, 0, 0);
  
  for (let i = 1; i <= echoCount; i++) {
    const opacity = Math.pow(fadeRate, i);
    const offset = i * 3;
    
    ctx.globalCompositeOperation = blendMode;
    ctx.globalAlpha = opacity;
    ctx.drawImage(tempCanvas, offset, offset);
  }
  
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
};

export const applyMotionBlurTrails = (canvas, ctx, params = {}) => {
  const { trailLength = 8, blurIntensity = 5, direction = 'auto' } = params;
  console.log('💨 Motion Blur Trails effect applied');
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, 0, 0);
  
  const directions = {
    horizontal: [1, 0],
    vertical: [0, 1],
    diagonal: [0.7, 0.7],
    auto: [1, 0.5]
  };
  
  const [dx, dy] = directions[direction] || directions.auto;
  
  for (let i = 1; i <= trailLength; i++) {
    const opacity = (trailLength - i) / trailLength * 0.3;
    const offsetX = dx * i * 2;
    const offsetY = dy * i * 2;
    
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = opacity;
    ctx.filter = `blur(${blurIntensity * i / trailLength}px)`;
    ctx.drawImage(tempCanvas, offsetX, offsetY);
  }
  
  ctx.filter = 'none';
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
};

export const applyFeedbackLoop = (canvas, ctx, params = {}) => {
  const { feedbackStrength = 0.7, delay = 3, zoom = 1.02, rotation = 0 } = params;
  console.log('🔄 Feedback Loop effect applied');
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, 0, 0);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = feedbackStrength;
  
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(zoom, zoom);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);
  
  ctx.drawImage(tempCanvas, 0, 0);
  
  ctx.restore();
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
};

export const applyInfiniteMirror = (canvas, ctx, params = {}) => {
  const { mirrorCount = 8, perspective = 1.0, fadeDistance = 0.8, mirrorAngle = 0 } = params;
  console.log('🪞 Infinite Mirror effect applied');
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, 0, 0);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  for (let i = 1; i <= mirrorCount; i++) {
    const scale = Math.pow(perspective, -i);
    const opacity = Math.pow(fadeDistance, i);
    const angle = (mirrorAngle * i * Math.PI) / 180;
    
    ctx.globalAlpha = opacity;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    ctx.rotate(angle);
    ctx.translate(-centerX, -centerY);
    
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();
  }
  
  ctx.globalAlpha = 1.0;
};

export const applyWormhole = (canvas, ctx, params = {}) => {
  const { tunnelDepth = 20, distortionStrength = 1.5, centerX = 0.5, centerY = 0.5 } = params;
  console.log('🕳️ Wormhole effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const cx = centerX * canvas.width;
  const cy = centerY * canvas.height;
  const maxRadius = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) / 2;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      if (distance > 10) {
        const tunnelFactor = distance / maxRadius;
        const wormholeRadius = distance * (1 + Math.sin(tunnelFactor * tunnelDepth) * distortionStrength * 0.1);
        
        const sourceX = cx + Math.cos(angle) * wormholeRadius;
        const sourceY = cy + Math.sin(angle) * wormholeRadius;
        
        if (sourceX >= 0 && sourceX < canvas.width && sourceY >= 0 && sourceY < canvas.height) {
          const targetIndex = (y * canvas.width + x) * 4;
          const sourceIndex = (Math.floor(sourceY) * canvas.width + Math.floor(sourceX)) * 4;
          
          newData[targetIndex] = data[sourceIndex];
          newData[targetIndex + 1] = data[sourceIndex + 1];
          newData[targetIndex + 2] = data[sourceIndex + 2];
          newData[targetIndex + 3] = data[sourceIndex + 3];
        }
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

// ===========================================
// ANIMATED VERSIONS (WithTime)
// ===========================================

export const applyMandelbrotZoomWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { zoomSpeed = 1.0, centerX = -0.5, centerY = 0, iterations = 150, colorCycle = true } = params;
  const zoom = Math.pow(1.1, timeInSeconds * zoomSpeed);
  
  console.log('🌌 Mandelbrot Zoom WithTime effect applied');
  // Use the static version with time-based zoom
  applyMandelbrotZoom(canvas, ctx, { ...params, zoom });
};

export const applyJuliaSetsWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { cReal = -0.4, cImag = 0.6, animateC = true, animationSpeed = 0.5 } = params;
  
  let realC = cReal;
  let imagC = cImag;
  
  if (animateC) {
    realC = cReal + Math.sin(timeInSeconds * animationSpeed) * 0.3;
    imagC = cImag + Math.cos(timeInSeconds * animationSpeed) * 0.3;
  }
  
  console.log('🌟 Julia Sets WithTime effect applied');
  applyJuliaSets(canvas, ctx, { ...params, cReal: realC, cImag: imagC });
};

export const applyLightTrailsWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { trailLength = 15, brightness = 1.0, trailColor = '#ffffff', fadeSpeed = 0.3, speed = 1.0 } = params;
  const animatedTime = timeInSeconds * speed;
  
  console.log('✨ Light Trails WithTime effect applied');
  console.log('✨ Animated time:', animatedTime);
  
  const r = parseInt(trailColor.slice(1, 3), 16);
  const g = parseInt(trailColor.slice(3, 5), 16);
  const b = parseInt(trailColor.slice(5, 7), 16);
  
  ctx.globalCompositeOperation = 'screen';
  
  // Create multiple moving light trails
  for (let i = 0; i < 3; i++) {
    const offset = i * Math.PI * 2 / 3;
    const x = canvas.width / 2 + Math.cos(animatedTime + offset) * canvas.width * 0.3;
    const y = canvas.height / 2 + Math.sin(animatedTime * 1.5 + offset) * canvas.height * 0.3;
    
    // Create trail effect
    for (let j = 0; j < trailLength; j++) {
      const fade = Math.pow(fadeSpeed, j);
      const trailX = x - Math.cos(animatedTime + offset) * j * 5;
      const trailY = y - Math.sin(animatedTime * 1.5 + offset) * j * 5;
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness * fade * 0.3})`;
      ctx.beginPath();
      ctx.arc(trailX, trailY, 3 - j * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  ctx.globalCompositeOperation = 'source-over';
};

export const applyNeonGlowWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { pulsate = true, pulseSpeed = 2.0 } = params;
  
  if (pulsate) {
    const pulseFactor = (Math.sin(timeInSeconds * pulseSpeed) * 0.5 + 0.5);
    const animatedParams = {
      ...params,
      glowIntensity: (params.glowIntensity || 5) * (0.5 + pulseFactor * 0.5)
    };
    console.log('💡 Neon Glow WithTime (pulsating) effect applied');
    applyNeonGlow(canvas, ctx, animatedParams);
  } else {
    console.log('💡 Neon Glow WithTime effect applied');
    applyNeonGlow(canvas, ctx, params);
  }
};

export const applyLaserBeamsWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { beamCount = 3, beamWidth = 3, beamColor = '#ff0000', intensity = 1.5, rotationSpeed = 1.0 } = params;
  const animatedAngle = timeInSeconds * rotationSpeed * 360; // Rotate 360 degrees per second
  
  console.log('🔴 Laser Beams WithTime effect applied');
  console.log('🔴 Rotation angle:', animatedAngle);
  
  const r = parseInt(beamColor.slice(1, 3), 16);
  const g = parseInt(beamColor.slice(3, 5), 16);
  const b = parseInt(beamColor.slice(5, 7), 16);
  
  ctx.globalCompositeOperation = 'screen';
  
  for (let i = 0; i < beamCount; i++) {
    const angle = (i / beamCount) * Math.PI * 2 + (animatedAngle * Math.PI / 180);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const endX = centerX + Math.cos(angle) * Math.max(canvas.width, canvas.height);
    const endY = centerY + Math.sin(angle) * Math.max(canvas.width, canvas.height);
    
    const gradient = ctx.createLinearGradient(centerX, centerY, endX, endY);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${intensity})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = beamWidth;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  
  ctx.globalCompositeOperation = 'source-over';
};

export const applyPrismEffectWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { rotateAngle = true } = params;
  
  if (rotateAngle) {
    const animatedAngle = (params.prismAngle || 45) + timeInSeconds * 30;
    console.log('🌈 Prism Effect WithTime (rotating) applied');
    applyPrismEffect(canvas, ctx, { ...params, prismAngle: animatedAngle });
  } else {
    console.log('🌈 Prism Effect WithTime effect applied');
    applyPrismEffect(canvas, ctx, params);
  }
};

export const applyMeltEffectWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { meltSpeed = 1.0, viscosity = 0.8, temperature = 1.0, direction = 'down', speed = 1.0 } = params;
  const animatedTime = timeInSeconds * speed;
  
  console.log('🫠 Melt Effect WithTime effect applied');
  console.log('🫠 Animated time:', animatedTime);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const meltOffset = Math.sin(x * 0.02 + animatedTime) * meltSpeed * 20;
      const meltY = y + meltOffset;
      
      const sourceX = x;
      const sourceY = Math.floor(meltY);
      
      const targetIndex = (y * canvas.width + x) * 4;
      
      if (sourceY >= 0 && sourceY < canvas.height) {
        const sourceIndex = (sourceY * canvas.width + sourceX) * 4;
        newData[targetIndex] = data[sourceIndex];
        newData[targetIndex + 1] = data[sourceIndex + 1];
        newData[targetIndex + 2] = data[sourceIndex + 2];
        newData[targetIndex + 3] = data[sourceIndex + 3];
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyLiquidMetalWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { reflectivity = 1.5, fluidity = 1.0, metalType = 'silver', waveSpeed = 1.0 } = params;
  const animatedTime = timeInSeconds * waveSpeed;
  
  console.log('🥈 Liquid Metal WithTime effect applied');
  console.log('🥈 Animated time:', animatedTime);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const metalColors = {
    silver: [192, 192, 192],
    gold: [255, 215, 0],
    copper: [184, 115, 51],
    chrome: [220, 220, 220]
  };
  
  const [r, g, b] = metalColors[metalType] || metalColors.silver;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;
      
      // Create flowing metal effect
      const flowX = Math.sin(x * 0.02 + animatedTime) * fluidity * 10;
      const flowY = Math.cos(y * 0.02 + animatedTime * 1.5) * fluidity * 10;
      
      const sourceX = Math.floor(x + flowX);
      const sourceY = Math.floor(y + flowY);
      
      if (sourceX >= 0 && sourceX < canvas.width && sourceY >= 0 && sourceY < canvas.height) {
        const sourceIdx = (sourceY * canvas.width + sourceX) * 4;
        
        // Blend with metal color
        const blend = 0.7;
        data[idx] = data[sourceIdx] * (1 - blend) + r * blend;
        data[idx + 1] = data[sourceIdx + 1] * (1 - blend) + g * blend;
        data[idx + 2] = data[sourceIdx + 2] * (1 - blend) + b * blend;
        
        // Add reflectivity
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        const reflection = Math.sin(x * 0.01 + animatedTime) * reflectivity * 50;
        data[idx] = Math.min(255, data[idx] + reflection);
        data[idx + 1] = Math.min(255, data[idx + 1] + reflection);
        data[idx + 2] = Math.min(255, data[idx + 2] + reflection);
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyPlasmaEffectWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { complexity = 5, speed = 1.0, colorScheme = 'fire' } = params;
  console.log('🔥 Plasma Effect WithTime applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const time = timeInSeconds * speed;
  
  const colorSchemes = {
    fire: [(t) => Math.sin(t) * 127 + 128, (t) => Math.sin(t + 1) * 60 + 60, (t) => 0],
    electric: [(t) => 0, (t) => Math.sin(t) * 127 + 128, (t) => Math.sin(t + 2) * 127 + 128],
    toxic: [(t) => Math.sin(t + 1) * 80 + 80, (t) => Math.sin(t) * 127 + 128, (t) => 0],
    cosmic: [(t) => Math.sin(t) * 100 + 100, (t) => Math.sin(t + 2) * 100 + 100, (t) => Math.sin(t + 4) * 127 + 128]
  };
  
  const scheme = colorSchemes[colorScheme] || colorSchemes.fire;
  
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      // Więcej warstw plazmowej animacji
      const plasma = Math.sin(x * 0.02 + time) + 
                    Math.sin(y * 0.02 + time * 1.5) + 
                    Math.sin((x + y) * 0.01 + time * 0.5) + 
                    Math.sin(Math.sqrt(x * x + y * y) * 0.02 + time * 2) +
                    Math.sin(x * 0.01 + y * 0.01 + time * 3) * 0.5; // Dodatkowa warstwa
      
      const normalizedPlasma = (plasma + 5) / 10; // Dostosowane do nowej warstwy
      
      for (let dy = 0; dy < 2; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          if (x + dx < canvas.width && y + dy < canvas.height) {
            const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
            const originalBrightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            
            // Bardziej intensywne mieszanie
            const factor = (originalBrightness / 255) * 0.7 + 0.3; // Zawsze widoczny efekt
            
            data[idx] = Math.min(255, scheme[0](normalizedPlasma * Math.PI) * factor);
            data[idx + 1] = Math.min(255, scheme[1](normalizedPlasma * Math.PI) * factor);
            data[idx + 2] = Math.min(255, scheme[2](normalizedPlasma * Math.PI) * factor);
          }
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyTieDyeWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { intensity = 1.0, speed = 1.0 } = params;
  const animatedTime = timeInSeconds * speed;
  
  console.log('🎨 Tie Dye WithTime effect applied');
  console.log('🎨 Animated time:', animatedTime);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;
      
      // Create animated tie-dye pattern
      const angle = Math.atan2(y - canvas.height / 2, x - canvas.width / 2);
      const distance = Math.sqrt((x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2);
      const tieDye = Math.sin(angle * 3 + animatedTime) * Math.cos(distance * 0.01 + animatedTime * 0.5);
      
      const colorShift = tieDye * intensity * 50;
      data[idx] = Math.min(255, Math.max(0, data[idx] + colorShift));
      data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + colorShift * 0.7));
      data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + colorShift * 0.3));
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyOilSpillWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { intensity = 1.0, speed = 1.0 } = params;
  const animatedTime = timeInSeconds * speed;
  
  console.log('🌊 Oil Spill WithTime effect applied');
  console.log('🌊 Animated time:', animatedTime);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;
      
      // Create animated oil spill effect
      const angle = Math.atan2(y - canvas.height / 2, x - canvas.width / 2);
      const distance = Math.sqrt((x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2);
      const oilSpill = Math.sin(angle * 5 + animatedTime) * Math.cos(distance * 0.02 + animatedTime * 0.3);
      
      const iridescent = Math.sin(animatedTime + distance * 0.01) * intensity * 30;
      data[idx] = Math.min(255, Math.max(0, data[idx] + oilSpill * 20 + iridescent));
      data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + oilSpill * 15 + iridescent * 0.8));
      data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + oilSpill * 10 + iridescent * 0.6));
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyBubbleDistortionWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { bubbleSize = 20, intensity = 1.0, speed = 1.0 } = params;
  const animatedTime = timeInSeconds * speed;
  
  console.log('🫧 Bubble Distortion WithTime effect applied');
  console.log('🫧 Animated time:', animatedTime);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      // Create animated bubble distortion
      const bubbleX = Math.sin(x * 0.05 + animatedTime) * bubbleSize * intensity;
      const bubbleY = Math.cos(y * 0.05 + animatedTime * 1.2) * bubbleSize * intensity;
      
      const sourceX = Math.floor(x + bubbleX);
      const sourceY = Math.floor(y + bubbleY);
      
      const targetIndex = (y * canvas.width + x) * 4;
      
      if (sourceX >= 0 && sourceX < canvas.width && sourceY >= 0 && sourceY < canvas.height) {
        const sourceIndex = (sourceY * canvas.width + sourceX) * 4;
        newData[targetIndex] = data[sourceIndex];
        newData[targetIndex + 1] = data[sourceIndex + 1];
        newData[targetIndex + 2] = data[sourceIndex + 2];
        newData[targetIndex + 3] = data[sourceIndex + 3];
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyTimeEchoWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { echoCount = 5, fadeFactor = 0.8, offset = 10, speed = 1.0 } = params;
  const animatedTime = timeInSeconds * speed;
  
  console.log('⏰ Time Echo WithTime effect applied');
  console.log('⏰ Animated time:', animatedTime);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Create time echo effect with animation
  for (let echo = 1; echo <= echoCount; echo++) {
    const fade = Math.pow(fadeFactor, echo);
    const echoOffset = offset * echo * Math.sin(animatedTime);
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const echoX = Math.floor(x + echoOffset);
        const echoY = Math.floor(y + echoOffset * 0.5);
        
        if (echoX >= 0 && echoX < canvas.width && echoY >= 0 && echoY < canvas.height) {
          const echoIdx = (echoY * canvas.width + echoX) * 4;
          
          data[idx] = Math.min(255, data[idx] + data[echoIdx] * fade * 0.3);
          data[idx + 1] = Math.min(255, data[idx + 1] + data[echoIdx + 1] * fade * 0.3);
          data[idx + 2] = Math.min(255, data[idx + 2] + data[echoIdx + 2] * fade * 0.3);
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyMotionBlurTrailsWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { trailLength = 10, intensity = 0.5, speed = 1.0 } = params;
  const animatedTime = timeInSeconds * speed;
  
  console.log('💨 Motion Blur Trails WithTime effect applied');
  console.log('💨 Animated time:', animatedTime);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const targetIndex = (y * canvas.width + x) * 4;
      
      // Create motion blur effect
      let totalR = 0, totalG = 0, totalB = 0, totalA = 0;
      let sampleCount = 0;
      
      for (let i = 0; i < trailLength; i++) {
        const blurX = Math.floor(x + Math.sin(animatedTime + i * 0.1) * i * 2);
        const blurY = Math.floor(y + Math.cos(animatedTime + i * 0.1) * i * 2);
        
        if (blurX >= 0 && blurX < canvas.width && blurY >= 0 && blurY < canvas.height) {
          const sourceIndex = (blurY * canvas.width + blurX) * 4;
          const weight = (trailLength - i) / trailLength * intensity;
          
          totalR += data[sourceIndex] * weight;
          totalG += data[sourceIndex + 1] * weight;
          totalB += data[sourceIndex + 2] * weight;
          totalA += data[sourceIndex + 3] * weight;
          sampleCount += weight;
        }
      }
      
      if (sampleCount > 0) {
        newData[targetIndex] = totalR / sampleCount;
        newData[targetIndex + 1] = totalG / sampleCount;
        newData[targetIndex + 2] = totalB / sampleCount;
        newData[targetIndex + 3] = totalA / sampleCount;
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyFeedbackLoopWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { iterations = 3, intensity = 0.3, speed = 1.0 } = params;
  const animatedTime = timeInSeconds * speed;
  
  console.log('🔄 Feedback Loop WithTime effect applied');
  console.log('🔄 Animated time:', animatedTime);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Create animated feedback loop
  for (let iter = 0; iter < iterations; iter++) {
    const feedbackOffset = Math.sin(animatedTime + iter) * 20;
    const feedbackScale = 1 + Math.sin(animatedTime * 0.5) * 0.1;
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        
        const feedbackX = Math.floor((x - canvas.width / 2) * feedbackScale + canvas.width / 2 + feedbackOffset);
        const feedbackY = Math.floor((y - canvas.height / 2) * feedbackScale + canvas.height / 2 + feedbackOffset);
        
        if (feedbackX >= 0 && feedbackX < canvas.width && feedbackY >= 0 && feedbackY < canvas.height) {
          const feedbackIdx = (feedbackY * canvas.width + feedbackX) * 4;
          
          data[idx] = Math.min(255, data[idx] + data[feedbackIdx] * intensity);
          data[idx + 1] = Math.min(255, data[idx + 1] + data[feedbackIdx + 1] * intensity);
          data[idx + 2] = Math.min(255, data[idx + 2] + data[feedbackIdx + 2] * intensity);
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyInfiniteMirrorWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { rotationSpeed = 0.5 } = params;
  const animatedAngle = (params.mirrorAngle || 0) + timeInSeconds * rotationSpeed * 10;
  
  console.log('🪞 Infinite Mirror WithTime effect applied');
  applyInfiniteMirror(canvas, ctx, { ...params, mirrorAngle: animatedAngle });
};

export const applyWormholeWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { tunnelDepth = 20, distortionStrength = 1.5, centerX = 0.5, centerY = 0.5, rotationSpeed = 1.0, pulsate = true } = params;
  const animatedTime = timeInSeconds * rotationSpeed;
  
  console.log('🕳️ Wormhole WithTime effect applied');
  console.log('🕳️ Animated time:', animatedTime);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const cx = centerX * canvas.width;
  const cy = centerY * canvas.height;
  const pulseFactor = pulsate ? Math.sin(animatedTime * 2) * 0.3 + 0.7 : 1.0;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      // Create animated wormhole effect
      const wormholeAngle = angle + animatedTime;
      const wormholeDistance = distance * (1 + Math.sin(animatedTime * 3) * 0.2) * pulseFactor;
      const distortion = Math.sin(distance * 0.01 + animatedTime) * distortionStrength * 10;
      
      const sourceX = Math.floor(cx + Math.cos(wormholeAngle) * wormholeDistance + distortion);
      const sourceY = Math.floor(cy + Math.sin(wormholeAngle) * wormholeDistance + distortion);
      
      const targetIndex = (y * canvas.width + x) * 4;
      
      if (sourceX >= 0 && sourceX < canvas.width && sourceY >= 0 && sourceY < canvas.height) {
        const sourceIndex = (sourceY * canvas.width + sourceX) * 4;
        newData[targetIndex] = data[sourceIndex];
        newData[targetIndex + 1] = data[sourceIndex + 1];
        newData[targetIndex + 2] = data[sourceIndex + 2];
        newData[targetIndex + 3] = data[sourceIndex + 3];
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

// Additional fractal effect
export const applyFractalZoom = (canvas, ctx, params = {}) => {
  const { zoomSpeed = 1.0, centerX = -0.5, centerY = 0, iterations = 150 } = params;
  console.log('🌀 Fractal Zoom effect applied');
  
  const time = Date.now() * 0.001;
  const zoom = Math.pow(1.1, time * zoomSpeed);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const cx = centerX + (x - canvas.width / 2) / zoom / 200;
      const cy = centerY + (y - canvas.height / 2) / zoom / 200;
      
      let zx = 0, zy = 0;
      let i = 0;
      
      while (zx * zx + zy * zy < 4 && i < iterations) {
        const tmp = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = tmp;
        i++;
      }
      
      if (i < iterations) {
        const colorPhase = i * 0.1 + time * 0.5;
        const r = Math.sin(colorPhase) * 127 + 128;
        const g = Math.sin(colorPhase + 2) * 127 + 128;
        const b = Math.sin(colorPhase + 4) * 127 + 128;
        
        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            if (x + dx < canvas.width && y + dy < canvas.height) {
              const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
              data[idx] = Math.min(255, r);
              data[idx + 1] = Math.min(255, g);
              data[idx + 2] = Math.min(255, b);
            }
          }
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyFractalZoomWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { zoomSpeed = 1.0 } = params;
  const animatedZoom = Math.pow(1.1, timeInSeconds * zoomSpeed);
  console.log('🌀 Fractal Zoom WithTime effect applied');
  applyFractalZoom(canvas, ctx, { ...params, zoom: animatedZoom });
}; 