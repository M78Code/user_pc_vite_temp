<!--
 * @FilePath: d:/projects/user-h5/src/base-h5/components/details/components/chatroom/input_field.vue
 * @Description: 输入栏组件
-->

<template>
  <div class="input_field input_field_bg">
    <!-- input区域 -->
    <div class="input_container" @click.stop="onInputClick">
      <input class="text_input input_bg"
        :class="{
          'up-to-standard': get_can_send_msg,
          'input-banned': computed_mute_type != muteType.unmute,
        }"
        v-model="inputText" :placeholder="placeHolder" :maxlength="maxTextLen"
        :readonly="!get_can_send_msg || computed_mute_type != muteType.unmute"
         @blur.prevent="onInputblur"
         @keyup.enter="send_msg_by_enter"
      />
      <div class="tool-container">
        <template v-if="get_can_send_msg && computed_mute_type == muteType.unmute">
          <div class="icon-container">
            <EmojiSelector @emoji_select="onEmojiSelect" v-if="showEmojiPicker">
            </EmojiSelector>
            <div class="inner_container" @click.stop="setShowEmojiPicker(!showEmojiPicker)">
              <div class="emoji_icon"></div>
            </div>
          </div>
          <div class="divider"></div>
          <div class="icon-container" @click="onSend">
            <i class="send_icon"></i>
          </div>
        </template>

        <div class="icon-container" @click.stop="setShowSendHint(!showSendHint)" v-if="!get_can_send_msg || computed_mute_type != muteType.unmute">
          <PopperSendHint :type="popper_hint_type" :ban_placeholder="ban_placeholder" v-if="showSendHint"></PopperSendHint>
          <i :class="showSendHint ? 'send_hint_icon' : 'send_hint_icon_default'"></i>
        </div>
      </div>
    </div>


    <!-- 按钮栏区域,包含屏蔽消息,晒单,注单等 -->
    <div class="popper_container">
      <PopperBlockHint v-if="!is_first_enter"></PopperBlockHint>
      <div class="inner_container" @click="toggleBlockMsg">
        <div class="shield_msg_icon" v-if="get_is_block_msg"></div>
        <div class="unshield_msg_icon" v-else></div>
      </div>
    </div>

    <div class="right-area">
      <!-- 晒单 -->
      <div class="icon-text-container" @click="openShowBet" :class="{ 't_shaidan_disable': !is_post_bet }">
        <div class="shaidan_icon icon"></div>
        <div class="text">{{ i18n_t('chatroom.post_bet') }}</div>
      </div>
      <!-- 注单 -->
      <div class="icon-text-container" @click="toggleBet">
        <i class="bet_icon"></i>
        <div class="text">{{ i18n_t('chatroom.betting') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// #TODO vuex
// import { mapMutations, mapGetters } from "vuex";
import PopperBlockHint from 'src/base-h5/components/details/components/chatroom/popper_block_hint.vue';   // 屏蔽消息提示组件
import PopperSendHint from 'src/base-h5/components/details/components/chatroom/popper_send_hint.vue';    // 发言条件提示组件
import EmojiSelector from 'src/base-h5/components/details/components/chatroom/emoji_selector.vue';      //表情选择框
import { api_chatroom } from "src/project/api/index.js";
import { muteType } from "src/base-h5/components/details/components/chatroom/constant";
// #TODO mixins
// import chatroom_mixin from "src/base-h5/components/details/components/chatroom/chatroom_mixin";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";

import UserCtr from "src/core/user-config/user-ctr.js";
//国际化


export default defineComponent({
  name: 'input_field',

  // #TODO mixins
  // mixins: [chatroom_mixin],
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  components: {
    PopperBlockHint,
    PopperSendHint,
    EmojiSelector
  },
  setup(props, evnet) {
    const data = reactive({
      inputText: '',
      showEmojiPicker: false,   // 表情选择框显隐
      is_first_enter: sessionStorage.getItem('chatroom_first_enter'),   // 是否第一次进入聊天室
      showSendHint: false,   // 发送消息条件显隐
      muteType,   // 禁言类型
      sendFrequencyLimit: false,  // 发言频率限制
      sendFrequencyIntervel: 3000, // 发言频率间隔
      maxTextLen: 60,  // 最大输入字符数
      timeOutObj: null,
      send_frequency_timer: null
    });
    // #TODO vuex
    // computed: {
    // ...mapGetters([
    //   'get_is_block_msg',  // 是否屏蔽消息
    //   'get_can_send_msg',   // 是否可以发送消息(达标用户可以发送消息)
    //   'get_user_mute_info',    // 用户禁言信息
    //   'get_chatroom_mute_info', // 聊天室禁言信息
    //   'get_chatroom_userinfo', // 聊天室用户信息
    //   'get_send_msg_count', // 用户发送消息次数
    //   'get_chatroom_http_url' // 聊天室域名
    // ]),
    const popper_hint_type = computed(() => {
      if (computed_mute_type != muteType.unmute) {
        return 'rules'
      }
      return 'condition'
    });
    // input提示信息
    const placeHolder = computed(() => {
      if (!get_can_send_msg && get_chatroom_userinfo) {
        const { time, interval, limit } = get_chatroom_userinfo || {};
        // #TODO $root
        return i18n_t('chatroom.input_field_ph1', { numOfSend: limit - time, numOfCD: interval / 60000 });
      } else if (computed_mute_type == muteType.self_mute) {
        return ban_placeholder
      } else if (computed_mute_type == muteType.global_mute) {
        // #TODO $root
        return i18n_t('chatroom.mute_hint2')
      }
      return '';
    });
    // 用户禁言阶段placeholder显示文本
    const ban_placeholder = computed(() => {
      if (computed_mute_type != muteType.self_mute) {
        return ''
      }

      const {banTime = 0, banType = 1} = UserCtr_mute_info

      // 禁言时间-提示映射
      const time_map = {
        0: 4,
        900: 0,
        1800: 1,
        3600: 2,
        10800: 3
      }

      // 禁言类型-提示映射
      const type_map = {
        1: 0,
        2: 1,
        3: 2
      }
      // #TODO $root
      return i18n_t(
            'chatroom.mute_hint4',
            {
              time: i18n_t('chatroom.mute_hint.time')[time_map[banTime]],
              type:i18n_t('chatroom.mute_hint.type')[type_map[banType]]
            }
          )
    });
    // 是否可以晒单(全体禁止晒单：用户可以晒单，但是只能自己可见)
    const is_post_bet = computed(() => {
      // const { disableShowOrder } = get_chatroom_mute_info || {};
      // return disableShowOrder != 1;
      return true;
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
      if (!is_first_enter) {   // 第一次进入聊天室缓存
        sessionStorage.setItem('chatroom_first_enter', true);
      }
    })
    onUnmounted(() => {
      timeOutObj && clearTimeout(timeOutObj);
      timeOutObj = null;

      clearTimeout(send_frequency_timer);
      send_frequency_timer = null;
    });
    // #TODO vuex
    // methods: {
    // ...mapMutations([
    //   'set_toast',
    //   'set_post_bet_show',    // 设置晒单弹窗显隐
    //   'set_is_block_msg',      // 设置是否屏蔽消息
    //   'set_mute_info',     // 设置禁言信息
    //   'set_chatroom_userinfo',
    //   'set_send_msg_count',  // 设置用户发送消息次数
    // ]),
    const onInputClick = (e) => {
      if (!get_can_send_msg) {
        // #TODO $root
        set_toast({ txt: i18n_t('chatroom.mute_hint3') });
      }
    };
    // 设置发送条件显隐
    const setShowSendHint = (showSendHint) => {
      showSendHint = showSendHint;
    };
    // 切换emojiPicker显隐
    const setShowEmojiPicker = (showEmojiPicker) => {
      if (computed_mute_type != muteType.unmute) {
        return;
      }
      showEmojiPicker = showEmojiPicker;
    };
    // 发送消息
    const onSend = () => {
      if (computed_mute_type != muteType.unmute) {
        return;
      }
      if (inputText.trim() == "") {
        // 请输入聊天内容
        // #TODO $root
        set_toast({ txt: i18n_t('chatroom.send_err_hint1') });
        return;
      }
      if (sendFrequencyLimit) {
        // 抱歉！您说话太快了
        // #TODO $root
        set_toast({ txt: i18n_t('chatroom.send_err_hint2') });
        return;
      }
      sendFrequencyLimit = true;
      // 发送数据到服务端
      api_chatroom.post_chat_sendmessage({
        chatRoomId: get_chatroom_id,
        content: inputText
      }, { base_url: get_chatroom_http_url }).then((res) => {
        if (res.code == 0) {
          set_send_msg_count(get_send_msg_count + 1);
        }

        // isSuper: 超级会员 isVip: 普通会员
        const { isSuper, isVip, time } = get_chatroom_userinfo || {};
        if (res.code == 0 && isSuper === 'false' && isVip === 'false') {  // 不是Vip的话要更新用户发言条件信息，并设置定时器更新用户发言状态
          const data = { ...get_chatroom_userinfo, time: time + 1, sendTime: new Date().getTime() };
          set_chatroom_userinfo(data);
          setCanSendMsg(data);
        }
        if (res.code != 0 && res.msg) {
          set_toast(({ txt: res.msg }));
        }
      }).finally(() => {
        clearTimeout(send_frequency_timer)
        send_frequency_timer = setTimeout(() => {
          sendFrequencyLimit = false;
        }, sendFrequencyIntervel);
      });
      inputText = "";
    };
    // 打开晒单弹窗
    const openShowBet = () => {
      if (!is_post_bet) {
        // 禁止晒单
        // #TODO $root
        // set_toast({ txt: i18n_t('chatroom.ban_post_bet') });
        return;
      }
      set_post_bet_show(true);
    };
    // 切换屏蔽消息状态
    const toggleBlockMsg = () => {
      set_is_block_msg(!get_is_block_msg);
    };
    // 打开注单界面
    const toggleBet = () => {
      // #TODO emit
      // useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, true);
    };
    // 表情选择
    const onEmojiSelect = (emojiTxt) => {
      inputText += emojiTxt;
      setShowEmojiPicker(false);
    };
    // 聊天室视图内容滚动更新
    const onInputblur = () => {
      if ($q.platform.is.ios) {
        timeOutObj && clearTimeout(timeOutObj);
        timeOutObj = setTimeout(() => {
          const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
          window.scrollTo(0, Math.max(scrollHeight - 1, 0))
        }, 200)
      }
    };
    // 回车键发送消息
    const send_msg_by_enter = () => {
      onSend()
      onInputblur()
    };
    return {
      ...toRefs(data),
      popper_hint_type,
      placeHolder,
      ban_placeholder,
      is_post_bet,
      computed_mute_type,
      onInputClick,
      setShowSendHint,
      setShowEmojiPicker,
      onSend,
      openShowBet,
      toggleBlockMsg,
      toggleBet,
      onEmojiSelect,
      onInputblur,
      send_msg_by_enter
    }
  }
})
</script>

<style lang="scss" scoped>
.input_field {
  width: 100%;
  height: 0.6rem;
  display: flex;
  align-items: center;
  padding: 0 0.1rem;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  z-index: 100;
}

.icon-container {
  width: 0.3rem;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.01rem;
  position: relative;



  .icon {
    width: 0.16rem;
    height: 0.16rem;
  }
}

.input_container {
  position: relative;
  box-sizing: border-box;
  width: 2.2rem;
  height: 0.35rem;
  border-radius: 0.2rem;
  display: flex;
  align-items: center;


  .text_input {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 0.2rem;
    padding-left: 0.12rem;
    padding-right: 0.3rem;
    outline: none;
    border: none;
  }

  .up-to-standard {
    padding-right: 0.65rem;
  }

  .input-banned {
    padding-right: 0.35rem;
    font-size: .1rem;
  }

  .tool-container {
    position: absolute;
    right: 0.03rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .divider {
    width: 1px;
    height: 0.2rem;
    background-color: lightgray;
  }
}

.shield_icon {
  margin-left: 0.01rem;
}

.icon-text-container {
  width: 0.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 0.04rem;

  .text {
    margin-top: 0.04rem;
  }
}

.right-area {
  display: flex;
}

.popper_container {
  width: 0.3rem;
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.1rem;
}
</style>
