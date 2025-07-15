import React from "react";
import { cn } from "../../lib/utils";


interface CategoryBadgeProps {
  category: string;
  variant?: "default" | "exclusive";
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, variant = "default", className }: CategoryBadgeProps) => {
  const baseClasses = "px-2 py-1 text-xs font-semibold uppercase tracking-wide rounded";
  
  const variantClasses = {
    default: "bg-red-500 text-white",
    exclusive: "bg-red-600 text-white"
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant], className)}>
      {variant === "exclusive" && "EXCLUSIVE "}
      {category}
    </span>
  );
};

export default CategoryBadge;