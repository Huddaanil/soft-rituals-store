import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  adminGetProduct,
  adminListCategories,
  adminGetCostingProducts,
} from "@/lib/supabaseAdmin";
import AdminProductForm from "../../AdminProductForm";
import DeleteProductButton from "../../DeleteProductButton";

export const metadata: Metadata = {
  title: "Edit product",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [product, categories, costingProducts] = await Promise.all([
    adminGetProduct(slug),
    adminListCategories(),
    adminGetCostingProducts(),
  ]);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      <Link href="/admin" className="text-sm text-ink-soft hover:text-ink">
        ← Back to owner panel
      </Link>
      <h1 className="mt-3 font-display text-3xl">Edit “{product.name}”</h1>
      <AdminProductForm
        product={product}
        isNew={false}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
        costingProducts={costingProducts}
      />
      <div className="mt-10 border-t border-line pt-6">
        <DeleteProductButton slug={product.slug} name={product.name} />
      </div>
    </div>
  );
}
