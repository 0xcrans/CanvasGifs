/**
 * Geometric Effects Module
 * Contains all geometric deformation and distortion effects
 */

export const applyWave = (canvas, ctx, params = {}) => {
  const { amplitude = 25, frequency = 0.08, direction = 'horizontal' } = params;
  console.log('〰️ Wave effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let sourceX = x;
      let sourceY = y;
      
      if (direction === 'horizontal') {
        sourceX = x + Math.sin(y * frequency) * amplitude;
      } else {
        sourceY = y + Math.sin(x * frequency) * amplitude;
      }
      
      sourceX = Math.max(0, Math.min(canvas.width - 1, Math.floor(sourceX)));
      sourceY = Math.max(0, Math.min(canvas.height - 1, Math.floor(sourceY)));
      
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

export const applyRipple = (canvas, ctx, params = {}) => {
  const { amplitude = 30, frequency = 0.05, centerX = 0.5, centerY = 0.5 } = params;
  console.log('💧 Ripple effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const cx = centerX * canvas.width;
  const cy = centerY * canvas.height;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const rippleOffset = Math.sin(distance * frequency) * amplitude;
      const angle = Math.atan2(dy, dx);
      
      const sourceX = Math.floor(x + Math.cos(angle) * rippleOffset);
      const sourceY = Math.floor(y + Math.sin(angle) * rippleOffset);
      
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

export const applySwirl = (canvas, ctx, params = {}) => {
  const { angle = 45, radius = 0.5, centerX = 0.5, centerY = 0.5 } = params;
  console.log('🌀 Swirl effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const cx = centerX * canvas.width;
  const cy = centerY * canvas.height;
  const maxRadius = radius * Math.min(canvas.width, canvas.height) / 2;
  const angleRad = (angle * Math.PI) / 180;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < maxRadius) {
        const distanceFactor = (maxRadius - distance) / maxRadius;
        const swirlAngle = distanceFactor * angleRad;
        
        const cos = Math.cos(swirlAngle);
        const sin = Math.sin(swirlAngle);
        
        const sourceX = Math.floor(cx + dx * cos - dy * sin);
        const sourceY = Math.floor(cy + dx * sin + dy * cos);
        
        const targetIndex = (y * canvas.width + x) * 4;
        
        if (sourceX >= 0 && sourceX < canvas.width && sourceY >= 0 && sourceY < canvas.height) {
          const sourceIndex = (sourceY * canvas.width + sourceX) * 4;
          newData[targetIndex] = data[sourceIndex];
          newData[targetIndex + 1] = data[sourceIndex + 1];
          newData[targetIndex + 2] = data[sourceIndex + 2];
          newData[targetIndex + 3] = data[sourceIndex + 3];
        }
      } else {
        const targetIndex = (y * canvas.width + x) * 4;
        newData[targetIndex] = data[targetIndex];
        newData[targetIndex + 1] = data[targetIndex + 1];
        newData[targetIndex + 2] = data[targetIndex + 2];
        newData[targetIndex + 3] = data[targetIndex + 3];
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyPinch = (canvas, ctx, params = {}) => {
  const { strength = 0.5, radius = 0.5, centerX = 0.5, centerY = 0.5 } = params;
  console.log('🤏 Pinch effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const cx = centerX * canvas.width;
  const cy = centerY * canvas.height;
  const maxRadius = radius * Math.min(canvas.width, canvas.height) / 2;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < maxRadius) {
        const distanceFactor = distance / maxRadius;
        const pinchFactor = Math.pow(distanceFactor, 1 + strength);
        
        const sourceX = Math.floor(cx + dx * pinchFactor);
        const sourceY = Math.floor(cy + dy * pinchFactor);
        
        const targetIndex = (y * canvas.width + x) * 4;
        
        if (sourceX >= 0 && sourceX < canvas.width && sourceY >= 0 && sourceY < canvas.height) {
          const sourceIndex = (sourceY * canvas.width + sourceX) * 4;
          newData[targetIndex] = data[sourceIndex];
          newData[targetIndex + 1] = data[sourceIndex + 1];
          newData[targetIndex + 2] = data[sourceIndex + 2];
          newData[targetIndex + 3] = data[sourceIndex + 3];
        }
      } else {
        const targetIndex = (y * canvas.width + x) * 4;
        newData[targetIndex] = data[targetIndex];
        newData[targetIndex + 1] = data[targetIndex + 1];
        newData[targetIndex + 2] = data[targetIndex + 2];
        newData[targetIndex + 3] = data[targetIndex + 3];
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyFisheye = (canvas, ctx, params = {}) => {
  const { strength = 1.0, zoom = 1.0 } = params;
  console.log('🐟 Fisheye effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const maxRadius = Math.min(canvas.width, canvas.height) / 2;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = (x - cx) / maxRadius;
      const dy = (y - cy) / maxRadius;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= 1) {
        const fisheyeDistance = Math.pow(distance, strength);
        const angle = Math.atan2(dy, dx);
        
        const sourceX = Math.floor(cx + Math.cos(angle) * fisheyeDistance * maxRadius / zoom);
        const sourceY = Math.floor(cy + Math.sin(angle) * fisheyeDistance * maxRadius / zoom);
        
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
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyKaleidoscope = (canvas, ctx, params = {}) => {
  const { segments = 6, angle = 0 } = params;
  console.log('🔮 Kaleidoscope effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const segmentAngle = (2 * Math.PI) / segments;
  const rotationAngle = (angle * Math.PI) / 180;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      let pixelAngle = Math.atan2(dy, dx) + rotationAngle;
      
      // Normalize angle to [0, 2π]
      while (pixelAngle < 0) pixelAngle += 2 * Math.PI;
      while (pixelAngle >= 2 * Math.PI) pixelAngle -= 2 * Math.PI;
      
      // Map to segment
      const segmentIndex = Math.floor(pixelAngle / segmentAngle);
      const segmentOffset = pixelAngle - segmentIndex * segmentAngle;
      
      // Mirror within segment
      const mirroredOffset = segmentOffset > segmentAngle / 2 ? 
        segmentAngle - segmentOffset : segmentOffset;
      
      const sourceAngle = mirroredOffset - rotationAngle;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const sourceX = Math.floor(cx + Math.cos(sourceAngle) * distance);
      const sourceY = Math.floor(cy + Math.sin(sourceAngle) * distance);
      
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

export const applyMirror = (canvas, ctx, params = {}) => {
  const { direction = 'horizontal' } = params;
  console.log('🪞 Mirror effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let sourceX = x;
      let sourceY = y;
      
      switch (direction) {
        case 'horizontal':
          if (x > canvas.width / 2) {
            sourceX = canvas.width - x - 1;
          }
          break;
        case 'vertical':
          if (y > canvas.height / 2) {
            sourceY = canvas.height - y - 1;
          }
          break;
        case 'both':
          if (x > canvas.width / 2) {
            sourceX = canvas.width - x - 1;
          }
          if (y > canvas.height / 2) {
            sourceY = canvas.height - y - 1;
          }
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

export const applyDisplacement = (canvas, ctx, params = {}) => {
  const { amplitude = 20, frequency = 0.1 } = params;
  console.log('🌊 Displacement effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const noiseX = Math.sin(x * frequency + y * frequency * 0.5) * amplitude;
      const noiseY = Math.cos(y * frequency + x * frequency * 0.3) * amplitude;
      
      const sourceX = Math.max(0, Math.min(canvas.width - 1, Math.floor(x + noiseX)));
      const sourceY = Math.max(0, Math.min(canvas.height - 1, Math.floor(y + noiseY)));
      
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

// Additional geometric effects
export const applySpiral = (canvas, ctx, params = {}) => {
  const { strength = 1.0, centerX = 0.5, centerY = 0.5, rotations = 3 } = params;
  console.log('🐚 Spiral effect applied');
  
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
      
      // Apply spiral transformation
      const spiralAngle = angle + (distance / maxRadius) * rotations * Math.PI * strength;
      const spiralRadius = distance * (1 + Math.sin(spiralAngle) * 0.1);
      
      const sourceX = cx + Math.cos(spiralAngle) * spiralRadius;
      const sourceY = cy + Math.sin(spiralAngle) * spiralRadius;
      
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
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyVortex = (canvas, ctx, params = {}) => {
  const { strength = 1.0, centerX = 0.5, centerY = 0.5, rotations = 5 } = params;
  console.log('🌪️ Vortex effect applied');
  
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
      
      // Apply vortex transformation
      const vortexAngle = angle + (distance / maxRadius) * rotations * Math.PI * strength;
      const vortexRadius = distance * (1 - Math.sin(vortexAngle) * 0.2);
      
      const sourceX = cx + Math.cos(vortexAngle) * vortexRadius;
      const sourceY = cy + Math.sin(vortexAngle) * vortexRadius;
      
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
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyLiquidPixels = (canvas, ctx, params = {}) => {
  const { viscosity = 0.8, flow = 1.0, turbulence = 10 } = params;
  console.log('💧 Liquid Pixels effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const noiseX = (Math.sin(x * 0.01) + Math.cos(y * 0.01)) * turbulence;
      const noiseY = (Math.cos(x * 0.01) + Math.sin(y * 0.01)) * turbulence;
      
      const sourceX = x + noiseX * flow;
      const sourceY = y + noiseY * flow;
      
      if (sourceX >= 0 && sourceX < canvas.width && sourceY >= 0 && sourceY < canvas.height) {
        const targetIndex = (y * canvas.width + x) * 4;
        const sourceIndex = (Math.floor(sourceY) * canvas.width + Math.floor(sourceX)) * 4;
        
        // Blend with viscosity
        const blend = viscosity;
        newData[targetIndex] = data[targetIndex] * (1 - blend) + data[sourceIndex] * blend;
        newData[targetIndex + 1] = data[targetIndex + 1] * (1 - blend) + data[sourceIndex + 1] * blend;
        newData[targetIndex + 2] = data[targetIndex + 2] * (1 - blend) + data[sourceIndex + 2] * blend;
        newData[targetIndex + 3] = data[targetIndex + 3];
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyMorph = (canvas, ctx, params = {}) => {
  const { intensity = 1.0, speed = 1.0 } = params;
  console.log('🧬 Morph effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const time = Date.now() * 0.001 * speed;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const morphX = Math.sin(x * 0.01 + time) * intensity * 10;
      const morphY = Math.cos(y * 0.01 + time) * intensity * 10;
      
      const sourceX = x + morphX;
      const sourceY = y + morphY;
      
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
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

// Animated versions with time
export const applyWaveWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { waveSpeed = 1.2, sparkle = true, frequency = 0.08, amplitude = 25, direction = 'horizontal' } = params;
  const animatedFrequency = frequency + timeInSeconds * waveSpeed * 0.1;
  
  console.log('〰️ Wave WithTime effect applied');
  console.log('〰️ Original frequency:', frequency, 'Animated frequency:', animatedFrequency);
  applyWave(canvas, ctx, { amplitude, frequency: animatedFrequency, direction });
  
  // Add sparkle effect if enabled
  if (sparkle) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < 0.001) {
        const sparkleIntensity = Math.sin(timeInSeconds * 10 + i) * 0.5 + 0.5;
        data[i] = Math.min(255, data[i] + sparkleIntensity * 100);
        data[i + 1] = Math.min(255, data[i + 1] + sparkleIntensity * 100);
        data[i + 2] = Math.min(255, data[i + 2] + sparkleIntensity * 100);
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
};

export const applyRippleWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { speed = 1.0, damping = 0.95, frequency = 0.05, amplitude = 30, centerX = 0.5, centerY = 0.5 } = params;
  const animatedFrequency = frequency + timeInSeconds * speed * 0.05;
  const animatedAmplitude = amplitude * Math.pow(damping, timeInSeconds);
  
  console.log('💧 Ripple WithTime effect applied');
  console.log('💧 Original frequency:', frequency, 'Animated frequency:', animatedFrequency);
  console.log('💧 Original amplitude:', amplitude, 'Animated amplitude:', animatedAmplitude);
  applyRipple(canvas, ctx, { 
    frequency: animatedFrequency,
    amplitude: animatedAmplitude,
    centerX,
    centerY
  });
};

export const applySwirlWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { angle = 45, radius = 0.5, centerX = 0.5, centerY = 0.5, rotationSpeed = 1.0 } = params;
  const animatedAngle = angle + timeInSeconds * rotationSpeed * 360; // Rotate 360 degrees per second
  
  console.log('🌀 Swirl WithTime effect applied');
  console.log('🌀 Original angle:', angle, 'Animated angle:', animatedAngle);
  applySwirl(canvas, ctx, { ...params, angle: animatedAngle });
};

export const applyPinchWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { strength = 0.5, radius = 0.5, centerX = 0.5, centerY = 0.5, speed = 1.0 } = params;
  const animatedStrength = strength + Math.sin(timeInSeconds * speed) * 0.2;
  
  console.log('🤏 Pinch WithTime effect applied');
  console.log('🤏 Original strength:', strength, 'Animated strength:', animatedStrength);
  applyPinch(canvas, ctx, { ...params, strength: animatedStrength });
};

export const applyFisheyeWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { strength = 1.0, zoom = 1.0, speed = 1.0 } = params;
  const animatedStrength = strength + Math.sin(timeInSeconds * speed) * 0.3;
  const animatedZoom = zoom + Math.cos(timeInSeconds * speed * 0.5) * 0.2;
  
  console.log('🐟 Fisheye WithTime effect applied');
  console.log('🐟 Original strength:', strength, 'Animated strength:', animatedStrength);
  console.log('🐟 Original zoom:', zoom, 'Animated zoom:', animatedZoom);
  applyFisheye(canvas, ctx, { ...params, strength: animatedStrength, zoom: animatedZoom });
};

export const applyKaleidoscopeWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { segments = 6, angle = 0, rotationSpeed = 0.5 } = params;
  
  // Animate the rotation angle
  const animatedAngle = angle + (timeInSeconds * rotationSpeed * 360);
  
  console.log('🔮 Kaleidoscope WithTime effect applied');
  applyKaleidoscope(canvas, ctx, { ...params, angle: animatedAngle });
};

export const applyDisplacementWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { amplitude = 20, frequency = 0.1, speed = 1.0 } = params;
  console.log('🌊 Displacement WithTime effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  // POPRAWKA: Dodaj animację używając timeInSeconds
  const animationTime = timeInSeconds * speed;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      // Dodaj animację do przemieszczenia
      const noiseX = Math.sin(x * frequency + animationTime * 2) * amplitude + 
                    Math.cos(y * frequency * 0.7 + animationTime * 1.5) * amplitude * 0.5;
      const noiseY = Math.cos(y * frequency + animationTime * 1.8) * amplitude + 
                    Math.sin(x * frequency * 0.6 + animationTime * 2.2) * amplitude * 0.5;
      
      const sourceX = Math.max(0, Math.min(canvas.width - 1, Math.floor(x + noiseX)));
      const sourceY = Math.max(0, Math.min(canvas.height - 1, Math.floor(y + noiseY)));
      
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

// Time-based versions
export const applySpiralWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { strength = 1.0, centerX = 0.5, centerY = 0.5, rotations = 3, rotationSpeed = 1.0 } = params;
  const animatedRotations = rotations + timeInSeconds * rotationSpeed;
  
  console.log('🐚 Spiral WithTime effect applied');
  console.log('🐚 Original rotations:', rotations, 'Animated rotations:', animatedRotations);
  applySpiral(canvas, ctx, { ...params, rotations: animatedRotations });
};

export const applyVortexWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { strength = 1.0, centerX = 0.5, centerY = 0.5, rotations = 5, rotationSpeed = 1.0 } = params;
  const animatedRotations = rotations + timeInSeconds * rotationSpeed;
  
  console.log('🌪️ Vortex WithTime effect applied');
  console.log('🌪️ Original rotations:', rotations, 'Animated rotations:', animatedRotations);
  applyVortex(canvas, ctx, { ...params, rotations: animatedRotations });
};

export const applyLiquidPixelsWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { viscosity = 0.8, flow = 1.0, turbulence = 10, speed = 1.0 } = params;
  const animatedTime = timeInSeconds * speed;
  
  console.log('💧 Liquid Pixels WithTime effect applied');
  console.log('💧 Animated time:', animatedTime);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const noiseX = (Math.sin(x * 0.01 + animatedTime) + Math.cos(y * 0.01 + animatedTime)) * turbulence;
      const noiseY = (Math.cos(x * 0.01 + animatedTime) + Math.sin(y * 0.01 + animatedTime)) * turbulence;
      
      const sourceX = x + noiseX * flow;
      const sourceY = y + noiseY * flow;
      
      if (sourceX >= 0 && sourceX < canvas.width && sourceY >= 0 && sourceY < canvas.height) {
        const targetIndex = (y * canvas.width + x) * 4;
        const sourceIndex = (Math.floor(sourceY) * canvas.width + Math.floor(sourceX)) * 4;
        
        // Blend with viscosity
        const blend = viscosity;
        newData[targetIndex] = data[targetIndex] * (1 - blend) + data[sourceIndex] * blend;
        newData[targetIndex + 1] = data[targetIndex + 1] * (1 - blend) + data[sourceIndex + 1] * blend;
        newData[targetIndex + 2] = data[targetIndex + 2] * (1 - blend) + data[sourceIndex + 2] * blend;
        newData[targetIndex + 3] = data[targetIndex + 3];
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyMorphWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { intensity = 1.0, speed = 1.0 } = params;
  const animatedTime = timeInSeconds * speed;
  
  console.log('🧬 Morph WithTime effect applied');
  console.log('🧬 Animated time:', animatedTime);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const morphX = Math.sin(x * 0.01 + animatedTime) * intensity * 10;
      const morphY = Math.cos(y * 0.01 + animatedTime) * intensity * 10;
      
      const sourceX = x + morphX;
      const sourceY = y + morphY;
      
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
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
}; 