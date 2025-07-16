/**
 * Animation Effects Module
 * Contains effects that create motion and animation
 */

export const applyBreathing = (canvas, ctx, params = {}) => {
  const { intensity = 0.15, speed = 1.5, centerX = 0.5, centerY = 0.5 } = params;
  console.log('🫁 Breathing effect applied (static version)');
  
  // Static version - just slight zoom
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const breatheAmount = intensity * 0.5; // Static version has reduced effect
  const scale = 1 + breatheAmount;
  
  const cx = centerX * canvas.width;
  const cy = centerY * canvas.height;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      
      const sourceX = cx + dx / scale;
      const sourceY = cy + dy / scale;
      
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

export const applyShake = (canvas, ctx, params = {}) => {
  const { intensity = 5, speed = 3.0 } = params;
  console.log('📳 Shake effect applied (static version)');
  
  // Static version - apply a fixed small shake
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const shakeX = intensity * 0.3;
  const shakeY = intensity * 0.3;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const sourceX = Math.floor(x - shakeX);
      const sourceY = Math.floor(y - shakeY);
      
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

export const applyOscillate = (canvas, ctx, params = {}) => {
  const { frequency = 1.0, amplitude = 20, direction = 'horizontal' } = params;
  console.log('〰️ Oscillate effect applied (static version)');
  
  // Static version - apply a fixed oscillation
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let sourceX = x;
      let sourceY = y;
      
      if (direction === 'horizontal') {
        sourceX = x + Math.sin(y * frequency * 0.02) * amplitude * 0.3;
      } else if (direction === 'vertical') {
        sourceY = y + Math.sin(x * frequency * 0.02) * amplitude * 0.3;
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

export const applyStrobe = (canvas, ctx, params = {}) => {
  const { speed = 3.0, intensity = 0.8 } = params;
  console.log('💡 Strobe effect applied (static version)');
  
  // Static version - apply brightness modulation
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const brightnessMultiplier = 1 + intensity * 0.5; // Static brightness boost
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * brightnessMultiplier);
    data[i + 1] = Math.min(255, data[i + 1] * brightnessMultiplier);
    data[i + 2] = Math.min(255, data[i + 2] * brightnessMultiplier);
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// Animated versions with time (these are the real animated effects)
export const applyBreathingWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { intensity = 0.15, speed = 1.5, centerX = 0.5, centerY = 0.5 } = params;
  console.log('🫁 Breathing WithTime effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const time = timeInSeconds * speed;
  const breatheAmount = Math.sin(time * 2 * Math.PI) * intensity;
  const scale = 1 + breatheAmount;
  
  const cx = centerX * canvas.width;
  const cy = centerY * canvas.height;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      
      const sourceX = cx + dx / scale;
      const sourceY = cy + dy / scale;
      
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

export const applyShakeWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { intensity = 10, speed = 5.0, horizontal = true, vertical = true } = params;
  console.log('📳 Shake WithTime effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const time = timeInSeconds * speed;
  const shakeX = horizontal ? Math.sin(time * 2.5 * 2 * Math.PI) * intensity : 0;
  const shakeY = vertical ? Math.cos(time * 3.1 * 2 * Math.PI) * intensity : 0;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const sourceX = Math.floor(x - shakeX);
      const sourceY = Math.floor(y - shakeY);
      
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

export const applyOscillateWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { amplitude = 20, frequency = 2.0, direction = 'horizontal', waveType = 'sine' } = params;
  console.log('〰️ Oscillate WithTime effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const time = timeInSeconds * frequency;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let sourceX = x;
      let sourceY = y;
      
      let wave;
      switch (waveType) {
        case 'square':
          wave = Math.sign(Math.sin(time * 2 * Math.PI));
          break;
        case 'triangle':
          wave = Math.asin(Math.sin(time * 2 * Math.PI)) * 2 / Math.PI;
          break;
        default: // sine
          wave = Math.sin(time * 2 * Math.PI);
          break;
      }
      
      if (direction === 'horizontal') {
        sourceX = x + wave * amplitude;
      } else if (direction === 'vertical') {
        sourceY = y + wave * amplitude;
      } else if (direction === 'both') {
        sourceX = x + wave * amplitude;
        sourceY = y + Math.cos(time * 2 * Math.PI) * amplitude;
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

export const applyStrobeWithTime = (canvas, ctx, params = {}, timeInSeconds) => {
  const { speed = 3.0, intensity = 0.8 } = params;
  console.log('💡 Strobe WithTime effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const strobe = Math.sin(timeInSeconds * speed * 2 * Math.PI);
  const brightnessMultiplier = 1 + strobe * intensity;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] * brightnessMultiplier));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * brightnessMultiplier));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * brightnessMultiplier));
  }
  
  ctx.putImageData(imageData, 0, 0);
}; 