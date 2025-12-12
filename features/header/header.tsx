"use client";

import ImageFallback from "@/components/image-fallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { useLogout } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { accountService } from "@/services/account.service";
import { categoryService } from "@/services/category.service";
import { blogService, homeService } from "@/services/content.service";
import { settingsService } from "@/services/settings.service";
import { useQuery } from "@tanstack/react-query";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Languages,
  LogOut,
  Menu,
  MoveRight,
  Search,
  User,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CartIcon from "../carts/components/cart-icon";
import AdBar from "./ad-bar";
import Logo from "./logo";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { mutate: logout } = useLogout();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Header");

  const toggleLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";

    // Update cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;

    // Update localStorage to sync with Accept-Language header
    localStorage.setItem("locale", newLocale);

    // Reload to apply language changes
    window.location.reload();
  };

  // Fetch user account data (synced with profile updates)
  const { data: user } = useQuery({
    queryKey: ["user-account"],
    queryFn: accountService.getAccount,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });

  // Fetch settings
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsService.getSettings(),
  });

  // Fetch blogs for dropdown
  const { data: blogs = [] } = useQuery({
    queryKey: ["blogs-dropdown"],
    queryFn: () => blogService.getBlogsForDropdown(),
  });

  // Fetch social media links
  const { data: socials = [] } = useQuery({
    queryKey: ["socials"],
    queryFn: homeService.getSocials,
  });

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
    { label: t("home"), href: "/" },
    // Only show orders link if user is logged in
    ...(user ? [{ label: t("orders"), href: "/orders" }] : []),
    ...(categories.length > 0
      ? [
          {
            label: t("categories"),
            href: "/categories",
            items: categories,
          },
        ]
      : []),
    { label: t("contact"), href: "/contact" },
    ...(blogs.length > 0
      ? [
          {
            label: t("learnMore"),
            href: "/blogs",
            items: blogs,
          },
        ]
      : []),
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
        className="overflow-hidden  "
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-none focus:outline-none focus:border-gray-900 text-lg  "
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      window.location.href = `/search?keyword=${target.value}`;
                      setIsSearchOpen(false);
                    }
                  }
                }}
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
          className="w-full sm:w-[400px] p-0 flex flex-col  "
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
              className="absolute inset-0 overflow-y-auto py-6"
            >
              <nav className="space-y-4" dir="ltr">
                {navLinks.map((link, index) => {
                  const isActive =
                    link.href &&
                    (link.href === "/"
                      ? pathname === "/"
                      : pathname?.startsWith(link.href));

                  return link.items ? (
                    <button
                      key={index}
                      onClick={() => handleSubmenuClick(link.label)}
                      className={cn(
                        "w-full flex items-center font-bold text-xl justify-between text-left text-gray-700 hover:text-gray-900 py-3 px-6 rounded-none transition-all",
                        isActive ? "bg-[#f6f6f6] " : " "
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <MoveRight className="w-5 h-5" />
                        <span>{link.label}</span>
                      </div>
                    </button>
                  ) : (
                    <Link
                      key={index}
                      href={link.href ?? "#"}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "block text-left text-gray-700 hover:text-gray-900 py-3 px-6 rounded-none transition-all",
                        isActive
                          ? "bg-[#f6f6f6] font-bold text-xl"
                          : "text-lg font-medium"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
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
                    <span>{t("back")}</span>
                  </button>
                  <h3 className="text-xl font-semibold mb-4">
                    {activeSubmenu}
                  </h3>
                  <nav className="space-y-3" dir="ltr">
                    {navLinks
                      .find((link) => link.label === activeSubmenu)
                      ?.items?.map((item: any, idx) => (
                        <div key={idx}>
                          <Link
                            href={
                              typeof item === "string"
                                ? "#"
                                : item.name
                                ? `/categories/${item.slug}`
                                : `/blogs/${item.slug}`
                            }
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-gray-600 hover:text-gray-900 py-2 font-medium"
                          >
                            {typeof item === "string"
                              ? item
                              : item.name || item.title}
                          </Link>
                          {/* Subcategories in mobile menu */}
                          {item.subcategories &&
                            item.subcategories.length > 0 && (
                              <div className="ms-4 space-y-2 border-s ps-4 mt-1">
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
            <div className="flex gap-4" dir="ltr">
              {socials.map((social) => (
                <Link
                  key={social.id}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900"
                  aria-label={social.title}
                >
                  <ImageFallback
                    src={social.icon}
                    alt={social.title}
                    width={24}
                    height={24}
                    className="size-6 object-contain"
                  />
                </Link>
              ))}
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
                onClick={toggleLanguage}
                className="text-[#848484] hover:underline cursor-pointer flex items-center gap-1"
                title={
                  locale === "ar" ? t("switchToEnglish") : t("switchToArabic")
                }
              >
                <Languages className="size-6" />
                <span className="text-xs font-medium uppercase">
                  {locale === "ar" ? "EN" : "AR"}
                </span>
              </button>

              <CartIcon />

              {/* User Avatar or Sign In */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="relative size-8 rounded-full overflow-hidden bg-gray-200">
                        {user.image ? (
                          <ImageFallback
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
                            <ImageFallback
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
                            {user.full_name ||
                              user.email ||
                              user.phone_complete_form}
                          </p>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="cursor-pointer flex-row-reverse"
                      >
                        <User className="size-4 ms-2" />
                        {t("profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600 flex-row-reverse"
                    >
                      <LogOut className="size-4 ms-2" />
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/signin"
                  className="text-[#848484] hover:underline cursor-pointer"
                >
                  {/* <User className="size-6" /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                    className="icon icon-account size-6 "
                    fill="none"
                    viewBox="0 0 18 19"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 4.5a3 3 0 116 0 3 3 0 01-6 0zm3-4a4 4 0 100 8 4 4 0 000-8zm5.58 12.15c1.12.82 1.83 2.24 1.91 4.85H1.51c.08-2.6.79-4.03 1.9-4.85C4.66 11.75 6.5 11.5 9 11.5s4.35.26 5.58 1.15zM9 10.5c-2.5 0-4.65.24-6.17 1.35C1.27 12.98.5 14.93.5 18v.5h17V18c0-3.07-.77-5.02-2.33-6.15-1.52-1.1-3.67-1.35-6.17-1.35z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </Link>
              )}

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-[#848484] hover:underline cursor-pointer"
              >
                <Search className="size-6" />
              </button>
            </div>

            <Logo
              logoUrl={settings?.logo}
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
                      {link.href ? (
                        <Link
                          href={link.href}
                          className="flex items-center gap-1 hover:underline cursor-pointer transition-colors"
                        >
                          {link.label}
                          <ChevronDown className="w-4 h-4" />
                        </Link>
                      ) : (
                        <button className="flex items-center gap-1  hover:underline cursor-pointer transition-colors">
                          {link.label}
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white border shadow-md min-w-[200px]"
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
                                  : item.name
                                  ? `/categories/${item.slug}`
                                  : `/blogs/${item.slug}`
                              }
                              className="flex items-center justify-between w-full"
                            >
                              {typeof item === "string"
                                ? item
                                : item.name || item.title}
                              {item.subcategories &&
                                item.subcategories.length > 0 && (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                            </Link>
                          </DropdownMenuItem>

                          {/* Nested Dropdown for Subcategories */}
                          {item.subcategories &&
                            item.subcategories.length > 0 && (
                              <div className="absolute left-full top-0 hidden group-hover/item:block min-w-[200px] bg-white border shadow-md rounded-md p-1 ms-1">
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
              logoUrl={settings?.logo}
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
