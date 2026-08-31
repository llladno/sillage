<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { FieldText, SectionShell } from '~/shared/ui'
import { loadGsap, useFakeSubmit, useToasts } from '~/shared/lib'
import { EMAIL_RE } from '~/widgets/newsletter/model/constants'

const { t } = useI18n()
const email = ref('')
const error = ref('')
const { pending, run } = useFakeSubmit()
const { push } = useToasts()
const root = ref<HTMLElement | null>(null)

const submit = () => {
  if (!EMAIL_RE.test(email.value)) {
    error.value = t('newsletter.invalid')
    return
  }
  error.value = ''
  run(() => {
    push(t('newsletter.success'))
    email.value = ''
  })
}

let kill: (() => void) | undefined

onMounted(async () => {
  const context = await loadGsap()
  if (!context || !root.value) return
  const { gsap, ScrollTrigger } = context
  const element = root.value

  const scene = gsap.context(() => {
    gsap.fromTo(
      '[data-rule]',
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.9,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: element, start: 'top 80%' },
      },
    )
    gsap.from('[data-fade]', {
      opacity: 0,
      y: 18,
      stagger: 0.1,
      duration: 0.6,
      scrollTrigger: { trigger: element, start: 'top 78%' },
    })
  }, element)

  ScrollTrigger.refresh()
  kill = () => scene.revert()
})

onBeforeUnmount(() => kill?.())
</script>

<template>
  <SectionShell id="newsletter" title-key="sections.newsletter.title">
    <div ref="root">
      <span data-rule aria-hidden="true" class="block h-px w-full origin-left bg-line" />
      <p data-fade class="mt-6 text-ink-dim">{{ t('newsletter.body') }}</p>
      <form
        data-fade
        class="mt-6 flex max-w-md items-end gap-4"
        novalidate
        @submit.prevent="submit"
      >
        <FieldText
          v-model="email"
          type="email"
          :label="t('newsletter.emailLabel')"
          :placeholder="t('newsletter.placeholder')"
          :error="error"
          class="flex-1"
        />
        <button
          type="submit"
          class="rounded-pill border border-accent px-5 py-2 text-sm text-accent disabled:opacity-50"
          :disabled="pending"
        >
          {{ t('newsletter.submit') }}
        </button>
      </form>
    </div>
  </SectionShell>
</template>
