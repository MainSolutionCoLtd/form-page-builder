export const css = `
  * { box-sizing: border-box; }
  button { font-family: inherit; cursor: pointer; }
  input, textarea, select { font-family: inherit; }
  @keyframes fb-spin { to { transform: rotate(360deg); } }
  .spin { animation: fb-spin 0.8s linear infinite; }
  /* Caps the widget at the viewport height so it scrolls internally rather
     than growing past whatever space its host container gives it; the
     second declaration upgrades to the dynamic viewport unit on browsers
     that support it (mobile browser chrome resizing the viewport), and is
     simply ignored by ones that don't. */
  .fb-root { max-height: 100vh; max-height: 100dvh; }

  /* Below this width the fixed 200px Palette + 270px Inspector columns
     don't leave room for a usable Canvas, so instead of stacking all
     three in flow (which buries Canvas under a tall Palette), Palette
     and Inspector become full-bleed drawers over Canvas, toggled by
     .fb-mobile-bar's two buttons and tracked by .fb-work-area's
     data-mobile-panel attribute — Canvas itself is always visible. */
  .fb-mobile-bar { display: none; align-items: center; gap: 6px; padding: 6px 10px; border-bottom: 1px solid var(--fb-border); background: var(--fb-surface); flex-shrink: 0; }
  .fb-mobile-btn { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 7px; border: 1px solid var(--fb-border); background: var(--fb-surface); color: var(--fb-muted); font-size: 12.5px; font-weight: 600; }
  .fb-mobile-btn[aria-pressed="true"] { border-color: var(--fb-primary); background: var(--fb-primary-soft); color: var(--fb-primary); }
  @media (max-width: 720px) {
    .fb-mobile-bar { display: flex; }
    .fb-work-area { flex-direction: column !important; min-height: 0; }
    .fb-canvas-area { position: relative; overflow: hidden; }
    .fb-canvas { width: 100%; }
    .fb-palette, .fb-inspector {
      position: absolute; inset: 0; z-index: 6;
      width: 100% !important; max-height: none !important;
      border: none !important;
      transition: transform 0.18s ease;
    }
    .fb-palette { transform: translateX(-100%); }
    .fb-inspector { transform: translateX(100%); }
    .fb-work-area[data-mobile-panel="palette"] .fb-palette,
    .fb-work-area[data-mobile-panel="inspector"] .fb-inspector { transform: translateX(0); }
  }
`;
