/**
 * The continuous void. Fixed behind every scene so sections feel like
 * one unbroken piece of space, not stacked blocks. Pure CSS, zero JS.
 */
export default function Starfield() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-void">
      <div className="stars-far" />
      <div className="stars-near" />
      {/* faint navy breathing at the horizon line of the viewport */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-navy/40 to-transparent" />
    </div>
  );
}
