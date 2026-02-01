import { jsx as _jsx } from "react/jsx-runtime";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./variants";
export function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
    const Comp = asChild ? Slot : "button";
    return (_jsx(Comp, { "data-slot": "button", "data-variant": variant, "data-size": size, className: cn(buttonVariants({ variant, size, className })), ...props }));
}
