import type { Metadata } from "next";
import Link from "next/link";
import { adminListCategories } from "@/lib/supabaseAdmin";
import AdminProductForm from "../../AdminProductForm";

export const metadata: Metadata = {
  title: "Add a product",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await adminListCategories();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      <Link href="/admin" className="text-sm text-ink-soft hover:text-ink">
        ← Back to owner panel
      </Link>
      <h1 className="mt-3 font-display text-3xl">Add a product</h1>
      <AdminProductForm
        product={null}
        isNew
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      />
    </div>
  );
}
