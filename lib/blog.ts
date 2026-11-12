import type { Locale } from "./i18n";

/**
 * Blog posts. This is the stand-in for the Drupal blog content: when the
 * backend is connected, replace `posts` with data from Drupal and keep the
 * same shape (slug, image, date, and the English/Arabic texts).
 *
 * `date` is the publish date (YYYY-MM-DD). The dates below are placeholders.
 * `body` is a list of paragraphs.
 */
export type BlogText = { title: string; excerpt: string; body: string[] };

export type BlogPost = {
  slug: string;
  /** Photo in /public, used for the card and the post banner. */
  image: string;
  date: string;
  en: BlogText;
  ar: BlogText;
};

/** Posts shown on each page of the blog list. */
export const POSTS_PER_PAGE = 9;

/** Related posts shown under a post. */
export const RELATED_POSTS = 4;

const posts: BlogPost[] = [
  {
    slug: "jeddah-yacht-club",
    image: "/images/blogs/jeddah-yacht-club.jpg",
    date: "2026-09-22",
    en: {
      title: "Jeddah Yacht Club",
      excerpt: "A Lifestyle Destination",
      body: [
        "Rising from the Jeddah Waterfront, Jeddah Yacht Club & Marina is more than a place to berth a yacht. Its iconic sail-shaped clubhouse brings together dining, wellness, business and leisure in one destination on the Red Sea.",
        "Members and guests can move from a morning on the water to lunch overlooking the marina, an afternoon at the gym or the beach club, and an evening with friends in one of the club's lounges.",
        "Whether you are a seasoned sailor or simply looking for a place to relax by the sea, the club is designed to be your home on the waterfront.",
      ],
    },
    ar: {
      title: "نادي جدة لليخوت",
      excerpt: "وجهة لأسلوب حياة متكامل",
      body: [
        "يرتفع نادي جدة لليخوت والمارينا على واجهة جدة البحرية، وهو أكثر من مجرد مرسى لليخوت. يجمع مبنى النادي الأيقوني على شكل شراع بين المطاعم والعافية والأعمال والترفيه في وجهة واحدة على البحر الأحمر.",
        "يمكن للأعضاء والضيوف الانتقال من صباح على الماء إلى غداء مطل على المارينا، ثم قضاء فترة بعد الظهر في الصالة الرياضية أو نادي الشاطئ، وأمسية مع الأصدقاء في إحدى صالات النادي.",
        "سواء كنت بحّارًا متمرسًا أو تبحث ببساطة عن مكان للاسترخاء بجانب البحر، فقد صُمم النادي ليكون بيتك على الواجهة البحرية.",
      ],
    },
  },
  {
    slug: "alara-beach-club",
    image: "/images/blogs/alara-beach-club.jpg",
    date: "2026-09-15",
    en: {
      title: "Alara",
      excerpt:
        "Where the horizon becomes part of the experience. The beach club features a stunning panoramic pool overlooking the Red Sea, offering a serene escape defined by sun, sea, and sophistication.",
      body: [
        "Where the horizon becomes part of the experience. Alara's beach club features a stunning panoramic pool overlooking the Red Sea, offering a serene escape defined by sun, sea, and sophistication.",
        "Shaded loungers line the water's edge, making it easy to spend a whole day unwinding, from a relaxed morning swim to the last light of the sunset over the sea.",
      ],
    },
    ar: {
      title: "ألارا",
      excerpt:
        "حيث يصبح الأفق جزءًا من التجربة. يضم نادي الشاطئ مسبحًا بانوراميًا مذهلًا يطل على البحر الأحمر، ليقدم ملاذًا هادئًا عنوانه الشمس والبحر والأناقة.",
      body: [
        "حيث يصبح الأفق جزءًا من التجربة. يضم نادي الشاطئ في ألارا مسبحًا بانوراميًا مذهلًا يطل على البحر الأحمر، ليقدم ملاذًا هادئًا عنوانه الشمس والبحر والأناقة.",
        "تصطف مقاعد الاسترخاء المظللة على حافة الماء، ليسهل قضاء يوم كامل في الراحة، من سباحة صباحية هادئة حتى آخر ضوء للغروب فوق البحر.",
      ],
    },
  },
  {
    slug: "business-floor",
    image: "/images/blogs/business-floor.jpg",
    date: "2026-09-08",
    en: {
      title: "Business Floor",
      excerpt:
        "A dedicated space for productivity and focus. Featuring a boardroom and multiple meeting rooms, the business floor is designed to host everything from intimate discussions to important gatherings.",
      body: [
        "A dedicated space for productivity and focus. Featuring a boardroom and multiple meeting rooms, the business floor is designed to host everything from intimate discussions to important gatherings.",
        "Floor-to-ceiling windows bring the Red Sea into every meeting, while quiet, well-equipped rooms let members get work done without leaving the club.",
      ],
    },
    ar: {
      title: "طابق الأعمال",
      excerpt:
        "مساحة مخصصة للإنتاجية والتركيز. يضم طابق الأعمال قاعة اجتماعات رئيسية وعدة غرف اجتماعات، وقد صُمم لاستضافة كل شيء من النقاشات الخاصة إلى اللقاءات المهمة.",
      body: [
        "مساحة مخصصة للإنتاجية والتركيز. يضم طابق الأعمال قاعة اجتماعات رئيسية وعدة غرف اجتماعات، وقد صُمم لاستضافة كل شيء من النقاشات الخاصة إلى اللقاءات المهمة.",
        "تجلب النوافذ الممتدة من الأرض إلى السقف البحر الأحمر إلى كل اجتماع، بينما تتيح الغرف الهادئة والمجهزة جيدًا للأعضاء إنجاز أعمالهم دون مغادرة النادي.",
      ],
    },
  },
  {
    slug: "the-view-lounge",
    image: "/images/blogs/the-view-lounge.jpg",
    date: "2026-09-01",
    en: {
      title: "The View Lounge",
      excerpt:
        "A vibrant social hub designed for leisure and connection. With spacious seating, entertainment, and panoramic surroundings, the View Lounge is where energy and relaxation come together effortlessly.",
      body: [
        "A vibrant social hub designed for leisure and connection. With spacious seating, entertainment, and panoramic surroundings, the View Lounge is where energy and relaxation come together effortlessly.",
        "Meet friends for coffee in the afternoon or stay into the evening as the lounge comes alive, all with sweeping views across the marina and the sea.",
      ],
    },
    ar: {
      title: "صالة ذا فيو",
      excerpt:
        "ملتقى اجتماعي نابض بالحياة صُمم للترفيه والتواصل. بمقاعدها الواسعة وأجوائها الترفيهية وإطلالاتها البانورامية، تجمع صالة ذا فيو بين الحيوية والاسترخاء بكل سهولة.",
      body: [
        "ملتقى اجتماعي نابض بالحياة صُمم للترفيه والتواصل. بمقاعدها الواسعة وأجوائها الترفيهية وإطلالاتها البانورامية، تجمع صالة ذا فيو بين الحيوية والاسترخاء بكل سهولة.",
        "التقِ بالأصدقاء لتناول القهوة بعد الظهر أو ابقَ حتى المساء حين تنبض الصالة بالحياة، مع إطلالات واسعة على المارينا والبحر.",
      ],
    },
  },
  {
    slug: "gym",
    image: "/images/blogs/gym.jpg",
    date: "2026-08-25",
    en: {
      title: "Gym",
      excerpt:
        "Elevate your fitness routine with inspiring views. Our fully equipped gym overlooks the paddle courts and the sea, offering a dynamic environment where wellness meets breathtaking scenery.",
      body: [
        "Elevate your fitness routine with inspiring views. Our fully equipped gym overlooks the paddle courts and the sea, offering a dynamic environment where wellness meets breathtaking scenery.",
        "From cardio with a view of the water to strength training in a bright, open space, it is a place that makes every workout feel a little more rewarding.",
      ],
    },
    ar: {
      title: "الصالة الرياضية",
      excerpt:
        "ارتقِ بروتينك الرياضي مع إطلالات ملهمة. تطل صالتنا الرياضية المتكاملة على ملاعب البادل والبحر، لتقدم بيئة حيوية تلتقي فيها العافية بالمناظر الخلابة.",
      body: [
        "ارتقِ بروتينك الرياضي مع إطلالات ملهمة. تطل صالتنا الرياضية المتكاملة على ملاعب البادل والبحر، لتقدم بيئة حيوية تلتقي فيها العافية بالمناظر الخلابة.",
        "من تمارين الكارديو المطلة على الماء إلى تمارين القوة في مساحة مشرقة ومفتوحة، إنها مكان يجعل كل تمرين أكثر متعة.",
      ],
    },
  },
  {
    slug: "1492-cigar-room",
    image: "/images/blogs/1492-cigar-room.jpg",
    date: "2026-08-18",
    en: {
      title: "1492 Cigar Room",
      excerpt:
        "An intimate retreat crafted for quiet moments and meaningful conversations. The cigar lounge blends sophistication and warmth, creating the perfect setting to unwind in a timeless atmosphere.",
      body: [
        "An intimate retreat crafted for quiet moments and meaningful conversations. The cigar lounge blends sophistication and warmth, creating the perfect setting to unwind in a timeless atmosphere.",
        "Deep leather armchairs and views over the waterfront set the tone for an unhurried evening, whether you come to relax alone or to share a conversation with friends.",
      ],
    },
    ar: {
      title: "غرفة السيجار 1492",
      excerpt:
        "ملاذ خاص صُمم للحظات الهادئة والأحاديث العميقة. تمزج صالة السيجار بين الرقي والدفء، لتكون المكان المثالي للاسترخاء في أجواء خالدة.",
      body: [
        "ملاذ خاص صُمم للحظات الهادئة والأحاديث العميقة. تمزج صالة السيجار بين الرقي والدفء، لتكون المكان المثالي للاسترخاء في أجواء خالدة.",
        "تضفي الكراسي الجلدية الوثيرة والإطلالات على الواجهة البحرية طابعًا هادئًا على الأمسية، سواء جئت للاسترخاء بمفردك أو لمشاركة حديث مع الأصدقاء.",
      ],
    },
  },
  {
    slug: "lobby-lounge",
    image: "/images/blogs/lobby-lounge.jpg",
    date: "2026-08-11",
    en: {
      title: "Lobby Lounge",
      excerpt:
        "Step into a grand welcome where elegance meets comfort. Our lobby is designed to impress, offering a refined space to relax, connect, or begin your journey through the club in style.",
      body: [
        "Step into a grand welcome where elegance meets comfort. Our lobby is designed to impress, offering a refined space to relax, connect, or begin your journey through the club in style.",
        "Soft seating, natural light and calm, warm tones make it an easy place to meet guests, wait for friends or simply pause before heading on to the rest of the club.",
      ],
    },
    ar: {
      title: "صالة الردهة",
      excerpt:
        "ادخل إلى استقبال فخم تلتقي فيه الأناقة بالراحة. صُممت ردهتنا لتبهرك، فهي مساحة راقية للاسترخاء أو التواصل أو بدء جولتك في النادي بأناقة.",
      body: [
        "ادخل إلى استقبال فخم تلتقي فيه الأناقة بالراحة. صُممت ردهتنا لتبهرك، فهي مساحة راقية للاسترخاء أو التواصل أو بدء جولتك في النادي بأناقة.",
        "تجعل المقاعد المريحة والضوء الطبيعي والألوان الدافئة الهادئة منها مكانًا مثاليًا لاستقبال الضيوف أو انتظار الأصدقاء أو التوقف قليلًا قبل التوجه إلى بقية أرجاء النادي.",
      ],
    },
  },
  {
    slug: "riva-privee-lounge",
    image: "/images/blogs/riva-privee-lounge.jpg",
    date: "2026-08-04",
    en: {
      title: "Riva Privée Lounge",
      excerpt:
        "Inspired by the iconic craftsmanship of Riva yachts, this lounge showcases authentic materials and design elements, delivering a unique maritime experience infused with heritage and luxury.",
      body: [
        "Inspired by the iconic craftsmanship of Riva yachts, this lounge showcases authentic materials and design elements, delivering a unique maritime experience infused with heritage and luxury.",
        "It is a place to network over breathtaking views of the Red Sea and the Jeddah skyline, surrounded by details that celebrate one of yachting's most famous names.",
      ],
    },
    ar: {
      title: "صالة ريفا بريفيه",
      excerpt:
        "مستوحاة من الحرفية الأيقونية ليخوت ريفا، تعرض هذه الصالة خامات وعناصر تصميم أصيلة، لتقدم تجربة بحرية فريدة تمتزج فيها العراقة بالفخامة.",
      body: [
        "مستوحاة من الحرفية الأيقونية ليخوت ريفا، تعرض هذه الصالة خامات وعناصر تصميم أصيلة، لتقدم تجربة بحرية فريدة تمتزج فيها العراقة بالفخامة.",
        "إنها مكان للتواصل وسط إطلالات خلابة على البحر الأحمر وأفق جدة، محاطًا بتفاصيل تحتفي بأحد أشهر الأسماء في عالم اليخوت.",
      ],
    },
  },
  {
    slug: "alara",
    image: "/images/blogs/alara.jpg",
    date: "2026-07-28",
    en: {
      title: "Alara",
      excerpt:
        "Where the horizon becomes part of the experience. The beach club features a stunning panoramic pool overlooking the Red Sea, offering a serene escape defined by sun, sea, and sophistication.",
      body: [
        "Where the horizon becomes part of the experience. Inside, Alara's bright, glass-walled spaces open onto the Red Sea, so the view follows you from the pool deck to the table.",
        "It is an easy place to spend an afternoon: a swim, a long lunch and the calm of the sea, all in one setting defined by sun, sea, and sophistication.",
      ],
    },
    ar: {
      title: "ألارا",
      excerpt:
        "حيث يصبح الأفق جزءًا من التجربة. يضم نادي الشاطئ مسبحًا بانوراميًا مذهلًا يطل على البحر الأحمر، ليقدم ملاذًا هادئًا عنوانه الشمس والبحر والأناقة.",
      body: [
        "حيث يصبح الأفق جزءًا من التجربة. تنفتح مساحات ألارا المشرقة ذات الجدران الزجاجية على البحر الأحمر، فترافقك الإطلالة من سطح المسبح حتى الطاولة.",
        "إنها مكان مثالي لقضاء فترة ما بعد الظهر: سباحة وغداء طويل وهدوء البحر، في أجواء عنوانها الشمس والبحر والأناقة.",
      ],
    },
  },
];

/** All posts, newest first. */
export function getPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPageCount(): number {
  return Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
}

/** The posts on one page of the list (page numbers start at 1). */
export function getPostsPage(page: number): BlogPost[] {
  const start = (page - 1) * POSTS_PER_PAGE;
  return getPosts().slice(start, start + POSTS_PER_PAGE);
}

/** Other posts to show under a post: the ones published right after it, then wrapping round. */
export function getRelatedPosts(slug: string, count = RELATED_POSTS): BlogPost[] {
  const all = getPosts();
  const index = all.findIndex((post) => post.slug === slug);
  const others = [...all.slice(index + 1), ...all.slice(0, Math.max(index, 0))];
  return others.slice(0, count);
}

/** "22 September 2026" / "٢٢ سبتمبر ٢٠٢٦" style date, written for the language. */
export function formatPostDate(date: string, lang: Locale): string {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA-u-ca-gregory" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

/** URL of a list page: page 1 is /blogs, later pages are /blogs/page/2, /blogs/page/3… */
export const blogPagePath = (page: number) => (page <= 1 ? "/blogs" : `/blogs/page/${page}`);

export const blogPostPath = (slug: string) => `/blogs/${slug}`;
