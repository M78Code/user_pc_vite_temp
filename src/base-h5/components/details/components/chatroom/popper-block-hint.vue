<!--
 * @FilePath: d:/projects/user-h5/src/base-h5/components/details/components/chatroom/popper_block_hint.vue
 * @Description: 屏蔽消息提示
-->

<template>
  <div class="popper t-popper" v-if="isShow">
    <div class="popper_content">
      <div class="popper_text">{{  i18n_t('chatroom.block_msg_info2')  }}</div>
      <div class="m-button t-m-button" @click="toggleShow">{{  `${i18n_t('chatroom.pop_content1')}(${countdownSec}s)`  }}</div>
    </div>
  </div>

</template>
<script>
// #TODO vuex
// import {mapGetters} from "vuex";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent, nextTick } from "vue";
;
import UserCtr from "src/core/user-config/user-ctr.js";;

//国际化


export default defineComponent({
  name: 'popper_block_hint',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  components: {},
  setup(props, evnet) {
    let data = reactive({
      value: 0,
      pwidth:0,//公告文本的宽度
    });

    onMounted(() => {
      let element = $refs.notice_content;
      pwidth = element.clientWidth;

      notice_move_timer = setInterval(clickCommend, 20);
      // 延迟显示，避免视觉跳闪
      show_notice_content_timer = setTimeout(() => {
        element.style.visibility = 'visible';
      }, 30)

    })
    watch(
      () => value,
      (newValue, oldValue) => {
        let allWidth= parseInt(pwidth) * 2;
        if(newValue <= -allWidth){
          $refs.notice_list.style.marginLeft = pwidth + "px";
          value = 0;
        }
      }
    );
    const clickCommend = (e) =>  {
      nextTick(() => {
        value -=1;
        $refs.notice_list.style.marginLeft = pwidth + value + "px";
      });
    };
    const menter = () => {
      clearInterval(notice_move_timer);
    };
    const mleave = () => {
      notice_move_timer = setInterval(clickCommend, 20);
    };
    onUnmounted(() => () {
      clearInterval(notice_move_timer);
      notice_move_timer = null
      clearTimeout(show_notice_content_timer)
      show_notice_content_timer = null
    })
    return {
      ...toRefs(data),
      clickCommend,
      menter,
      mleave
    }
  }
})
</script>


<style scoped lang="scss">
.popper {
  text-align: center;
  border-radius: 1rem;
  position: absolute;
  top: -0.3rem;
  right: -0.585rem;

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
    height: 0.3rem;
    font-size: 0.1rem;
    display: flex;
    align-items: center;
    height: 0.3rem;
    overflow: hidden;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .popper_text {
    margin-left: 0.1rem;
    white-space: nowrap;
    margin-right: 0.1rem;
  }

  .m-button {
    width: 0.68rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 1rem;
    color: white;
  }
}
</style>
