"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { Upload, Download, RotateCcw, ZoomIn, ZoomOut, Move, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import VoteFramePreview from "./app/components/VoteFramePreview";
import { Button } from "./components/ui/button";
import FrameCarousel from "./app/components/FrameCarousel";
import { Card } from "./components/ui/card";
export default function App() {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedFrame, setSelectedFrame] = useState("frame3");
    const [zoom, setZoom] = useState(100);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target?.result);
                setZoom(100);
                setOffsetX(0);
                setOffsetY(0);
            };
            reader.readAsDataURL(file);
        }
    };
    const startDrag = (clientX, clientY) => {
        if (!uploadedImage)
            return;
        setIsDragging(true);
        setDragStart({ x: clientX, y: clientY });
    };
    const moveDrag = (clientX, clientY) => {
        if (!isDragging || !uploadedImage)
            return;
        const deltaX = clientX - dragStart.x;
        const deltaY = clientY - dragStart.y;
        const sensitivity = 2;
        setOffsetX((prev) => Math.max(-300, Math.min(300, prev + deltaX * sensitivity)));
        setOffsetY((prev) => Math.max(-300, Math.min(300, prev + deltaY * sensitivity)));
        setDragStart({ x: clientX, y: clientY });
    };
    const stopDrag = () => setIsDragging(false);
    const handleMouseDown = (e) => {
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
    };
    const handleMouseMove = (e) => {
        moveDrag(e.clientX, e.clientY);
    };
    const handleMouseUp = stopDrag;
    const handleWheel = (e) => {
        if (!uploadedImage)
            return;
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? -15 : 15;
        setZoom((prev) => Math.max(50, Math.min(500, prev + delta)));
    };
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY);
    };
    const handleTouchMove = (e) => {
        if (isDragging)
            e.preventDefault();
        const touch = e.touches[0];
        moveDrag(touch.clientX, touch.clientY);
    };
    const handleTouchEnd = stopDrag;
    const handleDownload = () => {
        if (!canvasRef.current || !uploadedImage)
            return;
        const canvas = canvasRef.current;
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        if (!exportCtx)
            return;
        exportCanvas.width = 2400;
        exportCanvas.height = 2400;
        exportCtx.drawImage(canvas, 0, 0, 2400, 2400);
        const link = document.createElement("a");
        link.href = exportCanvas.toDataURL("image/png", 1.0);
        link.download = `bnp-vote-frame-hd-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleReset = () => {
        setUploadedImage(null);
        setSelectedFrame("frame3");
        setZoom(100);
        setOffsetX(0);
        setOffsetY(0);
        if (fileInputRef.current)
            fileInputRef.current.value = "";
    };
    const handleZoomIn = () => {
        setZoom((prev) => Math.min(500, prev + 20));
    };
    const handleZoomOut = () => {
        setZoom((prev) => Math.max(50, prev - 20));
    };
    const moveStep = 20;
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100", children: [_jsx("style", { dangerouslySetInnerHTML: {
                    __html: `
        .bengali-text {
          font-family: 'SolaimanLipi', 'Noto Sans Bengali', 'Arial', sans-serif;
        }
        
        .touch-manipulation {
          touch-action: manipulation;
        }
        
        .slider-orange::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ea580c;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        
        .slider-orange::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ea580c;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          border: none;
        }
        
        .slider-teal::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #0d9488;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        
        .slider-teal::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #0d9488;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          border: none;
        }
        
        @media (max-width: 640px) {
          .slider-orange::-webkit-slider-thumb,
          .slider-teal::-webkit-slider-thumb {
            width: 28px;
            height: 28px;
          }
          .slider-orange::-moz-range-thumb,
          .slider-teal::-moz-range-thumb {
            width: 28px;
            height: 28px;
          }
        }

        /* Ensure canvas is responsive */
        canvas {
          max-width: 100% !important;
          height: auto !important;
        }
      `
                } }), _jsxs("div", { className: "w-full bg-gradient-to-r from-[#006a4e] via-[#007a5e] to-[#E41E3F] py-3 md:py-6 px-4 text-center text-white shadow-lg relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" }), _jsx("div", { className: "container mx-auto w-full flex justify-center relative z-10", children: _jsx("img", { src: "/images/sobar_age_bd.avif", alt: "BNP Logo" }) })] }), _jsxs("div", { className: "container mx-auto  py-3 md:py-8 max-w-8xl", children: [_jsxs("div", { className: "lg:hidden block space-y-3 ", children: [_jsxs(Card, { className: "shadow-lg border-0 overflow-hidden bg-white", children: [_jsx("div", { className: "bg-gradient-to-r from-[#E41E3F] to-[#c41830] p-3 text-white", children: _jsx("h2", { className: "text-sm sm:text-base font-bold bengali-text", children: "\u09E7. \u09AB\u09CD\u09B0\u09C7\u09AE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8 \uD83D\uDDBC\uFE0F" }) }), _jsx("div", { className: "p-3", children: _jsx(FrameCarousel, { selectedFrame: selectedFrame, onSelectFrame: setSelectedFrame }) })] }), _jsxs(Card, { className: "shadow-lg border-0 overflow-hidden bg-white", children: [_jsx("div", { className: "bg-gradient-to-r from-[#007A5E] to-[#1B5E20] p-3 text-white", children: _jsx("h2", { className: "text-sm sm:text-base font-bold bengali-text", children: "\u09E8. \u099B\u09AC\u09BF \u0986\u09AA\u09B2\u09CB\u09A1 \u0995\u09B0\u09C1\u09A8 \uD83D\uDCF7" }) }), _jsxs("div", { className: "p-3", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleImageUpload, className: "hidden", id: "mobile-file-input" }), _jsxs(Button, { onClick: () => fileInputRef.current?.click(), className: "w-full bg-gradient-to-r from-[#E41E3F] to-[#c41830] hover:from-[#c41830] hover:to-[#a01525] text-white py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-xl shadow-lg transition-all active:scale-95 touch-manipulation", children: [_jsx(Upload, { className: "mr-2 h-5 w-5 sm:h-6 sm:w-6" }), _jsx("span", { className: "bengali-text", children: uploadedImage ? "নতুন ছবি নির্বাচন" : "ছবি নির্বাচন করুন" })] })] })] }), _jsxs(Card, { className: "shadow-lg border-0 overflow-hidden bg-white", children: [_jsxs("div", { className: "bg-gradient-to-r from-purple-600 to-purple-700 p-3 text-white flex justify-between items-center", children: [_jsx("h2", { className: "text-sm sm:text-base font-bold bengali-text", children: "\u09E9. \u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989 \uD83D\uDC41\uFE0F" }), uploadedImage && (_jsxs("span", { className: "text-xs bg-white/20 px-2 py-1 rounded flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }), "Live"] }))] }), _jsx("div", { className: "bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4", onWheel: handleWheel, style: { touchAction: 'none' }, children: _jsx("div", { className: `w-full transition-transform duration-75 ${uploadedImage ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd, children: _jsx(VoteFramePreview, { uploadedImage: uploadedImage, selectedFrame: selectedFrame, zoom: zoom, offsetX: offsetX, offsetY: offsetY, canvasRef: canvasRef }) }) }), uploadedImage && (_jsx("div", { className: "bg-blue-50 border-t border-blue-100 p-2 text-center", children: _jsx("span", { className: "text-xs text-blue-700 bengali-text", children: "\uD83D\uDCA1 \u0986\u0999\u09C1\u09B2 \u09A6\u09BF\u09AF\u09BC\u09C7 \u099F\u09C7\u09A8\u09C7 \u09B8\u09B0\u09BE\u09A8" }) }))] }), uploadedImage && (_jsxs(_Fragment, { children: [_jsxs(Card, { className: "shadow-lg border-0 overflow-hidden bg-white", children: [_jsx("div", { className: "bg-gradient-to-r from-orange-500 to-orange-600 p-3 text-white", children: _jsxs("h2", { className: "text-sm sm:text-base font-bold bengali-text flex items-center gap-2", children: [_jsx(ZoomIn, { className: "w-4 h-4 sm:w-5 sm:h-5" }), "\u09EA. \u099C\u09C1\u09AE \u0995\u09B0\u09C1\u09A8"] }) }), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 mb-3", children: [_jsx(Button, { size: "lg", onClick: handleZoomOut, className: "h-14 w-14 sm:h-16 sm:w-16 p-0 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl shadow-lg active:scale-95 transition-all touch-manipulation", children: _jsx(ZoomOut, { className: "h-7 w-7 sm:h-8 sm:w-8" }) }), _jsxs("div", { className: "flex-1 text-center", children: [_jsxs("div", { className: "text-2xl sm:text-3xl font-bold text-orange-600", children: [zoom, "%"] }), _jsx("div", { className: "text-xs text-gray-500 bengali-text", children: "\u099C\u09C1\u09AE \u09B2\u09C7\u09AD\u09C7\u09B2" })] }), _jsx(Button, { size: "lg", onClick: handleZoomIn, className: "h-14 w-14 sm:h-16 sm:w-16 p-0 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl shadow-lg active:scale-95 transition-all touch-manipulation", children: _jsx(ZoomIn, { className: "h-7 w-7 sm:h-8 sm:w-8" }) })] }), _jsx("input", { type: "range", min: "50", max: "500", step: "10", value: zoom, onChange: (e) => setZoom(Number(e.target.value)), className: "w-full h-4 bg-orange-200 rounded-lg appearance-none cursor-pointer slider-orange touch-manipulation" }), _jsxs("div", { className: "flex justify-between text-xs text-orange-700 mt-2 font-semibold bengali-text", children: [_jsx("span", { children: "\u099B\u09CB\u099F" }), _jsx("span", { children: "\u09AC\u09A1\u09BC" })] })] })] }), _jsxs(Card, { className: "shadow-lg border-0 overflow-hidden bg-white", children: [_jsx("div", { className: "bg-gradient-to-r from-teal-500 to-teal-600 p-3 text-white", children: _jsxs("h2", { className: "text-sm sm:text-base font-bold bengali-text flex items-center gap-2", children: [_jsx(Move, { className: "w-4 h-4 sm:w-5 sm:h-5" }), "\u09EB. \u09AA\u099C\u09BF\u09B6\u09A8 \u09A0\u09BF\u0995 \u0995\u09B0\u09C1\u09A8"] }) }), _jsxs("div", { className: "p-4 space-y-4", children: [_jsxs("div", { className: "bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border-2 border-teal-200", children: [_jsxs("div", { className: "text-center mb-3", children: [_jsx("div", { className: "text-sm font-bold text-teal-800 bengali-text mb-1", children: "\u09A4\u09C0\u09B0 \u09AC\u09BE\u099F\u09A8 \u09A6\u09BF\u09AF\u09BC\u09C7 \u09B8\u09B0\u09BE\u09A8" }), _jsxs("div", { className: "flex items-center justify-center gap-2 text-xs text-teal-600", children: [_jsxs("span", { className: "bengali-text", children: ["X: ", _jsx("strong", { children: offsetX })] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { className: "bengali-text", children: ["Y: ", _jsx("strong", { children: offsetY })] })] })] }), _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx(Button, { onClick: () => setOffsetY(prev => Math.max(-300, prev - moveStep)), className: "h-12 w-12 sm:h-14 sm:w-14 p-0 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-lg active:scale-95 transition-all touch-manipulation", children: _jsx(ChevronUp, { className: "h-7 w-7" }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { onClick: () => setOffsetX(prev => Math.max(-300, prev - moveStep)), className: "h-12 w-12 sm:h-14 sm:w-14 p-0 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-lg active:scale-95 transition-all touch-manipulation", children: _jsx(ChevronLeft, { className: "h-7 w-7" }) }), _jsx(Button, { onClick: () => { setOffsetX(0); setOffsetY(0); }, className: "h-12 w-12 sm:h-14 sm:w-14 p-0 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg active:scale-95 transition-all bengali-text text-xs font-bold touch-manipulation", children: "\u09AE\u09BE\u099D\u09C7" }), _jsx(Button, { onClick: () => setOffsetX(prev => Math.min(300, prev + moveStep)), className: "h-12 w-12 sm:h-14 sm:w-14 p-0 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-lg active:scale-95 transition-all touch-manipulation", children: _jsx(ChevronRight, { className: "h-7 w-7" }) })] }), _jsx(Button, { onClick: () => setOffsetY(prev => Math.min(300, prev + moveStep)), className: "h-12 w-12 sm:h-14 sm:w-14 p-0 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-lg active:scale-95 transition-all touch-manipulation", children: _jsx(ChevronDown, { className: "h-7 w-7" }) })] })] }), _jsxs("details", { className: "bg-gray-50 rounded-lg", children: [_jsx("summary", { className: "cursor-pointer p-3 text-sm font-bold text-gray-700 bengali-text", children: "\uD83C\uDFAF \u09B8\u09C2\u0995\u09CD\u09B7\u09CD\u09AE \u09A8\u09BF\u09AF\u09BC\u09A8\u09CD\u09A4\u09CD\u09B0\u09A3 (\u0990\u099A\u09CD\u099B\u09BF\u0995)" }), _jsxs("div", { className: "p-3 space-y-3 border-t border-gray-200", children: [_jsxs("div", { children: [_jsxs("label", { className: "text-xs font-bold text-teal-700 mb-1 block bengali-text", children: ["\u2190 \u09A1\u09BE\u09A8\u09C7-\u09AC\u09BE\u09AE\u09C7 \u2192 (", offsetX, ")"] }), _jsx("input", { type: "range", min: "-300", max: "300", step: "5", value: offsetX, onChange: (e) => setOffsetX(Number(e.target.value)), className: "w-full h-3 bg-teal-200 rounded-lg appearance-none cursor-pointer slider-teal touch-manipulation" })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-xs font-bold text-teal-700 mb-1 block bengali-text", children: ["\u2191 \u0989\u09AA\u09B0\u09C7-\u09A8\u09BF\u099A\u09C7 \u2193 (", offsetY, ")"] }), _jsx("input", { type: "range", min: "-300", max: "300", step: "5", value: offsetY, onChange: (e) => setOffsetY(Number(e.target.value)), className: "w-full h-3 bg-teal-200 rounded-lg appearance-none cursor-pointer slider-teal touch-manipulation" })] })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 pb-4", children: [_jsxs(Button, { onClick: handleDownload, disabled: !uploadedImage, className: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 sm:py-7 text-sm sm:text-base font-bold rounded-2xl shadow-lg transition-all active:scale-95 touch-manipulation disabled:opacity-50", children: [_jsx(Download, { className: "mr-2 h-5 w-5 sm:h-6 sm:w-6" }), _jsx("span", { className: "bengali-text", children: "HD \u09A1\u09BE\u0989\u09A8\u09B2\u09CB\u09A1" })] }), _jsxs(Button, { onClick: handleReset, className: "border-2 border-red-500 bg-white text-red-600 hover:bg-red-600 hover:text-white py-6 sm:py-7 text-sm sm:text-base font-bold rounded-2xl shadow-lg transition-all active:scale-95 touch-manipulation", children: [_jsx(RotateCcw, { className: "mr-2 h-5 w-5 sm:h-6 sm:w-6" }), _jsx("span", { className: "bengali-text", children: "\u09A8\u09A4\u09C1\u09A8 \u09B6\u09C1\u09B0\u09C1" })] })] })] }))] }), _jsx("div", { className: "hidden lg:block md:px-20 px-2", children: _jsxs("div", { className: "grid grid-cols-12 gap-4 items-start", children: [_jsx("div", { className: "col-span-6 w-full", children: _jsxs(Card, { className: "shadow-2xl border-0 overflow-hidden sticky top-6", children: [_jsx("div", { className: "bg-gradient-to-r from-[#E41E3F] to-[#c41830] p-4 text-white", children: _jsx("h2", { className: "text-lg font-bold bengali-text", children: "\u2699\uFE0F \u0995\u09A8\u09CD\u099F\u09CD\u09B0\u09CB\u09B2 \u09AA\u09CD\u09AF\u09BE\u09A8\u09C7\u09B2" }) }), _jsxs("div", { className: "p-6 space-y-5", children: [_jsxs("div", { children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleImageUpload, className: "hidden", id: "desktop-file-input" }), _jsxs(Button, { onClick: () => fileInputRef.current?.click(), className: "w-full bg-gradient-to-r from-[#E41E3F] to-[#c41830] hover:from-[#c41830] hover:to-[#a01525] text-white py-6 text-lg font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02]", children: [_jsx(Upload, { className: "mr-2 h-6 w-6" }), _jsx("span", { className: "bengali-text", children: uploadedImage ? "নতুন ছবি সিলেক্ট করুন" : "১. ছবি সিলেক্ট করুন" })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-base font-bold text-gray-800 mb-3 bengali-text border-l-4 border-[#E41E3F] pl-3", children: "\u09E8. \u09AB\u09CD\u09B0\u09C7\u09AE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8" }), _jsx(FrameCarousel, { selectedFrame: selectedFrame, onSelectFrame: setSelectedFrame })] }), uploadedImage && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-orange-50 p-4 rounded-lg border border-orange-200", children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsxs("label", { className: "text-base font-bold text-orange-900 bengali-text flex items-center gap-2", children: [_jsx(ZoomIn, { className: "w-5 h-5 text-orange-600" }), "\u09E9. \u099C\u09C1\u09AE \u0995\u09B0\u09C1\u09A8"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { size: "sm", onClick: handleZoomOut, className: "h-9 w-9 p-0 bg-orange-500 hover:bg-orange-600 text-white rounded-lg", children: _jsx(ZoomOut, { className: "h-4 w-4" }) }), _jsxs("span", { className: "text-sm font-bold bg-orange-600 text-white px-4 py-1.5 rounded min-w-[70px] text-center", children: [zoom, "%"] }), _jsx(Button, { size: "sm", onClick: handleZoomIn, className: "h-9 w-9 p-0 bg-orange-500 hover:bg-orange-600 text-white rounded-lg", children: _jsx(ZoomIn, { className: "h-4 w-4" }) })] })] }), _jsx("input", { type: "range", min: "50", max: "500", step: "10", value: zoom, onChange: (e) => setZoom(Number(e.target.value)), className: "w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer slider-orange" }), _jsxs("div", { className: "flex justify-between text-xs text-orange-700 mt-2 font-semibold", children: [_jsx("span", { children: "50%" }), _jsx("span", { children: "500%" })] })] }), _jsxs("div", { className: "bg-teal-50 p-4 rounded-lg border border-teal-200 space-y-4", children: [_jsxs("h4", { className: "text-base font-bold text-teal-900 bengali-text flex items-center gap-2", children: [_jsx(Move, { className: "w-5 h-5 text-teal-600" }), "\u09EA. \u09AA\u099C\u09BF\u09B6\u09A8 \u09A0\u09BF\u0995 \u0995\u09B0\u09C1\u09A8"] }), _jsxs("div", { children: [_jsxs("label", { className: "text-sm font-bold text-teal-700 mb-2 block bengali-text", children: ["\u2190 \u09A1\u09BE\u09A8\u09C7-\u09AC\u09BE\u09AE\u09C7 \u09B8\u09B0\u09BE\u09A8 \u2192 (", offsetX, ")"] }), _jsx("input", { type: "range", min: "-300", max: "300", step: "5", value: offsetX, onChange: (e) => setOffsetX(Number(e.target.value)), className: "w-full h-2.5 bg-teal-200 rounded-lg appearance-none cursor-pointer slider-teal" })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-sm font-bold text-teal-700 mb-2 block bengali-text", children: ["\u2191 \u0989\u09AA\u09B0\u09C7-\u09A8\u09BF\u099A\u09C7 \u09B8\u09B0\u09BE\u09A8 \u2193 (", offsetY, ")"] }), _jsx("input", { type: "range", min: "-300", max: "300", step: "5", value: offsetY, onChange: (e) => setOffsetY(Number(e.target.value)), className: "w-full h-2.5 bg-teal-200 rounded-lg appearance-none cursor-pointer slider-teal" })] })] }), _jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 flex items-start gap-3", children: [_jsx("svg", { className: "w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsxs("p", { className: "text-sm text-blue-800 bengali-text leading-relaxed", children: [_jsx("strong", { children: "\u099F\u09BF\u09AA\u09B8:" }), " \u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989\u09A4\u09C7 \u09AE\u09BE\u0989\u09B8 \u09B8\u09CD\u0995\u09CD\u09B0\u09CB\u09B2 \u0995\u09B0\u09C7 \u099C\u09C1\u09AE \u0995\u09B0\u09C1\u09A8 \u098F\u09AC\u0982 \u09A1\u09CD\u09B0\u09CD\u09AF\u09BE\u0997 \u0995\u09B0\u09C7 \u09B8\u09B0\u09BE\u09A8\u0964"] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 pt-2", children: [_jsxs(Button, { onClick: handleDownload, disabled: !uploadedImage, className: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 font-bold rounded-lg shadow-md transition-all hover:shadow-lg disabled:opacity-50", children: [_jsx(Download, { className: "mr-2 h-5 w-5" }), " HD \u09A1\u09BE\u0989\u09A8\u09B2\u09CB\u09A1"] }), _jsxs(Button, { onClick: handleReset, className: "border-2 border-red-500 bg-white text-red-600 hover:bg-red-600 hover:text-white py-4 font-bold rounded-lg transition-all", children: [_jsx(RotateCcw, { className: "mr-2 h-5 w-5" }), " \u09B0\u09BF\u09B8\u09C7\u099F"] })] })] }))] })] }) }), _jsx("div", { className: "col-span-6 w-full", children: _jsxs(Card, { className: "shadow-2xl border-0 overflow-hidden sticky top-6", children: [_jsxs("div", { className: "bg-gradient-to-r from-[#007A5E] to-[#1B5E20] p-4 text-white flex justify-between items-center", children: [_jsx("h2", { className: "text-lg font-bold bengali-text", children: "\uD83D\uDCF8 \u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989" }), uploadedImage && (_jsxs("span", { className: "text-xs bg-white/20 px-3 py-1.5 rounded text-white/90 flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }), "Live View"] }))] }), _jsx("div", { className: "bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center min-h-[700px] overflow-hidden", onWheel: handleWheel, style: { touchAction: 'none' }, children: _jsx("div", { className: `w-full transition-transform duration-100 ${uploadedImage ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd, children: _jsx(VoteFramePreview, { uploadedImage: uploadedImage, selectedFrame: selectedFrame, zoom: zoom, offsetX: offsetX, offsetY: offsetY, canvasRef: canvasRef }) }) })] }) })] }) })] }), _jsxs("div", { className: "bg-gradient-to-r from-[#1B5E20] to-[#0d3f16] text-white text-center py-4 md:py-6 mt-6 md:mt-8 border-t-4 border-[#E41E3F] shadow-lg", children: [_jsx("p", { className: "bengali-text font-semibold opacity-95 text-sm md:text-lg", children: "\u00A9 \u09E8\u09E6\u09E8\u09EC \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6 \u099C\u09BE\u09A4\u09C0\u09AF\u09BC\u09A4\u09BE\u09AC\u09BE\u09A6\u09C0 \u09A6\u09B2 (\u09AC\u09BF\u098F\u09A8\u09AA\u09BF)" }), _jsx("p", { className: "text-xs opacity-70 mt-1", children: "\u09B8\u09B0\u09CD\u09AC\u09B8\u09CD\u09AC\u09A4\u09CD\u09AC \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 | World's Best Frame Generator \uD83C\uDF1F" })] })] }));
}
