import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Owner sign in",
  robots: { index: false },
};

type SearchParams = Promise<{ next?: string }>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-3xl">Owner sign in</h1>
      <p className="mt-2 text-ink-soft">
        For Soft Rituals. This area is private.
      </p>
      <LoginForm next={next ?? "/admin"} />
    </div>
  );
}
