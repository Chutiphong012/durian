"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef(function ({ className, ...props }, ref) {
    return (
        <input
            ref={ref}
            className={cn(
                "block w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none focus:border-blue-500",
                className
            )}
            {...props} />
    );
});

Input.displayName = "Input";
