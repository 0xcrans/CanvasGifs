/**
 * Basic Effects Module
 * Contains fundamental image processing effects
 */

export const applyDithering = (canvas, ctx, params = {}) => {
  const { levels = 4, method = 'floyd-steinberg' } = params;
  console.log('⚫ Dithering effect applied');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  if (method === 'floyd-steinberg') {
    // Floyd-Steinberg dithering
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        
        // Quantize each channel
        for (let c = 0; c < 3; c++) {
          const oldPixel = data[i + c];
          const newPixel = Math.round(oldPixel / (255 / (levels - 1))) * (255 / (levels - 1));
          data[i + c] = newPixel;
          
          const error = oldPixel - newPixel;
          
          // Distribute error to neighboring pixels
          if (x + 1 < canvas.width) {
            data[i + 4 + c] += error * 7 / 16;
          }
          if (x - 1 >= 0 && y + 1 < canvas.height) {
            data[i - 4 + canvas.width * 4 + c] += error * 3 / 16;
          }
          if (y + 1 < canvas.height) {
            data[i + canvas.width * 4 + c] += error * 5 / 16;
          }
          if (x + 1 < canvas.width && y + 1 < canvas.height) {
            data[i + 4 + canvas.width * 4 + c] += error * 1 / 16;
          }
        }
      }
    }
  } else if (method === 'ordered') {
    // Ordered dithering
    const ditherMatrix = [
      [0, 8, 2, 10],
      [12, 4, 14, 6],
      [3, 11, 1, 9],
      [15, 7, 13, 5]
    ];
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const threshold = ditherMatrix[y % 4][x % 4] / 16;
        
        for (let c = 0; c < 3; c++) {
          const pixel = data[i + c] / 255;
          const quantized = pixel > threshold ? 255 : 0;
          data[i + c] = quantized;
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}; 