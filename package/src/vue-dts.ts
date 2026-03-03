// Type-only entry point for Vue DTS generation.
// Mirrors the runtime exports from vue.ts but avoids importing .vue files
// (which Rollup's DTS plugin cannot process).

import type { DefineComponent } from "vue";

// Main components
export declare const Agentation: DefineComponent;
export declare const AgentationToolbar: DefineComponent;

// Sub-component
export declare const AnnotationPopup: DefineComponent;

// Icons
type IconComponent = DefineComponent<{ size?: number }>;

export declare const IconClose: IconComponent;
export declare const IconPlus: IconComponent;
export declare const IconCheck: IconComponent;
export declare const IconCheckSmall: IconComponent;
export declare const IconListSparkle: IconComponent;
export declare const IconHelp: IconComponent;
export declare const IconCheckSmallAnimated: IconComponent;
export declare const IconCopyAlt: IconComponent;
export declare const IconCopyAnimated: IconComponent;
export declare const IconSendArrow: IconComponent;
export declare const IconSendAnimated: IconComponent;
export declare const IconEye: IconComponent;
export declare const IconEyeAlt: IconComponent;
export declare const IconEyeClosed: IconComponent;
export declare const IconEyeAnimated: IconComponent;
export declare const IconPausePlayAnimated: IconComponent;
export declare const IconEyeMinus: IconComponent;
export declare const IconGear: IconComponent;
export declare const IconPauseAlt: IconComponent;
export declare const IconPause: IconComponent;
export declare const IconPlayAlt: IconComponent;
export declare const IconTrashAlt: IconComponent;
export declare const IconChatEllipsis: IconComponent;
export declare const IconCheckmark: IconComponent;
export declare const IconCheckmarkLarge: IconComponent;
export declare const IconCheckmarkCircle: IconComponent;
export declare const IconXmark: IconComponent;
export declare const IconXmarkLarge: IconComponent;
export declare const IconSun: IconComponent;
export declare const IconMoon: IconComponent;
export declare const IconEdit: IconComponent;
export declare const IconTrash: IconComponent;
export declare const IconChevronLeft: IconComponent;
export declare const IconChevronRight: IconComponent;
export declare const IconPencil: IconComponent;
export declare const AnimatedBunny: IconComponent;

// Utilities
export {
  identifyElement,
  identifyAnimationElement,
  getElementPath,
  getNearbyText,
  getElementClasses,
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
