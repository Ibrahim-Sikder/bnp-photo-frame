"use client";

import { useState, useRef } from "react";

import { Upload, Download, RotateCcw } from "lucide-react";
import VoteFramePreview from "./components/VoteFramePreview";
import { Button } from "./components/ui/button";
import FrameCarousel from "./components/FrameCarousel";
import { Card } from "./components/ui/card";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<"frame1" | "frame2" | "frame3" | "frame4" | "frame5">("frame1");
  const [zoom, setZoom] = useState(100);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setZoom(100);
        setOffsetX(0);
        setOffsetY(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const startDrag = (clientX: number, clientY: number) => {
    if (!uploadedImage) return;
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (!isDragging || !uploadedImage) return;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    const sensitivity = 0.4;

    setOffsetX((prev) => Math.max(-100, Math.min(100, prev + deltaX * sensitivity)));
    setOffsetY((prev) => Math.max(-100, Math.min(100, prev + deltaY * sensitivity)));
    setDragStart({ x: clientX, y: clientY });
  };

  const stopDrag = () => setIsDragging(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => startDrag(e.clientX, e.clientY);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => moveDrag(e.clientX, e.clientY);
  const handleMouseUp = stopDrag;
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging) e.preventDefault();
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  };
  const handleTouchEnd = stopDrag;

  const handleDownload = () => {
    if (!canvasRef.current || !uploadedImage) return;
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Hero Header */}
      <div className="w-full bg-gradient-to-r from-[#006a4e] via-[#007a5e] to-[#E41E3F] py-8 px-4 text-center text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto w-full flex justify-center relative z-10">

          <img src="/images/sobar_age_bd.avif" alt="BNP Logo" className=" object-contain" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel */}
          <div className="lg:col-span-4 w-full">
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="bg-[#E41E3F] p-5 text-white">
                <h2 className="text-xl font-bold bengali-text">কন্ট্রোল প্যানেল</h2>
              </div>
              <div className="p-6 space-y-6">
                {!uploadedImage ? (
                  <div className="text-center py-6">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <Button onClick={() => fileInputRef.current?.click()} className="w-full bg-[#E41E3F] hover:bg-[#c41830] text-white py-7 text-lg font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02]">
                      <Upload className="mr-3 h-5 w-5" /> ছবি নির্বাচন করুন
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-gray-800 mb-3 bengali-text border-l-4 border-[#E41E3F] pl-2">ফ্রেম নির্বাচন করুন</h3>
                      <FrameCarousel selectedFrame={selectedFrame} onSelectFrame={setSelectedFrame} />
                    </div>
                    <div className="space-y-5 pt-2">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-bold text-gray-700 bengali-text">জুম করুন</label>
                          <span className="text-xs font-mono bg-gray-200 px-2 py-0.5 rounded text-gray-700">{zoom}%</span>
                        </div>
                        <input type="range" min="50" max="250" step="1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E41E3F]" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">অনুভূমিক অবস্থান (X)</label>
                        <input type="range" min="-100" max="100" value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007A5E]" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">উল্লম্ব অবস্থান (Y)</label>
                        <input type="range" min="-100" max="100" value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007A5E]" />
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p className="text-xs text-blue-800 bengali-text leading-relaxed">টিপ: আপনি প্রিভিউ ছবিতে আঙুল বা মাউস টেনে ছবি সরাতে পারেন।</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button onClick={handleDownload} className="bg-[#E41E3F] hover:bg-[#c41830] text-white py-3 font-bold rounded-lg shadow-md transition-all hover:shadow-lg">
                        <Download className="mr-2 h-4 w-4" /> ডাউনলোড
                      </Button>
                      <Button onClick={handleReset} variant="outline" className="border-[#007A5E] text-[#007A5E] hover:bg-[#007A5E]/5 py-3 font-bold rounded-lg">
                        <RotateCcw className="mr-2 h-4 w-4" /> নতুন
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-8 w-full">
            <Card className="shadow-xl border-0 overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-[#007A5E] to-[#1B5E20] p-5 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold bengali-text">প্রিভিউ</h2>
                <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/90">Live View</span>
              </div>
              <div className="bg-[#f8fafc] p-4 md:p-8 min-h-[500px] flex items-center justify-center">
                <div className={`w-full max-w-lg transition-transform duration-75 ${uploadedImage ? "cursor-grab active:cursor-grabbing touch-none" : "cursor-default"}`} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                  <VoteFramePreview uploadedImage={uploadedImage} selectedFrame={selectedFrame} zoom={zoom} offsetX={offsetX} offsetY={offsetY} canvasRef={canvasRef} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <div className="bg-[#1B5E20] text-white text-center py-8 mt-8 border-t-4 border-[#E41E3F]">
        <p className="bengali-text font-medium opacity-90">© ২০২৬ বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি)</p>
        <p className="text-xs opacity-60 mt-1">সর্বস্বত্ব সংরক্ষিত</p>
      </div>
    </div>
  );
}