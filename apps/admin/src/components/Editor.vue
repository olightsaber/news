<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

import { db } from '../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const title = ref('')
const saving = ref(false)
const saved = ref(false)

const editor = useEditor({
  content: '<p>Start writing your article here...</p>',
  extensions: [StarterKit, Underline],
})

const saveArticle = async () => {
  if (!title.value.trim()) {
    alert('Please enter a title.')
    return
  }

  saving.value = true
  saved.value = false

  try {
    await addDoc(collection(db, 'articles'), {
      title: title.value.trim(),
      content: editor.value.getJSON(),
      createdAt: serverTimestamp()
    })

    saved.value = true
    title.value = ''
    editor.value.commands.setContent('<p>Start writing your article here...</p>')
    setTimeout(() => { saved.value = false }, 3000)
  } catch (err) {
    alert('Failed to save article. Please try again.')
    console.error(err)
  } finally {
    saving.value = false
  }
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="editor-page">
    <header class="editor-header">
      <h1>Write Article</h1>
      <button
        class="publish-btn"
        :class="{ saving }"
        :disabled="saving"
        @click="saveArticle"
      >
        {{ saving ? 'Publishing...' : 'Publish' }}
      </button>
    </header>

    <div v-if="saved" class="saved-notice">
      Article published successfully!
    </div>

    <input
      v-model="title"
      placeholder="Article title"
      class="title-input"
    />

    <div v-if="editor" class="toolbar">
      <!-- Headings -->
      <div class="toolbar-group">
        <button
          v-for="level in [1, 2, 3]"
          :key="level"
          :class="{ active: editor.isActive('heading', { level }) }"
          :title="`Heading ${level}`"
          @click="editor.chain().focus().toggleHeading({ level }).run()"
        >H{{ level }}</button>
      </div>

      <!-- Inline marks -->
      <div class="toolbar-group">
        <button
          :class="{ active: editor.isActive('bold') }"
          title="Bold (Ctrl+B)"
          @click="editor.chain().focus().toggleBold().run()"
        ><b>B</b></button>
        <button
          :class="{ active: editor.isActive('italic') }"
          title="Italic (Ctrl+I)"
          @click="editor.chain().focus().toggleItalic().run()"
        ><i>I</i></button>
        <button
          :class="{ active: editor.isActive('underline') }"
          title="Underline (Ctrl+U)"
          @click="editor.chain().focus().toggleUnderline().run()"
        ><u>U</u></button>
        <button
          :class="{ active: editor.isActive('strike') }"
          title="Strikethrough"
          @click="editor.chain().focus().toggleStrike().run()"
        ><s>S</s></button>
        <button
          :class="{ active: editor.isActive('code') }"
          title="Inline code"
          @click="editor.chain().focus().toggleCode().run()"
        >&lt;&gt;</button>
      </div>

      <!-- Lists & blocks -->
      <div class="toolbar-group">
        <button
          :class="{ active: editor.isActive('bulletList') }"
          title="Bullet list"
          @click="editor.chain().focus().toggleBulletList().run()"
        >• List</button>
        <button
          :class="{ active: editor.isActive('orderedList') }"
          title="Ordered list"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >1. List</button>
        <button
          :class="{ active: editor.isActive('blockquote') }"
          title="Blockquote"
          @click="editor.chain().focus().toggleBlockquote().run()"
        >" Quote</button>
        <button
          :class="{ active: editor.isActive('codeBlock') }"
          title="Code block"
          @click="editor.chain().focus().toggleCodeBlock().run()"
        >&lt;/&gt; Code</button>
      </div>

      <!-- Divider & history -->
      <div class="toolbar-group">
        <button
          title="Horizontal rule"
          @click="editor.chain().focus().setHorizontalRule().run()"
        >─ Rule</button>
      </div>

      <div class="toolbar-group">
        <button
          :disabled="!editor.can().undo()"
          title="Undo (Ctrl+Z)"
          @click="editor.chain().focus().undo().run()"
        >↩ Undo</button>
        <button
          :disabled="!editor.can().redo()"
          title="Redo (Ctrl+Y)"
          @click="editor.chain().focus().redo().run()"
        >↪ Redo</button>
      </div>
    </div>

    <EditorContent v-if="editor" :editor="editor" class="editor-content" />
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.editor-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 28px 24px 48px;
  font-family: system-ui, -apple-system, sans-serif;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.editor-header h1 {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
}

.saved-notice {
  background: #dcfce7;
  border: 1px solid #86efac;
  color: #166534;
  padding: 10px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.title-input {
  width: 100%;
  padding: 12px 14px;
  font-size: 1.25rem;
  font-weight: 600;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  margin-bottom: 8px;
  outline: none;
  transition: border-color 0.15s;
}
.title-input:focus {
  border-color: #6366f1;
}
.title-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 10px;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}

.toolbar-group {
  display: flex;
  gap: 2px;
  padding-right: 8px;
  border-right: 1px solid #e5e7eb;
  margin-right: 4px;
}
.toolbar-group:last-child {
  border-right: none;
  margin-right: 0;
}

.toolbar button {
  padding: 4px 10px;
  font-size: 0.82rem;
  border: 1px solid transparent;
  border-radius: 5px;
  background: none;
  cursor: pointer;
  color: #374151;
  transition: background 0.12s;
  white-space: nowrap;
}
.toolbar button:hover:not(:disabled) {
  background: #e5e7eb;
}
.toolbar button.active {
  background: #ede9fe;
  border-color: #a5b4fc;
  color: #4f46e5;
}
.toolbar button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.editor-content {
  border: 1px solid #d1d5db;
  border-radius: 0 0 8px 8px;
  min-height: 380px;
  padding: 20px;
  font-size: 1rem;
  line-height: 1.75;
  cursor: text;
}

:deep(.ProseMirror) {
  outline: none;
  min-height: 340px;
}
:deep(.ProseMirror h1) { font-size: 1.875rem; font-weight: 700; margin: 1.25rem 0 0.6rem; }
:deep(.ProseMirror h2) { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; }
:deep(.ProseMirror h3) { font-size: 1.25rem; font-weight: 600; margin: 0.875rem 0 0.4rem; }
:deep(.ProseMirror p) { margin: 0 0 0.75rem; }
:deep(.ProseMirror ul) { padding-left: 1.5rem; list-style: disc; margin-bottom: 0.75rem; }
:deep(.ProseMirror ol) { padding-left: 1.5rem; list-style: decimal; margin-bottom: 0.75rem; }
:deep(.ProseMirror li) { margin-bottom: 0.2rem; }
:deep(.ProseMirror blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  color: #6b7280;
  margin: 0.75rem 0;
  font-style: italic;
}
:deep(.ProseMirror code) {
  background: #f3f4f6;
  padding: 0.125rem 0.35rem;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 0.875em;
}
:deep(.ProseMirror pre) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 14px 18px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0.75rem 0;
}
:deep(.ProseMirror pre code) {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 0.9em;
}
:deep(.ProseMirror hr) {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 1.25rem 0;
}

.publish-btn {
  padding: 10px 24px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.publish-btn:hover:not(:disabled) {
  background: #4338ca;
}
.publish-btn.saving,
.publish-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>