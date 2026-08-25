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
     don't leave room for a usable Canvas, so stack all three instead of
     letting .fb-root's overflow:hidden clip Inspector off-screen. */
  @media (max-width: 720px) {
    .fb-work-area { flex-direction: column !important; overflow-y: auto; }
    .fb-palette { width: 100% !important; max-height: 45vh; border-right: none !important; border-bottom: 1px solid var(--fb-border); }
    .fb-canvas { width: 100%; }
    .fb-inspector { width: 100% !important; border-left: none !important; border-top: 1px solid var(--fb-border); }
  }
`;
