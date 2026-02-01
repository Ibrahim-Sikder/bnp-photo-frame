import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function FrameCarousel({ selectedFrame, onSelectFrame }) {
    const containerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const frames = [
        { id: "frame1", imageUrl: "/frames/frame1.png" },
        { id: "frame2", imageUrl: "/frames/frame2.png" },
        { id: "frame3", imageUrl: "/frames/frame3.png" },
        { id: "frame4", imageUrl: "/frames/frame4.png" },
        { id: "frame5", imageUrl: "/frames/frame5.png" },
        { id: "frame6", imageUrl: "/frames/frame6.png" },
        { id: "frame7", imageUrl: "/frames/frame7.png" },
        { id: "frame8", imageUrl: "/frames/frame8.png" },
        { id: "frame9", imageUrl: "/frames/frame9.png" },
        { id: "frame10", imageUrl: "/frames/frame10.png" },
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
    const scroll = (direction) => {
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
    return (_jsxs("div", { className: "relative w-full", children: [_jsx("style", { dangerouslySetInnerHTML: {
                    __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `
                } }), _jsxs("div", { className: "flex items-center gap-1", children: [canScrollLeft && (_jsx(Button, { onClick: () => scroll("left"), variant: "ghost", size: "sm", className: "flex-shrink-0 text-[#E41E3F] hover:bg-[#E41E3F]/10 z-10 rounded-full h-8 w-8 p-0 lg:h-9 lg:w-9", children: _jsx(ChevronLeft, { className: "h-4 w-4 lg:h-5 lg:w-5" }) })), _jsx("div", { ref: containerRef, className: "flex gap-2 overflow-x-auto scrollbar-hide flex-1 py-2", style: { scrollBehavior: "smooth" }, children: frames.map((frame) => (_jsxs("button", { onClick: () => onSelectFrame(frame.id), className: `relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 
                sm:w-18 sm:h-22 
                lg:w-20 lg:h-24 
                ${selectedFrame === frame.id
                                ? "border-[#E41E3F] shadow-xl ring-2 ring-[#E41E3F]/40 scale-105"
                                : "border-gray-300 hover:border-[#E41E3F]/50 hover:scale-102"}`, children: [selectedFrame === frame.id && (_jsx("div", { className: "absolute top-1 right-1 w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-[#E41E3F] flex items-center justify-center z-10 shadow-lg animate-pulse", children: _jsx("svg", { className: "w-2.5 h-2.5 lg:w-3 lg:h-3 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) })), _jsx("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-1", children: _jsx("div", { className: "relative w-full h-full rounded overflow-hidden", children: _jsx("img", { src: frame.imageUrl, alt: `Frame ${frame.id}`, className: "w-full h-full object-cover transition-transform duration-300 hover:scale-110", loading: "lazy", onError: (e) => {
                                                const target = e.target;
                                                target.style.backgroundColor = "#ddd";
                                                target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23eee'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-size='12' fill='%23999'%3E${frame.id}%3C/text%3E%3C/svg%3E`;
                                            } }) }) })] }, frame.id))) }), canScrollRight && (_jsx(Button, { onClick: () => scroll("right"), variant: "ghost", size: "sm", className: "flex-shrink-0 text-[#E41E3F] hover:bg-[#E41E3F]/10 z-10 rounded-full h-8 w-8 p-0 lg:h-9 lg:w-9", children: _jsx(ChevronRight, { className: "h-4 w-4 lg:h-5 lg:w-5" }) }))] }), _jsx("div", { className: "flex justify-center items-center gap-1.5 mt-2", children: frames.map((frame) => (_jsx("button", { onClick: () => onSelectFrame(frame.id), className: `h-1.5 rounded-full transition-all duration-300 ${selectedFrame === frame.id
                        ? "bg-[#E41E3F] w-6"
                        : "bg-gray-300 hover:bg-gray-400 w-1.5"}`, "aria-label": `Select ${frame.id}` }, frame.id))) })] }));
}
