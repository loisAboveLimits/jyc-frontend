import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { blogPostPath } from "@/lib/blog";
import { localizedHref, type Locale } from "@/lib/i18n";

/**
 * A blog post in a list: tall photo with the title and a short excerpt
 * underneath. The whole card links to the post.
 */
export default function PostCard({
  post,
  lang,
  readMore,
  headingLevel = "h2",
  priority = false,
}: {
  post: BlogPost;
  lang: Locale;
  readMore: string;
  headingLevel?: "h2" | "h3";
  priority?: boolean;
}) {
  const text = post[lang];
  const Heading = headingLevel;

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[345/405] overflow-hidden rounded-t-[20px] shadow-xl shadow-black/30">
        <Image
          src={post.image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 345px, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
        />
      </div>
      {/* Frosted-glass caption, as in the design: see-through panel with a thin
          light edge, a soft teal sheen and the page blurred behind it */}
      <div className="mt-2.5 flex flex-1 flex-col rounded-t-md rounded-b-[20px] border border-white/25 bg-linear-to-br from-white/[0.12] via-teal/[0.08] to-teal/[0.22] px-4 pb-8 pt-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_0_40px_rgba(255,255,255,0.04),0_14px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <Heading className="text-2xl font-bold leading-snug">
          {/* The link covers the whole card */}
          <Link
            href={localizedHref(lang, blogPostPath(post.slug))}
            className="after:absolute after:inset-0 after:rounded-[20px] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-gold"
          >
            {text.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-white/90">{text.excerpt}</p>
        <span aria-hidden="true" className="mt-4 text-sm font-semibold text-teal transition-colors group-hover:text-gold">
          {readMore}
        </span>
      </div>
    </article>
  );
}
