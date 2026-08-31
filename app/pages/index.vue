<script setup lang="ts">
import { ScrubHero } from '~/widgets/scrub-hero'
import { CompositionPyramid } from '~/widgets/composition'
import { StorySection } from '~/widgets/story'
import { ObjectSection } from '~/widgets/object'
import { RitualSection } from '~/widgets/ritual'
import { AcquireSection } from '~/widgets/acquire'
</script>

<template>
  <div>
    <ScrubHero />
    <CompositionPyramid />
    <StorySection />
    <ObjectSection />
    <RitualSection />
    <AcquireSection />
  </div>
</template>
