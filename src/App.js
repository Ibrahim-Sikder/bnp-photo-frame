"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { Upload, Download, RotateCcw } from "lucide-react";
import VoteFramePreview from "./components/VoteFramePreview";
import { Button } from "./components/ui/button";
import FrameCarousel from "./components/FrameCarousel";
import { Card } from "./components/ui/card";
export default function App() {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedFrame, setSelectedFrame] = useState("frame1");
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
        const sensitivity = 0.4;
        setOffsetX((prev) => Math.max(-100, Math.min(100, prev + deltaX * sensitivity)));
        setOffsetY((prev) => Math.max(-100, Math.min(100, prev + deltaY * sensitivity)));
        setDragStart({ x: clientX, y: clientY });
    };
    const stopDrag = () => setIsDragging(false);
    const handleMouseDown = (e) => startDrag(e.clientX, e.clientY);
    const handleMouseMove = (e) => moveDrag(e.clientX, e.clientY);
    const handleMouseUp = stopDrag;
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
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png", 1.0);
        link.download = `bnp-vote-frame-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleReset = () => {
        setUploadedImage(null);
        setSelectedFrame("frame1");
        setZoom(100);
        setOffsetX(0);
        setOffsetY(0);
        if (fileInputRef.current)
            fileInputRef.current.value = "";
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-10", children: [_jsxs("div", { className: "w-full bg-gradient-to-r from-[#006a4e] via-[#007a5e] to-[#E41E3F] py-8 px-4 text-center text-white shadow-md relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" }), _jsx("div", { className: "container mx-auto w-full flex justify-center relative z-10", children: _jsx("img", { src: "/images/sobar_age_bd.avif", alt: "BNP Logo", className: " object-contain" }) })] }), _jsx("div", { className: "container mx-auto px-4 py-6 md:py-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start", children: [_jsx("div", { className: "lg:col-span-4 w-full", children: _jsxs(Card, { className: "shadow-xl border-0 overflow-hidden", children: [_jsx("div", { className: "bg-[#E41E3F] p-5 text-white", children: _jsx("h2", { className: "text-xl font-bold bengali-text", children: "\u0995\u09A8\u09CD\u099F\u09CD\u09B0\u09CB\u09B2 \u09AA\u09CD\u09AF\u09BE\u09A8\u09C7\u09B2" }) }), _jsx("div", { className: "p-6 space-y-6", children: !uploadedImage ? (_jsxs("div", { className: "text-center py-6", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleImageUpload, className: "hidden" }), _jsxs(Button, { onClick: () => fileInputRef.current?.click(), className: "w-full bg-[#E41E3F] hover:bg-[#c41830] text-white py-7 text-lg font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02]", children: [_jsx(Upload, { className: "mr-3 h-5 w-5" }), " \u099B\u09AC\u09BF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"] })] })) : (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-bold text-gray-800 mb-3 bengali-text border-l-4 border-[#E41E3F] pl-2", children: "\u09AB\u09CD\u09B0\u09C7\u09AE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8" }), _jsx(FrameCarousel, { selectedFrame: selectedFrame, onSelectFrame: setSelectedFrame })] }), _jsxs("div", { className: "space-y-5 pt-2", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-2", children: [_jsx("label", { className: "text-sm font-bold text-gray-700 bengali-text", children: "\u099C\u09C1\u09AE \u0995\u09B0\u09C1\u09A8" }), _jsxs("span", { className: "text-xs font-mono bg-gray-200 px-2 py-0.5 rounded text-gray-700", children: [zoom, "%"] })] }), _jsx("input", { type: "range", min: "50", max: "250", step: "1", value: zoom, onChange: (e) => setZoom(Number(e.target.value)), className: "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E41E3F]" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block", children: "\u0985\u09A8\u09C1\u09AD\u09C2\u09AE\u09BF\u0995 \u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09A8 (X)" }), _jsx("input", { type: "range", min: "-100", max: "100", value: offsetX, onChange: (e) => setOffsetX(Number(e.target.value)), className: "w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007A5E]" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block", children: "\u0989\u09B2\u09CD\u09B2\u09AE\u09CD\u09AC \u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09A8 (Y)" }), _jsx("input", { type: "range", min: "-100", max: "100", value: offsetY, onChange: (e) => setOffsetY(Number(e.target.value)), className: "w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007A5E]" })] })] }), _jsxs("div", { className: "bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2", children: [_jsx("svg", { className: "w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("p", { className: "text-xs text-blue-800 bengali-text leading-relaxed", children: "\u099F\u09BF\u09AA: \u0986\u09AA\u09A8\u09BF \u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989 \u099B\u09AC\u09BF\u09A4\u09C7 \u0986\u0999\u09C1\u09B2 \u09AC\u09BE \u09AE\u09BE\u0989\u09B8 \u099F\u09C7\u09A8\u09C7 \u099B\u09AC\u09BF \u09B8\u09B0\u09BE\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u09A8\u0964" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 pt-2", children: [_jsxs(Button, { onClick: handleDownload, className: "bg-[#E41E3F] hover:bg-[#c41830] text-white py-3 font-bold rounded-lg shadow-md transition-all hover:shadow-lg", children: [_jsx(Download, { className: "mr-2 h-4 w-4" }), " \u09A1\u09BE\u0989\u09A8\u09B2\u09CB\u09A1"] }), _jsxs(Button, { onClick: handleReset, variant: "outline", className: "border-[#007A5E] text-[#007A5E] hover:bg-[#007A5E]/5 py-3 font-bold rounded-lg", children: [_jsx(RotateCcw, { className: "mr-2 h-4 w-4" }), " \u09A8\u09A4\u09C1\u09A8"] })] })] })) })] }) }), _jsx("div", { className: "lg:col-span-8 w-full", children: _jsxs(Card, { className: "shadow-xl border-0 overflow-hidden sticky top-6", children: [_jsxs("div", { className: "bg-gradient-to-r from-[#007A5E] to-[#1B5E20] p-5 text-white flex justify-between items-center", children: [_jsx("h2", { className: "text-xl font-bold bengali-text", children: "\u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989" }), _jsx("span", { className: "text-xs bg-white/20 px-2 py-1 rounded text-white/90", children: "Live View" })] }), _jsx("div", { className: "bg-[#f8fafc] p-4 md:p-8 min-h-[500px] flex items-center justify-center", children: _jsx("div", { className: `w-full max-w-lg transition-transform duration-75 ${uploadedImage ? "cursor-grab active:cursor-grabbing touch-none" : "cursor-default"}`, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd, children: _jsx(VoteFramePreview, { uploadedImage: uploadedImage, selectedFrame: selectedFrame, zoom: zoom, offsetX: offsetX, offsetY: offsetY, canvasRef: canvasRef }) }) })] }) })] }) }), _jsxs("div", { className: "bg-[#1B5E20] text-white text-center py-8 mt-8 border-t-4 border-[#E41E3F]", children: [_jsx("p", { className: "bengali-text font-medium opacity-90", children: "\u00A9 \u09E8\u09E6\u09E8\u09EC \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6 \u099C\u09BE\u09A4\u09C0\u09AF\u09BC\u09A4\u09BE\u09AC\u09BE\u09A6\u09C0 \u09A6\u09B2 (\u09AC\u09BF\u098F\u09A8\u09AA\u09BF)" }), _jsx("p", { className: "text-xs opacity-60 mt-1", children: "\u09B8\u09B0\u09CD\u09AC\u09B8\u09CD\u09AC\u09A4\u09CD\u09AC \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09BF\u09A4" })] })] }));
}
