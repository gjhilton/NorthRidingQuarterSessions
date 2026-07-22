import { css } from "styled-system/css";
import { Card, PageContainer, PageTitle } from "@/components/ui";

export default function CookiesPage() {
  return (
    <PageContainer>
      <PageTitle>Cookies policy</PageTitle>
      <Card>
        <p className={css({ fontSize: "body" })}>
          This site does not use cookies, and does not use any other
          browser storage (such as localStorage) to track you or remember
          anything between visits. There is no analytics or tracking
          script of any kind running on this site.
        </p>
        <p className={css({ fontSize: "body", mt: "3" })}>
          The interactive search features on the Browse and People pages
          run a small database entirely within your browser, downloaded
          fresh on each visit — nothing about your searches is sent
          anywhere or stored anywhere.
        </p>
      </Card>
    </PageContainer>
  );
}
