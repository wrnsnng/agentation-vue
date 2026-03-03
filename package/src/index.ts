// =============================================================================
// Agentation
// =============================================================================
//
// A floating toolbar for annotating web pages and collecting structured feedback
// for AI coding agents.
//
// Usage:
//   import { Agentation } from 'agentation';
//   <Agentation />
//
// =============================================================================

// Main components
// CSS-only version (default - zero runtime deps)
export { PageFeedbackToolbarCSS as Agentation } from "./react/components/page-toolbar-css";
export { PageFeedbackToolbarCSS } from "./react/components/page-toolbar-css";
export type { DemoAnnotation, AgentationProps } from "./react/components/page-toolbar-css";

// Shared components (for building custom UIs)
export { AnnotationPopupCSS } from "./react/components/annotation-popup-css";
export type {
  AnnotationPopupCSSProps,
  AnnotationPopupCSSHandle,
} from "./react/components/annotation-popup-css";

// Icons (same for both versions - they're pure SVG)
export * from "./react/components/icons";

// Utilities (for building custom UIs)
export {
  identifyElement,
  identifyAnimationElement,
  getElementPath,
  getNearbyText,
  getElementClasses,
  // Shadow DOM support
  isInShadowDOM,
  getShadowHost,
  closestCrossingShadow,
} from "./core/utils/element-identification";

export {
  loadAnnotations,
  saveAnnotations,
  getStorageKey,
} from "./core/utils/storage";

// Types
export type { Annotation } from "./core/types";
