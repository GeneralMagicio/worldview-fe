import Image from "next/image";

interface CategoryCardProps {
  title: string;
  icon: string;
}

export default function CategoryCard({ title, icon }: CategoryCardProps) {
  return (
    <div className="relative flex justify-between items-center rounded-2xl p-1 h-24 overflow-hidden bg-category-noise bg-no-repeat bg-cover">
      <h3 className="absolute text-white font-sora text-sm font-semibold z-10 px-1 leading-10">{title}</h3>
      <div className="absolute right-0 my-auto">
        <Image
          src={icon || "/placeholder.svg"}
          alt=""
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
    </div>
  );
}
