// Card-pack reveal: which projects get it, and the small client script that
// plays it. Markup and styles live in src/components/PackReveal.astro.

/** Projects whose links open with the pack animation. A frontmatter flag
 *  (`pack: true`) is honoured as well once the schema has one. */
export const PACK_SLUGS: readonly string[] = ["newtonian-aero"];

export const isPack = (d: { slug: string }): boolean =>
  (d as { pack?: boolean }).pack === true || PACK_SLUGS.includes(d.slug);

/** Time from click to the settled card. Keep in step with --pack-t in PackReveal.astro. */
const REVEAL_MS = 2600;

/** Below this window height the card would be too small to read. */
const MIN_HEIGHT = 520;

let wired = false;

export function initPackReveal(): void {
  if (wired) return;
  wired = true;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let open: HTMLElement | null = null;
  let trigger: HTMLElement | null = null;
  let timer = 0;

  const dialogFor = (slug: string) => document.querySelector<HTMLElement>(`[data-pack-dialog="${CSS.escape(slug)}"]`);

  const focusables = (root: HTMLElement) =>
    [...root.querySelectorAll<HTMLElement>("a[href], button")].filter(
      (el) => el.tabIndex >= 0 && !el.hidden && el.getClientRects().length > 0,
    );

  const resetTilt = (dlg: HTMLElement) => {
    const tilt = dlg.querySelector<HTMLElement>("[data-pack-tilt]");
    if (!tilt) return;
    for (const p of ["--rx", "--ry", "--gx", "--gy"]) tilt.style.removeProperty(p);
    tilt.classList.remove("is-tilting");
  };

  const reveal = (dlg: HTMLElement) => {
    if (dlg.classList.contains("is-revealed")) return;
    window.clearTimeout(timer);
    dlg.classList.add("is-revealed");
    const skip = dlg.querySelector<HTMLElement>("[data-pack-skip]");
    const go = dlg.querySelector<HTMLElement>("[data-pack-go]");
    const card = dlg.querySelector<HTMLElement>("[data-pack-card]");
    const hadFocus = !dlg.contains(document.activeElement) || document.activeElement === skip;
    if (skip) skip.tabIndex = -1;
    if (go) go.tabIndex = 0;
    if (card) card.tabIndex = 0;
    if (hadFocus) go?.focus({ preventScroll: true });
  };

  const show = (dlg: HTMLElement, from: HTMLElement) => {
    open = dlg;
    trigger = from;
    dlg.classList.remove("is-revealed", "is-fast", "is-open");
    resetTilt(dlg);
    for (const el of dlg.querySelectorAll<HTMLElement>("[data-pack-go], [data-pack-card]")) el.tabIndex = -1;
    const skip = dlg.querySelector<HTMLElement>("[data-pack-skip]");
    if (skip) skip.tabIndex = 0;
    dlg.hidden = false;
    void dlg.offsetWidth; // restart the keyframes on every open
    dlg.classList.add("is-open");
    skip?.focus({ preventScroll: true });
    timer = window.setTimeout(() => reveal(dlg), REVEAL_MS);
  };

  const close = (returnFocus = true) => {
    if (!open) return;
    window.clearTimeout(timer);
    const dlg = open;
    open = null;
    dlg.hidden = true;
    dlg.classList.remove("is-open", "is-revealed", "is-fast");
    resetTilt(dlg);
    if (returnFocus) trigger?.focus({ preventScroll: true });
    trigger = null;
  };

  // Plain left clicks and Enter only; modified clicks, middle clicks and
  // "open in new tab" stay ordinary link behaviour.
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    if (open) {
      if (target.closest("[data-pack-close]")) {
        e.preventDefault();
        close();
      } else if (!open.classList.contains("is-revealed") && target.closest("[data-pack-stage]")) {
        // A click on the pack while it is still opening jumps to the card.
        e.preventDefault();
        open.classList.add("is-fast");
        reveal(open);
      }
      return;
    }

    const link = target.closest<HTMLAnchorElement>("a[data-pack]");
    // Reduced motion, or a window too short to show the card (a phone held
    // sideways): go straight to the page.
    if (!link || link.target === "_blank" || reduced.matches || window.innerHeight < MIN_HEIGHT) return;
    const dlg = dialogFor(link.dataset.pack ?? "");
    if (!dlg) return;
    e.preventDefault();
    show(dlg, link);
  });

  document.addEventListener("keydown", (e) => {
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "Tab") {
      const items = focusables(open);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !open.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }
    // The page behind must not scroll while the overlay is up.
    const scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"];
    if (scrollKeys.includes(e.key) || (e.key === " " && !(e.target instanceof HTMLButtonElement))) e.preventDefault();
  });

  // Keep focus inside if something else on the page takes it.
  document.addEventListener("focusin", (e) => {
    if (!open || !(e.target instanceof Node) || open.contains(e.target)) return;
    focusables(open)[0]?.focus({ preventScroll: true });
  });

  const stopScroll = (e: Event) => {
    if (open) e.preventDefault();
  };
  document.addEventListener("wheel", stopScroll, { passive: false });
  document.addEventListener("touchmove", stopScroll, { passive: false });

  // Pointer tilt on the settled card (mouse only; touch and pen get the still card).
  let raf = 0;
  document.addEventListener("pointermove", (e) => {
    if (!open || e.pointerType !== "mouse" || !open.classList.contains("is-revealed")) return;
    const dlg = open;
    const stage = dlg.querySelector<HTMLElement>("[data-pack-stage]");
    const tilt = dlg.querySelector<HTMLElement>("[data-pack-tilt]");
    if (!stage || !tilt) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = stage.getBoundingClientRect();
      const px = (clientX - r.left) / r.width - 0.5;
      const py = (clientY - r.top) / r.height - 0.5;
      if (Math.abs(px) > 0.75 || Math.abs(py) > 0.75) {
        resetTilt(dlg);
        return;
      }
      const cx = Math.max(-0.5, Math.min(0.5, px));
      const cy = Math.max(-0.5, Math.min(0.5, py));
      tilt.classList.add("is-tilting");
      tilt.style.setProperty("--ry", `${(cx * 16).toFixed(2)}deg`);
      tilt.style.setProperty("--rx", `${(-cy * 12).toFixed(2)}deg`);
      tilt.style.setProperty("--gx", `${(cx * 60).toFixed(1)}%`);
      tilt.style.setProperty("--gy", `${(cy * 60).toFixed(1)}%`);
    });
  });

  // Coming back with the browser's Back button: the page is restored closed.
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) close(false);
  });
  window.addEventListener("pagehide", () => close(false));
}
