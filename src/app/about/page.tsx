import Image from "next/image";
import {
  Shield,
  Truck,
  Star,
  Trophy,
  Users,
  Globe,
  Store,
  MessageSquare,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero */}
      <section className="relative bg-black/60 text-white h-72 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="About hero"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-yellow-200">
            About Nuvion
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
            Your place for quality football shirts, easy shopping, and fast
            delivery.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Orders Delivered", value: "10k+", icon: Store },
            { label: "Clubs", value: "120+", icon: Trophy },
            { label: "Leagues", value: "20+", icon: Globe },
            { label: "Happy Fans", value: "8k+", icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 px-4 py-5 flex items-center gap-4 hover:border-yellow-500/50 transition-all duration-300"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-200 to-yellow-100 text-black shadow-lg">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold text-yellow-200">
                  {value}
                </div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6">
            <h2 className="text-xl font-semibold text-yellow-200 mb-3">
              Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We started Nuvion to make buying a football shirt simple and
              enjoyable. No clutter, no stress — just clear pictures, honest
              pricing, and styles you love. Browse by club, league, or kit type
              and find your next favorite shirt in seconds.
            </p>
            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-yellow-200" />{" "}
                Quality-first sourcing and checks
              </li>
              <li className="flex items-start gap-2">
                <Truck className="h-4 w-4 mt-0.5 text-yellow-200" /> Fast,
                trackable shipping
              </li>
              <li className="flex items-start gap-2">
                <Star className="h-4 w-4 mt-0.5 text-yellow-200" /> Clear
                photos, real details
              </li>
              <li className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 mt-0.5 text-yellow-200" />{" "}
                Friendly support that replies
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6">
            <h3 className="text-base font-semibold text-yellow-200 mb-2">
              At a Glance
            </h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>Crisp, fast-loading images</li>
              <li>Secure checkout</li>
              <li>Easy filters and quick search</li>
              <li>Friendly support</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6">
            <h2 className="text-xl font-semibold text-yellow-200 mb-3">
              Shipping & Returns
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              We ship quickly and keep you updated. Need to return something? No
              problem — you have 14 days to send it back in its original
              condition.
            </p>
            <ul className="mt-4 text-sm text-gray-300 space-y-1">
              <li>• Processing: 1–3 business days</li>
              <li>• Tracking on every order</li>
              <li>• Easy return portal</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6">
            <h2 className="text-xl font-semibold text-yellow-200 mb-3">
              Care & Sizing
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              For long-lasting color and feel, wash inside out on cold and hang
              to dry. Not sure about the fit? Check the size guide on each
              product page or ask us — we’re happy to help.
            </p>
            <ul className="mt-4 text-sm text-gray-300 space-y-1">
              <li>• Men’s, Women’s, and Kids sizes</li>
              <li>• Helpful fit notes on product pages</li>
            </ul>
          </div>
        </div>

        {/* Visual Gallery */}
        <div className="rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { src: "/soc-hero.jpg", alt: "Matchday energy" },
              { src: "/shop-hero.jpg", alt: "Shop detail" },
              { src: "/hero.jpg", alt: "Classic fabrics" },
            ].map((img) => (
              <div
                key={img.alt}
                className="relative h-40 sm:h-48 rounded-xl overflow-hidden"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6">
          <h2 className="text-xl font-semibold text-yellow-200 mb-4">
            What Fans Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                quote:
                  "Super smooth checkout and the kit looks even better in person. Shipped fast!",
                name: "David M.",
              },
              {
                quote:
                  "Loved the selection by league — found my team in seconds and sizing was spot on.",
                name: "Aisha K.",
              },
              {
                quote:
                  "Clean site, clear photos, no drama. I’ll be back for more shirts.",
                name: "Marco R.",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-gray-700 bg-gray-800 p-5"
              >
                <p className="text-gray-300 text-sm leading-relaxed">
                  “{t.quote}”
                </p>
                <div className="mt-3 text-xs text-gray-400">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6">
          <h2 className="text-xl font-semibold text-yellow-200 mb-4">FAQ</h2>
          <div className="divide-y divide-gray-700">
            {[
              {
                q: "How long does shipping take?",
                a: "Most orders arrive within 5–10 business days depending on your region. You’ll receive tracking by email.",
              },
              {
                q: "Can I return a shirt?",
                a: "Yes. You have 14 days from delivery to return items in original condition.",
              },
              {
                q: "Do you have size guidance?",
                a: "Each product page includes a size guide. If you’re unsure, message us and we’ll help.",
              },
            ].map((f) => (
              <details key={f.q} className="py-3 group">
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{f.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">
                    ⌄
                  </span>
                </summary>
                <p className="mt-2 text-sm text-gray-300">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Guarantees Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: "Authentic Feel",
              desc: "High-quality materials and finishes.",
              icon: Shield,
            },
            {
              title: "Fast Shipping",
              desc: "Quick dispatch with tracking.",
              icon: Truck,
            },
            {
              title: "Easy Returns",
              desc: "14-day hassle-free returns.",
              icon: Star,
            },
          ].map(({ title, desc, icon: Icon }) => (
            <div
              key={title}
              className="rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 px-5 py-5 flex items-start gap-3 hover:border-yellow-500/50 transition-all duration-300"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-200 to-yellow-100 text-black shadow-lg">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-yellow-200">
                  {title}
                </div>
                <div className="text-xs text-gray-400">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6">
          <h2 className="text-xl font-semibold text-yellow-200 mb-3">
            Contact
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            Questions, feedback, or wholesale? We’d love to hear from you.
          </p>
          <div className="text-gray-300 text-sm">
            <p>Email: support@nuvion.store</p>
            <p>Hours: Mon–Fri, 9am–5pm (local time)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
