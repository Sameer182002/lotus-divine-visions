import { BrandLogo } from "@/components/BrandLogo";
import {
  BRAND,
  FOOTER_COLS,
  FOOTER_NEWSLETTER,
  FOOTER_SOCIAL,
} from "@/data/siteContent";

export function Footer() {
  return (
    <footer className="bg-brown text-ivory/60 py-16 lg:py-20 px-5 sm:px-8 lg:px-20 border-t border-gold/10">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12 max-w-7xl mx-auto">
        <div className="sm:col-span-2 md:col-span-1">
          <BrandLogo tone="ivory" align="left" />
          <p className="text-xs mt-5 lg:mt-6 leading-relaxed max-w-xs">
            {BRAND.description}
          </p>
        </div>
        {FOOTER_COLS.map((col) => (
          <FooterCol key={col.title} title={col.title} links={col.links as readonly string[]} />
        ))}
        <div>
          <h4 className="eyebrow text-gold mb-4 lg:mb-5">{FOOTER_NEWSLETTER.heading}</h4>
          <p className="text-xs mb-4">{FOOTER_NEWSLETTER.blurb}</p>
          <div className="flex items-center border-b border-gold/30 py-2">
            <input
              type="email"
              placeholder={FOOTER_NEWSLETTER.placeholder}
              className="bg-transparent flex-1 text-xs text-ivory placeholder:text-ivory/40 outline-none"
            />
            <button className="text-gold text-lg">→</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 lg:mt-16 pt-8 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="eyebrow text-ivory/40 text-[10px] lg:text-[11px] text-center">
          {BRAND.copyright}
        </span>
        <div className="flex gap-6 eyebrow text-ivory/40">
          {FOOTER_SOCIAL.map((s) => (
            <a key={s.label} href={s.href} className="hover:text-gold">{s.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: readonly string[] }) {
  return (
    <div>
      <h4 className="eyebrow text-gold mb-4 lg:mb-5">{title}</h4>
      <ul className="space-y-3 text-xs">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="hover:text-gold transition-colors">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
