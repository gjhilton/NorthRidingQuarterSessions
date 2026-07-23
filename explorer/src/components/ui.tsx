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
          fontSize: "pageTitle",
          fontWeight: "600",
          color: "fg",
        })}
      >
        {children}
      </h1>
      {subtitle && (
        <p className={css({ color: "fg", fontSize: "heading", mt: "1" })}>{subtitle}</p>
      )}
    </div>
  );
}

export function Card({
  children,
  className,
  bg = "bg",
  borderWidth = "lineweight_normal",
}: {
  children: React.ReactNode;
  className?: string;
  // Passed as real props, merged into this component's own css() call,
  // rather than left to a className override -- two separate css() calls
  // combined via cx() just concatenate class names, and Panda resolves a
  // same-specificity conflict between them by stylesheet order, not by
  // which one the caller passed last. That silently made Card's own
  // defaults always win over a caller's attempted className override.
  bg?: string;
  borderWidth?: string;
}) {
  return (
    <div
      className={cx(
        css({
          bg,
          borderWidth, borderStyle: "solid",
          borderColor: "fg",
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

export function Table({
  children,
  className,
  fontSize = "body",
  borderWidth = "lineweight_normal",
}: {
  children: React.ReactNode;
  className?: string;
  // Real props, not className overrides -- see Card's bg/borderWidth props
  // for why a caller-supplied className can't reliably beat this
  // component's own default for the same property.
  fontSize?: string;
  borderWidth?: string;
}) {
  return (
    <div
      className={cx(
        css({
          overflowX: "auto",
          borderWidth,
          borderStyle: "solid",
          borderColor: "fg",
          borderRadius: "corner",
        }),
        className
      )}
    >
      <table className={css({ width: "100%", borderCollapse: "collapse", fontSize })}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={css({
        textAlign: "left",
        verticalAlign: "bottom",
        py: "2",
        px: "3",
        bg: "bg",
        color: "fgMuted",
        fontWeight: "600",
        borderBottomWidth: "lineweight_normal", borderBottomStyle: "solid",
        borderColor: "fg",
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
          borderBottomWidth: "lineweight_normal", borderBottomStyle: "solid",
          borderColor: "fg",
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

// Shared by the client search islands (BrowseExplorer, PeopleSearch, People
// browse filters) so their forms stay visually identical without each
// re-declaring the same style literal. A raw style object (css.raw), not a
// compiled className -- consumers merge it via css(formInputStyle, {...})
// in one call so an override actually wins (two separately-compiled
// classes combined with cx() just concatenate class names, and Panda
// resolves a same-specificity conflict between them by stylesheet order,
// not by which one the caller passed last).
export const formInputStyle = css.raw({
  borderWidth: "lineweight_normal", borderStyle: "solid",
  borderColor: "fg",
  borderRadius: "corner",
  px: "3",
  py: "2",
  fontSize: "body",
  bg: "bg",
  color: "fg",
});

// Every button in the app is one of two variants, plus two states layered
// on top of either: default is bordered paper/ink; hero is a filled
// ink/paper block (the search button is the one hero use case so far).
// Both variants roll over to the same white-on-red accent fill and dim to
// the same disabled state -- only the *resting* look differs, so the
// interaction behaviour is defined once and merged with whichever variant
// via a single css() call (raw style objects, not separately-compiled
// classes -- see Card's bg/borderWidth props for why that distinction
// matters here).
export const buttonInteractionStyle = css.raw({
  cursor: "pointer",
  transition: "background-color 0.15s, border-color 0.15s, color 0.15s",
  _hover: { borderColor: "fgAccent", bg: "fgAccent", color: "bg" },
  _disabled: { opacity: 0.3, cursor: "default" },
});

export const buttonVariantStyle = {
  default: css.raw({ bg: "bg", color: "fg" }),
  hero: css.raw({ bg: "fg", color: "bg" }),
};

export type ButtonVariant = keyof typeof buttonVariantStyle;

// A bordered button with an icon on either side of its (possibly
// multi-line) label content -- used by the Cases page's CSV export and
// Prev/Next buttons.
export function IconButton({
  icon,
  iconPosition = "left",
  variant = "default",
  children,
  className,
  ...props
}: {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
  variant?: ButtonVariant;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cx(
        css(buttonVariantStyle[variant], buttonInteractionStyle, {
          display: "flex",
          alignItems: "center",
          gap: "4",
          px: "5",
          py: "1.5",
          borderWidth: "lineweight_heavy", borderStyle: "solid",
          borderColor: "fg",
          borderRadius: "corner",
        }),
        className
      )}
    >
      {iconPosition === "left" && icon}
      {children}
      {iconPosition === "right" && icon}
    </button>
  );
}

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
        borderWidth: "lineweight_normal", borderStyle: "solid",
        borderColor: "fg",
        color: "fgMuted",
      })}
    >
      {children}
    </span>
  );
}
