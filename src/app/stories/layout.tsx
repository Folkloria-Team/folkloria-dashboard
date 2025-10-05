"use client";
import { useEffect } from "react";

export default function StoriesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    }
  }, []);
  return <div>{children}</div>;
}
