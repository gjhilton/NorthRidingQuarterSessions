import { css, cx } from "styled-system/css";
import { SearchIcon } from "@/components/icons/SearchIcon";

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
          fontSize: "display",
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
          bg: "bg",
          borderWidth: "hairline", borderStyle: "solid",
          borderColor: "borderMuted",
          borderRadius: "corner",
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
      <span className={css({ fontSize: "display", fontWeight: "600", fontFamily: "serif" })}>
        {value}
      </span>
      <span className={css({ fontSize: "body", color: "fgMuted" })}>{label}</span>
    </Card>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className={css({ overflowX: "auto", borderWidth: "hairline", borderStyle: "solid", borderColor: "borderMuted", borderRadius: "corner" })}>
      <table className={css({ width: "100%", borderCollapse: "collapse", fontSize: "body" })}>
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
        borderBottomWidth: "hairline", borderBottomStyle: "solid",
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
          borderBottomWidth: "hairline", borderBottomStyle: "solid",
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
    <h2 className={css({ fontFamily: "serif", fontSize: "heading", fontWeight: "600", mb: "3" })}>
      {children}
    </h2>
  );
}

// Shared by the two client search islands (BrowseExplorer, PeopleSearch) so
// their forms stay visually identical without each re-declaring the same
// css() literal.
export const formInputStyle = css({
  borderWidth: "hairline", borderStyle: "solid",
  borderColor: "borderMuted",
  borderRadius: "corner",
  px: "3",
  py: "2",
  fontSize: "body",
  bg: "bgSurface",
  color: "fg",
});

// The site's one search-widget style: a text input with a square magnifier
// button flush against its right edge, sharing a border so the two read as
// one control. Used identically by the homepage's CasesSearch/PeopleSearch
// and the Cases listing page's own search field.
export function SearchField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={css({ display: "flex" })}>
      <input
        {...props}
        className={cx(
          formInputStyle,
          css({ flex: "1", borderRightWidth: "0", borderTopRightRadius: "0", borderBottomRightRadius: "0" }),
          props.className
        )}
      />
      <button
        type="submit"
        aria-label="Search"
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2.75rem",
          borderWidth: "hairline",
          borderStyle: "solid",
          borderColor: "borderMuted",
          borderTopRightRadius: "corner",
          borderBottomRightRadius: "corner",
          bg: "fgAccent",
          color: "bgSurface",
          cursor: "pointer",
          _hover: { opacity: 0.9 },
        })}
      >
        <SearchIcon size={16} />
      </button>
    </div>
  );
}

export const primaryButtonStyle = css({
  bg: "fgAccent",
  color: "bgSurface",
  px: "4",
  py: "2",
  borderRadius: "corner",
  fontSize: "body",
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
        fontSize: "small",
        px: "2",
        py: "0.5",
        borderRadius: "full",
        bg: "bg",
        borderWidth: "hairline", borderStyle: "solid",
        borderColor: "borderMuted",
        color: "fgMuted",
      })}
    >
      {children}
    </span>
  );
}
