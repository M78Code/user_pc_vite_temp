<!--
 * @FilePath: d:/projects/user-h5/src/base-h5/components/details/components/chatroom/chat_msg.vue
 * @Description: 消息组件
-->
<template>
  <div class="chat_msg" :class="{ 'reverse': is_self_msg }">
    <div class="nick_name t_nick_name">{{ computed_name }}</div>
    <!-- 渲染注单消息标题 -->
    <!-- <div class="bet_info_container" v-if="msgItem.type == msgType.bet">
      <div class="title">{{ i18n_t('chatroom.post_bet_info1') }}</div>
    </div> -->
    <!-- 渲染普通消息 -->
    <div class="msg_container t_msg_container" v-if="msgItem.type == msgType.normal">
      <div class="msg_text t_msg_text">
        <span class="msg-content">{{ msgItem.content }}</span>
        <span class="msg-time">{{$formatDate(msgItem.updateTime, 'HH:mm')}}</span>
      </div>
    </div>
    <div class="bet-info" v-if="msgItem.type == msgType.bet">
      <bet_info :msgInfo="msgItem"></bet_info>
    </div>

  </div>
</template>

<script>
import bet_info from 'src/base-h5/components/details/components/chatroom/bet_info.vue'; // 晒单展示组件
import { msgType } from 'src/base-h5/components/details/components/chatroom/constant'; // 普通消息、注单消息
// #TODO vuex
// import { mapGetters } from "vuex";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import UserCtr from "src/core/user-config/user-ctr.js";

export default defineComponent({
  name: 'chat_msg',
  components: { bet_info },
  props: {
    msgItem: {
      type: Object,
      default() {
        return {};
      },
    }
  },
  setup(props, evnet) {
    let data = reactive({
      msgType
    });
    // #TODO vuex
    // computed: {
    // ...mapGetters([
    //   'UserCtr', // 当前登录的用户信息
    // ]),
    const computed_name = computed(() => {
      const { nickName } = msgItem || '';
      if (nickName != null && !is_self_msg) {
        const count = nickName.length > 3 ? 2 : 1
        const middle = nickName.length > 3 ? '****' : '******'
        const prefix = nickName.substring(0, count);
        const suffix = nickName.substring(nickName.length - count, nickName.length);
        return prefix + middle + suffix;
      } else {
        return '';
      }
    });
    // 是否是自己发送的消息
    const is_self_msg = computed(() => {
      const { userId } = UserCtr || {};
      const { userId: msgUserId } = msgItem;
      return userId == msgUserId;
    });
    return {
      ...toRefs(data),
      computed_name,
      is_self_msg
    }
  }
})
</script>

<style lang="scss" scoped>
.chat_msg {
  width: 100%;
  display: flex;
  margin-top: 0.15rem;
  padding: 0rem 0.1rem;
  flex-wrap: wrap;

  .nick_name {
    box-sizing: border-box;
    font-size: 0.12rem;
    margin-top: 0.05rem;
    text-align: right;
  }


  .bet_info_container {
    display: flex;
    padding-left: 0.1rem;
    flex-direction: row;

    .title {
      background-image: var(--q-color-linear-gradient-bg-4);
      border-radius: 0.2rem;
      display: inline-block;
      color: white;
      display: flex;
      align-items: center;
      padding: 0.03rem 0.1rem;
      font-size: 0.12rem;
    }
  }

  .bet-info {
    margin-top: 0.1rem;
    width: 100%;
  }



  .msg_container {
    align-items: center;
    flex: 3.7;
    padding-left: 0.1rem;
    display: flex;

    .msg_text {
      display: inline-block;
      font-size: 0.12rem;
      box-shadow: var(--q-color-com-box-shadow-3);
      border-radius: 0.06rem;
      padding: 0.05rem 0.5rem 0.05rem 0.1rem;
      position: relative;
      word-break: break-all;


      &::before {
        content: "";
        position: absolute;
        left: -0.11rem;
        top: 0.05rem;
        border-width: 0.06rem;
        border-style: solid;
      }

      .msg-time {
        position: absolute;
        // top: 50%;
        right: .1rem;
        // transform: translateY(-48%);
        font-size: .1rem;
      }
    }
  }
}

.reverse {
  flex-direction: row-reverse;

  .nick_name {
    text-align: right;
  }

  .bet_info_container {
    padding-right: 0.1rem;

  }

  .msg_container {
    flex-direction: row-reverse;
    padding-right: 0.1rem;

    .msg_text {
      background-color: var(--q-color-com-bg-color-24) !important;
      color: var(--q-gb-t-c-18) !important;

      &::before {
        border-width: 0rem;
      }

      &::after {
        content: "";
        position: absolute;
        top: 0.05rem;
        right: -0.11rem;
        top: 0.05rem;
        border-width: 0.06rem;
        border-style: solid;
        border-color: transparent transparent transparent var(--q-color-com-border-color-17) !important;
        /* transparent 设置边框颜色透明 */
      }
    }
  }
}
</style>


