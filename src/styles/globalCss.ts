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
     and Inspector become narrow drawers over Canvas (which stays
     partially visible behind them), toggled by .fb-mobile-bar's two
     buttons, tracked by .fb-work-area's data-mobile-panel attribute,
     and dismissible via .fb-mobile-backdrop. */
  .fb-mobile-bar { display: none; align-items: center; gap: 6px; padding: 6px 10px; border-bottom: 1px solid var(--fb-border); background: var(--fb-surface); flex-shrink: 0; }
  .fb-mobile-btn { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 7px; border: 1px solid var(--fb-border); background: var(--fb-surface); color: var(--fb-muted); font-size: 12.5px; font-weight: 600; }
  .fb-mobile-btn[aria-pressed="true"] { border-color: var(--fb-primary); background: var(--fb-primary-soft); color: var(--fb-primary); }
  .fb-mobile-backdrop { display: none; }
  @media (max-width: 720px) {
    .fb-mobile-bar { display: flex; }
    .fb-work-area { flex-direction: column !important; min-height: 0; }
    .fb-canvas-area { position: relative; overflow: hidden; }
    .fb-canvas { width: 100%; }
    .fb-mobile-backdrop { display: block; position: absolute; inset: 0; z-index: 6; background: rgba(15,16,20,0.35); }
    .fb-palette, .fb-inspector {
      position: absolute; top: 0; bottom: 0; z-index: 7;
      width: min(260px, 80vw) !important; max-height: none !important;
      border: none !important;
      box-shadow: 0 0 24px rgba(0,0,0,0.18);
      transition: transform 0.18s ease;
    }
    .fb-palette { left: 0; transform: translateX(-100%); }
    .fb-inspector { right: 0; transform: translateX(100%); }
    .fb-work-area[data-mobile-panel="palette"] .fb-palette,
    .fb-work-area[data-mobile-panel="inspector"] .fb-inspector { transform: translateX(0); }
  }
`;
