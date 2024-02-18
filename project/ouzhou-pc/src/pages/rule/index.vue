<template>
    <rule-wapper></rule-wapper>
</template>

<script setup>
import { RuleWapper } from 'src/components/rule'
import { onMounted, nextTick } from "vue";
import { MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";
onMounted(() => {
  nextTick(() => {
    // 隐藏loading动画 
    useMittEmit(MITT_TYPES.EMIT_LOADING_CTR_CMD,0);
  })
})
</script>