import { useEffect, useRef } from "react";

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

  useEffect(() => {
    let isCancelled = false;

    if (!uploadedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1350;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load User Image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = uploadedImage;

    img.onload = () => {
      if (isCancelled) return;

      // Load Frame Image
      const frameImg = new Image();
      frameImg.crossOrigin = "anonymous";

      frameImg.src = `/frames/${selectedFrame}.png`;

      frameImg.onload = () => {
        if (isCancelled) return;
        drawCanvas(ctx, canvas, img, frameImg, zoom, offsetX, offsetY);
      };

      frameImg.onerror = () => {
        if (isCancelled) return;
        console.warn("PNG failed, trying JPEG");
        frameImg.src = `/frames/${selectedFrame}.jpeg`;
      };
    };

    return () => {
      isCancelled = true;
    };
  }, [uploadedImage, selectedFrame, zoom, offsetX, offsetY, canvasRef]);

  const drawCanvas = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    frameImg: HTMLImageElement,
    zoom: number,
    offsetX: number,
    offsetY: number
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = 540;
    const centerY = 640;

    // FIX: Reduced Radius from 380 to 360.
    // This creates a gap so the image does NOT touch or cover the frame border.
    // The image will stay strictly inside the frame.
    const radius = 360;

    // --- STEP 1: Draw Frame (Bottom Layer) ---
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

    // --- STEP 2: Draw User Image (Top Layer, Clipped) ---
    ctx.save();

    // Create Circular Clipping Path with reduced radius
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    // Aspect Ratio Logic (Object Fit: Cover)
    const diameter = radius * 2;
    const scale = Math.max(diameter / img.width, diameter / img.height);
    const finalScale = scale * (zoom / 100);

    const drawWidth = img.width * finalScale;
    const drawHeight = img.height * finalScale;

    let posX = centerX - drawWidth / 2 + (offsetX * 1.5);
    let posY = centerY - drawHeight / 2 + (offsetY * 1.5);

    ctx.drawImage(img, posX, posY, drawWidth, drawHeight);
    ctx.restore(); // Remove clip
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center bg-gray-100 rounded-xl p-2">
      {uploadedImage ? (
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full max-w-md">
            <canvas
              ref={canvasRef}
              className="z-50 w-full h-auto rounded-lg shadow-2xl border-4 border-white"
              style={{
                display: "block",
                aspectRatio: "1080/1350",
                maxHeight: "500px",
              }}
            />
            <div className="mt-3 text-center">
              <p className="text-sm font-bold text-gray-700 bengali-text">
                প্রিভিউ: {selectedFrame.replace('frame', 'ফ্রেম ')}
              </p>
              <p className="text-xs text-gray-500">রেজোলিউশন: ১০৮০ × ১৩৫০ পিক্সেল (HD)</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5 px-4 text-gray-500 w-full bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg bengali-text font-semibold text-gray-700">ছবি আপলোড করুন</p>
          <p className="text-sm text-gray-400 bengali-text mt-1">আপনার ছবি এখানে আপলোড করে ফ্রেম প্রিভিউ দেখুন</p>
        </div>
      )}
    </div>
  );
}