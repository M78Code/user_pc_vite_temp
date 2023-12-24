<!-- @Description: toast弹框 -->
<template>
  <div class="text-toast" v-if="is_show">
    <div class="no_data">
      <img :src="compute_local_project_file_path('/image/svg/warn.svg')" >
      <div style="text-align: center">{{text}}</div>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue';
import { useMittOn, MITT_TYPES, useMittEmit } from 'src/core/mitt/index.js'
import {compute_local_project_file_path} from "src/output/index.js";

/* 是否展示 */
const is_show = ref(false)
/* 文本内容 */
const text = ref(null)
/* 监听打开弹窗mitt */
/**
* @Description:显示消息框
* @Author Cable
* @param:msg：消息内容
* @param:delay:延迟关闭时间 单位毫秒
* @return:
*/
const { off } = useMittOn(MITT_TYPES.EMIT_SHOW_TOAST_CMD, function (opt) {
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
})
/* 销毁mitt */
onUnmounted(off)
/* 定时器相关 */
let timer;
onUnmounted(() => {
  off()
  clearTimeout(timer)
})
</script>
<!-- 
<script>
import { defineComponent, ref, watch, onUnmounted, onBeforeUnmount } from 'vue'
import store from "src/store-redux/index.js";
// TODO:
// import { mapGetters, mapMutations } from "vuex";

export default defineComponent({
  name: "text-toast",
  setup() {
    // TODO: 改为真实的store替换
    const { toastReducer } = store.getState()
    //文字内容
    const text = ref('')
    const toast_hide_time = ref(1000)
    /** 是否展示 */
    const local_is_show = ref(false)
    /** 定时器变量 */
    const toast_time_out = ref(null)

    const unsubscribe = store.subscribe(() => {
      const {toastReducer: new_toastReducer} = store.getState()
      text.value = new_toastReducer.text
      toast_hide_time.value = new_toastReducer.toast_hide_time
      if (new_toastReducer.text) {
          local_is_show.value = true;
          hide_toast();
        }
    });
    
    /** 隐藏toast */
    const hide_toast = () => {
      clearTimeout(toast_time_out.value);
      toast_time_out.value = setTimeout(() => {
        local_is_show.value = false;
        store.dispatch({
          type: "SET_TEXT",
           text: '' 
          });
      }, toast_hide_time.value);
    }

    
    onBeforeUnmount(() => {
      if (toast_time_out.value) {
        clearTimeout(toast_time_out.value)
        toast_time_out.value = null
      }
      unsubscribe()
    })
    // onUnMounted(() => {
    //   // TODO: $data待确认
    //   for (const key in $data) {
    //     $data[key] = null
    //   };
    // })
    return {
      local_is_show,
      toast_time_out,
      text,
    }
  }
})

</script> -->

<style lang="scss" scoped>
.text_toast {
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
  padding: 0.18rem 0.14rem;
  color: #ffffff;
  background: #040506;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.06rem;

  img {
    margin-bottom: 0.1rem;
  }
}
</style>
