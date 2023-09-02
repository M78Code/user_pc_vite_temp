<!--
 * @Description: 消息提示
-->
<template>
  <div>
    <q-dialog v-model="is_show" seamless>
      <q-card class="dialog_content">
        <q-card-section>
          <div class="text-h6">
            <slot name="img">
              <img src="/public/yazhou-pc/image/svg/warn.svg" />
            </slot>
          </div>
          <slot name="msg">{{ text }}</slot>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>


<script setup>
import { onUnmounted, ref } from 'vue';
import { useMittOn, MITT_TYPES } from 'src/core/mitt/index.js'

/* 是否展示 */
const is_show = ref(false)
/* 文本内容 */
const text = ref('')
/* 监听打开弹窗mitt */
const { off } = useMittOn(MITT_TYPES.EMIT_SHOW_TOAST_CMD, show_toast)
/* 销毁mitt */
onUnmounted(off)

/* 定时器相关 */
const timer = ref(null)
function clear_timer() {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  };
}
onUnmounted(clear_timer)

/**
* @Description:显示消息框
* @Author Cable
* @param:msg：消息内容
* @param:delay:延迟关闭时间 单位毫秒
* @return:
*/
function show_toast(msg, delay = 2000) {
  text.value = msg || "";
  if (text.value == "" || is_show.value) return;
  is_show.value = true;

  /* 延时关闭 */
  timer.value = setTimeout(() => {
    is_show.value = false;
    text.value = "";
  }, delay);
}

</script>

<style lang="scss" scoped>
.q-card-section {
  padding: 8px 8px;
}

.text-h6 {
  text-align: center;
}

.q-card {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
}
</style>

