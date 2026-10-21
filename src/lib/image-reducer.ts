/**
 * HRK Filters Client-Side Image Reducer
 * Automatically scales down large camera/mobile uploads (e.g. 5MB-10MB)
 * to web-optimized dimensions (max 900x900px) and compresses to ~60-90KB.
 * Prevents localStorage quota overflow and ensures instant page load speeds.
 */

export interface ReducedImageResult {
  dataUrl: string;
  originalSizeBytes: number;
  reducedSizeBytes: number;
  originalSizeFormatted: string;
  reducedSizeFormatted: string;
  compressionRatio: string;
  width: number;
  height: number;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Resizes and compresses an image file using browser-native HTML5 Canvas.
 * No external runtime bloat, executes in milliseconds, 100% offline.
 */
export async function reduceImage(
  file: File,
  maxWidth = 900,
  maxHeight = 900,
  quality = 0.82
): Promise<ReducedImageResult> {
  return new Promise((resolve, reject) => {
    const originalSizeBytes = file.size;
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not create canvas context"));
          return;
        }

        // Clean white background for transparent PNGs or automotive cutouts
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // High quality bicubic image scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized WebP if supported, fallback to JPEG
        let dataUrl: string;
        try {
          dataUrl = canvas.toDataURL("image/webp", quality);
          if (!dataUrl.startsWith("data:image/webp")) {
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }
        } catch {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        // Calculate approximate size in bytes from Base64 string
        const base64Length = dataUrl.length - (dataUrl.indexOf(",") + 1);
        const reducedSizeBytes = Math.round((base64Length * 3) / 4);

        const savingsPercent = Math.max(
          0,
          Math.round(((originalSizeBytes - reducedSizeBytes) / originalSizeBytes) * 100)
        );

        resolve({
          dataUrl,
          originalSizeBytes,
          reducedSizeBytes,
          originalSizeFormatted: formatBytes(originalSizeBytes),
          reducedSizeFormatted: formatBytes(reducedSizeBytes),
          compressionRatio: `-${savingsPercent}%`,
          width,
          height,
        });
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
