<template>
  <div class="mb-8 animate-fade-in">
    <form @submit.prevent="handleSubmit" class="relative">
      <input
        v-model="newTodo"
        type="text"
        placeholder="添加新的待办事项..."
        class="input pr-12"
        :class="{ 'border-red-500 focus:ring-red-500': error }"
        :disabled="store.loading"
      />
      <button
        type="submit"
        class="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-1 !px-3"
        :disabled="store.loading"
      >
        <SpinnerIcon v-if="store.loading" class="w-5 h-5 animate-spin" />
        <PlusIcon v-else class="w-5 h-5" />
      </button>
    </form>
    <p v-if="error || store.error" class="text-red-500 text-sm mt-1">
      {{ error || store.error }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { ArrowPathIcon as SpinnerIcon } from '@heroicons/vue/24/outline'
import { useTodoStore } from '../stores/todo'

const store = useTodoStore()
const newTodo = ref('')
const error = ref('')

const handleSubmit = async () => {
  if (!newTodo.value.trim()) {
    error.value = '请输入待办事项内容'
    return
  }
  
  error.value = ''
  await store.addTodo(newTodo.value.trim())
  if (!store.error) {
    newTodo.value = ''
  }
}
</script> 