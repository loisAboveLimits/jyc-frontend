type Props = {
  /** Fade the top edge into the page background. */
  top?: boolean;
  /** Fade the bottom edge into the page background. */
  bottom?: boolean;
  /** Height of each fade (Tailwind classes). Use a smaller one for short strips. */
  size?: string;
};

/**
 * Soft top/bottom edges for a full-width photo section, so it melts into the
 * page background (navy-deep) instead of starting and ending with a hard line.
 * Put it inside a `relative isolate` section, after the photo and its tints:
 * it sits above them (-z-[5]) and below the content.
 */
export default function EdgeFades({ top = true, bottom = true, size = "h-24 lg:h-40" }: Props) {
  const base = `pointer-events-none absolute inset-x-0 -z-[5] ${size} from-navy-deep to-transparent`;
  return (
    <>
      {top && <div aria-hidden="true" className={`${base} -top-px bg-linear-to-b`} />}
      {bottom && <div aria-hidden="true" className={`${base} -bottom-px bg-linear-to-t`} />}
    </>
  );
}
