<template>
  <div>
    <div v-if="editor">
      <button @click="editor.chain().focus().toggleBold().run()">
        Bold
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()">
        Italic
      </button>
    </div>

    <EditorContent v-if="editor" :editor="editor" />
  </div>
</template>

<script setup>
import { onBeforeUnmount } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  content: '<p>Hello World! 🌍</p>',
  extensions: [StarterKit],
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
.ProseMirror {
  border: 1px solid #ccc;
  padding: 12px;
  min-height: 200px;
}
</style>