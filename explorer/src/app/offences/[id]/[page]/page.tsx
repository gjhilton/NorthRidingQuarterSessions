import { OffencePageContent } from "../OffencePageContent";
import { OFFENCE_PAGE_SIZE, getOffenceTypeConvictionCount, listOffenceTypesAlphabetical } from "@/lib/queries/offences";

// Page 1 lives at the clean /offences/[id] URL (see OffencePageContent's
// comment); this route only ever needs pages 2 and up.
export async function generateStaticParams() {
  return listOffenceTypesAlphabetical().flatMap((o) => {
    const totalPages = Math.max(1, Math.ceil(getOffenceTypeConvictionCount(o.id) / OFFENCE_PAGE_SIZE));
    return Array.from({ length: totalPages - 1 }, (_, i) => ({
      id: String(o.id),
      page: String(i + 2),
    }));
  });
}

export default async function OffenceTypePagedPage(props: PageProps<"/offences/[id]/[page]">) {
  const { id, page } = await props.params;
  return <OffencePageContent id={Number(id)} page={Number(page)} />;
}
