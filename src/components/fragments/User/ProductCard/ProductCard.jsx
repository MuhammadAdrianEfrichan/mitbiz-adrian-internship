import React from "react";
import Button from "../../../ui/Button";

const ProductCard = ({ image, title, sku, price, available = true, onClick }) => {
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
        <div className="flex mt-3 justify-between">
        <div className=" text-blue-600 font-semibold text-lg">Rp {price}</div>
        <Button onClick={onClick} className="border border-blue-300 text-white px-2 py-2 rounded-2xl bg-blue-500 cursor-pointer hover:bg-blue-400 hover:border-blue-400">Add To Cart</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
