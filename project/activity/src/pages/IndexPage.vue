<template>
  <q-page class="flex flex-center">
    <component :is="currentComponent"></component>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
        currentComponent: null
    }
  },
  mounted() {
    function ismobile() {
        return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)            
    }
    this.currentComponent = defineAsyncComponent(() => ismobile() ? import('./yazhou-h5/index.vue') : import('./yazhou-pc/index.vue'));
  },
})
</script>
