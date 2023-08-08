<!-- @Description: toast弹框 -->
<template>
  <div class="text-toast" v-if="local_is_show">{{ get_txt }}</div>
</template>

<script>
import { defineComponent, ref, watch, onUnmounted, onBeforeUnmount } from 'vue'
// TODO:
// import { mapGetters, mapMutations } from "vuex";

export default defineComponent({
  name: "text-toast",
  setup() {
    // TODO: 改为真实的store替换
    const { get_txt, get_toast_hide_time, set_toast } = useStore()
    watch(
      () => get_txt,
      (val) => {
        if (val) {
          local_is_show.value = true;
          hide_toast();
        }
      }
    )
    /** 隐藏toast */
    function hide_toast() {
      clearTimeout(toast_time_out.value);
      toast_time_out.value = setTimeout(() => {
        local_is_show.value = false;
        set_toast({ txt: '' });
      }, get_toast_hide_time);
    }

    /** 是否展示 */
    const local_is_show = ref(false)
    /** 定时器变量 */
    const toast_time_out = ref(null)
    onBeforeUnmount(() => {
      if (toast_time_out.value) {
        clearTimeout(toast_time_out.value)
        toast_time_out.value = null
      }
    })
    onUnMounted(() => {
      // TODO: $data待确认
      for (const key in $data) {
        $data[key] = null
      };
    })
    return {
      local_is_show,
      toast_time_out,
      get_txt
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
