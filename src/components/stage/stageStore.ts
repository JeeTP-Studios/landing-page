/**
 * What the page tells the 3D stage. Pages register the elements the stage
 * should follow; the stage reads them every frame. Home registers the hero
 * and the manifesto (full choreography); the footer registers itself on every
 * page (the assembled stack returns there). A page that registers nothing
 * leaves the stage hidden.
 */
export type StageTarget = "hero" | "mani" | "footer";

export const stageTargets: Record<StageTarget, HTMLElement | null> = {
  hero: null,
  mani: null,
  footer: null,
};

/** Ref callback factory: `ref={stageRef("hero")}`. */
export const stageRef =
  (name: StageTarget) =>
  (el: HTMLElement | null) => {
    stageTargets[name] = el;
  };
