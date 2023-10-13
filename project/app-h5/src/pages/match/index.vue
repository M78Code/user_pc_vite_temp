<template>
    <div>
        <div> index.vue</div>
        <div> {{ DateNow }}</div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
const DateNow = ref((new Date()).toDateString())
setInterval(() => {
    DateNow.value = new Date().toDateString()
})
</script>