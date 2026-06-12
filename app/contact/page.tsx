import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Soft Rituals — DM us on Instagram @ssoft.rituals for orders, gifts and custom pieces. Maputo, Mozambique.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-8 lg:py-24">
      <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-sage-deep">
        Contact
      </p>
      <h1 className="mt-5 font-display text-4xl leading-tight">
        Talk to a person, <em className="text-rose">not a ticket.</em>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-[17px] leading-7 text-ink-soft">
        Orders, gift ideas, custom pieces for events, or just to ask what's
        fresh this week — send us a message on Instagram and we'll answer
        personally, usually the same day.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href="https://instagram.com/ssoft.rituals"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-sage-deep"
          data-testid="contact-instagram"
        >
          DM us on Instagram — @ssoft.rituals
        </a>
      </div>

      <div className="mx-auto mt-16 grid max-w-xl gap-4 text-left sm:grid-cols-2">
        <div className="rounded-xl border border-line p-6">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em]">Where</h2>
          <p className="mt-2 text-ink-soft">
            Maputo, Mozambique. Delivery across Maputo and Matola, arranged
            with you.
          </p>
        </div>
        <div className="rounded-xl border border-line p-6">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em]">When</h2>
          <p className="mt-2 text-ink-soft">
            We reply personally, usually within the day — a little slower on
            pouring days.
          </p>
        </div>
      </div>
    </div>
  );
}
