// =============================================================================
// Agentation - Vue 3
// =============================================================================
//
// A floating toolbar for annotating web pages and collecting structured feedback
// for AI coding agents. Vue 3 version.
//
// Usage:
//   import { Agentation } from 'agentation/vue';
//
// =============================================================================

// Main component
export { default as Agentation } from "./vue/components/AgentationToolbar.vue";
export { default as AgentationToolbar } from "./vue/components/AgentationToolbar.vue";

// Sub-component (for building custom UIs)
export { default as AnnotationPopup } from "./vue/components/AnnotationPopup.vue";

// Icons
export * from "./vue/components/icons";

// Utilities (shared with React version)
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
