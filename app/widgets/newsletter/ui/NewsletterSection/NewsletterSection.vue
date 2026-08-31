<script setup lang="ts">
import { ref } from 'vue'
import { FieldText, SectionShell } from '~/shared/ui'
import { useFakeSubmit, useToasts } from '~/shared/lib'
import { EMAIL_RE } from '~/widgets/newsletter/model/constants'

const { t } = useI18n()
const email = ref('')
const error = ref('')
const { pending, run } = useFakeSubmit()
const { push } = useToasts()

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
</script>

<template>
  <SectionShell id="newsletter" title-key="sections.newsletter.title">
    <p class="text-ink-dim">{{ t('newsletter.body') }}</p>
    <form class="mt-6 flex max-w-md items-end gap-4" novalidate @submit.prevent="submit">
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
  </SectionShell>
</template>
