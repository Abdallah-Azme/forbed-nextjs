"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Search, User, ShoppingBag, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdBar from "./ad-bar";
import Logo from "./logo";
import CartIcon from "../carts/components/cart-icon";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "الشتوي", href: "/winter" },
    {
      label: "مجموعة المراتب",
      items: ["مراتب فوربد", "مراتب طبية", "مراتب سوست"],
    },
    {
      label: "اعرف أكثر",
      items: [
        "مقدمة عن أفضل أنواع المراتب في مصر",
        "إيه بتقدمه فوربد؟",
        "ماهي المراتب الطبية؟",
        "تعرف إيه عن مراتب فوربد الطبية؟",
        "إيه الفرق بين السوست المنفصلة والمتصلة؟",
      ],
    },
    { label: "تواصل معنا", href: "/contact" },
  ];
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Announcement Bar */}
      <AdBar />
      {/* Main Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        dir="rtl"
        className="border-b bg-white"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* --- Mobile Menu Button --- */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>

            {/* --- Logo --- */}
            <Logo />

            {/* --- Desktop Navigation --- */}
            <nav className="hidden lg:flex items-center gap-3 text-gray-700">
              {navLinks.map((link, index) =>
                link.items ? (
                  <DropdownMenu key={index}>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 font-medium hover:text-orange-500 transition-colors">
                        {link.label}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="text-right bg-white border shadow-md"
                    >
                      {link.items.map((item, idx) => (
                        <DropdownMenuItem
                          key={idx}
                          className="hover:bg-orange-50 cursor-pointer"
                        >
                          {item}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={index}
                    href={link.href ?? "#"}
                    className="font-medium hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* --- Header Icons --- */}
            <div className="flex items-center space-x-reverse space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:text-orange-500"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:text-orange-500"
              >
                <User className="w-5 h-5" />
              </Button>
              <CartIcon />
            </div>
          </div>

          {/* --- Mobile Menu --- */}
          {isMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 border-t pt-3 space-y-3"
            >
              {navLinks.map((link, index) =>
                link.items ? (
                  <details key={index} className="group">
                    <summary className="cursor-pointer font-medium text-gray-700 hover:text-orange-500 flex justify-between items-center">
                      {link.label}
                      <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-2 ps-4 space-y-1 text-sm">
                      {link.items.map((item, idx) => (
                        <p
                          key={idx}
                          className="text-gray-600 hover:text-orange-500 cursor-pointer"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    key={index}
                    href={link.href ?? "#"}
                    className="font-medium text-gray-700 hover:text-orange-500 block"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </motion.nav>
          )}
        </div>
      </motion.header>
    </header>
  );
}
