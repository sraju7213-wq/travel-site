/**
 * Shared theme constants. The inline bootstrap script in the root layout and
 * the ThemeToggle component both use the same storage key and attribute so a
 * saved choice survives navigation and reloads without a flash of the wrong
 * palette.
 */
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "ks-world-adventure-theme";
export const THEME_ATTRIBUTE = "data-theme";

export const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var m=window.matchMedia('(prefers-color-scheme: light)').matches;var t=(s==='light'||s==='dark')?s:(m?'light':'dark');var r=document.documentElement;r.setAttribute('${THEME_ATTRIBUTE}',t);r.style.colorScheme=t;var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content',t==='light'?'#F6F2E9':'#0C1617');}catch(e){document.documentElement.setAttribute('${THEME_ATTRIBUTE}','dark');}})();`;
