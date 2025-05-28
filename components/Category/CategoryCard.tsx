import React from "react";
import Image from "next/image";
import Link from "next/link";
import { sendHapticFeedbackCommand } from "@/utils/animation";

interface CategoryCardProps {
  title: string;
  icon: string;
  href: string;
}

function CategoryCard({ title, icon, href }: CategoryCardProps) {
  return (
    <Link
      className="relative flex justify-between items-center rounded-2xl p-1 h-24 overflow-hidden bg-category-noise bg-no-repeat bg-cover active:scale-95 transition-none active:transition-transform active:duration-100"
      href={href}
      onClick={() => sendHapticFeedbackCommand()}
    >
      <h3 className="absolute text-white font-sora text-sm font-semibold z-10 px-1 leading-10">
        {title}
      </h3>
      <div className="absolute right-0 my-auto">
        <Image
          src={icon || "/placeholder.svg"}
          alt=""
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
    </Link>
  );
}

export default React.memo(CategoryCard, (prev, next) => {
  return (
    prev.title === next.title &&
    prev.icon === next.icon &&
    prev.href === next.href
  );
});
