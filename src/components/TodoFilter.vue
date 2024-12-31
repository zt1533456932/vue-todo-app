<template>
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div class="flex items-center space-x-4">
      <button
        v-for="option in filterOptions"
        :key="option.value"
        @click="store.setFilter(option.value)"
        class="btn-secondary"
        :class="{ 'bg-primary text-white hover:bg-primary-dark': store.filter === option.value }"
        :disabled="store.loading"
      >
        {{ option.label }}
        <span class="ml-2 text-sm">{{ store.stats[option.value] }}</span>
      </button>
    </div>
    
    <div class="flex items-center space-x-2">
      <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-primary transition-all duration-300"
          :style="{ width: `${store.stats.percentage}%` }"
        ></div>
      </div>
      <span class="text-sm">{{ store.stats.percentage }}%</span>
    </div>
  </div>
</template>

<script setup>
import { useTodoStore } from '../stores/todo'

const store = useTodoStore()

const filterOptions = [
  { label: '全部', value: 'all' },
  { label: '待完成', value: 'active' },
  { label: '已完成', value: 'completed' }
]
</script> 