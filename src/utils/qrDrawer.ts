import QRCode from 'qrcode';
import { QROptions, QRTheme, DotShape, CornerSquareStyle, CenterLogoShape } from '../types';

export interface RenderResult {
  dataUrl: string;
  blob: Blob;
}

export interface RenderQRCodeImages {
  centerLogo?: HTMLImageElement | null;
  photoDots?: HTMLImageElement | null;
}

export async function renderQRCode(
  options: QROptions,
  theme: QRTheme,
  imagesInput?: RenderQRCodeImages | HTMLImageElement | null
): Promise<RenderResult> {
  const {
    text,
    frameStyle,
    resolution = 1024,
    customColorsEnabled,
    fgColor: customFg,
    bgColor: customBg,
    showCenterLogo = true,
    centerLogoShape = 'rounded',
    photoDotsActive = false,
    photoDotsMode = 'photo_dots',
    photoContrast = 65,
    // fallback aliases
    photoMode
  } = options;

  // Resolve images from imagesInput or single element
  let centerLogoImage: HTMLImageElement | null = null;
  let photoDotsImage: HTMLImageElement | null = null;

  if (imagesInput && 'nodeName' in imagesInput) {
    const singleImg = imagesInput as HTMLImageElement;
    if (photoDotsActive || photoMode === 'photo_dots' || photoMode === 'photo_mosaic') {
      photoDotsImage = singleImg;
    }
    if (showCenterLogo || photoMode === 'center_logo') {
      centerLogoImage = singleImg;
    }
  } else if (imagesInput) {
    centerLogoImage = imagesInput.centerLogo || null;
    photoDotsImage = imagesInput.photoDots || null;
  }

  // Error Correction H (~30% recovery) ensures reliable scanning with both center logo & photo dots
  const qrData = QRCode.create(text || 'https://google.com', {
    errorCorrectionLevel: 'H'
  });

  const modules = qrData.modules;
  const size = modules.size;

  const hasCenterLogo = Boolean(
    showCenterLogo &&
    centerLogoImage &&
    centerLogoImage.complete &&
    centerLogoImage.naturalWidth > 0
  );

  const isDotsPhotoActive = Boolean(
    photoDotsActive &&
    photoDotsImage &&
    photoDotsImage.complete &&
    photoDotsImage.naturalWidth > 0
  );

  // Setup Canvas
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d')!;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Base Colors
  const fgColor = customColorsEnabled ? customFg : theme.primaryColor;
  const bgColor = customColorsEnabled ? customBg : theme.bgColor;

  // Draw Canvas Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, resolution, resolution);

  // Calculate QR bounds based on Frame Style
  let qrX = 0;
  let qrY = 0;
  let qrSize = resolution;

  if (frameStyle === 'badge_card') {
    const outerMargin = resolution * 0.045;
    const cardBorderWidth = Math.max(2, resolution * 0.008);
    const bottomLabelH = resolution * 0.08;

    // Card border
    ctx.strokeStyle = customColorsEnabled ? customFg : theme.secondaryColor;
    ctx.lineWidth = cardBorderWidth;
    ctx.beginPath();
    ctx.roundRect(
      outerMargin,
      outerMargin,
      resolution - outerMargin * 2,
      resolution - outerMargin * 2,
      resolution * 0.035
    );
    ctx.stroke();

    // Bottom Scan text banner
    const footerY = resolution - outerMargin - bottomLabelH;
    const footerW = resolution - outerMargin * 2;
    ctx.fillStyle = customColorsEnabled ? customFg : theme.primaryColor;
    ctx.beginPath();
    ctx.roundRect(
      outerMargin + cardBorderWidth * 2,
      footerY,
      footerW - cardBorderWidth * 4,
      bottomLabelH - cardBorderWidth * 2,
      resolution * 0.02
    );
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `600 ${Math.round(resolution * 0.026)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillText('SCAN ME  •  স্ক্যান করুন', resolution / 2, footerY + bottomLabelH * 0.45);

    // QR area inside card
    const availableH = resolution - outerMargin * 2 - bottomLabelH - resolution * 0.04;
    qrSize = Math.min(resolution - outerMargin * 2 - resolution * 0.08, availableH);
    qrX = (resolution - qrSize) / 2;
    qrY = outerMargin + resolution * 0.04 + (availableH - qrSize) / 2;
  } else if (frameStyle === 'clean_border') {
    const margin = resolution * 0.04;
    ctx.strokeStyle = fgColor;
    ctx.lineWidth = Math.max(2, resolution * 0.006);
    ctx.beginPath();
    ctx.roundRect(margin, margin, resolution - margin * 2, resolution - margin * 2, resolution * 0.03);
    ctx.stroke();

    const padding = resolution * 0.08;
    qrSize = resolution - padding * 2;
    qrX = padding;
    qrY = padding;
  } else {
    // Standard Default QR (Quiet Zone ~8%)
    const padding = resolution * 0.08;
    qrSize = resolution - padding * 2;
    qrX = padding;
    qrY = padding;
  }

  const cellSize = qrSize / size;

  // 1. Render QR Data Modules (Dots)
  if (isDotsPhotoActive && photoDotsImage && photoDotsMode === 'photo_dots') {
    // ==========================================
    // PHOTO-FORMED DOTS (USER'S IMAGE BECOMES THE QR DOTS)
    // ==========================================
    const dotsPath = new Path2D();

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (isFinderPattern(r, c, size)) continue;
        if (hasCenterLogo && isCenterLogoArea(r, c, size)) continue;

        const isDark = modules.get(r, c);
        if (!isDark) continue;

        const x = qrX + c * cellSize;
        const y = qrY + r * cellSize;
        appendModuleToPath(dotsPath, x, y, cellSize, theme.dotShape);
      }
    }

    ctx.save();
    ctx.clip(dotsPath);

    // Draw user's gallery photo spanning the QR matrix
    drawCoverImage(ctx, photoDotsImage, qrX, qrY, qrSize, qrSize);

    // Scannability contrast layer
    const contrastFactor = Math.min(0.72, Math.max(0.2, (photoContrast / 100) * 0.55));
    ctx.fillStyle = fgColor;
    ctx.globalAlpha = contrastFactor;
    ctx.fillRect(qrX, qrY, qrSize, qrSize);

    ctx.restore();

  } else if (isDotsPhotoActive && photoDotsImage && photoDotsMode === 'photo_mosaic') {
    // ==========================================
    // PHOTO MOSAIC (EACH DOT SAMPLING IMAGE PIXELS)
    // ==========================================
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = size;
    sampleCanvas.height = size;
    const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true })!;
    drawCoverImage(sampleCtx, photoDotsImage, 0, 0, size, size);
    const pixelData = sampleCtx.getImageData(0, 0, size, size).data;

    const contrastMultiplier = 0.55 + (1 - photoContrast / 100) * 0.35;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (isFinderPattern(r, c, size)) continue;
        if (hasCenterLogo && isCenterLogoArea(r, c, size)) continue;

        const isDark = modules.get(r, c);
        if (!isDark) continue;

        const x = qrX + c * cellSize;
        const y = qrY + r * cellSize;

        const pIdx = (r * size + c) * 4;
        const red = Math.round(pixelData[pIdx] * contrastMultiplier);
        const green = Math.round(pixelData[pIdx + 1] * contrastMultiplier);
        const blue = Math.round(pixelData[pIdx + 2] * contrastMultiplier);

        const dotColor = `rgb(${red}, ${green}, ${blue})`;
        drawModule(ctx, x, y, cellSize, theme.dotShape, dotColor);
      }
    }
  } else {
    // ==========================================
    // STANDARD THEME DOTS
    // ==========================================
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (isFinderPattern(r, c, size)) continue;
        if (hasCenterLogo && isCenterLogoArea(r, c, size)) continue;

        const isDark = modules.get(r, c);
        if (!isDark) continue;

        const x = qrX + c * cellSize;
        const y = qrY + r * cellSize;

        drawModule(ctx, x, y, cellSize, theme.dotShape, fgColor);
      }
    }
  }

  // 2. Draw 3 Corner Finder Patterns (Eyes)
  drawFinderPattern(ctx, qrX, qrY, cellSize, theme.cornerStyle, fgColor, bgColor);
  drawFinderPattern(ctx, qrX + (size - 7) * cellSize, qrY, cellSize, theme.cornerStyle, fgColor, bgColor);
  drawFinderPattern(ctx, qrX, qrY + (size - 7) * cellSize, cellSize, theme.cornerStyle, fgColor, bgColor);

  // 3. Draw Center Image / Logo (QR এর মাঝের ছবি)
  if (hasCenterLogo && centerLogoImage) {
    const centerStart = Math.floor(size * 0.38);
    const centerEnd = Math.ceil(size * 0.62);
    const badgeModules = centerEnd - centerStart + 1;
    const badgePixelSize = badgeModules * cellSize;
    const badgeX = qrX + centerStart * cellSize;
    const badgeY = qrY + centerStart * cellSize;

    drawCenterImage(
      ctx,
      badgeX,
      badgeY,
      badgePixelSize,
      centerLogoImage,
      fgColor,
      bgColor,
      centerLogoShape
    );
  }

  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/png', 1.0);
  });

  return { dataUrl, blob };
}

// Check if cell is in one of the three 7x7 corner finder patterns
function isFinderPattern(r: number, c: number, size: number): boolean {
  if (r < 7 && c < 7) return true;
  if (r < 7 && c >= size - 7) return true;
  if (r >= size - 7 && c < 7) return true;
  return false;
}

// Center area reservation for user's logo/image (from row/col ~37% to ~63%)
function isCenterLogoArea(r: number, c: number, size: number): boolean {
  const start = Math.floor(size * 0.37);
  const end = Math.ceil(size * 0.63);
  return r >= start && r <= end && c >= start && c <= end;
}

// Append module geometry to a Path2D for masking
function appendModuleToPath(
  path: Path2D,
  x: number,
  y: number,
  size: number,
  dotShape: DotShape
) {
  switch (dotShape) {
    case 'dots': {
      const radius = size * 0.44;
      path.moveTo(x + size / 2 + radius, y + size / 2);
      path.arc(x + size / 2, y + size / 2, radius, 0, Math.PI * 2);
      break;
    }
    case 'rounded': {
      path.roundRect(x + size * 0.05, y + size * 0.05, size * 0.9, size * 0.9, size * 0.3);
      break;
    }
    case 'smooth': {
      path.roundRect(x + size * 0.04, y + size * 0.04, size * 0.92, size * 0.92, size * 0.42);
      break;
    }
    case 'square':
    default: {
      path.rect(x, y, size + 0.2, size + 0.2);
      break;
    }
  }
}

// Draw individual data dots with color
function drawModule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  dotShape: DotShape,
  fgColor: string
) {
  ctx.fillStyle = fgColor;

  switch (dotShape) {
    case 'dots': {
      const radius = size * 0.44;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, radius, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'rounded': {
      ctx.beginPath();
      ctx.roundRect(x + size * 0.05, y + size * 0.05, size * 0.9, size * 0.9, size * 0.3);
      ctx.fill();
      break;
    }
    case 'smooth': {
      ctx.beginPath();
      ctx.roundRect(x + size * 0.04, y + size * 0.04, size * 0.92, size * 0.92, size * 0.42);
      ctx.fill();
      break;
    }
    case 'square':
    default: {
      ctx.fillRect(x, y, size + 0.2, size + 0.2);
      break;
    }
  }
}

// Draw cover-fitted image in rectangular box
function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const nw = img.naturalWidth || 1;
  const nh = img.naturalHeight || 1;
  let sWidth = nw;
  let sHeight = nh;
  let sx = 0;
  let sy = 0;

  if (nw > nh) {
    sWidth = nh;
    sx = (nw - nh) / 2;
  } else if (nh > nw) {
    sHeight = nw;
    sy = (nh - nw) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
}

// Draw professional Corner Finder Pattern (7x7 module square)
function drawFinderPattern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cellSize: number,
  cornerStyle: CornerSquareStyle,
  fgColor: string,
  bgColor: string
) {
  ctx.save();
  const outerWidth = cellSize * 7;
  const innerSpace = cellSize * 5;
  const centerDot = cellSize * 3;
  const cx = x + outerWidth / 2;
  const cy = y + outerWidth / 2;

  switch (cornerStyle) {
    case 'circle': {
      ctx.fillStyle = fgColor;
      ctx.beginPath();
      ctx.arc(cx, cy, outerWidth / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.arc(cx, cy, innerSpace / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fgColor;
      ctx.beginPath();
      ctx.arc(cx, cy, centerDot / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'rounded': {
      ctx.fillStyle = fgColor;
      ctx.beginPath();
      ctx.roundRect(x, y, outerWidth, outerWidth, cellSize * 1.8);
      ctx.fill();

      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(cx - innerSpace / 2, cy - innerSpace / 2, innerSpace, innerSpace, cellSize * 1.1);
      ctx.fill();

      ctx.fillStyle = fgColor;
      ctx.beginPath();
      ctx.roundRect(cx - centerDot / 2, cy - centerDot / 2, centerDot, centerDot, cellSize * 0.8);
      ctx.fill();
      break;
    }

    case 'leaf': {
      ctx.fillStyle = fgColor;
      ctx.beginPath();
      ctx.roundRect(x, y, outerWidth, outerWidth, [cellSize * 2.2, cellSize * 0.4, cellSize * 2.2, cellSize * 0.4]);
      ctx.fill();

      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(
        cx - innerSpace / 2,
        cy - innerSpace / 2,
        innerSpace,
        innerSpace,
        [cellSize * 1.5, cellSize * 0.2, cellSize * 1.5, cellSize * 0.2]
      );
      ctx.fill();

      ctx.fillStyle = fgColor;
      ctx.beginPath();
      ctx.roundRect(
        cx - centerDot / 2,
        cy - centerDot / 2,
        centerDot,
        centerDot,
        [cellSize * 1.0, cellSize * 0.1, cellSize * 1.0, cellSize * 0.1]
      );
      ctx.fill();
      break;
    }

    case 'square':
    default: {
      ctx.fillStyle = fgColor;
      ctx.fillRect(x, y, outerWidth, outerWidth);

      ctx.fillStyle = bgColor;
      ctx.fillRect(cx - innerSpace / 2, cy - innerSpace / 2, innerSpace, innerSpace);

      ctx.fillStyle = fgColor;
      ctx.fillRect(cx - centerDot / 2, cy - centerDot / 2, centerDot, centerDot);
      break;
    }
  }

  ctx.restore();
}

// Draw Center Image / Logo in the middle with custom shape (circle, rounded, square)
function drawCenterImage(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  logoImg: HTMLImageElement,
  fgColor: string,
  bgColor: string,
  shape: CenterLogoShape = 'rounded'
) {
  ctx.save();
  const cx = x + size / 2;
  const cy = y + size / 2;
  const outerBox = size * 0.94;
  const bx = cx - outerBox / 2;
  const by = cy - outerBox / 2;
  const radius = shape === 'circle' ? outerBox / 2 : shape === 'rounded' ? size * 0.22 : size * 0.05;

  // 1. High contrast protective background base
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  if (shape === 'circle') {
    ctx.arc(cx, cy, outerBox / 2, 0, Math.PI * 2);
  } else {
    ctx.roundRect(bx, by, outerBox, outerBox, radius);
  }
  ctx.fill();

  // 2. Crisp decorative border
  ctx.strokeStyle = fgColor;
  ctx.lineWidth = Math.max(1.5, size * 0.045);
  ctx.beginPath();
  if (shape === 'circle') {
    ctx.arc(cx, cy, outerBox / 2, 0, Math.PI * 2);
  } else {
    ctx.roundRect(bx, by, outerBox, outerBox, radius);
  }
  ctx.stroke();

  // 3. Draw image clipped cleanly into shape
  ctx.save();
  const innerMargin = size * 0.12;
  const imgBox = size - innerMargin * 2;
  const ix = cx - imgBox / 2;
  const iy = cy - imgBox / 2;
  const innerRadius = shape === 'circle' ? imgBox / 2 : shape === 'rounded' ? size * 0.16 : size * 0.03;

  ctx.beginPath();
  if (shape === 'circle') {
    ctx.arc(cx, cy, imgBox / 2, 0, Math.PI * 2);
  } else {
    ctx.roundRect(ix, iy, imgBox, imgBox, innerRadius);
  }
  ctx.clip();

  try {
    drawCoverImage(ctx, logoImg, ix, iy, imgBox, imgBox);
  } catch (err) {
    console.warn('Failed to draw custom center logo on canvas', err);
  }

  ctx.restore();
  ctx.restore();
}

// Backward-compatible alias
export const renderAnimalQRCode = renderQRCode;
