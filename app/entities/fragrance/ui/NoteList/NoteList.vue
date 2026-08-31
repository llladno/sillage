<script setup lang="ts">
defineProps<{ notes: string[]; label: string }>()
</script>

<template>
  <div class="border-t border-line py-5" data-note-row>
    <p class="text-xs uppercase tracking-widest text-ink-dim">{{ label }}</p>
    <p class="mt-2 font-display text-xl">
      <span v-for="(note, index) in notes" :key="note">
        {{ note }}<span v-if="index < notes.length - 1"> · </span>
      </span>
    </p>
  </div>
</template>
