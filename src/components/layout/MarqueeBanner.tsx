"use client";

import { useEffect, useState } from "react";
import { Tag } from "lucide-react";

export function MarqueeBanner() {
  const [offer, setOffer] = useState<{ isCouponLive: boolean; marqueeText: string } | null>(null);

  useEffect(() => {
    fetch("/api/rooms/offer")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.isCouponLive) {
          setOffer(data);
        }
      })
      .catch(console.error);
  }, []);

  if (!offer) return null;

  return (
    <div className="bg-gold text-brown text-[11px] font-bold tracking-widest uppercase overflow-hidden whitespace-nowrap py-2 border-b border-brown/10 relative z-50">
      <div className="animate-marquee inline-block">
        <span className="inline-flex items-center mx-8 gap-2">
          <Tag className="w-3 h-3" strokeWidth={2.5} />
          {offer.marqueeText}
        </span>
        <span className="inline-flex items-center mx-8 gap-2">
          <Tag className="w-3 h-3" strokeWidth={2.5} />
          {offer.marqueeText}
        </span>
        <span className="inline-flex items-center mx-8 gap-2">
          <Tag className="w-3 h-3" strokeWidth={2.5} />
          {offer.marqueeText}
        </span>
        <span className="inline-flex items-center mx-8 gap-2">
          <Tag className="w-3 h-3" strokeWidth={2.5} />
          {offer.marqueeText}
        </span>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
