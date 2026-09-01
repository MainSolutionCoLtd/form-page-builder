export const css = `
  * { box-sizing: border-box; }
  button { font-family: inherit; cursor: pointer; }
  input, textarea, select { font-family: inherit; }
  @keyframes fb-spin { to { transform: rotate(360deg); } }
  .spin { animation: fb-spin 0.8s linear infinite; }
  /* Cap at viewport height so the widget scrolls internally; dvh upgrade is ignored where unsupported. */
  .fb-root { max-height: 100vh; max-height: 100dvh; }

  /* Toolbar's active-template label is nice-to-have — drop it first when width is tight. */
  @media (max-width: 600px) { .fb-template-tag { display: none; } }

  /* Under 720px: Palette/Inspector become drawers over Canvas, toggled by .fb-mobile-bar,
     tracked by .fb-work-area[data-mobile-panel], dismissed via .fb-mobile-backdrop. */
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
