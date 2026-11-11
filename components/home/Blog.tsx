import Image from "next/image";
import Link from "next/link";
import { button, container, eyebrow } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedHref, type Locale } from "@/lib/i18n";

/** "Blog & Articles": heading, link to all posts and the featured post. */
export default function Blog({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.home.blog;
  const blogsHref = localizedHref(lang, "/blogs");

  return (
    <section className="bg-linear-to-b from-navy-deep via-navy/60 to-navy-deep py-20 lg:py-36">
      <div className={container}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className={eyebrow}>{t.eyebrow}</p>
            <h2 className="mt-4 text-4xl font-bold sm:text-[44px]">{t.title}</h2>
          </div>
          <Link href={blogsHref} className={`${button.glass} min-w-52 font-normal sm:min-w-64`}>
            {t.all}
          </Link>
        </div>

        <article className="mt-12">
          <Link href={blogsHref} className="relative block aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[1309/783]">
            <Image
              src="/images/home/blog-featured.jpg"
              alt={t.imageAlt}
              fill
              sizes="(min-width: 1340px) 1300px, 100vw"
              className="object-cover"
            />
          </Link>
          <h3 className="mt-10 text-2xl font-bold text-gold sm:text-[26px]">{t.postTitle}</h3>
          <p className="mt-4">{t.postText}</p>
          <Link href={blogsHref} className="mt-2 inline-flex min-h-11 items-center text-xl font-bold text-teal hover:text-gold">
            {dict.common.readMore}
            <span className="sr-only">: {t.postTitle}</span>
          </Link>
        </article>
      </div>
    </section>
  );
}
