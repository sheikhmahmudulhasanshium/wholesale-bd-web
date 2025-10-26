"use client";

import { PricingTier } from "@/lib/types";
import React from "react";

export default function Body() {
  // Local Product type definition
  type Product = {
    _id: string;
    name: string;
    description: string;
    images: string[];
    categoryId: {
      _id: string;
      name: string;
      description: string;
    };
    zoneId: {
      _id: string;
      name: string;
      code: string;
      description: string;
      isActive: boolean;
      sortingOrder: number;
    };
    sellerId: {
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
      businessName: string;
    };
    pricingTiers: PricingTier[];
  };

  // Mock product data
  const mockProduct: Product = {
    _id: "1",
    name: "Elegant Cotton T-Shirt",
    description: "Present your products with the quality they deserve.",
    images: [],
    categoryId: {
      _id: "68e3af17bd6fde6e554feb07",
      name: "Clothing & Fashion",
      description: "Apparel, shoes, accessories for men, women, and children",
    },
    zoneId: {
      _id: "68e3af17bd6fde6e554feb00",
      name: "Dhaka",
      code: "DHA",
      description: "Capital city and largest commercial hub of Bangladesh",
      isActive: true,
      sortingOrder: 1,
    },
    sellerId: {
      _id: "someSellerId1",
      email: "seller1@example.com",
      firstName: "Test",
      lastName: "Seller",
      businessName: "Test Business",
    },
    pricingTiers: [],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">{mockProduct.name}</h1>
      <p className="text-gray-600 mb-4">{mockProduct.description}</p>
      <div className="space-y-2">
        <p>
          <strong>Category:</strong> {mockProduct.categoryId.name}
        </p>
        <p>
          <strong>Zone:</strong> {mockProduct.zoneId.name}
        </p>
        <p>
          <strong>Seller:</strong> {mockProduct.sellerId.businessName}
        </p>
      </div>
      {mockProduct.images.length === 0 ? (
        <p className="mt-4 text-gray-500 italic">No images available</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {mockProduct.images.map((img, i) => (
            <img key={i} src={img} alt={mockProduct.name} className="rounded-md" />
          ))}
        </div>
      )}
    </div>
  );
}
