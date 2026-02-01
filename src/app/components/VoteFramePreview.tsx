import { useEffect, useRef, useMemo } from "react";

interface VoteFramePreviewProps {
  uploadedImage: string | null;
  selectedFrame: "frame1" | "frame2" | "frame3" | "frame4" | "frame5";
  zoom: number;
  offsetX: number;
  offsetY: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export default function VoteFramePreview({
  uploadedImage,
  selectedFrame,
  zoom,
  offsetX,
  offsetY,
  canvasRef,
}: VoteFramePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageCache = useRef<{ [key: string]: HTMLImageElement }>({});
  const frameCache = useRef<{ [key: string]: HTMLImageElement }>({});

  // Pre-load and cache the uploaded image to prevent flickering
  const cachedUserImage = useMemo(() => {
    if (!uploadedImage) return null;

    if (!imageCache.current[uploadedImage]) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = uploadedImage;
      imageCache.current[uploadedImage] = img;
    }

    return imageCache.current[uploadedImage];
  }, [uploadedImage]);

  // Pre-load and cache frame images
  const cachedFrameImage = useMemo(() => {
    const frameKey = `/frames/${selectedFrame}.png`;

    if (!frameCache.current[frameKey]) {
      const frameImg = new Image();
      frameImg.crossOrigin = "anonymous";
      frameImg.src = frameKey;
      frameCache.current[frameKey] = frameImg;
    }

    return frameCache.current[frameKey];
  }, [selectedFrame]);

  useEffect(() => {
    if (!canvasRef.current || !cachedFrameImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", {
      willReadFrequently: false,
      alpha: true
    });
    if (!ctx) return;

    // Larger canvas size for better quality - matching the uploaded images
    canvas.width = 1200;
    canvas.height = 1200;

    const drawFrame = () => {
      // Draw if frame is loaded (and user image if present)
      if (cachedFrameImage.complete && (!uploadedImage || cachedUserImage?.complete)) {
        drawCanvas(ctx, canvas, cachedUserImage, cachedFrameImage, zoom, offsetX, offsetY);
      } else {
        // Wait for images to load
        const checkAndDraw = () => {
          if (cachedFrameImage.complete && (!uploadedImage || cachedUserImage?.complete)) {
            drawCanvas(ctx, canvas, cachedUserImage, cachedFrameImage, zoom, offsetX, offsetY);
          }
        };

        if (uploadedImage && cachedUserImage && !cachedUserImage.complete) {
          cachedUserImage.onload = checkAndDraw;
        }
        if (!cachedFrameImage.complete) {
          cachedFrameImage.onload = checkAndDraw;
        }
      }
    };

    // Use requestAnimationFrame for smoother rendering
    const rafId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [uploadedImage, selectedFrame, zoom, offsetX, offsetY, canvasRef, cachedUserImage, cachedFrameImage]);

  const drawCanvas = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    img: HTMLImageElement | null,
    frameImg: HTMLImageElement,
    zoom: number,
    offsetX: number,
    offsetY: number
  ) => {
    // Clear canvas completely (important for transparency)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Circle dimensions - bigger and properly centered
    const centerX = canvasWidth / 2; // 600
    const centerY = canvasHeight / 2; // 600
    const radius = 540; // Much bigger circle (90% of canvas)

    // --- STEP 1: Draw User Image FIRST (Background) ---
    if (img) {
      ctx.save();

      // Create circular clipping path
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      // Calculate scaling for "cover" behavior
      const diameter = radius * 2;
      const scale = Math.max(diameter / img.width, diameter / img.height);
      const finalScale = scale * (zoom / 100);

      const drawWidth = img.width * finalScale;
      const drawHeight = img.height * finalScale;

      // Calculate position with offset
      const posX = centerX - drawWidth / 2 + (offsetX * 2.5);
      const posY = centerY - drawHeight / 2 + (offsetY * 2.5);

      // Enable high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw user image
      ctx.drawImage(img, posX, posY, drawWidth, drawHeight);
      ctx.restore();
    } else {
      // If no image, show white circle background
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.restore();
    }

    // --- STEP 2: Draw Frame ON TOP (Foreground with transparency) ---
    // The frame PNG has transparency in the circle area
    ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);

    // --- STEP 3: Optional subtle inner shadow for depth ---
    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      ctx.stroke();
      ctx.restore();
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3">
      {!uploadedImage ? (
        <div className="text-center  px-4 text-gray-500 w-full bg-white rounded-lg border-2 border-dashed border-gray-300 max-w-2xl">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xl bengali-text font-semibold text-gray-700 mb-2">ছবি আপলোড করুন</p>
          <p className="text-sm text-gray-400 bengali-text">আপনার ছবি আপলোড করে ফ্রেম প্রিভিউ দেখুন</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>মাউস স্ক্রোল করে জুম • ড্র্যাগ করে সরান</span>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full max-w-2xl">
            <canvas
              ref={canvasRef}
              className="w-full h-auto rounded-xl shadow-2xl border-4 border-white"
              style={{
                display: "block",
                aspectRatio: "1/1",
                imageRendering: "auto",
                // Prevent flickering with GPU acceleration
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            />

          </div>
        </div>
      )}
    </div>
  );
}