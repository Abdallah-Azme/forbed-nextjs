"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
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
import { cn } from "@/lib/utils";
import AdBar from "./ad-bar";
import Logo from "./logo";
import CartIcon from "../carts/components/cart-icon";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrolled = latest > 50;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  });

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
    <header className="bg-white sticky top-0 z-50">
      {/* Announcement Bar */}
      <motion.div
        animate={{
          height: isScrolled ? 0 : "auto",
          opacity: isScrolled ? 0 : 1,
        }}
        initial={{ height: "auto", opacity: 1 }}
        className="overflow-hidden"
      >
        <AdBar />
      </motion.div>
      {/* Main Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-white"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* --- Mobile Menu Button --- */}
            <button
              className="lg:hidden text-gray-700 cursor-pointer transition-transform duration-300 hover:scale-110"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="size-11" />
            </button>

            {/* --- Logo --- */}
            <Logo
              className={cn(
                "shrink-0 transition-all duration-300",
                isScrolled ? "size-[75px]" : "size-[100px]"
              )}
            />

            {/* --- Desktop Navigation --- */}
            <nav className="hidden lg:flex items-center gap-3 text-gray-700">
              {navLinks.map((link, index) =>
                link.items ? (
                  <DropdownMenu key={index}>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1  hover:underline cursor-pointer transition-colors">
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
                          className="hover:underline cursor-pointer"
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
                    className=" hover:underline cursor-pointer transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* --- Header Icons --- */}
            <div className="flex items-center gap-3">
              <button className="text-[#848484] hover:underline cursor-pointer">
                <Search className="size-6" />
              </button>
              <button className="text-[#848484] hover:underline  cursor-pointer">
                <User className="size-6" />
              </button>
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
                    <summary className="cursor-pointer  text-gray-700 hover:underline flex justify-between items-center">
                      {link.label}
                      <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-2 ps-4 space-y-1 text-sm">
                      {link.items.map((item, idx) => (
                        <p
                          key={idx}
                          className="text-gray-600 hover:underline cursor-pointer"
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
                    className=" text-gray-700 hover:underline block"
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
