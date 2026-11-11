import MainPage, { mainPageMetadata, type LangParams } from "@/components/MainPage";

type Props = { params: LangParams };

// Needs the language from the URL before rendering (see app/[lang]/page.tsx).
export const instant = false;

export const generateMetadata = ({ params }: Props) =>
  mainPageMetadata(params, "leasing");

export default function LeasingPage({ params }: Props) {
  return <MainPage params={params} page="leasing" />;
}
