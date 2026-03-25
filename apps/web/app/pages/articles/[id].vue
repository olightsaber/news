<script setup>
import { doc, getDoc } from 'firebase/firestore'

const route = useRoute()
const { $db } = useNuxtApp()

const article = ref(null)
const loading = ref(true)
const contentHtml = ref('')

onMounted(async () => {
  try {
    const docRef = doc($db, 'articles', route.params.id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      article.value = { id: docSnap.id, ...docSnap.data() }
      if (article.value.content) {
        const [{ generateHTML }, { default: StarterKit }] = await Promise.all([
          import('@tiptap/html'),
          import('@tiptap/starter-kit')
        ])
        contentHtml.value = generateHTML(article.value.content, [StarterKit])
      }
    }
  } finally {
    loading.value = false
  }
})

function formatDate(ts) {
  if (!ts) return ''
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">

    <!-- ── Sticky Header ── -->
    <header class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
      <UContainer>
        <div class="flex items-center justify-between h-16">
          <div class="w-24" />
          <NuxtLink to="/" class="flex items-center gap-2 group select-none">
            <div class="size-9 rounded-xl bg-primary flex items-center justify-center shadow">
              <UIcon name="i-heroicons-newspaper" class="text-xl text-white" />
            </div>
            <span class="text-xl font-black tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              The&nbsp;News
            </span>
          </NuxtLink>
          <div class="w-24 flex justify-end">
            <UColorModeButton />
          </div>
        </div>
      </UContainer>
    </header>

    <UContainer class="max-w-3xl py-10 pb-24">

      <!-- Back button -->
      <UButton
        to="/"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-arrow-left"
        class="mb-8"
      >
        All articles
      </UButton>

      <!-- Loading skeletons -->
      <div v-if="loading" class="space-y-4">
        <USkeleton class="h-10 w-3/4 rounded-lg" />
        <USkeleton class="h-4 w-32 rounded" />
        <UDivider class="my-8" />
        <div class="space-y-3">
          <USkeleton v-for="i in 8" :key="i" :class="`h-4 rounded ${i % 4 === 0 ? 'w-2/3' : 'w-full'}`" />
        </div>
      </div>

      <!-- Not found -->
      <div v-else-if="!article" class="flex flex-col items-center py-32 gap-4">
        <div class="size-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <UIcon name="i-heroicons-exclamation-circle" class="text-4xl text-gray-400" />
        </div>
        <p class="text-xl font-semibold text-gray-700 dark:text-gray-300">Article not found</p>
        <UButton to="/" variant="soft" color="primary" icon="i-heroicons-arrow-left">
          Return home
        </UButton>
      </div>

      <!-- Article content -->
      <article v-else>
        <UCard class="mb-10">
          <template #header>
            <h1 class="text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
              {{ article.title }}
            </h1>
          </template>
          <UBadge color="neutral" variant="subtle">
            <UIcon name="i-heroicons-calendar-days" class="mr-1 text-xs" />
            {{ formatDate(article.createdAt) }}
          </UBadge>
        </UCard>

        <UDivider class="mb-10" />

        <div class="article-content" v-html="contentHtml" />
      </article>

    </UContainer>

    <!-- ── Footer ── -->
    <footer class="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-400">
      <UContainer>
        <div class="flex items-center justify-center gap-2">
          <UIcon name="i-heroicons-newspaper" class="text-primary" />
          <span>The News · {{ new Date().getFullYear() }}</span>
        </div>
      </UContainer>
    </footer>

  </div>
</template>

<style scoped>
.article-content :deep(h1) {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 1.5rem 0 0.75rem;
  line-height: 1.3;
}
.article-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.25rem 0 0.6rem;
  line-height: 1.35;
}
.article-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  line-height: 1.4;
}
.article-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
  color: rgb(55 65 81);
}
:is(.dark) .article-content :deep(p) {
  color: rgb(209 213 219);
}
.article-content :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.article-content :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.article-content :deep(li) {
  margin-bottom: 0.25rem;
  line-height: 1.75;
}
.article-content :deep(blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  color: #6b7280;
  margin: 1rem 0;
  font-style: italic;
}
.article-content :deep(code) {
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, monospace;
  font-size: 0.875em;
}
.article-content :deep(pre) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}
.article-content :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 0.9em;
}
.article-content :deep(strong) {
  font-weight: 700;
}
.article-content :deep(em) {
  font-style: italic;
}
.article-content :deep(s) {
  text-decoration: line-through;
}
.article-content :deep(hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5rem 0;
}
</style>


<style scoped>
.article-content :deep(h1) {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 1.5rem 0 0.75rem;
  line-height: 1.3;
}
.article-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.25rem 0 0.6rem;
  line-height: 1.35;
}
.article-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  line-height: 1.4;
}
.article-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
}
.article-content :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.article-content :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.article-content :deep(li) {
  margin-bottom: 0.25rem;
  line-height: 1.75;
}
.article-content :deep(blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  color: #6b7280;
  margin: 1rem 0;
  font-style: italic;
}
.article-content :deep(code) {
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, monospace;
  font-size: 0.875em;
}
.article-content :deep(pre) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}
.article-content :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 0.9em;
}
.article-content :deep(strong) {
  font-weight: 700;
}
.article-content :deep(em) {
  font-style: italic;
}
.article-content :deep(s) {
  text-decoration: line-through;
}
.article-content :deep(hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5rem 0;
}
</style>