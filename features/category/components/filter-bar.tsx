"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function FilterBar({
  count,
  onSortChange,
  onPriceChange,
  maxPrice = 14327,
}: {
  count: number;
  onSortChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  maxPrice?: number;
}) {
  const t = useTranslations("FilterBar");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    setPriceFrom("");
    setPriceTo("");
    onPriceChange("all");
  };

  const handleApply = () => {
    if (priceFrom || priceTo) {
      const from = priceFrom || "0";
      const to = priceTo || maxPrice.toString();
      onPriceChange(`${from}-${to}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 gap-4">
      <div className="flex  items-center gap-6 text-sm text-gray-600 w-full md:w-auto justify-between md:justify-end">
        <span>{t("productsCount", { count })}</span>

        <div className="flex items-center gap-2">
          <Select defaultValue="best-selling" onValueChange={onSortChange}>
            <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto gap-1 text-sm font-normal text-gray-600 hover:text-black focus:ring-0">
              <SelectValue placeholder={t("sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="best-selling">{t("bestSelling")}</SelectItem>
              <SelectItem value="title-asc">{t("alphabeticallyAZ")}</SelectItem>
              <SelectItem value="title-desc">
                {t("alphabeticallyZA")}
              </SelectItem>
              <SelectItem value="price-asc">{t("priceLowToHigh")}</SelectItem>
              <SelectItem value="price-desc">{t("priceHighToLow")}</SelectItem>
              <SelectItem value="created-desc">{t("dateNewToOld")}</SelectItem>
              <SelectItem value="created-asc">{t("dateOldToNew")}</SelectItem>
            </SelectContent>
          </Select>
          <span>{t("sortByLabel")}</span>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button className="text-sm font-normal text-gray-600 hover:text-black">
              {t("price")}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-6 rounded-none" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {t("highestPrice", { price: maxPrice.toLocaleString() })}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-sm text-gray-600 hover:text-black h-auto p-0 hover:bg-transparent"
                >
                  {t("reset")}
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">
                    {t("from")}
                  </label>
                  <Input
                    type="number"
                    placeholder={t("from")}
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    className="h-10 rounded-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">
                    {t("to")}
                  </label>
                  <Input
                    type="number"
                    placeholder={t("to")}
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    className="h-10 rounded-none"
                  />
                </div>
              </div>

              <Button
                onClick={handleApply}
                className="w-full rounded-none"
                disabled={!priceFrom && !priceTo}
              >
                {t("apply")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <span>{t("filterLabel")}</span>
      </div>
    </div>
  );
}
