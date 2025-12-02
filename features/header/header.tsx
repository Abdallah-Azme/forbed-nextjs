"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  Menu,
  MoveRight,
  Search,
  User,
  X,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import CartIcon from "../carts/components/cart-icon";
import AdBar from "./ad-bar";
import Logo from "./logo";
import { userManager } from "@/lib/utils/auth";
import { useLogout } from "@/hooks/use-auth";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { mutate: logout } = useLogout();

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });

  useEffect(() => {
    // Get user data on mount
    const userData = userManager.getUser();
    setUser(userData);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrolled = latest > 50;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  });

  const handleLogout = () => {
    logout({});
  };

  const navLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Orders", href: "/orders" },
    ...(categories.length > 0
      ? [
          {
            label: "Categories",
            items: categories,
          },
        ]
      : []),
    { label: "تواصل معنا", href: "/contact" },
  ];

  const handleSubmenuClick = (label: string) => {
    setActiveSubmenu(label);
  };

  const handleBackClick = () => {
    setActiveSubmenu(null);
  };

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Search Overlay */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isSearchOpen ? "auto" : 0,
          opacity: isSearchOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden bg-white border-b"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-none focus:outline-none focus:border-gray-900 text-lg"
                autoFocus
              />
              <button className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              <X className="size-6" />
            </button>
          </div>
        </div>
      </motion.div>

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
      {/* --- Mobile Side Sheet Menu --- */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent
          side="left"
          className="w-full sm:w-[400px] p-0 flex flex-col"
        >
          <SheetHeader className="border-b p-4 sr-only">
            <div className="flex items-center justify-between">
              <Logo className="size-16" />
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-hidden relative">
            {/* Main Menu */}
            <motion.div
              animate={{
                x: activeSubmenu ? "-100%" : "0%",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 overflow-y-auto p-6"
            >
              <nav className="space-y-4">
                {navLinks.map((link, index) =>
                  link.items ? (
                    <button
                      key={index}
                      onClick={() => handleSubmenuClick(link.label)}
                      className="w-full flex items-center justify-between text-gray-700 hover:text-gray-900 text-lg py-2"
                    >
                      <MoveRight className="w-5 h-5" />
                      <span>{link.label}</span>
                    </button>
                  ) : (
                    <Link
                      key={index}
                      href={link.href ?? "#"}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-end text-gray-700 hover:text-gray-900 text-lg py-2"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>
            </motion.div>

            {/* Submenu */}
            <motion.div
              animate={{
                x: activeSubmenu ? "0%" : "100%",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 bg-white overflow-y-auto p-6"
            >
              {activeSubmenu && (
                <>
                  <button
                    onClick={handleBackClick}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>رجوع</span>
                  </button>
                  <h3 className="text-xl font-semibold mb-4">
                    {activeSubmenu}
                  </h3>
                  <nav className="space-y-3">
                    {navLinks
                      .find((link) => link.label === activeSubmenu)
                      ?.items?.map((item: any, idx) => (
                        <div key={idx}>
                          <Link
                            href={
                              typeof item === "string"
                                ? "#"
                                : `/categories/${item.slug}`
                            }
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-gray-600 hover:text-gray-900 py-2 font-medium"
                          >
                            {typeof item === "string" ? item : item.name}
                          </Link>
                          {/* Subcategories in mobile menu */}
                          {item.subcategories &&
                            item.subcategories.length > 0 && (
                              <div className="mr-4 space-y-2 border-r pr-4 mt-1">
                                {item.subcategories.map(
                                  (sub: any, subIdx: number) => (
                                    <Link
                                      key={subIdx}
                                      href={`/categories/${sub.slug}`}
                                      onClick={() => setIsMenuOpen(false)}
                                      className="block text-sm text-gray-500 hover:text-gray-900 py-1"
                                    >
                                      {sub.name}
                                    </Link>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      ))}
                  </nav>
                </>
              )}
            </motion.div>
          </div>

          {/* Footer with social icons */}
          <div className="border-t p-6">
            <div className="flex gap-4">
              <button className="text-gray-700 hover:text-gray-900">
                <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button className="text-gray-700 hover:text-gray-900">
                <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-white"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* --- Header Icons --- */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-[#848484] hover:underline cursor-pointer"
              >
                <Search className="size-6" />
              </button>

              {/* User Avatar or Sign In */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="relative size-8 rounded-full overflow-hidden bg-gray-200">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.full_name || "User"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center size-full bg-gray-300">
                            <User className="size-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <ChevronDown className="size-4 text-gray-600" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 rounded-full overflow-hidden bg-gray-200">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.full_name || "User"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center size-full bg-gray-300">
                              <User className="size-5 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.email || user.phone_complete_form}
                          </p>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="size-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="size-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="size-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/signin"
                  className="text-[#848484] hover:underline cursor-pointer"
                >
                  <User className="size-6" />
                </Link>
              )}

              <CartIcon />
            </div>

            <Logo
              className={cn(
                "shrink-0 transition-all duration-300 block lg:hidden ",
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
                      className="text-right bg-white border shadow-md min-w-[200px]"
                    >
                      {link.items.map((item: any, idx) => (
                        <div key={idx} className="relative group/item">
                          <DropdownMenuItem
                            className="hover:underline cursor-pointer justify-between w-full"
                            asChild
                          >
                            <Link
                              href={
                                typeof item === "string"
                                  ? "#"
                                  : `/categories/${item.slug}`
                              }
                              className="flex items-center justify-between w-full"
                            >
                              {typeof item === "string" ? item : item.name}
                              {item.subcategories &&
                                item.subcategories.length > 0 && (
                                  <ChevronLeft className="w-4 h-4" />
                                )}
                            </Link>
                          </DropdownMenuItem>

                          {/* Nested Dropdown for Subcategories */}
                          {item.subcategories &&
                            item.subcategories.length > 0 && (
                              <div className="absolute right-full top-0 hidden group-hover/item:block min-w-[200px] bg-white border shadow-md rounded-md p-1 mr-1">
                                {item.subcategories.map(
                                  (sub: any, subIdx: number) => (
                                    <Link
                                      key={subIdx}
                                      href={`/categories/${sub.slug}`}
                                      className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
                                    >
                                      {sub.name}
                                    </Link>
                                  )
                                )}
                              </div>
                            )}
                        </div>
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

            {/* --- Logo --- */}
            <Logo
              className={cn(
                "shrink-0 transition-all duration-300 hidden lg:block ",
                isScrolled ? "size-[75px]" : "size-[100px]"
              )}
            />

            <button
              className="lg:hidden text-gray-700 cursor-pointer transition-transform duration-300 hover:scale-110"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="size-11" />
            </button>
          </div>
        </div>
      </motion.header>
    </header>
  );
}
