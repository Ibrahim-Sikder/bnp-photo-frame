/* eslint-disable react-hooks/immutability */
import { useEffect, useRef, useMemo, useState } from "react";

interface VoteFramePreviewProps {
  uploadedImage: string | null;
  selectedFrame: "frame1" | "frame2" | "frame3" | "frame4" | "frame5" | "frame6" | "frame7" | "frame8" | "frame9" | "frame10";
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
  const animationFrameId = useRef<number | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 1200 });
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Calculate canvas size based on container width
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const size = Math.min(mobile ? 800 : 1200, containerWidth);
        setCanvasSize({ width: size, height: size });
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Pre-load and cache the uploaded image
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

    // Set responsive canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    const drawFrame = () => {
      // Check if frame is loaded
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

    // Cancel previous animation frame
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    // Use requestAnimationFrame for smooth rendering
    animationFrameId.current = requestAnimationFrame(drawFrame);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [uploadedImage, selectedFrame, zoom, offsetX, offsetY, canvasRef, cachedUserImage, cachedFrameImage, canvasSize]);

  const drawCanvas = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    img: HTMLImageElement | null,
    frameImg: HTMLImageElement,
    zoom: number,
    offsetX: number,
    offsetY: number
  ) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Circle configuration - responsive radius
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const radius = Math.min(canvasWidth, canvasHeight) * 0.45; // 45% of canvas size

    // --- STEP 1: Draw User Image or White Background ---
    ctx.save();

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    if (img && img.complete) {
      // Calculate scaling for "cover" behavior
      const diameter = radius * 2;
      const scale = Math.max(diameter / img.width, diameter / img.height);
      const finalScale = scale * (zoom / 100);

      const drawWidth = img.width * finalScale;
      const drawHeight = img.height * finalScale;

      // Adjust offset sensitivity based on canvas size
      const offsetMultiplier = isMobile ? 2 : 3;
      const posX = centerX - drawWidth / 2 + (offsetX * offsetMultiplier);
      const posY = centerY - drawHeight / 2 + (offsetY * offsetMultiplier);

      // High-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw user image
      ctx.drawImage(img, posX, posY, drawWidth, drawHeight);
    } else {
      // White circle background when no image
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    ctx.restore();

    // --- STEP 2: Draw Frame ON TOP ---
    if (frameImg.complete) {
      // Clear any previous artifacts
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);
      ctx.restore();

      // Draw frame normally
      ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);
    }

    // --- STEP 3: Optional subtle border ---
    if (img && img.complete) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
      ctx.stroke();
      ctx.restore();
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center w-full">
      <style dangerouslySetInnerHTML={{
        __html: `
        .bengali-text {
          font-family: 'SolaimanLipi', 'Noto Sans Bengali', 'Arial', sans-serif;
        }
        
        /* Force canvas responsiveness */
        .preview-canvas {
          width: 100% !important;
          height: auto !important;
          max-width: 100% !important;
          display: block !important;
          aspect-ratio: 1 / 1;
        }
        
        /* Ensure container maintains aspect ratio */
        .canvas-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
        }
        
        /* Fix for mobile devices */
        @media (max-width: 768px) {
          .preview-canvas {
            max-height: 80vh !important;
          }
        }
      `}} />

      {/* Canvas Container */}
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className="preview-canvas w-full rounded-lg md:rounded-xl shadow-2xl border-2 md:border-4 border-white ring-1 md:ring-2 ring-gray-200 bg-white"
        />



        {/* Zoom Badge - Only when image uploaded */}
        {uploadedImage && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/70 text-white text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-sm shadow-lg">
            <span className="font-bold">{zoom}%</span>
          </div>
        )}
      </div>
    </div>
  );
}