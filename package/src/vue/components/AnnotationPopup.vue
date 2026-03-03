<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import styles from '../../core/styles/annotation-popup.module.scss'
import { originalSetTimeout } from '../../core/utils/freeze-animations'

// =============================================================================
// Props
// =============================================================================

const props = withDefaults(defineProps<{
  element: string
  timestamp?: string
  selectedText?: string
  placeholder?: string
  initialValue?: string
  submitLabel?: string
  onSubmit: (text: string) => void
  onCancel: () => void
  onDelete?: () => void
  popupStyle?: Record<string, unknown>
  accentColor?: string
  isExiting?: boolean
  lightMode?: boolean
  computedStyles?: Record<string, string>
}>(), {
  placeholder: 'What should change?',
  initialValue: '',
  submitLabel: 'Add',
  accentColor: '#3c82f7',
  isExiting: false,
  lightMode: false,
})

// =============================================================================
// State
// =============================================================================

const text = ref(props.initialValue)
const isShaking = ref(false)
const animState = ref<'initial' | 'enter' | 'entered' | 'exit'>('initial')
const isFocused = ref(false)
const isStylesExpanded = ref(false)

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const popupRef = ref<HTMLDivElement | null>(null)

let cancelTimer: ReturnType<typeof setTimeout> | null = null
let shakeTimer: ReturnType<typeof setTimeout> | null = null

// =============================================================================
// Sync with parent exit state
// =============================================================================

watch(() => props.isExiting, (exiting) => {
  if (exiting && animState.value !== 'exit') {
    animState.value = 'exit'
  }
})

// =============================================================================
// Mount animation + focus
// =============================================================================

onMounted(() => {
  originalSetTimeout(() => {
    animState.value = 'enter'
  }, 0)
  const enterTimer = originalSetTimeout(() => {
    animState.value = 'entered'
  }, 200)
  const focusTimer = originalSetTimeout(() => {
    const textarea = textareaRef.value
    if (textarea) {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = textarea.value.length
      textarea.scrollTop = textarea.scrollHeight
    }
  }, 50)

  onUnmounted(() => {
    clearTimeout(enterTimer)
    clearTimeout(focusTimer)
    if (cancelTimer) clearTimeout(cancelTimer)
    if (shakeTimer) clearTimeout(shakeTimer)
  })
})

// =============================================================================
// Methods
// =============================================================================

function shake() {
  if (shakeTimer) clearTimeout(shakeTimer)
  isShaking.value = true
  shakeTimer = originalSetTimeout(() => {
    isShaking.value = false
    textareaRef.value?.focus()
  }, 250)
}

function handleCancel() {
  animState.value = 'exit'
  cancelTimer = originalSetTimeout(() => {
    props.onCancel()
  }, 150)
}

function handleSubmit() {
  if (!text.value.trim()) return
  props.onSubmit(text.value.trim())
}

function handleKeyDown(e: KeyboardEvent) {
  if ((e as any).isComposing) return
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
  if (e.key === 'Escape') {
    handleCancel()
  }
}

function toggleStyles() {
  const wasExpanded = isStylesExpanded.value
  isStylesExpanded.value = !isStylesExpanded.value
  if (wasExpanded) {
    originalSetTimeout(() => textareaRef.value?.focus(), 0)
  }
}

// =============================================================================
// Expose
// =============================================================================

defineExpose({ shake })

// =============================================================================
// Computed class
// =============================================================================

function popupClassName() {
  return [
    styles.popup,
    props.lightMode ? styles.light : '',
    animState.value === 'enter' ? styles.enter : '',
    animState.value === 'entered' ? styles.entered : '',
    animState.value === 'exit' ? styles.exit : '',
    isShaking.value ? styles.shake : '',
  ].filter(Boolean).join(' ')
}

function kebab(str: string) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}
</script>

<template>
  <div
    ref="popupRef"
    :class="popupClassName()"
    data-annotation-popup
    :style="popupStyle"
    @click.stop
  >
    <div :class="styles.header">
      <button
        v-if="computedStyles && Object.keys(computedStyles).length > 0"
        :class="styles.headerToggle"
        type="button"
        @click="toggleStyles"
      >
        <svg
          :class="[styles.chevron, isStylesExpanded ? styles.expanded : '']"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 10.25L9 7.25L5.75 4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span :class="styles.element">{{ element }}</span>
      </button>
      <span v-else :class="styles.element">{{ element }}</span>
      <span v-if="timestamp" :class="styles.timestamp">{{ timestamp }}</span>
    </div>

    <!-- Collapsible computed styles section -->
    <div
      v-if="computedStyles && Object.keys(computedStyles).length > 0"
      :class="[styles.stylesWrapper, isStylesExpanded ? styles.expanded : '']"
    >
      <div :class="styles.stylesInner">
        <div :class="styles.stylesBlock">
          <div
            v-for="(value, key) in computedStyles"
            :key="key"
            :class="styles.styleLine"
          >
            <span :class="styles.styleProperty">{{ kebab(String(key)) }}</span>
            : <span :class="styles.styleValue">{{ value }}</span>;
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedText" :class="styles.quote">
      &ldquo;{{ selectedText.slice(0, 80) }}{{ selectedText.length > 80 ? '...' : '' }}&rdquo;
    </div>

    <textarea
      ref="textareaRef"
      :class="styles.textarea"
      :style="{ borderColor: isFocused ? accentColor : undefined }"
      :placeholder="placeholder"
      :value="text"
      :rows="2"
      @input="text = ($event.target as HTMLTextAreaElement).value"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keydown="handleKeyDown"
    />

    <div :class="styles.actions">
      <div v-if="onDelete" :class="styles.deleteWrapper">
        <button :class="styles.deleteButton" type="button" @click="onDelete">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <button :class="styles.cancel" @click="handleCancel">Cancel</button>
      <button
        :class="styles.submit"
        :style="{
          backgroundColor: accentColor,
          opacity: text.trim() ? 1 : 0.4,
        }"
        :disabled="!text.trim()"
        @click="handleSubmit"
      >
        {{ submitLabel }}
      </button>
    </div>
  </div>
</template>
