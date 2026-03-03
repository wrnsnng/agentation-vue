// Build-time constants injected by tsup
declare const __VERSION__: string;

// Vue SFC module declarations
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
