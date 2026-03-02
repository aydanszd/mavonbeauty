"use client";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// ─── Static product data ─────────────────────────────────────────────────────
const STATIC_PRODUCTS = [
  {
    id: "1",
    name: "Classic Leather Sneaker",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1679623100266-db82be84f5f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1ha2V1cCUyMHByb2R1Y3RzfGVufDB8fDB8fHww",
    colors: ["#1a1a1a", "#ffffff", "#c8a882"],
    badge: undefined,
    rating: 4.8,
    reviews: 312,
    showWishlist: true,
  },
  {
    id: "2",
    name: "Urban Runner Pro",
    price: 189.00,
    originalPrice: undefined,
    image: "https://images.unsplash.com/photo-1723150512429-bfa92988d845?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1ha2V1cCUyMHByb2R1Y3RzfGVufDB8fDB8fHww",
    colors: ["#2563eb", "#dc2626", "#000000"],
    badge: "Low Stock",
    rating: 4.6,
    reviews: 87,
    showWishlist: true,
  },
  {
    id: "3",
    name: "Minimalist Canvas",
    price: 89.00,
    originalPrice: 110.00,
    image: "https://plus.unsplash.com/premium_photo-1677526496932-1b4bddeee554?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG1ha2V1cCUyMHByb2R1Y3RzfGVufDB8fDB8fHww",
    colors: ["#f5f5dc", "#808080", "#4a4a4a"],
    badge: undefined,
    rating: 4.9,
    reviews: 204,
    showWishlist: true,
  },
  {
    id: "4",
    name: "Trail Blazer Hiker",
    price: 219.00,
    originalPrice: undefined,
    image: "https://media.istockphoto.com/id/1419645742/photo/anonymous-woman-holding-a-gift-box-and-looking-at-beauty-cosmetics-products-inside.webp?a=1&b=1&s=612x612&w=0&k=20&c=Go43qsMzW5B59J32ctPFjOX0Fj1fS45Tf6o7-XgWDPY=",
    colors: ["#6b4f2e", "#556b2f", "#c0c0c0"],
    badge: undefined,
    rating: 4.7,
    reviews: 158,
    showWishlist: true,
  },
  {
    id: "5",
    name: "Retro Court Shoe",
    price: 145.00,
    originalPrice: 175.00,
    image: "https://media.istockphoto.com/id/906517920/photo/eye-shadow-palette.webp?a=1&b=1&s=612x612&w=0&k=20&c=UjizsRcZ0llXy_8xbkgP0s8W0_fKiX5Da-VL2mKhvus=",
    colors: ["#ffffff", "#dc2626", "#1a1a1a"],
    badge: undefined,
    rating: 4.5,
    reviews: 93,
    showWishlist: true,
  },
  {
    id: "6",
    name: "Slip-On Luxe",
    price: 99.00,
    originalPrice: undefined,
    image: "https://media.istockphoto.com/id/2155031694/photo/a-set-of-makeup-brushes-and-beauty-products-arranged-on-a-desk-at-the-beauticians-salon.webp?a=1&b=1&s=612x612&w=0&k=20&c=2NtT9UCSdeOsURYhn5Hx5YR0a0wvPFZJOXJYBE9zGEA=",
    colors: ["#2c2c2c", "#d4af37", "#8b4513"],
    badge: "Low Stock",
    rating: 4.4,
    reviews: 61,
    showWishlist: false,
  },
];

// ─── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({
  product,
  onProductClick,
}: {
  product: (typeof STATIC_PRODUCTS)[0];
  onProductClick: () => void;
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const discountPct =
    product.originalPrice
      ? Math.round(100 - (product.price / product.originalPrice) * 100)
      : null;

  return (
    <div
      className="group relative cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      onClick={onProductClick}
    >
      {/* Image wrapper */}
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "4/5" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              background: product.badge === "Low Stock" ? "#fef3c7" : "#fee2e2",
              color: product.badge === "Low Stock" ? "#92400e" : "#991b1b",
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Discount badge */}
        {discountPct && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full bg-gray-900 text-white">
            -{discountPct}%
          </span>
        )}

        {/* Wishlist button */}
        {product.showWishlist && (
          <button
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              setWishlisted((v) => !v);
            }}
          >
            <Heart
              className="w-4 h-4"
              fill={wishlisted ? "#ef4444" : "none"}
              stroke={wishlisted ? "#ef4444" : "#374151"}
            />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{product.name}</p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={i < Math.round(product.rating) ? "#f59e0b" : "#e5e7eb"}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {product.colors.map((hex, i) => (
            <span
              key={i}
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ background: hex }}
            />
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MostPopular() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const trackRef = useRef<HTMLDivElement>(null);

  const totalSlides = Math.max(0, STATIC_PRODUCTS.length - itemsPerView + 1);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1024) setItemsPerView(4);
      else if (w >= 768) setItemsPerView(3);
      else if (w >= 640) setItemsPerView(2);
      else setItemsPerView(1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Clamp activeIndex when viewport changes
  useEffect(() => {
    setActiveIndex((idx) => Math.min(idx, totalSlides - 1));
  }, [totalSlides]);

  const slideTo = (idx: number) => setActiveIndex(Math.max(0, Math.min(idx, totalSlides - 1)));

  // Calculate card width as percentage of the container
  const gapPx = 24;
  const cardWidthPct = 100 / itemsPerView;

  return (
    <section
      className="py-16 px-4 md:px-8 bg-white"
      style={{ fontFamily: '"Montserrat", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">
          Most Popular
        </h2>

        <div className="relative">
          {/* Prev */}
          <button
            onClick={() => slideTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Slider */}
          <div className="px-12 md:px-14 overflow-hidden">
            <div
              ref={trackRef}
              className="flex transition-transform duration-400 ease-in-out"
              style={{
                transform: `translateX(calc(-${activeIndex * cardWidthPct}% - ${activeIndex * gapPx}px))`,
                gap: gapPx,
              }}
            >
              {STATIC_PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0"
                  style={{
                    width: `calc(${cardWidthPct}% - ${gapPx * (itemsPerView - 1) / itemsPerView}px)`,
                  }}
                >
                  <ProductCard
                    product={product}
                    onProductClick={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Next */}
          <button
            onClick={() => slideTo(activeIndex + 1)}
            disabled={activeIndex >= totalSlides - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Dots */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => slideTo(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === activeIndex ? "bg-gray-900 w-8" : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}