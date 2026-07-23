"use client";

import { useRef, useState } from "react";
import { css, cx } from "styled-system/css";
import { formInputStyle, buttonInteractionStyle, buttonVariantStyle } from "@/components/ui";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { XIcon } from "@/components/icons/XIcon";

// The site's one search-widget style: a text input (with an inline clear
// button once it has a value) and a square magnifier button flush against
// its right edge, sharing a border so the two read as one control. Used
// identically by the homepage's CasesSearch/PeopleSearch and the Cases
// listing page's own search field. The magnifier button is the "hero"
// button variant -- filled ink/paper at rest.
//
// A client component (not part of ui.tsx) because the clear button needs
// state -- ui.tsx's other exports are plain enough to stay usable from
// server components, and this one isn't.
export function SearchField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = useState(Boolean(props.value ?? props.defaultValue));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  }

  function clear() {
    const input = inputRef.current;
    if (!input) return;
    // Goes through the native value setter and dispatches a real "input"
    // event rather than just clearing the DOM node directly -- that's what
    // makes this work whether the field is controlled (CasesSearch,
    // React's onChange fires) or uncontrolled (BrowseExplorer's advanced
    // search, read via FormData -- the real DOM value is what matters).
    const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    setValue?.call(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    setHasValue(false);
    input.focus();
  }

  return (
    <div className={css({ display: "flex" })}>
      <div className={css({ position: "relative", flex: "1" })}>
        <input
          {...props}
          ref={inputRef}
          onChange={handleChange}
          className={cx(
            css(formInputStyle, {
              width: "100%",
              borderWidth: "lineweight_heavy",
              borderRightWidth: "0",
              borderTopRightRadius: "0",
              borderBottomRightRadius: "0",
              pr: hasValue ? "8" : "3",
            }),
            props.className
          )}
        />
        {hasValue && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={clear}
            className={css({
              position: "absolute",
              right: "2",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bg: "transparent",
              border: "none",
              p: "1",
              color: "fgMuted",
              cursor: "pointer",
              _hover: { color: "fgAccent" },
            })}
          >
            <XIcon size={14} />
          </button>
        )}
      </div>
      <button
        type="submit"
        aria-label="Search"
        className={css(buttonVariantStyle.hero, buttonInteractionStyle, {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2.75rem",
          borderWidth: "lineweight_heavy",
          borderStyle: "solid",
          borderColor: "fg",
          borderTopRightRadius: "corner",
          borderBottomRightRadius: "corner",
        })}
      >
        <SearchIcon size={16} />
      </button>
    </div>
  );
}
