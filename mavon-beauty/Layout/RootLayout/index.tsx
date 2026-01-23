// layout/index.tsx
"use client"
import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Auth səhifələrini yoxla
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <>
      {!isAuthPage && <Header />}
      <main className={!isAuthPage ? "pt-16" : ""}>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}