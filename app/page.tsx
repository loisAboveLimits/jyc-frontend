import { redirect } from "next/navigation";

// Not normally reached: proxy.ts serves "/" from app/[lang]/page.tsx (English).
// The home page now lives in app/[lang]/page.tsx. This file can be deleted.
export default function RootPage() {
  redirect("/en");
}
