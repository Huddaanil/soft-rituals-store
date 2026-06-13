"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import {
  supabaseAdmin,
  publicImageUrl,
  IMAGE_BUCKET,
  adminGetProduct,
} from "@/lib/supabaseAdmin";

export type FormState = { error?: string };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function linesToArray(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function refreshStore() {
  // Big hammer, but this is a low-traffic shop and it makes the owner's
  // edits show up immediately instead of waiting for revalidation.
  revalidatePath("/", "layout");
}

async function uploadPhotoIfPresent(
  formData: FormData,
  slug: string
): Promise<string | null> {
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > 6 * 1024 * 1024) {
    throw new Error("That photo is larger than 6 MB. Please choose a smaller one.");
  }
  const ext = (file.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
  const path = `${slug}-${Date.now()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabaseAdmin()
    .storage.from(IMAGE_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (error) throw new Error(`Photo upload failed: ${error.message}`);
  return publicImageUrl(path);
}

export async function saveProduct(
  _prev: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  let savedName = "";
  try {
    await requireAdmin();

    const isNew = String(formData.get("isNew") ?? "") === "1";
    const name = String(formData.get("name") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const price = Math.round(Number(formData.get("price")));
    const short = String(formData.get("short") ?? "").trim();
    const alt = String(formData.get("alt") ?? "").trim();
    const story = linesToArray(String(formData.get("story") ?? ""));
    const notes = linesToArray(String(formData.get("notes") ?? ""));
    const featured = formData.get("featured") === "on";
    const active = formData.get("active") === "on";
    const seoTitle = String(formData.get("seoTitle") ?? "").trim();
    const seoDescription = String(formData.get("seoDescription") ?? "").trim();
    // Portuguese fields (optional; empty falls back to English at read time)
    const namePt = String(formData.get("name_pt") ?? "").trim();
    const shortPt = String(formData.get("short_pt") ?? "").trim();
    const storyPt = linesToArray(String(formData.get("story_pt") ?? ""));
    const notesPt = linesToArray(String(formData.get("notes_pt") ?? ""));
    const altPt = String(formData.get("alt_pt") ?? "").trim();
    const seoTitlePt = String(formData.get("seoTitle_pt") ?? "").trim();
    const seoDescriptionPt = String(formData.get("seoDescription_pt") ?? "").trim();
    const costRef = String(formData.get("cost_ref") ?? "").trim();

    if (name.length < 2) return { error: "Please give the product a name." };
    if (!category) return { error: "Please choose a section for this product." };
    if (!Number.isFinite(price) || price < 0)
      return { error: "Please enter a valid price in meticais (numbers only)." };

    const slug = isNew
      ? slugify(name) || `item-${Date.now().toString(36)}`
      : String(formData.get("slug") ?? "");
    if (!slug) return { error: "Missing product reference." };

    if (isNew && (await adminGetProduct(slug))) {
      return {
        error: `A product called "${name}" already exists. Use a slightly different name.`,
      };
    }

    const existing = isNew ? null : await adminGetProduct(slug);
    const uploadedUrl = await uploadPhotoIfPresent(formData, slug);
    const image =
      uploadedUrl ?? existing?.image ?? "/products/flower-bowl-set.jpg";

    const base = {
      slug,
      name,
      category,
      price,
      image,
      alt: alt || name,
      short,
      story,
      notes,
      featured,
      active,
      seo_title: seoTitle || `${name} | Soft Rituals`,
      seo_description: seoDescription || short,
    };
    const withPt = {
      ...base,
      name_pt: namePt || null,
      short_pt: shortPt || null,
      story_pt: storyPt.length ? storyPt : null,
      notes_pt: notesPt.length ? notesPt : null,
      alt_pt: altPt || null,
      seo_title_pt: seoTitlePt || null,
      seo_description_pt: seoDescriptionPt || null,
      cost_ref: costRef || null,
    };
    // Try writing PT/link columns; if they don't exist yet, save the base fields.
    let { error } = await supabaseAdmin()
      .from("store_products")
      .upsert(withPt, { onConflict: "slug" });
    if (error)
      ({ error } = await supabaseAdmin()
        .from("store_products")
        .upsert(base, { onConflict: "slug" }));
    if (error) return { error: error.message };
    savedName = name;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }

  refreshStore();
  redirect("/admin?saved=" + encodeURIComponent(savedName));
}

export async function setProductActive(
  slug: string,
  active: boolean
): Promise<void> {
  await requireAdmin();
  const { error } = await supabaseAdmin()
    .from("store_products")
    .update({ active })
    .eq("slug", slug);
  if (error) throw new Error(error.message);
  refreshStore();
}

export async function setProductFeatured(
  slug: string,
  featured: boolean
): Promise<void> {
  await requireAdmin();
  const { error } = await supabaseAdmin()
    .from("store_products")
    .update({ featured })
    .eq("slug", slug);
  if (error) throw new Error(error.message);
  refreshStore();
}

export async function deleteProduct(slug: string): Promise<void> {
  await requireAdmin();
  const { error } = await supabaseAdmin()
    .from("store_products")
    .delete()
    .eq("slug", slug);
  if (error) throw new Error(error.message);
  refreshStore();
  redirect("/admin?removed=1");
}

export async function deleteCategory(slug: string): Promise<void> {
  await requireAdmin();
  // Don't orphan products: refuse to delete a section that still has items.
  const { count, error: countErr } = await supabaseAdmin()
    .from("store_products")
    .select("slug", { count: "exact", head: true })
    .eq("category", slug);
  if (countErr) throw new Error(countErr.message);
  if ((count ?? 0) > 0) {
    throw new Error(
      "This section still has products in it. Move or remove them first."
    );
  }
  const { error } = await supabaseAdmin()
    .from("store_categories")
    .delete()
    .eq("slug", slug);
  if (error) throw new Error(error.message);
  refreshStore();
}

export async function saveCategory(
  _prev: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  let savedName = "";
  try {
    await requireAdmin();
    const name = String(formData.get("name") ?? "").trim();
    const blurb = String(formData.get("blurb") ?? "").trim();
    const namePt = String(formData.get("name_pt") ?? "").trim();
    const blurbPt = String(formData.get("blurb_pt") ?? "").trim();
    const existingSlug = String(formData.get("slug") ?? "").trim();
    const sort = Math.round(Number(formData.get("sort") ?? 100)) || 100;
    if (name.length < 2) return { error: "Please give the section a name." };

    const slug = existingSlug || slugify(name);
    let { error } = await supabaseAdmin()
      .from("store_categories")
      .upsert(
        { slug, name, blurb, name_pt: namePt || null, blurb_pt: blurbPt || null, sort, active: true },
        { onConflict: "slug" }
      );
    if (error)
      ({ error } = await supabaseAdmin()
        .from("store_categories")
        .upsert({ slug, name, blurb, sort, active: true }, { onConflict: "slug" }));
    if (error) return { error: error.message };
    savedName = name;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }

  refreshStore();
  redirect("/admin?saved=" + encodeURIComponent(savedName));
}
