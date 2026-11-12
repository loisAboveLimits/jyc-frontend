import Image from "next/image";
import type { ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { arrowButton, container } from "@/components/ui";

/**
 * Pieces of the "Meet The Team" section that work on the server and in the
 * browser. The slider (Team.tsx) and its build-time stand-in (TeamFallback)
 * are both built from them, so they look identical.
 */

export type Member = { name: string; role: string; image: string };

export type TeamProps = {
  title: string;
  text: string;
  members: Member[];
  labels: { previous: string; next: string };
};

/** One person: photo with name and role underneath. */
export function MemberCard({ member }: { member: Member }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-teal bg-teal shadow-lg shadow-black/25">
      <div className="relative aspect-[241/240] bg-navy-soft">
        <Image
          src={member.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 18vw, (min-width: 640px) 40vw, 75vw"
          className="object-cover object-top"
        />
      </div>
      <div className="px-3 pb-3 pt-2.5 text-center">
        <h3 className="text-xl font-bold">{member.name}</h3>
        <p className="text-[15px]">{member.role}</p>
      </div>
    </article>
  );
}

/** The section layout: arrows, heading and text on one side, the cards on the other. */
export function TeamFrame({
  title,
  text,
  labels,
  onPrevious,
  onNext,
  children,
}: Omit<TeamProps, "members"> & {
  onPrevious?: () => void;
  onNext?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden bg-navy-soft py-14 lg:py-20">
      <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,370px)_minmax(0,1fr)] lg:gap-16`}>
        <div className="lg:pt-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onPrevious}
              aria-label={labels.previous}
              className={`${arrowButton} bg-white/15 hover:bg-white/25`}
            >
              <ChevronLeftIcon className="rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label={labels.next}
              className={`${arrowButton} bg-gold/80 hover:bg-gold`}
            >
              <ChevronRightIcon className="rtl:rotate-180" />
            </button>
          </div>
          <h2 className="mt-12 text-3xl font-bold text-teal sm:text-[40px]">{title}</h2>
          <p className="mt-6 max-w-sm leading-relaxed sm:text-[17px]">{text}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

/** Stand-in for the slider while it loads: the same cards in a plain row. */
export function TeamFallback({ members, ...frame }: TeamProps) {
  return (
    <TeamFrame {...frame}>
      <div className="flex min-w-0 gap-4">
        {members.map((member, index) => (
          <div
            key={index}
            className="w-[75%] shrink-0 sm:w-[calc((100%-16px)/2.25)] lg:w-[calc((100%-32px)/3.25)]"
          >
            <MemberCard member={member} />
          </div>
        ))}
      </div>
    </TeamFrame>
  );
}
