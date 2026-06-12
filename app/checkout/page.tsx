import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Place your Soft Rituals order — no account needed. We confirm personally and deliver across Maputo.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:py-16">
      <CheckoutForm />
    </div>
  );
}
