"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push("/admin/dashboard");
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-brown text-ivory">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold border-r-2 mx-auto mb-4"></div>
        <span className="eyebrow text-gold text-xs tracking-widest">LOADING ADMIN SESSION...</span>
      </div>
    </div>
  );
}
