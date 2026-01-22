"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Columns2,
  Columns3,
  Square,
} from "lucide-react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

export default function ShopMain() {
  const [layout, setLayout] = useState(3); // 1, 2, or 3 columns
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [openSections, setOpenSections] = useState({
    availability: true,
    price: true,
    color: false,
    brand: true,
    weight: false,
  });

  const products = [
    {
      id: 1,
      name: "Benefit Cosmetics Hoola Matte Bronzer",
      price: 500,
      image:
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600",
      colors: ["#F4C2A8", "#F8B4AA", "#2C4A52"],
    },
    {
      id: 2,
      name: "Cetaphil Gentle Skin Cleanser",
      price: 280,
      rating: 5,
      reviews: 1,
      image: "https://images.unsplash.com/photo-1556228578-dd3f6e90bc1a?w=600",
      colors: ["#F4C2A8", "#F8B4AA", "#B8E6D5"],
      moreColors: 3,
    },
    {
      id: 3,
      name: "Gentle Micellar Water",
      price: 200,
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
      colors: ["#F4C2A8", "#B8E6D5", "#4DB8AC"],
      moreColors: 2,
    },
    {
      id: 4,
      name: "Organcy Baby Lotion",
      price: 350,
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
      colors: ["#E8E8E8", "#FFE5E5"],
    },
    {
      id: 5,
      name: "Organcy Rebel Butter Serum",
      price: 420,
      image: "https://images.unsplash.com/photo-1556229010-aa1e86d66414?w=600",
      colors: ["#8B7355", "#D4A574"],
    },
    {
      id: 6,
      name: "Organcy Cosmetic Foundation",
      price: 380,
      image:
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600",
      colors: ["#FFF5E6", "#F4C2A8"],
    },
  ];

  const toggleSection = (section: any) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (e: any, index: any) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
  };

  const getGridClass = () => {
    if (layout === 1) return "grid-cols-1";
    if (layout === 2) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="py-8">
      {/* Header with Layout Switcher and Sort */}
      <div className="bg-white rounded-lg py-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-3">
          <button
            onClick={() => setLayout(1)}
            className={`pr-2 hover:bg-gray-100 rounded transition-colors ${layout === 1 ? "text-green-600" : "text-gray-400"}`}
          >
            <Square />
          </button>
          <button
            onClick={() => setLayout(2)}
            className={`p-2 hover:bg-gray-100 rounded transition-colors ${layout === 2 ? "text-green-600" : "text-gray-400"}`}
          >
            <Columns2 />
          </button>
          <button
            onClick={() => setLayout(3)}
            className={`p-2 hover:bg-gray-100 rounded transition-colors ${layout === 3 ? "text-green-600" : "text-gray-400"}`}
          >
            <Columns3 />
          </button>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <span className="text-sm font-medium">Sort by:</span>
          <select className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
            <option>Alphabetically, A-Z</option>
            <option>Alphabetically, Z-A</option>
            <option>Price, low to high</option>
            <option>Price, high to low</option>
            <option>Date, old to new</option>
            <option>Date, new to old</option>
          </select>
          <span className="text-sm font-medium whitespace-nowrap">
            20 products
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg py-6 pr-4 sticky top-4">
            <h3 className="text-lg font-bold mb-6">Filter:</h3>

            {/* Availability Filter */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <button
                onClick={() => toggleSection("availability")}
                className="flex justify-between items-center w-full text-left font-semibold mb-4"
              >
                <span>Availability</span>
                {openSections.availability ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.availability && (
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">In stock</span>
                    </div>
                    <span className="text-sm text-gray-500">(20)</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-400">
                        Out of stock
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">(0)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <button
                onClick={() => toggleSection("price")}
                className="flex justify-between items-center w-full text-left font-semibold mb-4"
              >
                <span>Price</span>
                {openSections.price ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.price && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    The highest price is $1,500.00
                  </p>
                  <div className="relative pt-2">
                    <RangeSlider
                      defaultValue={[0, 1500]}
                      value={[priceRange[0], priceRange[1]]}
                      onInput={(value) => setPriceRange(value)}
                      min={0}
                      max={1500}
                      step={10}
                    />
                  </div>
                  <div className="pt-4">
                    <p className="text-sm font-medium">
                      Price: ${priceRange[0]} - ${priceRange[1]}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Color Filter */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <button
                onClick={() => toggleSection("color")}
                className="flex justify-between items-center w-full text-left font-semibold mb-4"
              >
                <span>Color</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Brand Filter */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <button
                onClick={() => toggleSection("brand")}
                className="flex justify-between items-center w-full text-left font-semibold mb-4"
              >
                <span>Brand</span>
                {openSections.brand ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.brand && (
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">Beauty</span>
                    </div>
                    <span className="text-sm text-gray-500">(14)</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">Mavon</span>
                    </div>
                    <span className="text-sm text-gray-500">(1)</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">Mavon Beauty</span>
                    </div>
                    <span className="text-sm text-gray-500">(5)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Weight Filter */}
            <div className="pb-2">
              <button
                onClick={() => toggleSection("weight")}
                className="flex justify-between items-center w-full text-left font-semibold"
              >
                <span>Weight</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className={`grid ${getGridClass()} gap-6`}>
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden group"
              >
                <div className="relative bg-pink-50 aspect-square overflow-hidden rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute bottom-4 right-4 bg-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-50">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold mb-3">
                    From ${product.price.toFixed(2)}
                  </p>
                  {product.rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-gray-900">
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.reviews})
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {product.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full border-2 border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    {product.moreColors && (
                      <span className="text-sm text-gray-600">
                        +{product.moreColors}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
