/**
 * Optical Effects Module
 * Contains optical and 3D effects
 */

export const applyLensFlare = (canvas, ctx, params = {}) => {
  const { intensity = 1.0, position = { x: 0.5, y: 0.5 } } = params;
  console.log('🌟 Lens Flare effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const flareX = position.x * canvas.width;
  const flareY = position.y * canvas.height;
  
  // Create lens flare effect
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const distance = Math.sqrt((x - flareX) ** 2 + (y - flareY) ** 2);
      const flareIntensity = Math.max(0, 1 - distance / 100) * intensity;
      
      const i = (y * canvas.width + x) * 4;
      
      // Add flare color (yellow/orange)
      data[i] = Math.min(255, data[i] + flareIntensity * 255);
      data[i + 1] = Math.min(255, data[i + 1] + flareIntensity * 200);
      data[i + 2] = Math.min(255, data[i + 2] + flareIntensity * 100);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyDepthOfField = (canvas, ctx, params = {}) => {
  const { focusX = 0.5, focusY = 0.5, blurRadius = 20 } = params;
  console.log('🎯 Depth of Field effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const focusCenterX = focusX * canvas.width;
  const focusCenterY = focusY * canvas.height;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const distance = Math.sqrt((x - focusCenterX) ** 2 + (y - focusCenterY) ** 2);
      const blurAmount = Math.min(blurRadius, distance / 10);
      
      if (blurAmount > 0) {
        // Simple blur by averaging nearby pixels
        let avgR = 0, avgG = 0, avgB = 0, count = 0;
        
        for (let dy = -blurAmount; dy <= blurAmount; dy++) {
          for (let dx = -blurAmount; dx <= blurAmount; dx++) {
            const sampleX = Math.floor(x + dx);
            const sampleY = Math.floor(y + dy);
            
            if (sampleX >= 0 && sampleX < canvas.width && sampleY >= 0 && sampleY < canvas.height) {
              const sampleI = (sampleY * canvas.width + sampleX) * 4;
              avgR += data[sampleI];
              avgG += data[sampleI + 1];
              avgB += data[sampleI + 2];
              count++;
            }
          }
        }
        
        if (count > 0) {
          const targetI = (y * canvas.width + x) * 4;
          newData[targetI] = avgR / count;
          newData[targetI + 1] = avgG / count;
          newData[targetI + 2] = avgB / count;
          newData[targetI + 3] = data[targetI + 3];
        }
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyChromostereopsis = (canvas, ctx, params = {}) => {
  const { intensity = 1.0 } = params;
  console.log('👁️ Chromostereopsis effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Chromostereopsis effect - red appears closer, blue appears farther
      const redShift = Math.floor(intensity * 5);
      const blueShift = Math.floor(-intensity * 3);
      
      // Shift red channel
      if (x + redShift >= 0 && x + redShift < canvas.width) {
        const redI = (y * canvas.width + (x + redShift)) * 4;
        newData[redI] = Math.max(newData[redI], r);
      }
      
      // Shift blue channel
      if (x + blueShift >= 0 && x + blueShift < canvas.width) {
        const blueI = (y * canvas.width + (x + blueShift)) * 4;
        newData[blueI + 2] = Math.max(newData[blueI + 2], b);
      }
      
      // Keep green in place
      newData[i + 1] = g;
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyAnaglyph3D = (canvas, ctx, params = {}) => {
  const { separation = 10, angle = 0 } = params;
  console.log('🥽 Anaglyph 3D effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  const angleRad = (angle * Math.PI) / 180;
  const cosAngle = Math.cos(angleRad);
  const sinAngle = Math.sin(angleRad);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      
      // Calculate left and right eye positions
      const leftX = x - separation * cosAngle / 2;
      const leftY = y - separation * sinAngle / 2;
      const rightX = x + separation * cosAngle / 2;
      const rightY = y + separation * sinAngle / 2;
      
      let leftR = 0, leftG = 0, leftB = 0;
      let rightR = 0, rightG = 0, rightB = 0;
      
      // Sample left eye
      if (leftX >= 0 && leftX < canvas.width && leftY >= 0 && leftY < canvas.height) {
        const leftI = (Math.floor(leftY) * canvas.width + Math.floor(leftX)) * 4;
        leftR = data[leftI];
        leftG = data[leftI + 1];
        leftB = data[leftI + 2];
      }
      
      // Sample right eye
      if (rightX >= 0 && rightX < canvas.width && rightY >= 0 && rightY < canvas.height) {
        const rightI = (Math.floor(rightY) * canvas.width + Math.floor(rightX)) * 4;
        rightR = data[rightI];
        rightG = data[rightI + 1];
        rightB = data[rightI + 2];
      }
      
      // Anaglyph: red for left eye, cyan for right eye
      newData[i] = leftR; // Red channel from left eye
      newData[i + 1] = rightG; // Green channel from right eye
      newData[i + 2] = rightB; // Blue channel from right eye
      newData[i + 3] = data[i + 3];
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
}; 