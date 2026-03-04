import { Clock, Globe, Heart, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-foreground text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img
              src="/assets/generated/hint-mart-logo-transparent.dim_400x200.png"
              alt="HINT Mart"
              className="h-12 w-auto object-contain mb-3 brightness-0 invert"
            />
            <p className="text-white/70 text-sm leading-relaxed">
              Your trusted neighborhood store for all daily needs. Fresh
              groceries, household essentials, and more — delivered to your
              doorstep.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-lg">
              Contact Us
            </h3>
            <ul className="space-y-3 text-white/70 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-green flex-shrink-0" />
                <a
                  href="tel:7797796622"
                  className="hover:text-white transition-colors"
                >
                  7797796622
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-green flex-shrink-0" />
                <span>9:00 AM – 9:00 PM (Daily)</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-brand-green flex-shrink-0" />
                <a
                  href="https://hintmr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  hintmr.com
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-lg">
              Shop Categories
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              {[
                "Kirana",
                "Soft Drinks",
                "Electronic Products",
                "Books",
                "Home Equipment",
                "Woman Clothing",
              ].map((cat) => (
                <li key={cat}>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    {cat}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-sm">
          <p>
            © {currentYear} HINT Mart — HINT MARKET RAY STORE. All rights
            reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with{" "}
            <Heart className="h-3.5 w-3.5 fill-current text-red-400" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
