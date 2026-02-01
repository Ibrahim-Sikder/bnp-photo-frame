"use client";

import { useState, useRef } from "react";
import { Upload, Download, RotateCcw, ZoomIn, ZoomOut, Move, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
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

  const moveStep = 20;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <style dangerouslySetInnerHTML={{
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
      `}} />

      {/* Hero Header */}
      <div className="w-full bg-gradient-to-r from-[#006a4e] via-[#007a5e] to-[#E41E3F] py-3 md:py-6 px-4 text-center text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto w-full flex justify-center relative z-10">
          <img src="/images/sobar_age_bd.avif" alt="BNP Logo" />
        </div>
      </div>


      <div className="container mx-auto py-3 md:py-8 max-w-8xl">
        <div className="md:hidden block">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="file-input"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-[#E41E3F] to-[#c41830] hover:from-[#c41830] hover:to-[#a01525] text-white py-5 md:py-6 text-sm sm:text-base font-semibold rounded-xl shadow-lg transition-all active:scale-95 touch-manipulation"
            >
              <Upload className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              <span className="bengali-text">{uploadedImage ? "নতুন ছবি সিলেক্ট করুন" : "ছবি সিলেক্ট করুন"}</span>
            </Button>
          </div>

          {/* Frame Selection */}
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-3 bengali-text border-l-4 border-[#E41E3F] pl-3">
              ২. ফ্রেম নির্বাচন করুন
            </h3>
            <FrameCarousel selectedFrame={selectedFrame} onSelectFrame={setSelectedFrame} />
          </div>
        </div>
        {/* Main Content Area - Single Responsive Layout */}
        <div className="lg:grid flex  flex-col-reverse lg:grid-cols-12 gap-4 items-start">
          {/* Left Panel - Controls (12 columns on mobile, 6 on desktop) */}
          <div className=" lg:col-span-6 w-full md:col-start-1 ">
            <Card className="shadow-lg md:shadow-2xl border-0 overflow-hidden bg-white lg:sticky lg:top-6">
              <div className="bg-gradient-to-r from-[#E41E3F] to-[#c41830] p-3 md:p-4 text-white">
                <h2 className="text-sm sm:text-base md:text-lg font-bold bengali-text">⚙️ কন্ট্রোল প্যানেল</h2>
              </div>
              <div className="p-3 md:p-6 space-y-4 md:space-y-5">
                {/* Upload Button */}

                <div className="md:block hidden">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="file-input"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-gradient-to-r from-[#E41E3F] to-[#c41830] hover:from-[#c41830] hover:to-[#a01525] text-white py-5 md:py-6 text-sm sm:text-base font-semibold rounded-xl shadow-lg transition-all active:scale-95 touch-manipulation"
                    >
                      <Upload className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                      <span className="bengali-text">{uploadedImage ? "নতুন ছবি সিলেক্ট করুন" : "ছবি সিলেক্ট করুন"}</span>
                    </Button>
                  </div>

                  {/* Frame Selection */}
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-3 bengali-text border-l-4 border-[#E41E3F] pl-3">
                      ২. ফ্রেম নির্বাচন করুন
                    </h3>
                    <FrameCarousel selectedFrame={selectedFrame} onSelectFrame={setSelectedFrame} />
                  </div>
                </div>
                {/* Zoom Controls - Show only when image uploaded */}
                {uploadedImage && (
                  <>
                    <div className="bg-orange-50 p-3 md:p-4 rounded-lg border border-orange-200">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
                        <label className="text-base font-bold text-orange-900 bengali-text flex items-center gap-2">
                          <ZoomIn className="w-5 h-5 text-orange-600" />
                          ৩. জুম করুন
                        </label>
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <Button
                            onClick={handleZoomOut}
                            className="h-9 w-9 p-0 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                          >
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-bold bg-orange-600 text-white px-4 py-1.5 rounded min-w-[70px] text-center">{zoom}%</span>
                          <Button
                            onClick={handleZoomIn}
                            className="h-9 w-9 p-0 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        step="10"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer slider-orange touch-manipulation"
                      />
                      <div className="flex justify-between text-xs text-orange-700 mt-2 font-semibold">
                        <span>50%</span>
                        <span>500%</span>
                      </div>
                    </div>

                    {/* Position Controls */}
                    <div className="bg-teal-50 p-3 md:p-4 rounded-lg border border-teal-200 space-y-4">
                      <h4 className="text-base font-bold text-teal-900 bengali-text flex items-center gap-2">
                        <Move className="w-5 h-5 text-teal-600" />
                        ৪. পজিশন ঠিক করুন
                      </h4>

                      {/* Mobile Position Buttons (hidden on desktop) */}
                      <div className="lg:hidden">
                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border-2 border-teal-200">
                          <div className="text-center mb-3">
                            <div className="text-sm font-bold text-teal-800 bengali-text mb-1">তীর বাটন দিয়ে সরান</div>
                            <div className="flex items-center justify-center gap-2 text-xs text-teal-600">
                              <span className="bengali-text">X: <strong>{offsetX}</strong></span>
                              <span>•</span>
                              <span className="bengali-text">Y: <strong>{offsetY}</strong></span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-2">
                            <Button
                              onClick={() => setOffsetY(prev => Math.max(-300, prev - moveStep))}
                              className="h-12 w-12 sm:h-14 sm:w-14 p-0 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-lg active:scale-95 transition-all touch-manipulation"
                            >
                              <ChevronUp className="h-7 w-7" />
                            </Button>

                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => setOffsetX(prev => Math.max(-300, prev - moveStep))}
                                className="h-12 w-12 sm:h-14 sm:w-14 p-0 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-lg active:scale-95 transition-all touch-manipulation"
                              >
                                <ChevronLeft className="h-7 w-7" />
                              </Button>

                              <Button
                                onClick={() => { setOffsetX(0); setOffsetY(0); }}
                                className="h-12 w-12 sm:h-14 sm:w-14 p-0 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg active:scale-95 transition-all bengali-text text-xs font-bold touch-manipulation"
                              >
                                মাঝে
                              </Button>

                              <Button
                                onClick={() => setOffsetX(prev => Math.min(300, prev + moveStep))}
                                className="h-12 w-12 sm:h-14 sm:w-14 p-0 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-lg active:scale-95 transition-all touch-manipulation"
                              >
                                <ChevronRight className="h-7 w-7" />
                              </Button>
                            </div>

                            <Button
                              onClick={() => setOffsetY(prev => Math.min(300, prev + moveStep))}
                              className="h-12 w-12 sm:h-14 sm:w-14 p-0 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-lg active:scale-95 transition-all touch-manipulation"
                            >
                              <ChevronDown className="h-7 w-7" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Position Sliders (hidden on mobile) */}
                      <div className="hidden lg:block space-y-4">
                        <div>
                          <label className="text-sm font-bold text-teal-700 mb-2 block bengali-text">
                            ← ডানে-বামে সরান → ({offsetX})
                          </label>
                          <input
                            type="range"
                            min="-300"
                            max="300"
                            step="5"
                            value={offsetX}
                            onChange={(e) => setOffsetX(Number(e.target.value))}
                            className="w-full h-2.5 bg-teal-200 rounded-lg appearance-none cursor-pointer slider-teal"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-bold text-teal-700 mb-2 block bengali-text">
                            ↑ উপরে-নিচে সরান ↓ ({offsetY})
                          </label>
                          <input
                            type="range"
                            min="-300"
                            max="300"
                            step="5"
                            value={offsetY}
                            onChange={(e) => setOffsetY(Number(e.target.value))}
                            className="w-full h-2.5 bg-teal-200 rounded-lg appearance-none cursor-pointer slider-teal"
                          />
                        </div>
                      </div>

                      {/* Additional Mobile Sliders */}
                      <div className="lg:hidden">
                        <details className="bg-gray-50 rounded-lg">
                          <summary className="cursor-pointer p-3 text-sm font-bold text-gray-700 bengali-text">
                            🎯 সূক্ষ্ম নিয়ন্ত্রণ (ঐচ্ছিক)
                          </summary>
                          <div className="p-3 space-y-3 border-t border-gray-200">
                            <div>
                              <label className="text-xs font-bold text-teal-700 mb-1 block bengali-text">
                                ← ডানে-বামে → ({offsetX})
                              </label>
                              <input
                                type="range"
                                min="-300"
                                max="300"
                                step="5"
                                value={offsetX}
                                onChange={(e) => setOffsetX(Number(e.target.value))}
                                className="w-full h-3 bg-teal-200 rounded-lg appearance-none cursor-pointer slider-teal touch-manipulation"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-teal-700 mb-1 block bengali-text">
                                ↑ উপরে-নিচে ↓ ({offsetY})
                              </label>
                              <input
                                type="range"
                                min="-300"
                                max="300"
                                step="5"
                                value={offsetY}
                                onChange={(e) => setOffsetY(Number(e.target.value))}
                                className="w-full h-3 bg-teal-200 rounded-lg appearance-none cursor-pointer slider-teal touch-manipulation"
                              />
                            </div>
                          </div>
                        </details>
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 md:p-4 flex items-start gap-3">
                      <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-blue-800 bengali-text leading-relaxed">
                        <strong>টিপস:</strong> প্রিভিউতে মাউস স্ক্রোল করে জুম করুন এবং ড্র্যাগ করে সরান।
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <Button
                        onClick={handleDownload}
                        disabled={!uploadedImage}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 md:py-6 font-bold rounded-lg shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                      >
                        <Download className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                        <span className="bengali-text">HD ডাউনলোড</span>
                      </Button>
                      <Button
                        onClick={handleReset}
                        className="border-2 border-red-500 bg-white text-red-600 hover:bg-red-600 hover:text-white py-4 md:py-6 font-bold rounded-lg transition-all"
                      >
                        <RotateCcw className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                        <span className="bengali-text">রিসেট</span>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Right Panel - Preview (12 columns on mobile, 6 on desktop) */}
          <div className=" lg:col-span-6 w-full md:col-start-2 sm:col-start-1">
            <Card className="shadow-lg md:shadow-2xl border-0 overflow-hidden bg-white lg:sticky lg:top-6 mt-4 lg:mt-0">
              <div className="bg-gradient-to-r from-[#007A5E] to-[#1B5E20] p-3 md:p-4 text-white flex justify-between items-center">
                <h2 className="text-sm sm:text-base md:text-lg font-bold bengali-text">📸 প্রিভিউ</h2>
                {uploadedImage && (
                  <span className="text-xs bg-white/20 px-2 py-1 md:px-3 md:py-1.5 rounded text-white/90 flex items-center gap-1 md:gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="hidden sm:inline">Live View</span>
                    <span className="sm:hidden">Live</span>
                  </span>
                )}
              </div>
              <div
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 md:p-6 flex items-center justify-center min-h-[400px] md:min-h-[700px] overflow-hidden"
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
              {uploadedImage && (
                <div className="bg-blue-50 border-t border-blue-100 p-2 text-center lg:hidden">
                  <span className="text-xs text-blue-700 bengali-text">💡 আঙুল দিয়ে টেনে সরান</span>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-[#1B5E20] to-[#0d3f16] text-white text-center py-4 md:py-6 mt-6 md:mt-8 border-t-4 border-[#E41E3F] shadow-lg">
        <p className="bengali-text font-semibold opacity-95 text-sm md:text-lg">© ২০২৬ বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি)</p>
        <p className="text-xs opacity-70 mt-1">সর্বস্বত্ব সংরক্ষিত | World's Best Frame Generator 🌟</p>
      </div>
    </div>
  );
}