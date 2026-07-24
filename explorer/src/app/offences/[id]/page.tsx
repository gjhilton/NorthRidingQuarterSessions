import { OffencePageContent } from "./OffencePageContent";
import { listOffenceTypesAlphabetical } from "@/lib/queries/offences";

export async function generateStaticParams() {
  return listOffenceTypesAlphabetical().map((o) => ({ id: String(o.id) }));
}

export default async function OffenceTypePage(props: PageProps<"/offences/[id]">) {
  const { id } = await props.params;
  return <OffencePageContent id={Number(id)} page={1} />;
}
