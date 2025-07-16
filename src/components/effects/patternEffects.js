/**
 * Pattern Effects Module
 * Contains geometric pattern effects
 */

export const applyVoronoiDiagram = (canvas, ctx, params = {}) => {
  const { cellCount = 50, colorMode = 'original' } = params;
  console.log('🔺 Voronoi Diagram effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Generate random seed points
  const seeds = [];
  for (let i = 0; i < cellCount; i++) {
    seeds.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    });
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
          if (colorMode === 'original') {
            data[targetIndex] = data[sourceIndex];
            data[targetIndex + 1] = data[sourceIndex + 1];
            data[targetIndex + 2] = data[sourceIndex + 2];
          } else if (colorMode === 'random') {
            data[targetIndex] = Math.random() * 255;
            data[targetIndex + 1] = Math.random() * 255;
            data[targetIndex + 2] = Math.random() * 255;
          } else if (colorMode === 'gradient') {
            const gradientValue = (minDistance / Math.sqrt(canvas.width ** 2 + canvas.height ** 2)) * 255;
            data[targetIndex] = gradientValue;
            data[targetIndex + 1] = gradientValue;
            data[targetIndex + 2] = gradientValue;
          }
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyTessellation = (canvas, ctx, params = {}) => {
  const { pattern = 'triangle', size = 20 } = params;
  console.log('🔶 Tessellation effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let y = 0; y < canvas.height; y += size) {
    for (let x = 0; x < canvas.width; x += size) {
      // Calculate average color for tile
      let avgR = 0, avgG = 0, avgB = 0, count = 0;
      
      for (let dy = 0; dy < size && y + dy < canvas.height; dy++) {
        for (let dx = 0; dx < size && x + dx < canvas.width; dx++) {
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
      
      // Apply pattern
      for (let dy = 0; dy < size && y + dy < canvas.height; dy++) {
        for (let dx = 0; dx < size && x + dx < canvas.width; dx++) {
          const i = ((y + dy) * canvas.width + (x + dx)) * 4;
          
          if (pattern === 'triangle') {
            const triangleX = dx / size;
            const triangleY = dy / size;
            if (triangleX + triangleY < 1) {
              data[i] = avgR;
              data[i + 1] = avgG;
              data[i + 2] = avgB;
            }
          } else if (pattern === 'square') {
            data[i] = avgR;
            data[i + 1] = avgG;
            data[i + 2] = avgB;
          } else if (pattern === 'hexagon') {
            const hexX = dx / size;
            const hexY = dy / size;
            const centerX = 0.5;
            const centerY = 0.5;
            const distance = Math.sqrt((hexX - centerX) ** 2 + (hexY - centerY) ** 2);
            if (distance < 0.5) {
              data[i] = avgR;
              data[i + 1] = avgG;
              data[i + 2] = avgB;
            }
          }
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyTriangulation = (canvas, ctx, params = {}) => {
  const { pointCount = 200, edgeLength = 50 } = params;
  console.log('📐 Triangulation effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Generate random points
  const points = [];
  for (let i = 0; i < pointCount; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    });
  }
  
  // Simple triangulation (Delaunay would be more complex)
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      // Find closest point
      let minDistance = Infinity;
      let closestPoint = null;
      
      for (const point of points) {
        const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = point;
        }
      }
      
      if (closestPoint) {
        const sourceIndex = (Math.floor(closestPoint.y) * canvas.width + Math.floor(closestPoint.x)) * 4;
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

export const applyHexagonalGrid = (canvas, ctx, params = {}) => {
  const { size = 15, strokeWidth = 2 } = params;
  console.log('⬡ Hexagonal Grid effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Create hexagonal grid overlay
  const hexWidth = size * 2;
  const hexHeight = size * Math.sqrt(3);
  
  for (let y = 0; y < canvas.height; y += hexHeight) {
    for (let x = 0; x < canvas.width; x += hexWidth * 0.75) {
      // Draw hexagon outline
      const centerX = x + hexWidth / 2;
      const centerY = y + hexHeight / 2;
      
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
        const x1 = centerX + Math.cos(angle) * size;
        const y1 = centerY + Math.sin(angle) * size;
        const x2 = centerX + Math.cos(angle + Math.PI / 3) * size;
        const y2 = centerY + Math.sin(angle + Math.PI / 3) * size;
        
        // Draw line
        const dx = x2 - x1;
        const dy = y2 - y1;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        
        for (let i = 0; i <= steps; i++) {
          const px = Math.floor(x1 + (dx * i) / steps);
          const py = Math.floor(y1 + (dy * i) / steps);
          
          if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
            const index = (py * canvas.width + px) * 4;
            data[index] = 0;
            data[index + 1] = 0;
            data[index + 2] = 0;
          }
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}; 