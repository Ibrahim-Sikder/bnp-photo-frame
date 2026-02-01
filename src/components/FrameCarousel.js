import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function FrameCarousel({ selectedFrame, onSelectFrame }) {
    const containerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const frames = [
        {
            id: "frame1",
            imageUrl: "/frames/frame.jpeg",
        },
        {
            id: "frame2",
            imageUrl: "/frames/frame2.jpeg",
        },
        {
            id: "frame3",
            imageUrl: "/frames/frame3.jpeg",
        },
        {
            id: "frame4",
            imageUrl: "/frames/frame4.jpeg",
        },
        {
            id: "frame5",
            imageUrl: "/frames/frame5.jpeg",
        },
    ];
    const updateScrollButtons = () => {
        if (containerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };
    useEffect(() => {
        updateScrollButtons();
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", updateScrollButtons);
            return () => container.removeEventListener("scroll", updateScrollButtons);
        }
    }, []);
    const scroll = (direction) => {
        if (containerRef.current) {
            const scrollAmount = 120;
            const newPosition = containerRef.current.scrollLeft +
                (direction === "left" ? -scrollAmount : scrollAmount);
            containerRef.current.scrollTo({
                left: newPosition,
                behavior: "smooth"
            });
        }
    };
    return (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center gap-2", children: [canScrollLeft && (_jsx(Button, { onClick: () => scroll("left"), variant: "ghost", size: "sm", className: "flex-shrink-0 text-[#E41E3F] hover:bg-[#E41E3F]/10 z-10", children: _jsx(ChevronLeft, { className: "h-5 w-5" }) })), _jsx("div", { ref: containerRef, className: "flex gap-4 overflow-x-auto scrollbar-hide flex-1 px-1 py-2", style: { scrollBehavior: "smooth" }, children: frames.map((frame) => (_jsxs("button", { onClick: () => onSelectFrame(frame.id), className: `relative flex-shrink-0 w-24 h-28 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedFrame === frame.id
                                ? "border-[#E41E3F] shadow-lg ring-2 ring-[#E41E3F]/30"
                                : "border-gray-300 hover:border-gray-400"}`, children: [selectedFrame === frame.id && (_jsx("div", { className: "absolute top-1 right-1 w-5 h-5 rounded-full bg-[#E41E3F] flex items-center justify-center z-10 shadow-md", children: _jsx("svg", { className: "w-3 h-3 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) })), _jsx("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-2", children: _jsx("div", { className: "relative w-full h-full rounded overflow-hidden", children: _jsx("img", { src: frame.imageUrl, alt: frame.id, className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-110", loading: "lazy", onError: (e) => {
                                                const fallbackSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect width='200' height='150' fill='%23f8f9fa'/%3E%3Ctext x='100' y='80' text-anchor='middle' font-size='12' fill='%23495057' font-family='system-ui'%3E${frame.id}%3C/text%3E%3C/svg%3E`;
                                                e.currentTarget.src = fallbackSVG;
                                            } }) }) })] }, frame.id))) }), canScrollRight && (_jsx(Button, { onClick: () => scroll("right"), variant: "ghost", size: "sm", className: "flex-shrink-0 text-[#E41E3F] hover:bg-[#E41E3F]/10 z-10", children: _jsx(ChevronRight, { className: "h-5 w-5" }) }))] }), _jsx("div", { className: "flex justify-center items-center gap-2 mt-4", children: frames.map((frame) => (_jsx("button", { onClick: () => onSelectFrame(frame.id), className: `w-8 h-2 rounded-full transition-all duration-300 ${selectedFrame === frame.id
                        ? "bg-[#E41E3F]"
                        : "bg-gray-300 hover:bg-gray-400"}` }, frame.id))) })] }));
}
