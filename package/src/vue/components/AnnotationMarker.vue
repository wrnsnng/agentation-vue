<script setup lang="ts">
import { computed } from 'vue'
import { IconXmark, IconEdit } from './icons'
import styles from '../../core/styles/page-toolbar.module.scss'
import type { Annotation } from '../../core/types'

const props = defineProps<{
  annotation: Annotation
  globalIndex: number
  index: number
  totalVisible: number
  isHovered: boolean
  isDeleting: boolean
  isEditing: boolean
  markerColor: string
  markerClickBehavior: 'edit' | 'delete'
  markersExiting: boolean
  isClearing: boolean
  needsEnterAnimation: boolean
  animatedMarkersSize: number
  isFixed: boolean
  renumberFrom: number | null
  isDarkMode: boolean
  tooltipExitingId: string | null
}>()

const emit = defineEmits<{
  (e: 'mouseenter'): void
  (e: 'mouseleave'): void
  (e: 'click'): void
  (e: 'contextmenu', event: MouseEvent): void
}>()

const showDeleteState = computed(() => (props.isHovered || props.isDeleting) && !props.isEditing)
const showDeleteHover = computed(() => showDeleteState.value && props.markerClickBehavior === 'delete')

const animClass = computed(() => {
  if (props.markersExiting) return styles.exit
  if (props.isClearing) return styles.clearing
  if (props.needsEnterAnimation) return styles.enter
  return ''
})

const markerClass = computed(() => [
  styles.marker,
  props.isFixed ? styles.fixed : '',
  props.annotation.isMultiSelect ? styles.multiSelect : '',
  animClass.value,
  showDeleteHover.value ? styles.hovered : '',
].filter(Boolean).join(' '))

const animDelay = computed(() => {
  if (props.markersExiting) {
    return `${(props.totalVisible - 1 - props.index) * 20}ms`
  }
  if (props.needsEnterAnimation && props.animatedMarkersSize === 0) {
    return `${props.index * 20}ms`
  }
  return undefined
})

const showTooltip = computed(() =>
  (props.isHovered || props.tooltipExitingId === props.annotation.id) && !props.isEditing
)

const tooltipAnimClass = computed(() =>
  props.tooltipExitingId === props.annotation.id && !props.isHovered
    ? styles.exit
    : styles.enter
)

function getTooltipPosition(): Record<string, string> {
  const tooltipMaxWidth = 200
  const tooltipEstimatedHeight = 80
  const markerSize = 22
  const gap = 10

  const markerX = (props.annotation.x / 100) * window.innerWidth
  const markerY = typeof props.annotation.y === 'string' ? parseFloat(props.annotation.y) : props.annotation.y
  const result: Record<string, string> = {}

  const spaceBelow = window.innerHeight - markerY - markerSize - gap
  if (spaceBelow < tooltipEstimatedHeight) {
    result.top = 'auto'
    result.bottom = `calc(100% + ${gap}px)`
  }

  const centerX = markerX - tooltipMaxWidth / 2
  const edgePadding = 10
  if (centerX < edgePadding) {
    const offset = edgePadding - centerX
    result.left = `calc(50% + ${offset}px)`
  } else if (centerX + tooltipMaxWidth > window.innerWidth - edgePadding) {
    const overflow = centerX + tooltipMaxWidth - (window.innerWidth - edgePadding)
    result.left = `calc(50% - ${overflow}px)`
  }

  return result
}
</script>

<template>
  <div
    :class="markerClass"
    data-annotation-marker
    :style="{
      left: `${annotation.x}%`,
      top: annotation.isFixed ? `${annotation.y}px` : annotation.y + 'px',
      backgroundColor: showDeleteHover ? undefined : markerColor,
      animationDelay: animDelay,
    }"
    @mouseenter="emit('mouseenter')"
    @mouseleave="emit('mouseleave')"
    @click.stop="emit('click')"
    @contextmenu="emit('contextmenu', $event)"
  >
    <template v-if="showDeleteState">
      <IconXmark v-if="showDeleteHover" :size="annotation.isMultiSelect ? 18 : 16" />
      <IconEdit v-else :size="16" />
    </template>
    <span
      v-else
      :class="renumberFrom !== null && globalIndex >= renumberFrom ? styles.renumber : undefined"
    >
      {{ globalIndex + 1 }}
    </span>

    <!-- Tooltip -->
    <div
      v-if="showTooltip"
      :class="[
        styles.markerTooltip,
        !isDarkMode ? styles.light : '',
        tooltipAnimClass,
      ]"
      :style="getTooltipPosition()"
    >
      <span :class="styles.markerQuote">
        {{ annotation.element }}
        <template v-if="annotation.selectedText">
          &nbsp;"{{ annotation.selectedText.slice(0, 30) }}{{ annotation.selectedText.length > 30 ? '...' : '' }}"
        </template>
      </span>
      <span :class="styles.markerNote">{{ annotation.comment }}</span>
    </div>
  </div>
</template>
