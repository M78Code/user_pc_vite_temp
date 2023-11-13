<template>
  <q-page class="flex flex-center">
    <Index></Index>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import Index from './yazhou-pc/index.vue'

export default defineComponent({
  name: 'IndexPage',
  components: { Index }
})
</script>
