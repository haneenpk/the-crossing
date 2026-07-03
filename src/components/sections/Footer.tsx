/**
 * The quiet end. No noise after the film — just credits.
 */
export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 px-6 py-16 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="telemetry bright">The Crossing</p>
          <p className="mt-3 max-w-[44ch] text-[13px] leading-[1.7] text-ivory/40">
            An interactive short film about space, distance and the way home.
            Built with intention — every pixel on purpose.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-[13px] text-ivory/40 sm:items-end">
          <a
            href="#hero"
            className="transition-colors duration-300 hover:text-ivory"
          >
            Watch again ↑
          </a>
          <p>© 2026 — imagery from a personal archive</p>
        </div>
      </div>
    </footer>
  );
}
