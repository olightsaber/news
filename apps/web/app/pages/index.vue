<script setup>
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

const { $db } = useNuxtApp()
const articles = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const q = query(collection($db, 'articles'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    articles.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } finally {
    loading.value = false
  }
})

function formatDate(ts) {
  if (!ts) return ''
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function extractPreview(content) {
  if (!content) return ''
  const walk = (nodes) => {
    if (!Array.isArray(nodes)) return ''
    return nodes.map(n => {
      if (n.type === 'text') return n.text || ''
      if (n.content) return walk(n.content)
      return ''
    }).join(' ')
  }
  const raw = walk(content?.content || [])
  return raw.length > 120 ? raw.slice(0, 120).trimEnd() + '…' : raw
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">

    <!-- ── Sticky Header ── -->
    <header class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
      <UContainer>
        <div class="flex items-center justify-between h-16">
          <!-- left spacer -->
          <div class="w-24" />

          <!-- centered logo -->
          <NuxtLink to="/" class="flex items-center gap-2 group select-none">
            <div class="size-9 rounded-xl bg-primary flex items-center justify-center shadow">
              <UIcon name="i-heroicons-newspaper" class="text-xl text-white" />
            </div>
            <span class="text-xl font-black tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              The&nbsp;News
            </span>
          </NuxtLink>

          <!-- right: color mode -->
          <div class="w-24 flex justify-end">
            <UColorModeButton />
          </div>
        </div>
      </UContainer>
    </header>

    <!-- ── Hero ── -->
    <section class="py-16 text-center">
      <UContainer>
        <UBadge color="primary" variant="subtle" size="md" class="mb-4">
          <UIcon name="i-heroicons-bolt" class="mr-1" />
          Latest Coverage
        </UBadge>
        <h1 class="text-5xl font-black tracking-tight text-gray-900 dark:text-white mt-2 mb-4">
          Stay <span class="text-primary">Informed</span>
        </h1>
        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Hand-picked articles from our editors, delivered fresh every day.
        </p>
      </UContainer>
    </section>

    <UDivider class="mb-12" />

    <!-- ── Article Grid ── -->
    <UContainer class="pb-20">

      <!-- Loading skeletons -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard v-for="i in 6" :key="i">
          <template #header>
            <USkeleton class="h-5 w-3/4 rounded" />
          </template>
          <div class="space-y-2">
            <USkeleton class="h-3 w-full rounded" />
            <USkeleton class="h-3 w-5/6 rounded" />
            <USkeleton class="h-3 w-4/6 rounded" />
          </div>
          <template #footer>
            <USkeleton class="h-4 w-24 rounded" />
          </template>
        </UCard>
      </div>

      <!-- Empty state -->
      <div v-else-if="articles.length === 0" class="flex flex-col items-center py-32 gap-4">
        <div class="size-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <UIcon name="i-heroicons-newspaper" class="text-4xl text-gray-400" />
        </div>
        <p class="text-xl font-semibold text-gray-700 dark:text-gray-300">No articles yet</p>
        <p class="text-gray-400 text-sm">Check back soon — our editors are working on it.</p>
      </div>

      <!-- Cards grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="article in articles"
          :key="article.id"
          :to="`/articles/${article.id}`"
          class="group focus:outline-none"
        >
          <UCard
            class="h-full flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 ring-1 ring-transparent hover:ring-primary/30"
          >
            <template #header>
              <div class="flex items-start justify-between gap-2">
                <h2 class="text-base font-bold leading-snug text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 flex-1">
                  {{ article.title }}
                </h2>
                <UIcon name="i-heroicons-arrow-up-right" class="text-gray-300 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              </div>
            </template>

            <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 flex-1">
              {{ extractPreview(article.content) || 'Click to read the full article.' }}
            </p>

            <template #footer>
              <div class="flex items-center justify-between">
                <UBadge color="neutral" variant="subtle" size="sm">
                  <UIcon name="i-heroicons-calendar-days" class="mr-1 text-xs" />
                  {{ formatDate(article.createdAt) }}
                </UBadge>
                <span class="text-xs font-semibold text-primary flex items-center gap-0.5">
                  Read more
                  <UIcon name="i-heroicons-arrow-right" class="text-xs" />
                </span>
              </div>
            </template>
          </UCard>
        </NuxtLink>
      </div>

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
