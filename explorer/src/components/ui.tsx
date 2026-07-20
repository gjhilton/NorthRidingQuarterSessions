import { css, cx } from "styled-system/css";

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={css({
        maxWidth: "72rem",
        mx: "auto",
        px: "6",
        py: "10",
        display: "flex",
        flexDirection: "column",
        gap: "8",
      })}
    >
      {children}
    </main>
  );
}

export function PageTitle({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <div>
      <h1
        className={css({
          fontFamily: "serif",
          fontSize: "3xl",
          fontWeight: "600",
          color: "fg",
        })}
      >
        {children}
      </h1>
      {subtitle && (
        <p className={css({ color: "fgMuted", mt: "1" })}>{subtitle}</p>
      )}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        css({
          bg: "bgSurface",
          border: "1px solid",
          borderColor: "borderMuted",
          borderRadius: "md",
          p: "5",
        }),
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <Card
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "1",
        minWidth: "10rem",
      })}
    >
      <span className={css({ fontSize: "2xl", fontWeight: "600", fontFamily: "serif" })}>
        {value}
      </span>
      <span className={css({ fontSize: "sm", color: "fgMuted" })}>{label}</span>
    </Card>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className={css({ overflowX: "auto", border: "1px solid", borderColor: "borderMuted", borderRadius: "md" })}>
      <table className={css({ width: "100%", borderCollapse: "collapse", fontSize: "sm" })}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      className={css({
        textAlign: "left",
        py: "2",
        px: "3",
        bg: "bg",
        color: "fgMuted",
        fontWeight: "600",
        borderBottom: "1px solid",
        borderColor: "borderMuted",
        whiteSpace: "nowrap",
      })}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={cx(
        css({
          py: "2",
          px: "3",
          borderBottom: "1px solid",
          borderColor: "borderMuted",
          verticalAlign: "top",
        }),
        className
      )}
    >
      {children}
    </td>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className={css({ color: "fgMuted", fontStyle: "italic", py: "6", textAlign: "center" })}>
      {children}
    </p>
  );
}

export function ChartTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className={css({ fontFamily: "serif", fontSize: "lg", fontWeight: "600", mb: "3" })}>
      {children}
    </h2>
  );
}

// Shared by the two client search islands (BrowseExplorer, PeopleSearch) so
// their forms stay visually identical without each re-declaring the same
// css() literal.
export const formInputStyle = css({
  border: "1px solid",
  borderColor: "borderMuted",
  borderRadius: "md",
  px: "3",
  py: "2",
  fontSize: "sm",
  bg: "bgSurface",
  color: "fg",
});

export const primaryButtonStyle = css({
  bg: "fgAccent",
  color: "bgSurface",
  px: "4",
  py: "2",
  borderRadius: "md",
  fontSize: "sm",
  fontWeight: "600",
  cursor: "pointer",
  border: "none",
  _disabled: { opacity: 0.6, cursor: "default" },
});

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={css({
        display: "inline-block",
        fontSize: "xs",
        px: "2",
        py: "0.5",
        borderRadius: "full",
        bg: "bg",
        border: "1px solid",
        borderColor: "borderMuted",
        color: "fgMuted",
      })}
    >
      {children}
    </span>
  );
}
