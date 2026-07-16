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
`;
