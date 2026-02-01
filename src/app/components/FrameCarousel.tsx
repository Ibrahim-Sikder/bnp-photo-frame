import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FrameCarouselProps {
  selectedFrame: "frame1" | "frame2" | "frame3" | "frame4" | "frame5" | "frame6" | "frame7" | "frame8" | "frame9" | "frame10";
  onSelectFrame: (frame: "frame1" | "frame2" | "frame3" | "frame4" | "frame5" | "frame6" | "frame7" | "frame8" | "frame9" | "frame10") => void;
}

export default function FrameCarousel({ selectedFrame, onSelectFrame }: FrameCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const frames = [
    { id: "frame1" as const, imageUrl: "/frames/frame1.png" },
    { id: "frame2" as const, imageUrl: "/frames/frame2.png" },
    { id: "frame3" as const, imageUrl: "/frames/frame3.png" },
    { id: "frame4" as const, imageUrl: "/frames/frame4.png" },
    { id: "frame5" as const, imageUrl: "/frames/frame5.png" },
    { id: "frame6" as const, imageUrl: "/frames/frame6.png" },
    { id: "frame7" as const, imageUrl: "/frames/frame7.png" },
    { id: "frame8" as const, imageUrl: "/frames/frame8.png" },
    { id: "frame9" as const, imageUrl: "/frames/frame9.png" },
    { id: "frame10" as const, imageUrl: "/frames/frame10.png" },
  ];

  const updateScrollButtons = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const container = containerRef.current;

    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 150;
      const newPosition = containerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      containerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-1">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <Button
            onClick={() => scroll("left")}
            variant="ghost"
            size="sm"
            className="flex-shrink-0 text-[#E41E3F] hover:bg-[#E41E3F]/10 z-10 rounded-full h-8 w-8 p-0 lg:h-9 lg:w-9"
          >
            <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>
        )}

        {/* Frames Container - Reduced Padding */}
        <div
          ref={containerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 py-2"
          style={{ scrollBehavior: "smooth", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {frames.map((frame) => (
            <button
              key={frame.id}
              onClick={() => onSelectFrame(frame.id)}
              className={`relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 
                sm:w-18 sm:h-22 
                lg:w-20 lg:h-24 
                ${selectedFrame === frame.id
                  ? "border-[#E41E3F] shadow-xl ring-2 ring-[#E41E3F]/40 scale-105"
                  : "border-gray-300 hover:border-[#E41E3F]/50 hover:scale-102"
                }`}
            >
              {/* Selected Indicator */}
              {selectedFrame === frame.id && (
                <div className="absolute top-1 right-1 w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-[#E41E3F] flex items-center justify-center z-10 shadow-lg animate-pulse">
                  <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Frame Preview Image */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-1">
                <div className="relative w-full h-full rounded overflow-hidden">
                  <img
                    src={frame.imageUrl}
                    alt={`Frame ${frame.id}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.backgroundColor = "#ddd";
                      target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23eee'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-size='12' fill='%23999'%3E${frame.id}%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <Button
            onClick={() => scroll("right")}
            variant="ghost"
            size="sm"
            className="flex-shrink-0 text-[#E41E3F] hover:bg-[#E41E3F]/10 z-10 rounded-full h-8 w-8 p-0 lg:h-9 lg:w-9"
          >
            <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>
        )}
      </div>

      {/* Scroll Indicator Dots */}
      <div className="flex justify-center items-center gap-1.5 mt-2">
        {frames.map((frame) => (
          <button
            key={frame.id}
            onClick={() => onSelectFrame(frame.id)}
            className={`h-1.5 rounded-full transition-all duration-300 ${selectedFrame === frame.id
              ? "bg-[#E41E3F] w-6"
              : "bg-gray-300 hover:bg-gray-400 w-1.5"
              }`}
            aria-label={`Select ${frame.id}`}
          />
        ))}
      </div>

      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}