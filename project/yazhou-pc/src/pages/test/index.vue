<template>
  <div>测试页面</div>
  <q-btn @click="on_test">体育规则</q-btn>
</template>

<script setup>

const on_test = () => {
  window.open(
    'http://localhost:28300/project/yazhou-pc/index.html#/rule',
    '_blank',
    `height=${650}, width=${1000}, top=${100}, left=${100}, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`
  );
}
</script>