import { useCallback, useEffect, useRef, useState } from "react";
import type { DocumentFields, FormDocument } from "../types";
import { CLIPBOARD_KEY } from "../lib/storage/keys";
import { parseTemplate, serializeTemplate } from "../lib/template";

/**
 * Cross-instance "template clipboard" over one localStorage key (not the StorageAdapter — this is
 * ephemeral per-browser scratch). Watched via `storage` events (other tabs) + this listener set (same tab).
 */
const sameTabListeners = new Set<() => void>();
function notifySameTab() {
  sameTabListeners.forEach((fn) => fn());
}

function readKey(key: string): string | null {
  try {
    return typeof window !== "undefined" && window.localStorage ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

export function useTemplateClipboard(clipboardKey: string = CLIPBOARD_KEY) {
  const keyRef = useRef(clipboardKey);
  keyRef.current = clipboardKey;

  const [hasClipboard, setHasClipboard] = useState(false);

  const refresh = useCallback(() => {
    setHasClipboard(parseTemplate(readKey(keyRef.current)) !== null);
  }, []);

  useEffect(() => {
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === keyRef.current) refresh();
    };
    sameTabListeners.add(refresh);
    window.addEventListener("storage", onStorage);
    return () => {
      sameTabListeners.delete(refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const copyTemplate = useCallback((document: FormDocument) => {
    const str = serializeTemplate(document);
    try {
      window.localStorage?.setItem(keyRef.current, str);
    } catch {
      /* quota / unavailable */
    }
    navigator?.clipboard?.writeText?.(str).catch(() => {}); // best-effort OS-clipboard mirror

    notifySameTab();
    refresh();
  }, [refresh]);

  const readTemplate = useCallback((): DocumentFields | null => {
    return parseTemplate(readKey(keyRef.current));
  }, []);

  return { hasClipboard, copyTemplate, readTemplate };
}
