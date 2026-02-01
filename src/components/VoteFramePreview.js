import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
export default function VoteFramePreview({ uploadedImage, selectedFrame, zoom, offsetX, offsetY, canvasRef, }) {
    const containerRef = useRef(null);
    useEffect(() => {
        let isCancelled = false;
        if (!uploadedImage || !canvasRef.current)
            return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        canvas.width = 1080;
        canvas.height = 1350;
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Load User Image
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = uploadedImage;
        img.onload = () => {
            if (isCancelled)
                return;
            // Load Frame Image
            const frameImg = new Image();
            frameImg.crossOrigin = "anonymous";
            frameImg.src = `/frames/${selectedFrame}.png`;
            frameImg.onload = () => {
                if (isCancelled)
                    return;
                drawCanvas(ctx, canvas, img, frameImg, zoom, offsetX, offsetY);
            };
            frameImg.onerror = () => {
                if (isCancelled)
                    return;
                console.warn("PNG failed, trying JPEG");
                frameImg.src = `/frames/${selectedFrame}.jpeg`;
            };
        };
        return () => {
            isCancelled = true;
        };
    }, [uploadedImage, selectedFrame, zoom, offsetX, offsetY, canvasRef]);
    const drawCanvas = (ctx, canvas, img, frameImg, zoom, offsetX, offsetY) => {
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
    return (_jsx("div", { ref: containerRef, className: "flex flex-col items-center justify-center bg-gray-100 rounded-xl p-2", children: uploadedImage ? (_jsx("div", { className: "w-full flex flex-col items-center", children: _jsxs("div", { className: "relative w-full max-w-md", children: [_jsx("canvas", { ref: canvasRef, className: "z-50 w-full h-auto rounded-lg shadow-2xl border-4 border-white", style: {
                            display: "block",
                            aspectRatio: "1080/1350",
                            maxHeight: "500px",
                        } }), _jsxs("div", { className: "mt-3 text-center", children: [_jsxs("p", { className: "text-sm font-bold text-gray-700 bengali-text", children: ["\u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989: ", selectedFrame.replace('frame', 'ফ্রেম ')] }), _jsx("p", { className: "text-xs text-gray-500", children: "\u09B0\u09C7\u099C\u09CB\u09B2\u09BF\u0989\u09B6\u09A8: \u09E7\u09E6\u09EE\u09E6 \u00D7 \u09E7\u09E9\u09EB\u09E6 \u09AA\u09BF\u0995\u09CD\u09B8\u09C7\u09B2 (HD)" })] })] }) })) : (_jsxs("div", { className: "text-center py-5 px-4 text-gray-500 w-full bg-white rounded-lg border-2 border-dashed border-gray-300", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center", children: _jsx("svg", { className: "w-8 h-8 text-red-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }), _jsx("p", { className: "text-lg bengali-text font-semibold text-gray-700", children: "\u099B\u09AC\u09BF \u0986\u09AA\u09B2\u09CB\u09A1 \u0995\u09B0\u09C1\u09A8" }), _jsx("p", { className: "text-sm text-gray-400 bengali-text mt-1", children: "\u0986\u09AA\u09A8\u09BE\u09B0 \u099B\u09AC\u09BF \u098F\u0996\u09BE\u09A8\u09C7 \u0986\u09AA\u09B2\u09CB\u09A1 \u0995\u09B0\u09C7 \u09AB\u09CD\u09B0\u09C7\u09AE \u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989 \u09A6\u09C7\u0996\u09C1\u09A8" })] })) }));
}
