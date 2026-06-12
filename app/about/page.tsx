import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — made at home, the slow way",
  description:
    "Soft Rituals started in a kitchen in Maputo with one pot of wax. Every candle is still poured by hand, every soap still cut by hand.",
};

const VALUES = [
  {
    title: "Hand-poured",
    text: "Each candle poured one at a time, never in a factory.",
  },
  {
    title: "Small batches",
    text: "We make a little, often — so everything is fresh.",
  },
  {
    title: "Handmade with love",
    text: "Every piece wrapped and tagged by hand, like a gift.",
  },
  {
    title: "Made in Maputo",
    text: "Created here in Mozambique, with love.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 lg:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-sage-deep">
            Our story
          </p>
          <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
            Made at home, <em className="text-rose">the slow way.</em>
          </h1>
          <div className="mt-7 space-y-5 text-[17px] leading-7 text-ink-soft">
            <p>
              Soft Rituals started in a kitchen in Maputo, with one pot of wax
              and a lot of patience. The first candles were for our own table —
              lit at the end of days that ran too long, for people who answer
              one more email before dinner.
            </p>
            <p>
              Today every candle is still poured by hand and every soap is
              still cut by hand. Flowers are sculpted petal by petal. Gift
              boxes are packed one at a time. When a batch sells out, we make
              more — slowly, because that is the whole point.
            </p>
            <p>
              We believe the cure for a loud day is not a holiday you keep
              postponing. It is five quiet minutes you actually take. Our work
              is to make those five minutes beautiful.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-9 inline-block rounded-full bg-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-sage-deep"
          >
            Shop the collection
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src="/products/carved-pillar.jpg"
              alt="A pink pillar candle carved with roses and lilies"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src="/products/succulent-box.jpg"
              alt="Sculpted succulent candles on real pebbles"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-xl border border-line bg-paper-2/50 p-6">
            <h2 className="font-display text-lg">{v.title}</h2>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">{v.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
