<!-- @Description: toast弹框 -->
<template>
  <div class="text-toast" v-if="local_is_show">{{ text }}</div>
</template>

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
</script>

<style lang="scss" scoped>
.text-toast {
  position: fixed;
  z-index: 10000;
  top: 41%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #414655;
  padding: 6px 10px;
  font-size: 0.14rem;
  border-radius: 5px;
  color: #ffffff;
  line-height: 1.2;
  max-width: 2.6rem;
}
</style>
