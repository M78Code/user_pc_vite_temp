<!--
 * @FilePath: d:/projects/user-h5/src/base-h5/components/details/components/chatroom/chatroom.vue
 * @Description: 聊天室组件
-->
<template>
  <div class="chatroom" ref="chatroom">
    <div class="chatroom_container" v-if="get_chatroom_id || true">
      <div class="wrap-marquee" v-if="bulletin_list.length">
        <div class="marquee-left-wrap">
          <div class="marquee-icon">
            <i class="icon-notice"></i>
          </div>
        </div>
        <marquee_bulletin ref="bulletin" :bulletin-info="bulletin_info" @click.stop.native="is_show_bulletin_dialog = true"></marquee_bulletin>
      </div>
      <msg_list :list_height="list_height" :msgList="msgList"></msg_list>
      <div class="bottom_container">
        <input_field></input_field>
      </div>
    </div>

    <!-- 聊天室公告弹窗 -->
    <q-dialog v-model="is_show_bulletin_dialog" >
      <q-card class="dialog-wrap" >
        <div  class="card-header">
          <div class="text-center">{{i18n_t('chatroom.bulletin')}}</div>
        </div>
        <q-card-section class="card-body">
          <div class="dialog-scroll">
            <div class="bulletin-item" v-for="(item, index) in bulletin_list" :key="item.id">{{ `${index+1}. ${item.content}` }}</div>
          </div>

        </q-card-section>

        <div class="card-footer">
          <div class="btn"  @click.stop="is_show_bulletin_dialog = false">{{ i18n_t('chatroom.close') }}</div>
        </div>
      </q-card>
    </q-dialog>

    <!-- 晒单弹层 -->
    <template v-if="get_post_bet_show">
      <post_bet :visible="get_post_bet_show"></post_bet>
    </template>
  </div>
</template>
<script>

import input_field from 'src/base-h5/components/details/components/chatroom/input_field.vue'; // 输入框组件
// #TODO vuex
// import { mapMutations, mapGetters } from "vuex";
import post_bet from 'src/base-h5/components/details/components/chatroom/post_bet.vue';
import msg_list from 'src/base-h5/components/details/components/chatroom/msg_list.vue';   // 消息列表组件
import { api_chatroom } from "src/project/api/index.js";
// import chatroom_mixin from 'src/base-h5/components/details/components/chatroom/chatroom_mixin'
// import mqtt_mixin from 'src/base-h5/components/details/components/chatroom/mqtt_mixin'
import { get_valid_api } from 'src/base-h5/components/details/components/chatroom/check_domain.js'
import notice_bar from 'src/base-h5/components/details/components/chatroom/notice_bar.vue';
import marquee_bulletin from 'src/base-h5/components/marquee/marquee_bulletin.vue'
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js"

import UserCtr from "src/core/user-config/user-ctr.js";
//国际化


export default defineComponent({
  name: 'chatroom',


  components: {
    input_field,
    post_bet,
    msg_list,
    notice_bar,
    marquee_bulletin,
  },
  // #TODO mixins
  // mixins: [chatroom_mixin, mqtt_mixin],
  props: {

  },
  setup(props, evnet) {
    let data = reactive({
      isBlockMsg: false,  //是否屏蔽聊天消息
      list_height: null,  // 聊天室列表高度
      chatroomWs: null,
      msgList: [],   // 消息列表
      userMuteTimeOutObj: null,    // 用户禁言timeout(分钟数禁言,倒计时解除禁言判断)
      msgIntervalObj: null,   // 间隔时间拉取增量消息Obj
      hasDestroyed: false,
      bulletin_info : '', // 公告内容
      bulletin_list: [],
      is_show_bulletin_dialog: false,
    });
    // #TODO vuex
    // computed: {
    //   ...mapGetters([
    //     'get_post_bet_show',  // 晒单弹窗显隐
    //     'get_mute_type',  // 禁言类型
    //     'get_details_chatroom_data', // 聊天室相关数据信息
    //     'get_chatroom_userinfo', // 聊天室用户信息
    //     'get_chatroom_mute_info', // 聊天室禁言信息
    //     'get_chatroom_http_url',
    //   ]),
    // },
    onMounted(() => {
      // 原 created
      set_is_enter_chat(true);    // 设置进入聊天室状态
      const { chatRoomId } = get_details_chatroom_data || {};
      if (chatRoomId) {
        set_chatroom_id(chatRoomId);
        onLiveChatLogin();   // 登录聊天室
      } else {
        set_toast({ txt: '聊天室未开启' });
      }
      // #TODO emit
      useMittOn(MITT_TYPES.EMIT_REFRESH_CHATROOM, onLiveChatLogin)

      // 原 mounted
      const { offsetTop } = $refs.chatroom || {};
      list_height = window.innerHeight - offsetTop;  // 计算消息列表的高度
    })
    onUnmounted(() => {
      // #TODO emit
      useMittOn(MITT_TYPES.EMIT_REFRESH_CHATROOM, onLiveChatLogin).off
      hasDestroyed = true;
      set_is_enter_chat(false);
      chatroomWs && chatroomWs.destory();
      clear_chatroom_data();   // 退出时清理聊天室数据
      userMuteTimeOutObj && clearTimeout(userMuteTimeOutObj);
      userMuteTimeOutObj = null;
      msgIntervalObj && clearInterval(msgIntervalObj);
      msgIntervalObj = null;
    });
    // #TODO vuex
    // methods: {
    // ...mapMutations([
    //   'set_toast', 'set_is_enter_chat', 'set_chatroom_id', 'set_chatroom_userinfo',
    //   'clear_chatroom_data', 'set_user_mute_info', 'set_chatroom_mute_info', 'set_like_info',
    //   'set_chatroom_http_url'
    // ]),
    // 轮询拉取增量消息，防止消息丢失率
    const intervalUpdateMsg = () => {
      let { pullMsgRate } = UserCtr.user_info;  // 消息拉取频率
      if (!pullMsgRate || pullMsgRate < 5) {
        pullMsgRate = pullMsgRate || 10;
      }
      pullMsgRate += 1;  // 客户端这里多加1s
      clearInterval(msgIntervalObj)
      if (!hasDestroyed) {
        msgIntervalObj = setInterval(() => {
          onPullMsgList(true);
        }, pullMsgRate * 1000);
      }
    };

    // 登录聊天室
    const onLiveChatLogin = async() => {
      try {
        const res = await api_chatroom.liveChatLogin({
          chatRoomId: get_chatroom_id,
        })
        if (res && res.code == 200) {
          const chatroom_http_url = await get_valid_api(UserCtr);
          // console.log(chatroom_http_url);
          set_chatroom_http_url(chatroom_http_url);
          get_chatroom_bulletin_info('init_load');
          onPullMsgList();  // 拉取全量消息
          onGetvipinfo();   // 获取用户信息
          onGetbansendinfo();  // 获取用户禁言信息
          onGetlikeinfo();  // 获取用户点赞信息
          onGetchatroom();  // 获取聊天室信息
          connectMqtt(res.data);   // 连接mqtt
          intervalUpdateMsg();  // 轮询拉取增量消息，防止消息丢失率
        } else {
          res && res.msg && set_toast({ txt: res.msg });
        }
      } catch (e) {
        console.log(e);
      }
    };
    // 获取公告信息
    const get_chatroom_bulletin_info = (init_load) => {
      api_chatroom.post_chat_bulletin({}, { base_url: get_chatroom_http_url })
        .then((res) => {
          if (res.code == 0 && _.get(res,'data', [])) {
            bulletin_info = ''
            res.data.forEach((item, index) => {
              bulletin_info += `<span style="margin-right: .2rem;">${index + 1}. ${item.content}</span>`
            })
            bulletin_list = res.data || []

            // 非初次获取公告时，需重新计算动画时长
            if (!init_load && bulletin_list.length) {
              $refs.bulletin.get_marquee_data()
            }

            // 不存在公告时，则隐藏公告弹窗
            if (!bulletin_list.length) {
              is_show_bulletin_dialog = false
            }
          }
        })
        .catch((err) => {
          console.error(err)
        });
    };
    // 拉取全量、增量消息信息(isIncrementMsg是否是增量消息)
    const onPullMsgList = (isIncrementMsg) => {
      let params = {
        chatRoomId: get_chatroom_id
      }
      if (isIncrementMsg) {
        params = { ...params, messageSize: 30 }
      }
      api_chatroom.get_chat_history_message(params, { base_url: get_chatroom_http_url }).then((res) => {
        if (res.code == 0 && res.data) {
          const resMsgList = res.data || [];
          resMsgList.reverse();  // 列表反转
          if (!isIncrementMsg) {
            msgList = resMsgList;
          } else {
            resMsgList.forEach((msgItem) => {
              const hasMsg = msgList.findIndex((item) => item.messageId == msgItem.messageId) != -1;
              if (!hasMsg) {
                msgList.push(msgItem);
              }
            })
          }
        } else {
          res.msg && set_toast({ txt: res.msg });
        }
      }).catch((err) => {
        console.log(err);
      });
    };
    // 获取用户聊天室VIP信息
    const onGetvipinfo = () => {
      api_chatroom.getvipinfo(null, { base_url: get_chatroom_http_url }).then((res) => {
        if (res.code == 0 && res.data) {
          set_chatroom_userinfo(res.data);
          setCanSendMsg(res.data);
        }
      }).catch((err) => {
        console.log(err);
      });
    };
    // 获取聊天室信息(主要用户获取全体禁言)(CP)
    const onGetchatroom = () => {
      api_chatroom.get_chatroom({ chatRoomId: get_chatroom_id }, { base_url: get_chatroom_http_url }).then((res) => {
        if (res.code == 0 && res.data) {
          set_chatroom_mute_info(res.data);
          // console.log(res.data);
        }
      }).catch((err) => {
        console.log(err);
      });
    };
    // 获取用户禁言信息
    const onGetbansendinfo = () => {
      api_chatroom.get_ban_send_info(null, { base_url: get_chatroom_http_url }).then((res) => {
        if (res.code == 0 && res.data) {
          set_user_mute_info(res.data);
          setBanUserTimer(res.data);
        }
      }).catch((err) => {
        console.log(err);
      });
    };
    // 获取用户点赞信息
    const onGetlikeinfo = () => {
      api_chatroom.get_bet_like_info(null, { base_url: get_chatroom_http_url }).then((res) => {
        if (res.code == 0 && res.data) {
          set_like_info(res.data);
        }
      }).catch((err) => {
        console.log(err);
      });
    };
    // 设置用户被禁言的计时器(分钟数过后解除禁言)
    const setBanUserTimer = (data) => {
      const { banTime, banStartTime } = data || {};  // banTime表示禁言时间(单位为秒)
      if (banTime > 0) {
        userMuteTimeOutObj && clearTimeout(userMuteTimeOutObj);
        const nowTS = new Date().getTime();
        const leftBanTime = banTime * 1000 - (nowTS - banStartTime);
        userMuteTimeOutObj = setTimeout(() => {
          set_user_mute_info(null);
        }, leftBanTime);
      }
    };
    return {
      ...toRefs(data),
      intervalUpdateMsg,
      onLiveChatLogin,
      get_chatroom_bulletin_info,
      onPullMsgList,
      onGetvipinfo,
      onGetchatroom,
      onGetbansendinfo,
      onGetlikeinfo,
      setBanUserTimer
    }
  }
})
</script>

<style lang="scss" scoped>
.chatroom {
  width: 100%;
  position: relative;
  height: 100%;

  .chatroom-notice {
    width: 100%;
    white-space: nowrap;// 内容不换行
    animation-name: seamless-scrolling;
    animation-timing-function: linear;// 动画速度曲线，匀速
    animation-iteration-count: infinite;// 动画循环无限次播放

    li {
      display: inline-block;
      width: 100%;
      margin-right: 0.3rem;
      &:last-child {
        margin-right: 0;
      }
    }
  }

  .wrap-marquee {
    width: 100%;
    height: 0.34rem;
    display: flex;
    align-items: center;
    padding: 0 0.13rem 0 0.17rem;
    overflow: hidden;
    position: fixed;
    top: 2.51rem;
    z-index: 99;
    .marquee-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.24rem;
    }
  }

  :deep(.lucky-user) {
    width: 3.36rem;
    left: .35rem;
  }
}

.bottom_container {
  width: 100%;
}


// @include keyframes(seamless-scrolling) {
//   0% {
//     transform: translateX(0px);
//   }
//   100% {
//     transform: translateX(-50%);
//   }
// }
</style>

<style lang="scss">
.dialog-wrap {
  width: 3.2rem;
  height: 3.3rem;
  padding: .3rem .2rem;
  background-color: var(--q-color-page-bg-color-7);
  overflow-y: hidden !important;
  .card-header{
    height: .16rem;
    line-height: .16rem;
    margin-bottom: .25rem;
    font-size: .16rem;
    color: var(--q-color-fs-color-46);
    font-weight: 600;
  }
  .card-body{
    padding: 0;
    .dialog-scroll {
      width: 100%;
      height: 1.9rem;
      overflow-x: hidden;
      overflow-y: auto;
      margin: 0 auto;
      font-size: .14rem;
      text-align: justify;
      word-break: break-all;
      color: var(--q-color-fs-color-164);
      .bulletin-item{
        font-weight: 400;
        line-height: .22rem;
        margin-bottom: 0.1rem;
      }
    }
  }
  .card-footer {
    //border-top: 1px solid rgba(102,102,102,0.1);
    width: 100%;
    height: .16rem;
    line-height: .16rem;
    margin-top: .25rem;
    .btn {
      width: 100%;
      height: 100%;
      text-align: center;
      font-size: .16rem;
      font-weight: 500;
      color: var(--q-color-fs-color-165);
      cursor: pointer;
    }
  }
}
</style>
