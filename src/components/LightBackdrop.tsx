/**
 * Decorative backdrop for the light (About / Projects / Contact) pages:
 * a faint drafting grid + slow-drifting lavender "aurora" washes, blended
 * with multiply so white sections pick up a gentle tint while text stays
 * crisp. Fixed, pointer-events none, pure CSS (see .light-backdrop).
 */
export default function LightBackdrop() {
  return (
    <div className="light-backdrop" aria-hidden="true">
      <span className="lb-blob lb-1" />
      <span className="lb-blob lb-2" />
      <span className="lb-blob lb-3" />
      <span className="lb-blob lb-4" />
    </div>
  );
}
