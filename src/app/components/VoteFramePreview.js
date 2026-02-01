import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useMemo } from "react";
export default function VoteFramePreview({ uploadedImage, selectedFrame, zoom, offsetX, offsetY, canvasRef, }) {
    const containerRef = useRef(null);
    const imageCache = useRef({});
    const frameCache = useRef({});
    const animationFrameId = useRef(null);
    // Pre-load and cache the uploaded image
    const cachedUserImage = useMemo(() => {
        if (!uploadedImage)
            return null;
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
        if (!canvasRef.current || !cachedFrameImage)
            return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", {
            willReadFrequently: false,
            alpha: true
        });
        if (!ctx)
            return;
        // High-quality canvas size
        canvas.width = 1200;
        canvas.height = 1200;
        const drawFrame = () => {
            // Check if frame is loaded
            if (cachedFrameImage.complete && (!uploadedImage || cachedUserImage?.complete)) {
                drawCanvas(ctx, canvas, cachedUserImage, cachedFrameImage, zoom, offsetX, offsetY);
            }
            else {
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
    }, [uploadedImage, selectedFrame, zoom, offsetX, offsetY, canvasRef, cachedUserImage, cachedFrameImage]);
    const drawCanvas = (ctx, canvas, img, frameImg, zoom, offsetX, offsetY) => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        // Circle configuration
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const radius = 540; // Large radius for better visibility
        // --- STEP 1: Draw User Image or White Background ---
        ctx.save();
        // Create circular clipping path
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.clip();
        if (img) {
            // Calculate scaling for "cover" behavior
            const diameter = radius * 2;
            const scale = Math.max(diameter / img.width, diameter / img.height);
            const finalScale = scale * (zoom / 100);
            const drawWidth = img.width * finalScale;
            const drawHeight = img.height * finalScale;
            // Position with offset (multiplier for smooth control)
            const posX = centerX - drawWidth / 2 + (offsetX * 3);
            const posY = centerY - drawHeight / 2 + (offsetY * 3);
            // High-quality rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            // Draw user image
            ctx.drawImage(img, posX, posY, drawWidth, drawHeight);
        }
        else {
            // White circle background when no image
            ctx.fillStyle = "#ffffff";
            ctx.fill();
        }
        ctx.restore();
        // --- STEP 2: Draw Frame ON TOP ---
        ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);
        // --- STEP 3: Optional subtle border ---
        if (img) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
            ctx.stroke();
            ctx.restore();
        }
    };
    return (_jsxs("div", { ref: containerRef, className: "flex flex-col items-center justify-center w-full", children: [_jsxs("div", { className: "relative w-full", children: [_jsx("canvas", { ref: canvasRef, width: 1200, height: 1200, className: "w-full rounded-lg md:rounded-xl shadow-2xl border-2 md:border-4 border-white ring-1 md:ring-2 ring-gray-200 bg-white", style: {
                            display: "block",
                            maxWidth: "100%",
                            height: "auto",
                            aspectRatio: "1",
                        } }), !uploadedImage && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: _jsxs("div", { className: "bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 m-4 max-w-sm text-center border-2 border-gray-200", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#E41E3F] to-[#c41830] flex items-center justify-center shadow-lg", children: _jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }), _jsx("h3", { className: "text-xl font-bold text-gray-800 mb-2 bengali-text", children: "\u099B\u09AC\u09BF \u0986\u09AA\u09B2\u09CB\u09A1 \u0995\u09B0\u09C1\u09A8" }), _jsx("p", { className: "text-sm text-gray-600 mb-4 bengali-text", children: "\u0986\u09AA\u09A8\u09BE\u09B0 \u099B\u09AC\u09BF \u09AF\u09C1\u0995\u09CD\u09A4 \u0995\u09B0\u09C7 \u09AB\u09CD\u09B0\u09C7\u09AE \u09A6\u09C7\u0996\u09C1\u09A8" }), _jsxs("div", { className: "space-y-2 text-xs text-gray-500", children: [_jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("svg", { className: "w-4 h-4 text-[#E41E3F]", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z", clipRule: "evenodd" }) }), _jsx("span", { className: "bengali-text", children: "\u099C\u09C1\u09AE \u0995\u09B0\u09A4\u09C7 \u09B8\u09CD\u0995\u09CD\u09B0\u09CB\u09B2 \u0995\u09B0\u09C1\u09A8" })] }), _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("svg", { className: "w-4 h-4 text-[#007A5E]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" }) }), _jsx("span", { className: "bengali-text", children: "\u099F\u09C7\u09A8\u09C7 \u09B8\u09B0\u09BE\u09A4\u09C7 \u09A1\u09CD\u09B0\u09CD\u09AF\u09BE\u0997 \u0995\u09B0\u09C1\u09A8" })] })] })] }) })), uploadedImage && (_jsx("div", { className: "absolute top-2 right-2 md:top-3 md:right-3 bg-black/70 text-white text-xs md:text-sm px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg", children: _jsxs("span", { className: "font-bold", children: [zoom, "%"] }) }))] }), _jsx("style", { children: `
        .bengali-text {
          font-family: 'SolaimanLipi', 'Noto Sans Bengali', 'Arial', sans-serif;
        }
      ` })] }));
}
