// Renders editable headline text where _underscored_ words become the italic
// gradient accent, e.g. "A real home, with _round-the-clock_ care."
export function AccentText({ text, accentClassName = "accent grad-text" }: { text: string; accentClassName?: string }) {
  const parts = text.split(/(_[^_]+_)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("_") && part.endsWith("_") ? (
          <span key={i} className={accentClassName}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
