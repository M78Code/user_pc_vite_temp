<!--
 * @FilePath: d:/projects/user-h5/src/base-h5/components/details/components/chatroom/popper_send_hint.vue
 * @Description: 发言条件提示
-->

<template>
  <div class="popper t-popper">
    <div class="popper_content">
      <template v-if="type === 'condition'">
        <div class="popper_text">{{  i18n_t('chatroom.pop_send_hint1')  }}</div>
        <div class="popper_text">{{  i18n_t('chatroom.pop_send_hint2')  }}</div>
        <div class="popper_text">{{  i18n_t('chatroom.pop_send_hint3')  }}</div>
      </template>
      <template v-if="type === 'rules'">
        <div v-if="ban_placeholder" class="popper_text_ban">{{ ban_placeholder }}</div>
        <div class="popper_text">{{  i18n_t('chatroom.pop_send_hint4')  }}</div>
        <div class="popper_text">{{  i18n_t('chatroom.pop_send_hint5')  }}</div>
      </template>
    </div>
  </div>

</template>

<script>
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
;
//国际化


export default defineComponent({
  name: 'popper_send_hint',
  props: {
    // 提示类型 发言条件、发言规则...
    type: {
      type: String,
      default: 'condition'
    },
    ban_placeholder: {
      type: String,
      default: ''
    }
  },
  setup(props, evnet) {
    let data = reactive({
      isShow: true,
    });
    const toggleShow = () => {
      isShow = !isShow;
    }
    return {
      ...toRefs(data),
      toggleShow
    }
  }
})
</script>


<style scoped lang="scss">
.popper {
  border-radius: 0.1rem;
  position: absolute;
  right: -0.585rem;
  bottom: 0.4rem;

  &::before {
    content: "";
    width: 0.1rem;
    height: 0.1rem;
    box-sizing: border-box;
    transform: rotate(-135deg);
    position: absolute;
    bottom: -0.061rem;
    right: 0.68rem;
  }

  .popper_content {
    width: 2.2rem;
    font-size: 0.1rem;
    overflow: hidden;
    padding: 0.1rem 0.1rem;
    word-break: break-all;
  }

  .popper_text_ban {
    margin-bottom: .04rem;
  }

  .popper_text {
    margin-top: 0.01rem;
  }
}
</style>
