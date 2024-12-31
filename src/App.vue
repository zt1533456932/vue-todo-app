<template>
  <div class="min-h-screen p-4 md:p-8 bg-gradient-to-br from-background-light to-blue-50 dark:from-background-dark dark:to-slate-900">
    <div class="backdrop-blur-3xl backdrop-saturate-150">
      <div class="max-w-4xl mx-auto">
        <header class="flex items-center justify-between mb-8 p-6 rounded-2xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg shadow-lg">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            待办事项
          </h1>
          <button 
            @click="toggleDarkMode" 
            class="btn-secondary backdrop-blur-lg"
            aria-label="Toggle dark mode"
          >
            <SunIcon v-if="isDark" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>
        </header>
        
        <div class="space-y-6">
          <TodoInput />
          <TodoFilter />
          
          <div v-if="store.loading && !store.todos.length" class="flex justify-center py-12">
            <ArrowPathIcon class="w-8 h-8 animate-spin text-primary" />
          </div>
          
          <TransitionGroup
            v-else
            name="list"
            tag="ul"
            class="space-y-2"
          >
            <li
              v-for="todo in store.filteredTodos"
              :key="todo._id"
              class="group flex items-center space-x-3 p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg rounded-xl shadow-sm hover:shadow-md transition-all duration-200 animate-slide-in"
            >
              <button
                @click="store.toggleTodo(todo._id)"
                class="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center"
                :class="{ 'border-primary bg-primary': todo.isCompleted }"
                :disabled="store.loading"
              >
                <CheckIcon v-if="todo.isCompleted" class="w-4 h-4 text-white" />
              </button>
              
              <span
                class="flex-grow"
                :class="{ 'line-through text-gray-400': todo.isCompleted }"
              >
                {{ todo.value }}
              </span>
              
              <button
                @click="store.deleteTodo(todo._id)"
                class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500"
                :disabled="store.loading"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </li>
          </TransitionGroup>

          <p v-if="store.error" class="text-center text-red-500 mt-4">
            {{ store.error }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  SunIcon, 
  MoonIcon, 
  CheckIcon, 
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'
import { useTodoStore } from './stores/todo'
import TodoInput from './components/TodoInput.vue'
import TodoFilter from './components/TodoFilter.vue'

// 改用手动管理暗色模式
const isDark = ref(localStorage.getItem('todo-theme') === 'dark')

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  // 更新 HTML 类名
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('todo-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('todo-theme', 'light')
  }
}

// 初始化主题
if (isDark.value) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

const store = useTodoStore()
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 优化背景图案和过渡 */
.min-h-screen {
  position: relative;
  overflow: hidden;
  background-image: 
    linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to));
}

.min-h-screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(45deg, rgba(255, 255, 255, 0.02) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.02) 75%);
  background-size: 60px 60px;
  background-position: 30px 30px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.dark .min-h-screen::before {
  background-image: 
    linear-gradient(45deg, rgba(0, 0, 0, 0.05) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.05) 75%);
  opacity: 0.3;
}

/* 优化过渡效果 */
html {
  transition: background-color 0.5s ease, color 0.5s ease;
}

html.dark {
  color-scheme: dark;
}

/* 优化全局过渡效果 */
*,
*::before,
*::after {
  transition: background-color 0.5s ease,
              border-color 0.5s ease,
              color 0.5s ease,
              opacity 0.5s ease,
              transform 0.5s ease;
}

/* 禁用某些元素的过渡效果以提高性能 */
.animate-spin,
.opacity-0,
.group-hover\:opacity-100 {
  transition: none;
}

/* 优化背景模糊效果 */
.backdrop-blur-lg {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.backdrop-blur-3xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
</style>
