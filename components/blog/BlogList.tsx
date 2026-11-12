import PostCard from "@/components/blog/PostCard";
import Pagination from "@/components/blog/Pagination";
import PageHero from "@/components/PageHero";
import { container } from "@/components/ui";
import { getPageCount, getPostsPage } from "@/lib/blog";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

/** One page of the blog list: banner, a grid of up to 9 posts, and the page numbers. */
export default function BlogList({ lang, dict, page }: { lang: Locale; dict: Dictionary; page: number }) {
  const t = dict.blogs;
  const posts = getPostsPage(page);

  return (
    <main className="flex-1">
      <PageHero
        lang={lang}
        breadcrumb={{ home: dict.common.breadcrumbHome, label: dict.common.breadcrumbLabel }}
        crumb={dict.nav.blogs}
        title={t.title}
        image="/images/blogs/banner.jpg"
        compact
      />

      <section className="pb-20 lg:pb-28">
        <div className={container}>
          <h2 className="sr-only">{t.listTitle}</h2>
          <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-[clamp(2.5rem,6vw,6rem)] lg:gap-y-24 xl:px-8">
            {posts.map((post, index) => (
              <li key={post.slug}>
                <PostCard post={post} lang={lang} readMore={dict.common.readMore} priority={index < 3} />
              </li>
            ))}
          </ul>

          <Pagination lang={lang} current={page} total={getPageCount()} labels={t.pagination} />
        </div>
      </section>
    </main>
  );
}
