<!-- @Description: toast弹框 -->
<template>
  <div class="text-toast" v-if="is_show">
    <div class="no_data">
      <img :src="compute_local_project_file_path('/image/svg/warn.svg')" alt="" />
      <div style="text-align: center; padding: 0.08rem 0;" v-html="text"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useMittOn, MITT_TYPES } from 'src/core/mitt/index.js'
import {compute_local_project_file_path} from "src/output/index.js";

/* 是否展示 */
const is_show = ref(false)
/* 文本内容 */
const text = ref(null)
/* 定时器相关 */
let timer;

const ref_data = reactive({
  emit_lsit: {},
})


onMounted(()=>{
  ref_data.emit_lsit = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_SHOW_TOAST_CMD, set_text_toast).off,
  }
})

/* 监听打开弹窗mitt */
/**
* @Description:显示消息框
* @Author Cable
* @param:msg：消息内容
* @param:delay:延迟关闭时间 单位毫秒
* @return:
*/
const set_text_toast =(opt) => {
  console.error('asdasdasd')
  let { msg, delay = 2000 } = opt || {}
  if (typeof opt == 'string')
    msg = opt;
    text.value = msg || "";
  if (!text.value || is_show.value) return;
  is_show.value = true;
  /* 延时关闭 */
  timer = setTimeout(() => {
    is_show.value = false;
    text.value = "";
  }, delay);
}

onUnmounted(() => {
  clearTimeout(timer)
  /* 销毁mitt */
  Object.values(ref_data.emit_lsit).map((x) => x());
})


</script>

<style lang="scss" scoped>
.text-toast {
  position: fixed;
  z-index: 9999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.no_data {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.1rem 0.14rem;
  color: #ffffff;
  background: #040506;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.06rem;

  img {
    // margin-bottom: 0.1rem;
  }
}
</style>
