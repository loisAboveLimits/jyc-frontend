import Link from "next/link";
import PostCard from "@/components/blog/PostCard";
import PageHero from "@/components/PageHero";
import { container } from "@/components/ui";
import { ChevronLeftIcon } from "@/components/icons";
import { type BlogPost, blogPagePath, formatPostDate, getRelatedPosts } from "@/lib/blog";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedHref, type Locale } from "@/lib/i18n";

/**
 * A single blog post: banner (the post photo) with breadcrumb, title and
 * date, then the text, then four related posts.
 */
export default function PostArticle({ post, lang, dict }: { post: BlogPost; lang: Locale; dict: Dictionary }) {
  const t = dict.blogs;
  const text = post[lang];
  const related = getRelatedPosts(post.slug);
  const blogsHref = localizedHref(lang, blogPagePath(1));

  return (
    <main className="flex-1">
      <PageHero
        lang={lang}
        breadcrumb={{ home: dict.common.breadcrumbHome, label: dict.common.breadcrumbLabel }}
        parents={[{ label: dict.nav.blogs, href: blogsHref }]}
        title={text.title}
        date={{ dateTime: post.date, label: formatPostDate(post.date, lang), prefix: t.publishedOn }}
        image={post.image}
        compact
      />

      <article className="pb-16 pt-4 lg:pb-24">
        <div className={container}>
          <div className="max-w-4xl space-y-6 text-lg leading-relaxed text-white/90 sm:text-xl sm:leading-[1.8]">
            {text.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <Link
            href={blogsHref}
            className="mt-12 inline-flex items-center gap-2 font-semibold text-teal transition-colors hover:text-gold"
          >
            <ChevronLeftIcon className="size-4 rtl:rotate-180" />
            {t.back}
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-posts" className="border-t border-white/10 py-16 lg:py-24">
          <div className={container}>
            <h2 id="related-posts" className="text-3xl font-bold text-gold sm:text-[40px]">
              {t.related}
            </h2>
            <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.slug}>
                  <PostCard post={item} lang={lang} readMore={dict.common.readMore} headingLevel="h3" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
