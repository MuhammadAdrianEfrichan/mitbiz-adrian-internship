import React from "react";
import Button from "../../../ui/Button";

const ProductCard = ({ image, title, sku, price, discount = "-", available = true, onClick }) => {
  const numericPrice = Number(price) || 0;
  const numericDiscount = Number(discount);
  const hasDiscount = Number.isFinite(numericDiscount) && numericDiscount > 0 && numericDiscount <= 100;
  const finalPrice = hasDiscount
    ? numericPrice - (numericPrice * numericDiscount) / 100
    : numericPrice;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-44 object-cover" />
        {available && (
          <div className="absolute left-3 top-3 bg-white rounded-full px-3 py-1 flex items-center gap-2 shadow">
            <span className="w-3 h-3 bg-green-400 rounded-full block"></span>
            <span className="text-sm text-gray-700 font-medium">Available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        <div className="text-sm text-gray-400 mt-1">{sku}</div>
        <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {hasDiscount && (
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs text-slate-400 line-through">
                Rp {numericPrice.toLocaleString("id-ID")}
              </span>
              <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                -{numericDiscount}%
              </span>
            </div>
          )}
          <div className="text-lg font-semibold text-blue-600">
            Rp {finalPrice.toLocaleString("id-ID")}
          </div>
        </div>
        <Button onClick={onClick} className="shrink-0 rounded-2xl border border-blue-300 bg-blue-500 px-2 py-2 text-white cursor-pointer hover:border-blue-400 hover:bg-blue-400">Add To Cart</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
