"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { Upload, Download, RotateCcw, ZoomIn, ZoomOut, Move } from "lucide-react";
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
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100", children: [_jsxs("div", { className: "w-full bg-gradient-to-r from-[#006a4e] via-[#007a5e] to-[#E41E3F] py-4 md:py-6 px-4 text-center text-white shadow-lg relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" }), _jsx("div", { className: "container mx-auto w-full flex justify-center relative z-10", children: _jsx("img", { src: "/images/sobar_age_bd.avif", alt: "BNP Logo", className: "h-12 md:h-16 object-contain" }) })] }), _jsxs("div", { className: "container mx-auto px-3 md:px-4 py-4 md:py-8", children: [_jsxs("div", { className: "lg:hidden space-y-3", children: [_jsxs(Card, { className: "shadow-xl border-0 overflow-hidden bg-white", children: [_jsx("div", { className: "bg-gradient-to-r from-[#E41E3F] to-[#c41830] p-3 text-white", children: _jsx("h2", { className: "text-base font-bold bengali-text", children: "\u09E7. \u09AB\u09CD\u09B0\u09C7\u09AE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8 \uD83D\uDDBC\uFE0F" }) }), _jsx("div", { className: "p-3", children: _jsx(FrameCarousel, { selectedFrame: selectedFrame, onSelectFrame: setSelectedFrame }) })] }), _jsxs(Card, { className: "shadow-xl border-0 overflow-hidden bg-white", children: [_jsx("div", { className: "bg-gradient-to-r from-[#007A5E] to-[#1B5E20] p-3 text-white", children: _jsx("h2", { className: "text-base font-bold bengali-text", children: "\u09E8. \u099B\u09AC\u09BF \u0986\u09AA\u09B2\u09CB\u09A1 \u0995\u09B0\u09C1\u09A8 \uD83D\uDCF7" }) }), _jsxs("div", { className: "p-3", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleImageUpload, className: "hidden" }), _jsxs(Button, { onClick: () => fileInputRef.current?.click(), className: "w-full bg-gradient-to-r from-[#E41E3F] to-[#c41830] hover:from-[#c41830] hover:to-[#a01525] text-white py-6 text-base font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02] relative overflow-hidden", children: [_jsx("span", { className: "absolute inset-0 bg-white/10 animate-pulse" }), _jsx(Upload, { className: "mr-2 h-5 w-5 relative z-10" }), _jsx("span", { className: "relative z-10 bengali-text", children: uploadedImage ? "নতুন ছবি সিলেক্ট করুন" : "ছবি সিলেক্ট করুন" })] })] })] }), _jsxs(Card, { className: "shadow-xl border-0 overflow-hidden", children: [_jsxs("div", { className: "bg-gradient-to-r from-purple-600 to-purple-700 p-3 text-white flex justify-between items-center", children: [_jsx("h2", { className: "text-base font-bold bengali-text", children: "\u09E9. \u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989 \u09A6\u09C7\u0996\u09C1\u09A8 \uD83D\uDC41\uFE0F" }), uploadedImage && (_jsxs("span", { className: "text-xs bg-white/20 px-2 py-1 rounded text-white/90 flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }), "Live"] }))] }), _jsx("div", { className: "bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 flex items-center justify-center overflow-hidden", onWheel: handleWheel, style: { touchAction: 'none' }, children: _jsx("div", { className: `w-full transition-transform duration-75 ${uploadedImage ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd, style: { maxWidth: "100%" }, children: _jsx(VoteFramePreview, { uploadedImage: uploadedImage, selectedFrame: selectedFrame, zoom: zoom, offsetX: offsetX, offsetY: offsetY, canvasRef: canvasRef }) }) }), uploadedImage && (_jsxs("div", { className: "bg-blue-50 border-t border-blue-100 p-2 flex items-center gap-2 text-xs text-blue-700", children: [_jsx(Move, { className: "w-4 h-4 flex-shrink-0" }), _jsx("span", { className: "bengali-text", children: "\u099F\u09BF\u09AA\u09B8: \u0986\u0999\u09C1\u09B2 \u09A6\u09BF\u09AF\u09BC\u09C7 \u099F\u09C7\u09A8\u09C7 \u09B8\u09B0\u09BE\u09A8" })] }))] }), uploadedImage && (_jsxs(Card, { className: "shadow-xl border-0 overflow-hidden bg-white", children: [_jsx("div", { className: "bg-gradient-to-r from-blue-600 to-blue-700 p-3 text-white", children: _jsx("h2", { className: "text-base font-bold bengali-text", children: "\u09EA. \u0995\u09A8\u09CD\u099F\u09CD\u09B0\u09CB\u09B2 \u0995\u09B0\u09C1\u09A8 \u2699\uFE0F" }) }), _jsxs("div", { className: "p-3 space-y-3", children: [_jsxs("div", { className: "bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsxs("label", { className: "text-sm font-bold text-orange-900 bengali-text flex items-center gap-1", children: [_jsx(ZoomIn, { className: "w-4 h-4 text-orange-600" }), "\u099C\u09C1\u09AE \u0995\u09B0\u09C1\u09A8"] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: handleZoomOut, className: "h-8 w-8 p-0 border-orange-500 text-orange-600 hover:bg-orange-600 hover:text-white", children: _jsx(ZoomOut, { className: "h-4 w-4" }) }), _jsxs("span", { className: "text-sm font-bold bg-orange-600 text-white px-3 py-1 rounded min-w-[60px] text-center", children: [zoom, "%"] }), _jsx(Button, { size: "sm", variant: "outline", onClick: handleZoomIn, className: "h-8 w-8 p-0 border-orange-500 text-orange-600 hover:bg-orange-600 hover:text-white", children: _jsx(ZoomIn, { className: "h-4 w-4" }) })] })] }), _jsx("input", { type: "range", min: "50", max: "500", step: "5", value: zoom, onChange: (e) => setZoom(Number(e.target.value)), className: "w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600 zoom-slider" }), _jsxs("div", { className: "flex justify-between text-xs text-orange-700 mt-1 font-semibold", children: [_jsx("span", { children: "\u099B\u09CB\u099F" }), _jsx("span", { children: "\u09AC\u09A1\u09BC" })] })] }), _jsxs("div", { className: "bg-gradient-to-br from-teal-50 to-teal-100 p-3 rounded-lg border border-teal-200 space-y-3", children: [_jsxs("h4", { className: "text-sm font-bold text-teal-900 bengali-text flex items-center gap-1", children: [_jsx(Move, { className: "w-4 h-4 text-teal-600" }), "\u09AA\u099C\u09BF\u09B6\u09A8 \u09A0\u09BF\u0995 \u0995\u09B0\u09C1\u09A8"] }), _jsxs("div", { children: [_jsxs("label", { className: "text-xs font-bold text-teal-700 mb-1 block bengali-text flex items-center justify-between", children: [_jsx("span", { children: "\u2190 \u09A1\u09BE\u09A8\u09C7-\u09AC\u09BE\u09AE\u09C7 \u2192" }), _jsx("span", { className: "bg-teal-600 text-white px-2 py-0.5 rounded text-xs", children: offsetX > 0 ? `+${offsetX}` : offsetX })] }), _jsx("input", { type: "range", min: "-300", max: "300", step: "5", value: offsetX, onChange: (e) => setOffsetX(Number(e.target.value)), className: "w-full h-2.5 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-600" })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-xs font-bold text-teal-700 mb-1 block bengali-text flex items-center justify-between", children: [_jsx("span", { children: "\u2191 \u0989\u09AA\u09B0\u09C7-\u09A8\u09BF\u099A\u09C7 \u2193" }), _jsx("span", { className: "bg-teal-600 text-white px-2 py-0.5 rounded text-xs", children: offsetY > 0 ? `+${offsetY}` : offsetY })] }), _jsx("input", { type: "range", min: "-300", max: "300", step: "5", value: offsetY, onChange: (e) => setOffsetY(Number(e.target.value)), className: "w-full h-2.5 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-600" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 pt-2", children: [_jsxs(Button, { onClick: handleDownload, className: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02]", children: [_jsx(Download, { className: "mr-1 h-5 w-5" }), _jsx("span", { className: "bengali-text text-sm", children: "HD \u09A1\u09BE\u0989\u09A8\u09B2\u09CB\u09A1" })] }), _jsxs(Button, { onClick: handleReset, variant: "outline", className: "border-2 border-red-500 text-red-600 hover:bg-red-600 hover:text-white py-6 font-bold rounded-xl transition-all", children: [_jsx(RotateCcw, { className: "mr-1 h-5 w-5" }), _jsx("span", { className: "bengali-text text-sm", children: "\u09A8\u09A4\u09C1\u09A8 \u09B6\u09C1\u09B0\u09C1" })] })] })] })] }))] }), _jsx("div", { className: "hidden lg:block", children: _jsxs("div", { className: "grid grid-cols-12 gap-6 items-start", children: [_jsx("div", { className: "col-span-6 w-full", children: _jsxs(Card, { className: "shadow-2xl border-0 overflow-hidden sticky top-6", children: [_jsx("div", { className: "bg-gradient-to-r from-[#E41E3F] to-[#c41830] p-4 text-white", children: _jsx("h2", { className: "text-lg font-bold bengali-text", children: "\u2699\uFE0F \u0995\u09A8\u09CD\u099F\u09CD\u09B0\u09CB\u09B2 \u09AA\u09CD\u09AF\u09BE\u09A8\u09C7\u09B2" }) }), _jsxs("div", { className: "p-6 space-y-5", children: [_jsxs("div", { children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleImageUpload, className: "hidden" }), _jsxs(Button, { onClick: () => fileInputRef.current?.click(), className: "w-full bg-gradient-to-r from-[#E41E3F] to-[#c41830] hover:from-[#c41830] hover:to-[#a01525] text-white py-6 text-lg font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02]", children: [_jsx(Upload, { className: "mr-2 h-6 w-6" }), _jsx("span", { className: "bengali-text", children: uploadedImage ? "নতুন ছবি সিলেক্ট করুন" : "১. ছবি সিলেক্ট করুন" })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-base font-bold text-gray-800 mb-3 bengali-text border-l-4 border-[#E41E3F] pl-3 flex items-center gap-2", children: "\u09E8. \u09AB\u09CD\u09B0\u09C7\u09AE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8" }), _jsx(FrameCarousel, { selectedFrame: selectedFrame, onSelectFrame: setSelectedFrame })] }), uploadedImage && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg border border-gray-200", children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsxs("label", { className: "text-base font-bold text-gray-700 bengali-text flex items-center gap-2", children: [_jsx(ZoomIn, { className: "w-5 h-5 text-[#E41E3F]" }), "\u09E9. \u099C\u09C1\u09AE \u0995\u09B0\u09C1\u09A8"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: handleZoomOut, className: "h-9 w-9 p-0", children: _jsx(ZoomOut, { className: "h-4 w-4" }) }), _jsxs("span", { className: "text-sm font-bold bg-[#E41E3F] text-white px-4 py-1.5 rounded min-w-[70px] text-center", children: [zoom, "%"] }), _jsx(Button, { size: "sm", variant: "outline", onClick: handleZoomIn, className: "h-9 w-9 p-0", children: _jsx(ZoomIn, { className: "h-4 w-4" }) })] })] }), _jsx("input", { type: "range", min: "50", max: "500", step: "5", value: zoom, onChange: (e) => setZoom(Number(e.target.value)), className: "w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E41E3F]" }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500 mt-2", children: [_jsx("span", { children: "50%" }), _jsx("span", { children: "500%" })] })] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4", children: [_jsxs("h4", { className: "text-base font-bold text-gray-700 bengali-text flex items-center gap-2", children: [_jsx(Move, { className: "w-5 h-5 text-[#007A5E]" }), "\u09EA. \u09AA\u099C\u09BF\u09B6\u09A8 \u09A0\u09BF\u0995 \u0995\u09B0\u09C1\u09A8"] }), _jsxs("div", { children: [_jsxs("label", { className: "text-sm font-bold text-gray-600 mb-2 block bengali-text flex items-center justify-between", children: [_jsx("span", { children: "\u2190 \u09A1\u09BE\u09A8\u09C7-\u09AC\u09BE\u09AE\u09C7 \u09B8\u09B0\u09BE\u09A8 \u2192" }), _jsx("span", { className: "text-[#007A5E]", children: offsetX > 0 ? `+${offsetX}` : offsetX })] }), _jsx("input", { type: "range", min: "-300", max: "300", step: "5", value: offsetX, onChange: (e) => setOffsetX(Number(e.target.value)), className: "w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007A5E]" })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-sm font-bold text-gray-600 mb-2 block bengali-text flex items-center justify-between", children: [_jsx("span", { children: "\u2191 \u0989\u09AA\u09B0\u09C7-\u09A8\u09BF\u099A\u09C7 \u09B8\u09B0\u09BE\u09A8 \u2193" }), _jsx("span", { className: "text-[#007A5E]", children: offsetY > 0 ? `+${offsetY}` : offsetY })] }), _jsx("input", { type: "range", min: "-300", max: "300", step: "5", value: offsetY, onChange: (e) => setOffsetY(Number(e.target.value)), className: "w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007A5E]" })] })] }), _jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 flex items-start gap-3", children: [_jsx("svg", { className: "w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsxs("p", { className: "text-sm text-blue-800 bengali-text leading-relaxed", children: [_jsx("strong", { children: "\u099F\u09BF\u09AA\u09B8:" }), " \u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989\u09A4\u09C7 \u09AE\u09BE\u0989\u09B8 \u09B8\u09CD\u0995\u09CD\u09B0\u09CB\u09B2 \u0995\u09B0\u09C7 \u099C\u09C1\u09AE \u0995\u09B0\u09C1\u09A8 \u098F\u09AC\u0982 \u09A1\u09CD\u09B0\u09CD\u09AF\u09BE\u0997 \u0995\u09B0\u09C7 \u09B8\u09B0\u09BE\u09A8\u0964"] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 pt-2", children: [_jsxs(Button, { onClick: handleDownload, className: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 font-bold rounded-lg shadow-md transition-all hover:shadow-lg", children: [_jsx(Download, { className: "mr-2 h-5 w-5" }), " HD \u09A1\u09BE\u0989\u09A8\u09B2\u09CB\u09A1"] }), _jsxs(Button, { onClick: handleReset, variant: "outline", className: "border-2 border-[#007A5E] text-[#007A5E] hover:bg-[#007A5E] hover:text-white py-4 font-bold rounded-lg transition-all", children: [_jsx(RotateCcw, { className: "mr-2 h-5 w-5" }), " \u09B0\u09BF\u09B8\u09C7\u099F"] })] })] }))] })] }) }), _jsx("div", { className: "col-span-6 w-full", children: _jsxs(Card, { className: "shadow-2xl border-0 overflow-hidden sticky top-6", children: [_jsxs("div", { className: "bg-gradient-to-r from-[#007A5E] to-[#1B5E20] p-4 text-white flex justify-between items-center", children: [_jsx("h2", { className: "text-lg font-bold bengali-text", children: "\uD83D\uDCF8 \u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989" }), uploadedImage && (_jsxs("span", { className: "text-xs bg-white/20 px-3 py-1.5 rounded text-white/90 flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }), "Live View"] }))] }), _jsx("div", { className: "bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center min-h-[700px] overflow-hidden", onWheel: handleWheel, style: { touchAction: 'none' }, children: _jsx("div", { className: `w-full transition-transform duration-100 ${uploadedImage ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd, style: { maxWidth: "100%" }, children: _jsx(VoteFramePreview, { uploadedImage: uploadedImage, selectedFrame: selectedFrame, zoom: zoom, offsetX: offsetX, offsetY: offsetY, canvasRef: canvasRef }) }) })] }) })] }) })] }), _jsxs("div", { className: "bg-gradient-to-r from-[#1B5E20] to-[#0d3f16] text-white text-center py-6 mt-8 border-t-4 border-[#E41E3F] shadow-lg", children: [_jsx("p", { className: "bengali-text font-semibold opacity-95 text-base md:text-lg", children: "\u00A9 \u09E8\u09E6\u09E8\u09EC \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6 \u099C\u09BE\u09A4\u09C0\u09AF\u09BC\u09A4\u09BE\u09AC\u09BE\u09A6\u09C0 \u09A6\u09B2 (\u09AC\u09BF\u098F\u09A8\u09AA\u09BF)" }), _jsx("p", { className: "text-xs opacity-70 mt-1", children: "\u09B8\u09B0\u09CD\u09AC\u09B8\u09CD\u09AC\u09A4\u09CD\u09AC \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 | World's Best Frame Generator \uD83C\uDF1F" })] }), _jsx("style", { children: `
        .bengali-text {
          font-family: 'SolaimanLipi', 'Noto Sans Bengali', 'Arial', sans-serif;
        }
        
        .zoom-slider::-webkit-slider-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #E41E3F;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 640px) {
          .zoom-slider::-webkit-slider-thumb {
            width: 24px;
            height: 24px;
          }
        }
      ` })] }));
}
