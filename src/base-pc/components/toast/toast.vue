<!--
 * @Description: 消息提示
-->
<template>
  <div>
    <q-dialog v-model="is_show" seamless >
      <q-card class="dialog_content">
        <q-card-section>
          <div class="toast-text-content">
            <slot name="img">
              <img :src="compute_local_project_file_path('/image/svg/warn.svg')" />
            </slot>
          </div>
          <slot name="msg">'{{ text }} '''</slot>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>


<script setup>
import { onMounted,onUnmounted, ref } from 'vue';
import { useMittOn, MITT_TYPES } from 'src/core/mitt/index.js'
import { compute_local_project_file_path } from 'src/output/index.js'

/* 是否展示 */
const is_show = ref(false)
/* 文本内容 */
const text = ref('')

/* 定时器相关 */
let timer;
onMounted(() => {
  /* 监听打开弹窗mitt */
  useMittOn(MITT_TYPES.EMIT_SHOW_TOAST_CMD, show_toast).on
})

onUnmounted(()=>{
  /* 销毁mitt */
  useMittOn(MITT_TYPES.EMIT_SHOW_TOAST_CMD, show_toast).off
  clearTimeout(timer)
})
/**
* @Description:显示消息框
* @Author Cable
* @param:msg：消息内容
* @param:delay:延迟关闭时间 单位毫秒
* @return:
*/
const show_toast = (msg, delay = 2000) => {
  text.value = msg || "";
  if (text.value == "" || is_show.value) return;
  is_show.value = true;
  /* 延时关闭 */
  timer = setTimeout(() => {
    is_show.value = false;
    text.value = "";
  }, delay);
}

</script>

<style lang="scss" scoped>
:deep(.q-dialog-F){
  z-index:9999999;
}
.q-card-section {
  padding: 8px 8px;
}

.toast-text-content {
  text-align: center;
}

.q-card {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 6px;
  color: #ffffff;
  font-size: 12px;
  padding: 0;
}
</style>
