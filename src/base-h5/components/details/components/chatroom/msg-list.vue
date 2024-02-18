<!--
 * @FilePath: d:/projects/user-h5/src/base-h5/components/details/components/chatroom/msg_list.vue
 * @Description:
-->
<template>
  <div class="msg-list-container t_msg_list" :style="{ height: `${list_height}px` }" ref="msg_list"
    @touchmove="_onListScroll" @scroll="_onListScroll">
    <!-- 禁言提示 -->
    <!--<div v-if="computed_mute_type != muteType.unmute" class="mute-hint">-->
    <!--  <i class="mute_hint_icon"></i>-->
    <!--  <div class="text">{{ mute_hint_text }}</div>-->
    <!--</div>-->
    <chat_msg v-for="msgItem in filtered_msg_list" :msgItem="msgItem" :key="msgItem.messageId"></chat_msg>
    <div class="read-more" v-if="read_more_visible" @click="scrollToBottom">
      {{ i18n_t('chatroom.read_more') }}
    </div>
  </div>
</template>
<script>
// #TODO vuex
// import { mapMutations, mapGetters } from "vuex";
import chat_msg from 'src/base-h5/components/details/components/chatroom/chat_msg.vue';
import { msgType, muteType } from 'src/base-h5/components/details/components/chatroom/constant.js'
import UserCtr from "src/core/user-config/user-ctr.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent, nextTick } from "vue";
;
//国际化


export default defineComponent({
  name: 'msg_list',
  components: {
    chat_msg,
  },
  props: {
    // 聊天室列表高度
    list_height: {
      type: Number,
    },
    // 消息列表
    msgList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  setup(props, evnet) {
    let data = reactive({
      maxMsgLen: 50,    // 列表最大容纳消息数量
      listScrollTop: null,   // 聊天室列表滚动scrollTop，用于判断是否显示更多消息等
      listScrollHeight: null,   // 聊天室scrollHeight
      msgTimeInterval: null,      // 模拟消息间隔
      muteType,    // 禁言类型
    });
    watch(
      () => props.msgList,
      (newMsgList, preMsgList) => {
        _setScrollInfo();
        // 以前聊天信息未空, 判定可能是初始化消息, 滚动到底部
        // scroll底部距离小于50, 判定用户没怎么上滑消息,滚动到底部
        if (preMsgList.length == 0 || scroll_bottom < 50) {
          scrollToBottom();
        }
      }
    );
    // 屏蔽消息状态变化
    // #TODO watch vuex
    // watch(
    //   () => get_is_block_msg,
    //   () => {
    //     _setScrollInfo();
    //     scrollToBottom();
    //   }
    // );
    // 监听用户发送消息
    // #TODO watch vuex
    // watch(
    //   () => get_send_msg_count,
    //   () => {
    //     scrollToBottom();
    //   }
    // );

    // #TODO vuex
    // computed: {
    // ...mapGetters([
    //   'get_post_bet_show',  // 晒单弹窗显隐
    //   'get_chatroom_id',  // 聊天室ID
    //   'get_is_block_msg',  // 是否屏蔽消息
    //   'get_user_mute_info',   // 用户禁言信息
    //   'get_chatroom_mute_info', // 聊天室禁言信息
    //   'get_send_msg_count', // 用户发送消息次数
    // ]),
    // 禁言提示字段
    const mute_hint_text = computed(() => {
      let res = '';
      switch (computed_mute_type) {
        case muteType.self_mute:   // 个人禁言
          res = i18n_t('chatroom.mute_hint1');
          break;
        case muteType.global_mute:  // 全体禁言
          res = i18n_t('chatroom.mute_hint2');
          break;
      }
      return res;
    });
    // scroll底部距离
    const scroll_bottom = computed(() => {
      return listScrollHeight && listScrollTop != null ? (listScrollHeight - listScrollTop - list_height) : 0;
    });
    // 查看更多消息显隐
    const read_more_visible = computed(() => {
      return scroll_bottom > 200;
    });
    // 过滤的消息列表
    const filtered_msg_list = computed(() => {
      let fitlerList = [...msgList];
      if (get_is_block_msg) {   // 屏蔽普通消息
        fitlerList = fitlerList.filter((item) => item.type != msgType.normal);
      }
      const { userId } = UserCtr;
      // isVisible 是否仅自己可见 0普通消息 1仅自己可见
      // isSensitive 是否是敏感消息，是敏感消息要过滤
      // status 1普通消息 2撤回消息
      fitlerList = fitlerList.filter((item) => {
        const { isVisible, isSensitive, status } = item;
        const showMsg = !isVisible || (isVisible == 1 && item.userId == userId);
        const isWithDrawMsg = status == 2;
        return !isSensitive && showMsg && !isWithDrawMsg;
      });

      const maxMsgLen = 300;
      fitlerList = fitlerList.slice(fitlerList.length - maxMsgLen, fitlerList.length);
      return fitlerList;
    });
    // 禁言类型
    const computed_mute_type = computed(() => {
      if (get_chatroom_mute_info && get_chatroom_mute_info.disableSpeak == 1) {
        return muteType.global_mute;
      }
      if (get_user_mute_info) {
        return muteType.self_mute;
      }
      return muteType.unmute;
    });
    onMounted(() => {
      // 原created
      _onListScroll = debounce(onListScroll, 50);      // 列表滚动监听回调节流
      _setScrollInfo = debounce(setScrollInfo, 50);   // 设置滚动信息节流

    })
    onUnmounted(() => {
      // 原 beforeDestroy
      debounce_throttle_cancel(_onListScroll);   // 列表节流回收内存
      debounce_throttle_cancel(_setScrollInfo);
    });
    // #TODO vuex
    // methods: {
    // ...mapMutations(['set_toast', 'set_is_enter_chat']),
    // 滚动列表到底部
    const scrollToBottom = () => {
      nextTick(() => {
        $refs.msg_list.scrollTop = 10000000;       // msgList初始化滚动到底部
      });
    };
    const setScrollInfo = () => {
      nextTick(() => {
        const { scrollTop, scrollHeight } = $refs.msg_list;
        listScrollTop = scrollTop;
        listScrollHeight = scrollHeight;
      });
    };
    // 滚动监听事件，用于更新scrollTop
    const onListScroll = () => {
      const { scrollTop } = $refs.msg_list || {};
      listScrollTop = scrollTop;
    };
    return {
      ...toRefs(data),
      mute_hint_text,
      scroll_bottom,
      read_more_visible,
      filtered_msg_list,
      computed_mute_type,
      scrollToBottom,
      setScrollInfo,
      onListScroll
    }
  }
})
</script>


<style lang="scss" scoped>
.msg-list-container {
  width: 100%;
  padding-top: 0.34rem;
  padding-bottom: 0.8rem;
  overflow-y: scroll;
  position: relative;
}

.read-more {
  position: fixed;
  bottom: 0.8rem;
  padding: 0.05rem 0.1rem;
  left: 50%;
  border-radius: 1rem;
  transform: translateX(-50%);
  white-space: nowrap;
  background-image: var(--q-color-linear-gradient-bg-3);
  color: white;
  z-index: 100;
}

.mute-hint {
  width: 100%;
  height: 0.34rem;
  background-color: #FFF6E1;
  position: sticky;
  left: 0;
  top: 0;
  display: flex;
  z-index: 100;
  align-items: center;
  padding-left: 0.2rem;
  color: var(--q-color-fs-color-50);
  font-size: 0.1rem;

  .text {
    margin-left: 0.05rem;
  }
}
</style>
