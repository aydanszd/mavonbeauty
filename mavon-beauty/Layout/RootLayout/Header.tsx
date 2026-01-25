"use client";

import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  LogOut,
  Package,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  getCurrentUser,
  isAuthenticated,
  logoutUser,
} from "@/service/authService";

export default function Navbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication status on mount
    setAuthenticated(isAuthenticated());
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/api/v1/auth/user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  useEffect(() => {
    const checkAndStoreTokens = () => {
      // Check URL for GitHub tokens
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("accessToken");
      const refreshToken = urlParams.get("refreshToken");
      const userStr = urlParams.get("user");
      const source = urlParams.get("source");

      if (accessToken && refreshToken && userStr && source === "github") {
        try {
          const userData = JSON.parse(decodeURIComponent(userStr));

          // Save to storage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("user", JSON.stringify(userData));

          sessionStorage.setItem("accessToken", accessToken);
          sessionStorage.setItem("refreshToken", refreshToken);
          sessionStorage.setItem("user", JSON.stringify(userData));

          setUser(userData);
          setAuthenticated(true);

          // Clean URL without reload
          window.history.replaceState({}, "", "/");

          console.log("GitHub login successful with tokens!");
        } catch (error) {
          console.error("Error processing GitHub tokens:", error);
        }
      } else {
        // Load existing user from storage
        const existingUserStr =
          localStorage.getItem("user") || sessionStorage.getItem("user");
        const existingAccessToken =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");

        if (existingUserStr && existingAccessToken) {
          try {
            const userData = JSON.parse(existingUserStr);
            setUser(userData);
            setAuthenticated(true);
          } catch (error) {
            console.error("Error loading user:", error);
          }
        }
      }
    };

    checkAndStoreTokens();
  }, []);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setAuthenticated(false);
    setUser(null);
    setIsUserMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"
      style={{ fontFamily: '"Montserrat", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-19">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/">
              <img
                src="https://mavon-beauty.myshopify.com/cdn/shop/files/mavon_140x.png?v=1691552606"
                alt="mavon"
                className="h-6"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-black hover:text-gray-600 font-semibold"
            >
              Home
            </Link>
            <div className="relative group">
              <Link
                href="/shop"
                className="text-black flex justify-center items-center hover:text-gray-600 font-semibold"
              >
                Shop
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <Link
              href="/blog"
              className="text-black hover:text-gray-600 font-semibold"
            >
              Blog
            </Link>
            <Link
              href="/about-us"
              className="text-black hover:text-gray-600 font-semibold"
            >
              About Us
            </Link>
            <div className="relative group">
              <Link
                href="/faq"
                className="text-black flex justify-center items-center hover:text-gray-600 font-semibold"
              >
                Faq
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="relative group">
              <Link
                href="/contact-us"
                className="text-black flex justify-center items-center hover:text-gray-600 font-semibold"
              >
                Contact Us
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center">
            {/* Search */}
            <button className="text-black hover:text-gray-900 px-4">
              <Search className="h-5.5 w-5.5" />
            </button>

            <div className="h-6 w-px bg-black"></div>

            {/* Shopping Cart */}
            <button className="relative text-black hover:text-gray-900 px-4">
              <ShoppingCart className="h-5.5 w-5.5" />
              <span className="absolute bottom-3 right-2 bg-[#0AA360] text-white text-xs rounded-full h-4.5 w-4.5 flex items-center justify-center">
                0
              </span>
            </button>

            <div className="h-6 w-px bg-black"></div>

            {/* User Menu */}
            <div className="relative pl-4" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-black hover:text-gray-900 flex items-center gap-1"
              >
                <User className="h-5.5 w-5.5" />
                {authenticated && user && (
                  <span className="hidden lg:block text-sm font-medium ml-1">
                    {user.name?.split(" ")[0]}
                  </span>
                )}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                  {authenticated && user ? (
                    <>
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserCircle className="h-4 w-4" />
                        My Profile
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Guest Menu */}
                      <Link
                        href="/login"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Login
                      </Link>

                      <Link
                        href="/register"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserCircle className="h-4 w-4" />
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
