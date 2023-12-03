<template>
  <ul class="q-pa-md">
    <li v-for="(item, index) in list" :key="index">{{ item }}</li>
  </ul>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

</script>
