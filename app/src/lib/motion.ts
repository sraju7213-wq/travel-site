import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Shared motion primitives for the India Nepal Travel Center site.
 *
 * Every animated surface in the product pulls its easing, duration and
 * reduced-motion behaviour from this module so the whole site moves with one
 * consistent voice rather than a dozen hand-tuned curves.
 */

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  ScrollTrigger.config({
    // Only fire onEnter/onLeave etc. when the trigger state actually changes,
    // rather than on every scroll tick — less main-thread work on every device.
    limitCallbacks: true,
    // Mobile browsers fire resize when the URL bar collapses; refreshing every
    // trigger on that event causes visible jank and wasted layout work.
    ignoreMobileResize: true,
  });
}

/** Named eases. `expo` is the house curve for entrances, `power2` for micro-interactions. */
export const EASE = {
  out: "power3.out",
  expo: "expo.out",
  soft: "power2.out",
  inOut: "power2.inOut",
  back: "back.out(1.4)",
} as const;

/** Duration ladder in seconds — keeps timing legible across the product. */
export const DURATION = {
  micro: 0.28,
  quick: 0.5,
  base: 0.85,
  slow: 1.15,
  cinematic: 1.6,
} as const;

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * True when the visitor has asked their OS to reduce motion.
 * Safe to call during render (returns false on the server).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Splits a string into words, keeping whitespace out of the result so the
 * caller controls its own spacing (important for `inline-block` word masks).
 */
export function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/**
 * Recursively walks the DOM under `root` and collects the text nodes that
 * belong to it. Used by `SplitText` when it needs to animate a heading that
 * already contains inline markup.
 */
export function textNodesOf(root: Node): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const value = node.nodeValue ?? "";
      if (!value.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      // Skip anything visually hidden from the accessibility tree.
      if (parent.closest("[aria-hidden='true']")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }
  return nodes;
}
