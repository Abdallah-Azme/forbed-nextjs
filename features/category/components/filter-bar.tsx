"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FilterBar({
  count,
  onSortChange,
  onPriceChange,
}: {
  count: number;
  onSortChange: (value: string) => void;
  onPriceChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 gap-4">
      <div className="flex  items-center gap-6 text-sm text-gray-600 w-full md:w-auto justify-between md:justify-end">
        <span>{count} products</span>

        <div className="flex items-center gap-2">
          <Select defaultValue="best-selling" onValueChange={onSortChange}>
            <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto gap-1 text-sm font-normal text-gray-600 hover:text-black focus:ring-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="best-selling">Best selling</SelectItem>
              <SelectItem value="title-asc">Alphabetically, A-Z</SelectItem>
              <SelectItem value="title-desc">Alphabetically, Z-A</SelectItem>
              <SelectItem value="price-asc">Price, low to high</SelectItem>
              <SelectItem value="price-desc">Price, high to low</SelectItem>
              <SelectItem value="created-desc">Date, new to old</SelectItem>
              <SelectItem value="created-asc">Date, old to new</SelectItem>
            </SelectContent>
          </Select>
          <span>:Sort by</span>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <Select onValueChange={onPriceChange}>
          <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto gap-1 text-sm font-normal text-gray-600 hover:text-black focus:ring-0">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-5000">Under LE 5,000.00</SelectItem>
            <SelectItem value="5000-10000">
              LE 5,000.00 - LE 10,000.00
            </SelectItem>
            <SelectItem value="10000-plus">Above LE 10,000.00</SelectItem>
          </SelectContent>
        </Select>

        <span>:Filter</span>
      </div>
    </div>
  );
}
