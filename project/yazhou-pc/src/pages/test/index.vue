<template>
  <div>
    <div>测试页面</div>
    <!-- <q-btn @click="on_test">体育规则</q-btn> -->
  </div>
</template>

<script setup>
// import { useOpenWithPostMessage } from "src/core/utils/event-hook";
// import { onBeforeMount } from "vue";
// import { t } from "src/core/index.js";
// ;
// console.log('lockie_test_console', t('match_info.more'));
// let remove_list = [];
// const on_test = () => {
//   const { postMessage, remove } = useOpenWithPostMessage({
//     target: "_blank",
//     url: "http://localhost:28300/project/yazhou-pc/index.html#/rule",
//     features: `height=${650}, width=${1000}, top=${100}, left=${100}, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`,
//     message: () => {
//       console.log("子页面发来消息了");
//     },
//     unload:()=>{
//       remove()
//     }
//   });
//   remove_list.push(remove);
//   setTimeout(() => {
//     postMessage("向子页面发送消息");
//   }, 1000);
// };
// onBeforeMount(() => {
//   // remove(); //移除消息监听
//   remove_list.forEach((item) => item());
// });
</script>