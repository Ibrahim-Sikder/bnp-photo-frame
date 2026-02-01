"use client";

import { useState, useRef } from "react";
import { Upload, Download, RotateCcw, ZoomIn, ZoomOut, Move } from "lucide-react";
import VoteFramePreview from "./app/components/VoteFramePreview";
import { Button } from "./components/ui/button";
import FrameCarousel from "./app/components/FrameCarousel";
import { Card } from "./components/ui/card";

export default function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<"frame1" | "frame2" | "frame3" | "frame4" | "frame5" | "frame6" | "frame7" | "frame8" | "frame9" | "frame10">("frame3");
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
    const sensitivity = 2;

    setOffsetX((prev) => Math.max(-300, Math.min(300, prev + deltaX * sensitivity)));
    setOffsetY((prev) => Math.max(-300, Math.min(300, prev + deltaY * sensitivity)));
    setDragStart({ x: clientX, y: clientY });
  };

  const stopDrag = () => setIsDragging(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    moveDrag(e.clientX, e.clientY);
  };

  const handleMouseUp = stopDrag;

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!uploadedImage) return;
    e.preventDefault();
    e.stopPropagation();

    const delta = e.deltaY > 0 ? -15 : 15;
    setZoom((prev) => Math.max(50, Math.min(500, prev + delta)));
  };

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

    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');

    if (!exportCtx) return;

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(500, prev + 20));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(50, prev - 20));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="w-full bg-gradient-to-r from-[#006a4e] via-[#007a5e] to-[#E41E3F] py-4 md:py-6 px-4 text-center text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto w-full flex justify-center relative z-10">
          <img src="/images/sobar_age_bd.avif" alt="BNP Logo" className=" object-contain" />
        </div>
      </div>

      <div className="container  mx-auto px-24 py-4 md:py-8">
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-3">
          {/* Step Indicator - Mobile */}
          {!uploadedImage && (
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg">
              <div className="flex items-start gap-3">
                <div className="bg-white/20 rounded-full p-2 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 bengali-text">শুরু করুন!</h3>
                  <p className="text-sm bengali-text opacity-90">১. নিচের বাটনে ক্লিক করে আপনার ছবি আপলোড করুন</p>
                  <p className="text-sm bengali-text opacity-90 mt-1">২. ফ্রেম সিলেক্ট করুন</p>
                  <p className="text-sm bengali-text opacity-90 mt-1">৩. জুম ও পজিশন ঠিক করুন</p>
                  <p className="text-sm bengali-text opacity-90 mt-1">৪. HD ডাউনলোড করুন</p>
                </div>
              </div>
            </div>
          )}

          {/* Preview Section - Always Visible with Default Frame */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-[#007A5E] to-[#1B5E20] p-3 text-white flex justify-between items-center">
              <h2 className="text-base font-bold bengali-text">📸 প্রিভিউ দেখুন</h2>
              {uploadedImage && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/90 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Live
                </span>
              )}
            </div>
            <div
              className="bg-[#f8fafc] p-3 flex items-center justify-center min-h-[320px]"
              onWheel={handleWheel}
              style={{ touchAction: 'none' }}
            >
              <div
                className={`w-full transition-transform duration-75 ${uploadedImage ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <VoteFramePreview
                  uploadedImage={uploadedImage}
                  selectedFrame={selectedFrame}
                  zoom={zoom}
                  offsetX={offsetX}
                  offsetY={offsetY}
                  canvasRef={canvasRef}
                />
              </div>
            </div>
            {uploadedImage && (
              <div className="bg-blue-50 border-t border-blue-100 p-2 flex items-center gap-2 text-xs text-blue-700">
                <Move className="w-4 h-4" />
                <span className="bengali-text">টিপস: আঙুল দিয়ে টেনে সরান, পিঞ্চ করে জুম করুন</span>
              </div>
            )}
          </Card>

          {/* Controls Section - Mobile */}
          <Card className="shadow-xl border-0 overflow-hidden bg-white">
            <div className="bg-gradient-to-r from-[#E41E3F] to-[#c41830] p-3 text-white">
              <h2 className="text-base font-bold bengali-text">⚙️ কন্ট্রোল প্যানেল</h2>
            </div>
            <div className="p-3 space-y-3">
              {/* Upload Button - Always Visible */}
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gradient-to-r from-[#E41E3F] to-[#c41830] hover:from-[#c41830] hover:to-[#a01525] text-white py-6 text-base font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02] relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/10 animate-pulse"></span>
                  <Upload className="mr-2 h-5 w-5 relative z-10" />
                  <span className="relative z-10 bengali-text">{uploadedImage ? "নতুন ছবি সিলেক্ট করুন" : "১. ছবি সিলেক্ট করুন 📷"}</span>
                </Button>
              </div>

              {/* Frame Selection - Always Visible */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2 bengali-text border-l-4 border-[#E41E3F] pl-2 flex items-center gap-2">
                  <span>২. ফ্রেম নির্বাচন করুন 🖼️</span>
                </h3>
                <FrameCarousel selectedFrame={selectedFrame} onSelectFrame={setSelectedFrame} />
              </div>

              {/* Additional Controls - Show when image uploaded */}
              {uploadedImage && (
                <>
                  {/* Zoom Control */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold text-gray-700 bengali-text flex items-center gap-1">
                        <ZoomIn className="w-4 h-4 text-[#E41E3F]" />
                        ৩. জুম করুন
                      </label>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleZoomOut}
                          className="h-8 w-8 p-0 border-[#E41E3F] text-[#E41E3F] hover:bg-[#E41E3F] hover:text-white"
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-bold bg-[#E41E3F] text-white px-3 py-1 rounded min-w-[60px] text-center">{zoom}%</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleZoomIn}
                          className="h-8 w-8 p-0 border-[#E41E3F] text-[#E41E3F] hover:bg-[#E41E3F] hover:text-white"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="5"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E41E3F] zoom-slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>ছোট</span>
                      <span>বড়</span>
                    </div>
                  </div>

                  {/* Position Controls */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-3">
                    <h4 className="text-sm font-bold text-gray-700 bengali-text flex items-center gap-1">
                      <Move className="w-4 h-4 text-[#007A5E]" />
                      ৪. পজিশন ঠিক করুন
                    </h4>

                    {/* X Position */}
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1 block bengali-text flex items-center justify-between">
                        <span>← ডানে-বামে →</span>
                        <span className="text-[#007A5E]">{offsetX > 0 ? `+${offsetX}` : offsetX}</span>
                      </label>
                      <input
                        type="range"
                        min="-300"
                        max="300"
                        step="5"
                        value={offsetX}
                        onChange={(e) => setOffsetX(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007A5E]"
                      />
                    </div>

                    {/* Y Position */}
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1 block bengali-text flex items-center justify-between">
                        <span>↑ উপরে-নিচে ↓</span>
                        <span className="text-[#007A5E]">{offsetY > 0 ? `+${offsetY}` : offsetY}</span>
                      </label>
                      <input
                        type="range"
                        min="-300"
                        max="300"
                        step="5"
                        value={offsetY}
                        onChange={(e) => setOffsetY(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007A5E]"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02]"
                    >
                      <Download className="mr-1 h-5 w-5" />
                      <span className="bengali-text">HD ডাউনলোড</span>
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="border-2 border-[#007A5E] text-[#007A5E] hover:bg-[#007A5E] hover:text-white py-6 font-bold rounded-xl transition-all"
                    >
                      <RotateCcw className="mr-1 h-5 w-5" />
                      <span className="bengali-text">নতুন শুরু</span>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Desktop Layout: 6-6 Column Split */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Left Panel - Controls (6 columns) */}
            <div className="col-span-6 w-full">
              <Card className="shadow-2xl border-0 overflow-hidden sticky top-6">
                <div className="bg-gradient-to-r from-[#E41E3F] to-[#c41830] p-4 text-white">
                  <h2 className="text-lg font-bold bengali-text">⚙️ কন্ট্রোল প্যানেল</h2>
                </div>
                <div className="p-6 space-y-5">
                  {/* Upload Section */}
                  <div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-gradient-to-r from-[#E41E3F] to-[#c41830] hover:from-[#c41830] hover:to-[#a01525] text-white py-6 text-lg font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02]"
                    >
                      <Upload className="mr-2 h-6 w-6" />
                      <span className="bengali-text">{uploadedImage ? "নতুন ছবি সিলেক্ট করুন" : "১. ছবি সিলেক্ট করুন"}</span>
                    </Button>
                  </div>

                  {/* Frame Selection - Always Visible */}
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-3 bengali-text border-l-4 border-[#E41E3F] pl-3 flex items-center gap-2">
                      ২. ফ্রেম নির্বাচন করুন
                    </h3>
                    <FrameCarousel selectedFrame={selectedFrame} onSelectFrame={setSelectedFrame} />
                  </div>

                  {uploadedImage && (
                    <>
                      {/* Zoom Control */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-base font-bold text-gray-700 bengali-text flex items-center gap-2">
                            <ZoomIn className="w-5 h-5 text-[#E41E3F]" />
                            ৩. জুম করুন
                          </label>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleZoomOut}
                              className="h-9 w-9 p-0"
                            >
                              <ZoomOut className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-bold bg-[#E41E3F] text-white px-4 py-1.5 rounded min-w-[70px] text-center">{zoom}%</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleZoomIn}
                              className="h-9 w-9 p-0"
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="500"
                          step="5"
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E41E3F]"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>50%</span>
                          <span>500%</span>
                        </div>
                      </div>

                      {/* Position Controls */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                        <h4 className="text-base font-bold text-gray-700 bengali-text flex items-center gap-2">
                          <Move className="w-5 h-5 text-[#007A5E]" />
                          ৪. পজিশন ঠিক করুন
                        </h4>

                        <div>
                          <label className="text-sm font-bold text-gray-600 mb-2 block bengali-text flex items-center justify-between">
                            <span>← ডানে-বামে সরান →</span>
                            <span className="text-[#007A5E]">{offsetX > 0 ? `+${offsetX}` : offsetX}</span>
                          </label>
                          <input
                            type="range"
                            min="-300"
                            max="300"
                            step="5"
                            value={offsetX}
                            onChange={(e) => setOffsetX(Number(e.target.value))}
                            className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007A5E]"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-bold text-gray-600 mb-2 block bengali-text flex items-center justify-between">
                            <span>↑ উপরে-নিচে সরান ↓</span>
                            <span className="text-[#007A5E]">{offsetY > 0 ? `+${offsetY}` : offsetY}</span>
                          </label>
                          <input
                            type="range"
                            min="-300"
                            max="300"
                            step="5"
                            value={offsetY}
                            onChange={(e) => setOffsetY(Number(e.target.value))}
                            className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007A5E]"
                          />
                        </div>
                      </div>

                      {/* Info Box */}
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                        <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-blue-800 bengali-text leading-relaxed">
                          <strong>টিপস:</strong> প্রিভিউতে মাউস স্ক্রোল করে জুম করুন এবং ড্র্যাগ করে সরান।
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <Button
                          onClick={handleDownload}
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 font-bold rounded-lg shadow-md transition-all hover:shadow-lg"
                        >
                          <Download className="mr-2 h-5 w-5" /> HD ডাউনলোড
                        </Button>
                        <Button
                          onClick={handleReset}
                          variant="outline"
                          className="border-2 border-[#007A5E] text-[#007A5E] hover:bg-[#007A5E] hover:text-white py-4 font-bold rounded-lg transition-all"
                        >
                          <RotateCcw className="mr-2 h-5 w-5" /> রিসেট
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Panel - Preview (6 columns) */}
            <div className="col-span-6 w-full">
              <Card className="shadow-2xl border-0 overflow-hidden sticky top-6">
                <div className="bg-gradient-to-r from-[#007A5E] to-[#1B5E20] p-4 text-white flex justify-between items-center">
                  <h2 className="text-lg font-bold bengali-text">📸 প্রিভিউ</h2>
                  {uploadedImage && (
                    <span className="text-xs bg-white/20 px-3 py-1.5 rounded text-white/90 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Live View
                    </span>
                  )}
                </div>
                <div
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center min-h-[700px]"
                  onWheel={handleWheel}
                  style={{ touchAction: 'none' }}
                >
                  <div
                    className={`w-full transition-transform duration-100 ${uploadedImage ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <VoteFramePreview
                      uploadedImage={uploadedImage}
                      selectedFrame={selectedFrame}
                      zoom={zoom}
                      offsetX={offsetX}
                      offsetY={offsetY}
                      canvasRef={canvasRef}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-[#1B5E20] to-[#0d3f16] text-white text-center py-6 mt-8 border-t-4 border-[#E41E3F] shadow-lg">
        <p className="bengali-text font-semibold opacity-95 text-base md:text-lg">© ২০২৬ বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি)</p>
        <p className="text-xs opacity-70 mt-1">সর্বস্বত্ব সংরক্ষিত | World's Best Frame Generator 🌟</p>
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
}