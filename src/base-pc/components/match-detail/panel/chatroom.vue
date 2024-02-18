<!--
 * @Author: MasterJ
 * @Date: 2022-08-22 17:19
 * @Description 聊天室页面组件
-->
<template>
  <div class="chatroom wrap-chatroom" ref="chatroom">
    <!-- 聊天室标题 -->
    <panel-header
      v-if="show_header"
      ref="panel_header"
      :title="i18n_t('common.chatroom')"
      icon="chatroom"
      @set_fold="is_fold = !is_fold"
    >
    <template #append>
      <!-- 箭头 -->
      <i :class="['icon-arrow q-icon c-icon',{'fold': is_fold}]" ></i>
    </template>
  </panel-header>
   <charMarquee v-if="!is_fold && bulletin_list.length" :str="get_stitching_bulletin()" @open_alert="alert = true"></charMarquee>
    <!-- 聊天室内容滚动区域 -->
    <div class="chat-scroll-area" v-show="!is_fold" ref="chat_scroll_area" @scroll="handle_message_scroll">
      <div class="message-list">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message-item"
        >
          <q-chat-message
            :name="msg.userId !== lodash.get(get_user, 'userId') ? msg.nickName : ''"
            :text="msg.type === '1' ? msg.content : []"
            :sent="lodash.get(get_user, 'userId') === msg.userId"
            :class="{'message-show-order': msg.type === '2', 'message-show-time': +msg.type === 1}"
            size="9"
            :stamp="+msg.type === 1 ? get_deta_format(msg.sendTime) : ''"
          >
            <!-- 晒单类型消息 -->
            <template v-if="msg.type === '2'">
              <!--<div>在pc上晒了一单</div>-->
              <show-bets
                :bet_records.sync="msg"
                :stamp="get_deta_format(msg.sendTime)"
              ></show-bets>
            </template>
          </q-chat-message>
        </div>
      </div>
    </div>

    <!-- ↓ 有更多消息 -->
    <div v-show="can_show_more_msg && show_more_msg && !is_fold" class="more-msg" @click="scroll_to_bottom">
      <div class="inner-content">
        <i class="icon-arrow-down"></i>
        <div class="more-msg-text">{{ i18n_t('chatroom.more_msg') }}</div>
      </div>
    </div>

    <!-- 聊天室交互栏 -->
    <div class="chat-handle-bar" v-show="!is_fold" ref="chat_handle_bar">
      <div class="chat-item-wrapper">
        <!-- 表情选择弹窗 -->
        <emoji-picker v-show="show_emoji_choose" v-model="content"/>

        <div class="item-user-input">
          <!-- 发言输入框 -->
          <q-input
            v-model="content"
            ref="chat-input"
            input-class="chat-input"
            :placeholder="curr_chat_input_placeholder"
            :dense="true"
            :borderless="true"
            :disable="is_all_mute || is_muted"
            @input="handle_user_input"
            @keyup.enter.native="send_msg"
            @focus="chat_input_click"
            @click="chat_input_click"
          >
            <template v-slot:append>
              <!-- 禁言 -->
              <template v-if="is_all_mute || is_muted"></template>
              <!-- 非发言限制 显示图标 -->
              <template v-else-if="!is_cd ">
                <q-icon @click="handle_emoji_click" name="" size="20px" :class="can_send_msg ? 'icon-emoji2' : 'icon-emoji'" />

                <div class="btn-send">
                  <q-icon @click="send_msg" name="" size="20px" :class="can_send_msg ? 'icon-send2' : 'icon-send'" />
                </div>
              </template>

              <!-- 发言限制 显示图标 -->
              <template v-else>
                <q-icon @click="toggle_chat_conditions_tips" name="" size="20px" class="icon-cd-tips">
                  <div v-if="show_chat_conditions_tips" class="chat-conditions-tips">
                    <div class="tips-flex">
                      <span class="tips-title">{{ i18n_t('chatroom.send_limit_title') }}</span>
                      <span>{{ i18n_t('chatroom.send_limit_condition.0', [500]) }}</span>
                      <span>{{ i18n_t('chatroom.send_limit_condition.1', [1500]) }}</span>
                    </div>
                  </div>
                </q-icon>
              </template>
            </template>

            <!-- 敏感词提示 -->
            <template v-if="content_status_info.contain_bad_word">
              <q-tooltip
                  v-model="content_status_info.contain_bad_word"
                  anchor="top middle"
                  self="center middle"
                  :content-style="{background: 'rgba(0, 0, 0, .85)', borderRadius: '24px'}"
              >{{i18n_t('chatroom.contain_bad_word')}}</q-tooltip>
            </template>

            <!-- 发言过快提示 -->
            <template v-if="content_status_info.send_fast">
              <q-tooltip
                  v-model="content_status_info.send_fast"
                  anchor="top middle"
                  self="center middle"
                  :content-style="{background: 'rgba(0, 0, 0, .85)', borderRadius: '24px'}"
              >{{i18n_t('chatroom.send_fast')}}</q-tooltip>
            </template>

            <!-- 发言限制提示 -->
            <template v-if="content_status_info.limit_send">
              <q-tooltip
                  v-model="content_status_info.limit_send"
                  anchor="top middle"
                  self="center middle"
                  :content-style="{background: 'rgba(0, 0, 0, .85)', borderRadius: '24px'}"
              >{{i18n_t('chatroom.limit_send')}}</q-tooltip>
            </template>
          </q-input>
          <div class="muted" v-if="is_all_mute || is_muted"   @mouseenter="muted_tips_status = true"  @mouseleave="muted_tips_status = false"></div>
          <div v-if="muted_tips_status" class="muted_tips">
            <div class="prohibited_text">{{ curr_chat_input_placeholder }}</div>
            <div>{{ i18n_t('chatroom.send_rules') }}</div>
            <div>{{ i18n_t('chatroom.muted_tips') }}</div>
          </div>
        </div>
        <div class="other-btn">

          <!-- 过滤晒单信息按钮 -->
          <div
            class="item-btn btn-normal-user-input"
            :class="is_mute_textmsg ? 'btn-mute-user-input' : ''"
            @click="toggle_mute_textmsg"
          >
            <div v-if="show_mute_text_msg_tips" class="tips">
              <div class="tips-flex">
                <div class="tips-text">{{ i18n_t('chatroom.mute_text_info') }}</div>
                <div class="btn-cancel-tips" @click="btn_cancel_tips(true)">{{ i18n_t('chatroom.cancel_tips', [countdown]) }}</div>
              </div>
            </div>
          </div>

        </div>

        <!-- 晒单按钮 -->
        <div class="show-order" @click='send_saidn_change_handler'>
          <!--<i :class="chatroom_info.ban_share ? 'icon-ban-show-order' : 'icon-show-order'"></i>-->
          <i class="icon-show-order"></i>
          <div class="show-order-txt">{{ i18n_t('chatroom.show_order')}}</div>
        </div>

      </div>
    </div>

    <!-- 晒单列表 -->
    <saidan-list
    v-if="is_display_saidai && !is_fold"
    @qingkong="is_display_saidai=false"
    />
    <q-dialog v-model="alert" >
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
          <div class="btn"  @click.stop="alert = false">{{ i18n_t('chatroom.close') }}</div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import panel_header from "src/project/yabo/components/match_details/panel/components/panel_header.vue";
import charMarquee from "src/project/yabo/components/match_details/panel/components/marquee.vue";
import emoji_picker from "src/project/yabo/components/match_details/panel/components/emoji_picker";
import ChatroomMsgType from 'src/public/utils/ws/chatroom/chatroom_msgtype.js';
import { api_chatroom } from "src/public/api/index.js";
import {utils} from "src/output/index.js"
import axios from 'axios'
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"

export default {
  name: "chatroom",
  components: {
    'panel-header': panel_header,
    'emoji-picker': emoji_picker,
    'show-bets': () => import('src/project/yabo/components/match_details/panel/components/bet_record_info'),
    charMarquee
  },
  props: {
    show_header: {
      type: Boolean,
      default: true
    },
    chatroom_info: {
      type: Object,
      default: () => ({
        all_mute: 0,
        ban_share: 0,
        chatRoomId: '',
        crs: 0,
      })
    },
    chatroom_height: {
      type: Number | String,
      default: 0
    }
  },
  data() {
    return {
      // 是否展示晒单列表
      is_display_saidai: false,
      // 输入框内容
      content: '',
      content_status_info: {
        // 发言是否包含敏感词
        contain_bad_word: false,
        send_time: Date.now(),
        // 说话发言是否太快
        send_fast: false,
        // 发言限制cd
        limit_send: false,
      },
      // 是否显示emoji弹层
      show_emoji_choose: false,
      // 被禁言
      is_muted: false,
      // 过滤晒单tips 隐藏倒计时
      countdown: 3,
      // 是否显示过滤晒单tips
      show_mute_text_msg_tips: false,
      // 所有消息内容列表
      message_list: [],
      // 注单信息
      bet_records: {},
      // 输入框 placeholder
      chat_input_placeholder: '',
      // 敏感词列表
      bad_words: [
        '妈',
        '日'
      ],
      // 是否 允许显示 “↓ 有更多消息”
      can_show_more_msg: false,
      // 是否 显示 “↓ 有更多消息”
      show_more_msg: false,
      // 初始scrollTop
      init_chat_scroll_top: 0,
      // 当前聊天室翻页
      curr_chat_scroll_page: 1,
      // 正在加载更多消息
      is_loading_message: false,
      // 是否处于发言cd
      is_cd: false,
      // 是否 仅展示晒单
      is_mute_textmsg: sessionStorage.getItem('is_mute_textmsg'),
      // 是否显示发言条件tips
      show_chat_conditions_tips: false,
      // 当前轻提示
      curr_show_tips_fields: '',
      // 当前组件已销毁
      curr_component_destroyed: false,
      //是否折叠
      is_fold: false,
      //公告弹窗
      alert:false,
      //禁言hover 提示状态
      muted_tips_status:false,
      //公告消息列表
      bulletin_list:[],
    }
  },
  computed: {
    // ...mapGetters([
    //   'get_user',
    //   'get_user_token',
    //   'get_global_click',
    //   'get_chatroom_id',
    //   'get_chatroom_connect_info',
    //   'get_chatroom_curr_url_info',
    // ]),
    // 是否 能发送消息
    can_send_msg() {
      return false
    },
    // 当前聊天室是否为全体禁言
    is_all_mute() {
      return this.chatroom_info.all_mute === 1
    },
    // 当前聊天室是否禁止晒单
    is_ban_share() {
      return this.chatroom_info.ban_share === 1
    },
    // 当前发言输入框placeholder
    curr_chat_input_placeholder() {
      return this.is_all_mute ? i18n_t('chatroom.all_mute') : this.chat_input_placeholder
    },
    // 消息列表
    messages() {
      if (this.is_mute_textmsg) {
        return this.message_list.filter(item => item.type == 2 || item.userId === this.get_user.userId)
      } else {
        return this.message_list
      }
    }
  },
  watch: {
    // 全局点击事件
    get_global_click(){
      this.show_emoji_choose = false
      this.show_chat_conditions_tips = false
    },
  },
  created() {
    // 加载mqtt
    this.load_mqtt_js()
    // 用户首次进入聊天室 展示过滤晒单提示
    const tips_map = JSON.parse(localStorage.getItem('show_mute_text_msg_tips')) || {}
    if (!tips_map[this.get_user.userId]) {
      this.show_mute_text_msg_tips = true
      this.countdown = 3
      this.btn_cancel_tips()
    }
  },
  mounted() {
    // 面板title高度
    const panel_header_height = this.$refs['panel_header'].$el.clientHeight
    // 聊天室交互栏高度
    const chat_handle_bar_height = this.$refs['chat_handle_bar'].clientHeight
    
    // 大视频下 动态计算聊天室滚动区域高度
    if (this.$route.name === 'video') {
      // 聊天室总高度
      const chatroom_height = this.$refs['chatroom'].clientHeight

      this.$refs['chat_scroll_area'].style.height = chatroom_height - panel_header_height - chat_handle_bar_height + 'px'
    }
    // 内嵌右侧
    else if (is_iframe) {
      this.$refs['chat_scroll_area'].style.height = this.chatroom_height - panel_header_height - chat_handle_bar_height + 'px'
    }
    
  },
  methods: {
    // ...mapMutations([
    //   'set_chatroom_id',
    //   'set_chatroom_available',
    //   'set_chatroom_connect_info',
    //   'set_chatroom_curr_url_info',
    // ]),
    // 用户禁言阶段placeholder显示文本
    get_ban_placeholder(info) {
      const {banTime = 0, banType = 1} = info
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
      return i18n_t(
            'chatroom.mute_hint4', 
            {
              time: i18n_t('chatroom.mute_hint.time')[time_map[banTime]], 
              type:i18n_t('chatroom.mute_hint.type')[type_map[banType]]
            }
          )
    },
    get_stitching_bulletin(){
      let str = ""
       lodash.each(this.bulletin_list,(item,index)=>{
        str+= `${index+1}.${item.content}&ensp;&ensp;&ensp;&ensp;`
       })
       return  str
    },
    get_deta_format(time){
     return new Date(time).Format('hh:mm')
    },
    /**
     * @description 获取聊天室公告
     * @returns 
     */
    async get_chat_bulletin(){
      try {
        let bulletin =  await api_chatroom.post_chat_bulletin({})
        this.bulletin_list = lodash.get(bulletin,'data.data',[])
      } catch (error) {
          console.log('object :>> ', error);
      }
    },
    /**
     * @description 加载mqtt 1. 未存在mqtt时，需加载完成后，再请求登录  2. 已存在mqtt，则直接请求登录
     */
    load_mqtt_js() {
      if (!document.querySelector('#mqtt-js')) {
        const script = document.createElement('script');
        let  BUILD_VERSION=  window.env.config.BUILD_VERSION;

        script.src = `${BUILD_VERSION ? '/' + BUILD_VERSION : ''}/other-assets/lib/js/mqtt.min.js`;
        script.async = false;
        script.id = 'mqtt-js'

        script.onload = () => {
          this.chatroom_process_start()
        }

        document.head.appendChild(script);
      } else {
        this.chatroom_process_start()
      }
    },
    /**
     * @description 聊天室api域名池切换
     * @returns {Promise<unknown>} 返回Promise, 链式操作后续流程
     */
    chatroom_api_change_process() {
      // 聊天室域名池
      const url_apis = lodash.get(this.get_user, 'oss.chatroomHttpUrl', [''])
      console.log('----聊天室域名池----', url_apis)
      const axios_instance = axios.create()
      // 登录token
      const token = lodash.get(this.get_user, 'token', sessionStorage.getItem('pc_token'))
      // 并发请求队列
      let reqs = []
      url_apis.map((item) =>
        reqs.push(
            axios_instance.post(`${item}/livechat-api/user/getvipinfo`, null, {
              timeout: 10000,
              headers: {
                requestId: token,
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
              }
            })
        )
      );

      // 探测聊天室域名api是否可用 此处探测api为 /user/getvipinfo
      return Promise.any(reqs)
        .then((res) => {

          // 全局 聊天室域名
          window.CURRENT_LIVECHAT_API = res.config.url.split('/livechat-api')[0]
          // 域名池所有请求失败 标记
          this.api_pool_all_failed = false

          // 聊天室当前可用域名
          const live_domain = res.config.url.split('/livechat-api')[0]


          // 当前可用域名链接 在域名池中的下标
          const curr_live_domain_index = url_apis.findIndex(item => item === live_domain)

          // 若下标存在，则更新当前下标存储值
          if (curr_live_domain_index !== -1) {
            const obj = Object.assign({}, this.get_chatroom_curr_url_info, {api_index: curr_live_domain_index})
            this.set_chatroom_curr_url_info(obj)
          }

          if (lodash.get(res, 'data.data')) {
            // 获取vip信息 后续操作
            this.after_get_vip_info_process(res.data.data)
          }
        })
        .catch((error) => {
          console.error(error)

          // 全局 聊天室域名 置空
          window.CURRENT_LIVECHAT_API = ''
          // 域名池所有请求失败 标记
          this.api_pool_all_failed = true
          
          // 记录域名池全部请求失败次数
          if (!this.error_req_count) {
           this.error_req_count = 1
          } else {
           this.error_req_count++
          }
          
          // 最多连续请求域名池 3次
          if (this.error_req_count > 2) {
           return
          }
          
          // 再次执行域名池切换
          this.chatroom_api_change_process()
        })




    },


    send_saidn_change_handler() {
      // this.is_display_saidai = true;
      // return;
      // if (this.chatroom_info.ban_share) {
      //   // 聊天室禁晒单提示
      //   useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t('chatroom.ban_share'));
      // }
      useMittOn(MITT_TYPES.EMIT_SAIDAN_PAGE_CHANGE_MSG_EVENT, true);
    },
    // 登录聊天室成功后，执行相应流程请求
    chatroom_process_start() {
      // 聊天室api域名池切换
      this.chatroom_api_change_process().then(() => {
        // 域名池请求成功 才继续后续状态、信息等请求
        if (!this.api_pool_all_failed) {
          // 登录成功后再拉取 历史消息
          this.load_message({is_first: true}).then(() => {
            this.get_chatroom()
            this.get_bet_like_info()
            this.get_ban_send_info()
            this.get_chat_bulletin()
          })

          // 固定间隔拉取消息，避免ws推送消息丢失
          clearInterval(this.pull_message_timer)
          const PULL_MSG_RATE = (this.get_user.pullMsgRate || 5) * 1000

          if (!this.curr_component_destroyed) {
            this.pull_message_timer = setInterval(() => {
              this.load_message()
            }, PULL_MSG_RATE)
          }
        }
      })
    },
    // 连接参数：/ws/{chatRoomId}/{requestId}
    init_ws() {
      // mqtt Topic数组
      const { mqtttopic } = this.get_chatroom_connect_info
      // 当前mqtt 下标
      const mqtt_index = lodash.get(this.get_chatroom_curr_url_info, 'mqtt_index', 0)
      // 当前mqtt url
      const mqtturl = lodash.get(this.get_user, `oss.chatroomUrl[${mqtt_index}]`, '')
      // mqtt连接参数配置
      const options = {
        // Clean session
        // clean: true,
        keepalive: 60,
        // 断线自动重新连接
        reconnect: true,
        reconnectPeriod: 1000,
        connectTimeout: 4000,
        // 不接受离线消息
        cleanSession: true,
        // Auth
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
      }

      // mqtt连接创建
      this.chatroomWs = mqtt.connect(mqtturl, options)
      // mqtt连接成功
      this.chatroomWs.on('connect', () => {
        console.log('Mqtt Connected')
        this.chatroomWs.subscribe(mqtttopic, (err) => {
          if (!err) {
            console.log('----聊天室所有级别订阅----')
            this.chatroomWs.publish('mqtttopic', '聊天室所有级别订阅')
          }
        })

        // this.chatroomWs.subscribe(merchanttopic, (err) => {
        //   if (!err) {
        //     console.log('----聊天室商户级别订阅----')
        //     this.chatroomWs.publish('merchanttopic', '聊天室商户级别订阅')
        //   }
        // })
      })

      // 接收mqtt消息推送
      this.chatroomWs.on('message', (topic, message, packet) => {
        // message is Buffer
        console.log(1111, `Topic: ${topic}, Message: ${message.toString()}, QoS: ${packet.qos}`)
        const mqtt_data = JSON.parse(message.toString())
        const { option, data } = mqtt_data

        this.handle_ws_pull_message(option, data)
      })

      // mqtt重连
      this.chatroomWs.on('reconnect', () => {
        console.log('Reconnecting...')
      })

      // 连接关闭
      this.chatroomWs.on('close', () => {
        // 若mqtt域名池数量大于1，则切换下一个mqtt链接
        if (lodash.get(this.get_user, 'oss.chatroomUrl.length', 1) > 1) {
          // 先关闭本次连接
          this.chatroomWs.end()

          // mqtt域名池中所有链接均失效，则重置到第一个链接
          let mqtt_index = this.get_chatroom_curr_url_info.mqtt_index + 1
          if (mqtt_index > this.get_user.oss.chatroomUrl.length - 1) {
            mqtt_index = 0
          }

          // 更新当前mqtt url地址
          const obj = Object.assign({}, this.get_chatroom_curr_url_info, {mqtt_index})
          this.set_chatroom_curr_url_info(obj)
          // 初始化连接
          this.init_ws()
        }

      })

      // 连接错误
      this.chatroomWs.on('error', function (error) {
        console.error('----mqtt连接错误----', error)
      })

    },
    /**
     * @description ws推送消息统一处理
     * @param option 推送类型
     * @param data 传输数据
     */
    handle_ws_pull_message(option, data) {
      switch (option) {
        // 增量消息
        case ChatroomMsgType.INCREMENT_MESSAGE:

          // 普通消息
          if (Object.prototype.toString.call(data) === '[object Object]') {
            data.nickName = this.replace_middle_character(data.nickName)
            data.content = [data.content]

            const message_list = this.message_list.concat(data)
            // 消息去重
            this.message_list = lodash.uniqBy(message_list, 'messageId')

            // 只显示300条
            if (this.message_list.length > 300) {
              this.message_list = this.message_list.slice(-300)
            }
          }
          // 晒单消息
          else if (Array.isArray(data)) {
            data.forEach(item => {
              item.nickName = this.replace_middle_character(item.nickName)
              item.content = JSON.parse(item.content)
              item.is_like = false
            })

            // 1.所有可见 2.禁晒单仅自己可见 才加入到消息列表中
            if (
                !data[0].isVisible ||
                data[0].isVisible && data[0].userId === this.get_user.userId
            ) {
              // this.message_list.push(...data)

              const message_list = this.message_list.concat(...data)
              // 消息去重
              this.message_list = lodash.uniqBy(message_list, 'messageId')

              // 只显示300条
              if (this.message_list.length > 300) {
                this.message_list = this.message_list.slice(-300)
              }
            }
          }

          // 当前过滤消息类型 和收到的消息类型是否相同
          const is_order_type = this.is_mute_textmsg && Array.isArray(data)

          // 显示更多消息 或 滚动至底部
          if (this.can_show_more_msg) {
            if (
                Array.isArray(data) && data[0].userId === lodash.get(this.get_user, 'userId') ||
                !Array.isArray(data) && data.userId === lodash.get(this.get_user, 'userId')
            ) {
              this.scroll_to_bottom()
            }
            else if (!this.is_mute_textmsg || is_order_type) {
              this.show_more_msg = true
            }
          } else {
            if (!this.is_mute_textmsg || is_order_type) {
              this.scroll_to_bottom()
            }
          }

          break;
        // 更新消息， 如点赞状态
        case ChatroomMsgType.UPDATE_MESSAGE:
          if (data.type === '2') {
            const order_index = this.message_list.findIndex(item => item.orderId === data.orderId)
            if (order_index > -1) {
              data.nickName = this.replace_middle_character(data.nickName)
              data.content = JSON.parse(data.content)
              data.is_like= this.message_list[order_index].is_like
              this.$set(this.message_list, order_index, data)
            }
          }
          break;
        // 撤回消息
        case ChatroomMsgType.RECALL_MESSAGE:
          const message_index = this.message_list.findIndex(item => item.messageId === data.messageId)
          if (message_index !== -1) {
            this.message_list.splice(message_index, 1)
          }
          break;
        // 清屏消息
        case ChatroomMsgType.CLEAR_MESSAGE:
        //商户清屏消息
        case ChatroomMsgType.CLEAR_MERCHANT_MESSAGE:
          this.message_list = [];
          break;
        //用户清屏消息
        case ChatroomMsgType.CLEAR_USER_MESSAGE:
            this.message_list = lodash.filter(this.message_list,message => message.userId !== data);
          break;
        // 用户禁言
        case ChatroomMsgType.BAN_SEND_MESSAGE:
          if (data.userId === this.get_user.userId) {
            this.is_muted = true;
            this.chat_input_placeholder = this.get_ban_placeholder(data)
            let ban_user_time = data.banTime * 1000
            const ban_user_start_time = data.banStartTime

            // 禁言倒计时
            if (ban_user_time) {
              ban_user_time = ban_user_time - (Date.now() - ban_user_start_time)
              this.run_ban_user_timer(ban_user_time)
            }
          }
          break;
        // 用户解除禁言
        case ChatroomMsgType.UNBAN_SEND_MESSAGE:
          if (data.userId === this.get_user.userId) {
            this.is_muted = false;
            this.chat_input_placeholder = i18n_t('chatroom.send_chat_content')
          }
          break;
        // 聊天室禁言
        case ChatroomMsgType.BAN_ROOM_SEND_MESSAGE:
          this.$emit('update:chatroom_info', {all_mute: 1})
          break;
        // 聊天室解除禁言
        case ChatroomMsgType.UNBAN_ROOM_SEND_MESSAGE:
          this.$emit('update:chatroom_info', {all_mute: 0})
          break;
        // 聊天室禁晒单
        case ChatroomMsgType.BAN_ROOM_SHARE_MESSAGE:
          this.$emit('update:chatroom_info', {ban_share: 1})
          break;
        // 聊天室解除禁晒单
        case ChatroomMsgType.UNBAN_ROOM_SHARE_MESSAGE:
          this.$emit('update:chatroom_info', {ban_share: 0})
          break;
        // 聊天室公告更新
        case ChatroomMsgType.BULLETIN_MESSAGE:
          this.get_chat_bulletin()
          break;
        default:
          break;
      }

    },
    /**
     * @description 拉取消息列表
     * @param load_more 上滑加载分页消息
     * @param is_first 刚进入聊天室时第一次拉取
     * @returns {Promise<unknown>} 返回Promise对象便于链式执行后续逻辑
     */
    load_message({load_more, is_first} = {}) {
      this.is_loading_message = true

      const params = {
        chatRoomId: this.get_chatroom_id || '',
        messageId: this.pull_last_messsage_id || '',
      }
      return api_chatroom.get_chat_history_message(params).then((res) => {
        let data = lodash.get(res,'data');
        if (lodash.get(data,'code') === 0) {
          // q-chat-message 传入的text必须为数组，此处content字段转数组
          const message_data = data.data.filter((item, index) => {
            if (!Array.isArray(item.content)) {
              if (item.type === '1') {
                item.content = [item.content]
              } else if (item.type === '2') {
                item.content = JSON.parse(item.content)
              }
            }
            // 昵称保留前后3位，中间*号替换
            item.nickName = this.replace_middle_character(item.nickName)
            // 只显示 非敏感词 / 未撤回状态 / 仅自己可见的消息
            if (item.isVisible) {
              return !item.isSensitive && item.userId === this.get_user.userId
            }
            return !item.isSensitive && item.status === 1
          }).sort((item1, item2) => item1.sendTime - item2.sendTime)

          // 向上滚动 加载更多消息
          if (load_more) {
            let message_scroll_height = this.$refs['chat_scroll_area'].scrollHeight
            this.message_list.unshift(...message_data)

            nextTick(() => {
              this.$refs['chat_scroll_area'].scrollTop = this.$refs['chat_scroll_area'].scrollHeight - message_scroll_height
            })

            this.curr_chat_scroll_page++
          } else {
            // 拉取消息存在 才继续后续操作
            if (message_data.length) {
              let message_list = this.message_list.concat(message_data)
              // 消息去重
              this.message_list = lodash.uniqBy(message_list, 'messageId')

              // 只显示300条
              if (this.message_list.length > 300) {
                this.message_list = this.message_list.slice(-300)
              }

              // 记录每次拉取的最后一条消息的id，以便后续拉取增量消息
              this.pull_last_messsage_id = message_list[message_list.length - 1].messageId

              clearTimeout(this.scroll_timer)
              this.scroll_timer = setTimeout(() => {
                // 显示更多消息时，不滚动至底部
                if (!this.show_more_msg) {
                  this.scroll_to_bottom()
                }
              }, 300)
            }
          }

          this.is_loading_message = false
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        // 历史消息加载成功与否 最终都进行ws初始化连接
        if (is_first) {
          this.init_ws()
        }
      })
    },
    // 获取聊天室信息
    get_chatroom() {
      const params = {
        chatRoomId: this.get_chatroom_id
      }
      api_chatroom.get_chatroom(params).then(({data}) => {
        if (data.code === 0 && data.data) {
          // 同步 聊天室全体禁言状态
          if (data.data.disableSpeak) {
            this.$emit('update:chatroom_info', {all_mute: 1})
          }
          if (data.data.disableShowOrder) {
            this.$emit('update:chatroom_info', {ban_share: 1})
          }
        }
      }).catch(err => console.error(err))
    },
    // 获取点赞信息
    get_bet_like_info() {
      api_chatroom.get_bet_like_info().then(({data}) => {
        if (data.code === 0 && lodash.get(data, 'data.length')) {
          this.message_list.forEach((item, index) => {
            // 更新点赞状态
            if (data.data.includes(item.messageId)) {
              this.$set(this.message_list[index], 'is_like', true)
            }
          })
        }
      }).catch(err => console.error(err))
    },
    // 获取用户禁言信息
    get_ban_send_info() {
      api_chatroom.get_ban_send_info().then(({data}) => {
        // 同步 当前用户禁言状态
        if (data.code === 0 && data.data) {
          this.is_muted = true;
          let {data:info} = data
          this.chat_input_placeholder = this.get_ban_placeholder(info)
          let ban_user_time = info.banTime * 1000
          const ban_user_start_time = info.banStartTime

          // 禁言倒计时
          if (ban_user_time) {
            ban_user_time = ban_user_time - (Date.now() - ban_user_start_time)
            this.run_ban_user_timer(ban_user_time)
          }
        }
      })
    },
    // 非永久禁言 需执行禁言倒计时
    run_ban_user_timer(ban_time) {
      clearInterval(this.ban_user_timer)
      this.ban_user_timer = setInterval(() => {
        ban_time -= 1000
        if (ban_time <= 0) {
          this.is_muted = false;
          this.chat_input_placeholder = i18n_t('chatroom.send_chat_content')
          clearInterval(this.ban_user_timer)
        }
      }, 1000)
    },
    // 消息滚动处理
    handle_message_scroll(e) {
      if (this.init_chat_scroll_top && this.init_chat_scroll_top - e.target.scrollTop > 100) {
        this.can_show_more_msg = true
      } else {
        this.can_show_more_msg = false
        this.show_more_msg = false
      }

      // 向上滚动 加载更多
      if (!this.is_loading_message && e.target.scrollTop < 100 && this.curr_chat_scroll_page < 6) {
        // this.load_message({load_more: true})
      }
    },
    /**
     * @Description: 敏感词过滤
     */
    filter_bad_word(str, bad_words){
      let reg = '('
      for (let i = 0, len = bad_words.length; i < len; i++) {
        if (i === bad_words.length - 1) {
          reg += bad_words[i] + ')'
        } else {
          reg += bad_words[i] + '|'
        }
      }
      reg = new RegExp(reg, 'gi')
      return this.content.replace(reg,"***")
    },
    /**
     * @Description: 点击表情icon处理
     */
    handle_emoji_click() {
      let show_emoji_choose = !this.show_emoji_choose

      clearTimeout(this.emoji_choose_timer)
      this.emoji_choose_timer =setTimeout(()=>{
        this.show_emoji_choose = show_emoji_choose
      },50)
    },
    /**
     * @Description: 自由发言条件 展示/关闭
     */
    toggle_chat_conditions_tips() {
      let show_chat_conditions_tips = !this.show_chat_conditions_tips

      clearTimeout(this.toggle_chat_conditions_tips_timer)
      this.toggle_chat_conditions_tips_timer = setTimeout(() => {
        this.show_chat_conditions_tips = show_chat_conditions_tips
      }, 50)
    },
    /**
     * @Description: 发送消息
     */
    send_msg() {
      // 无内容 退出
      if (!this.content) {
        return
      }

      // 发言过快提示
      if (Date.now() - this.content_status_info.send_time < 3000) {
        this.$set(this.content_status_info, 'send_fast', true)
        this.content = ''

        clearTimeout(this.send_fast_timer)
        this.send_fast_timer = setTimeout(() => {
          this.$set(this.content_status_info, 'send_fast', false)
        }, 1500)
        return
      } else {
        this.$set(this.content_status_info, 'send_fast', false)
      }

      // 敏感词过滤
      // const filtered_word = this.filter_bad_word(this.content, this.bad_words)
      const filtered_word = this.content
      // 更新发言时间
      this.$set(this.content_status_info, 'send_time', Date.now())

      // 发言次数及cd显示
      if (this.origin_send_interval) {
        this.is_cd = true
        this.send_count--
        if (this.send_count > 0) {
          const _send_interval = Math.ceil(this.origin_send_interval / 60 / 1000)
          this.chat_input_placeholder = i18n_t('chatroom.remain_send', [this.send_count, _send_interval])
        } else {
          this.chat_input_placeholder = i18n_t('chatroom.send_used_up')
        }

        // 发言倒计时
        this.run_send_message_interval()
      }


      // 清空输入框
      this.content = ''

      // 发言 请求http
      const params = {
        chatRoomId: this.get_chatroom_id,
        content: filtered_word
      }
      api_chatroom.post_chat_sendmessage(params).then(({ data }) => {
        if (data.code === 0) {
          // 每次发言后，滚动到底部
          // this.scroll_to_bottom()
        }
        // 发言包含敏感词提示
        else if (data.code === 21044) {
          this.$set(this.content_status_info, 'contain_bad_word', true)
          clearTimeout(this.bad_word_tips_timer)
          this.bad_word_tips_timer = setTimeout(() => {
            this.$set(this.content_status_info, 'contain_bad_word', false)
          }, 2000)
        }
      }).catch(err => console.error(err))
    },
    /**
     * @description 获取vip信息 后续操作
     * @param data 用户vip相关信息
     */
    after_get_vip_info_process(data) {
      const {isVip,isSuper, limit, interval, time, sendTime} = data

      // 已达标用户 vip super
      if (isVip === 'true' || isSuper === 'true') {
        this.chat_input_placeholder = i18n_t('chatroom.send_chat_content')
      }
     // 未达标用户 则显示 相关发言限制提示
      else {
        if (limit || interval) {
          // 发言初始cd
          this.origin_send_interval = interval
          this.send_count = limit - time
          // 受限用户可发言 剩余倒计时
          this.send_interval = interval - (Date.now() - sendTime)

          if (this.send_interval < 0) {
            this.send_interval = interval
          }

          // 存在发言次数
          if (limit - time > 0) {
            if (sendTime + interval > Date.now()) {
              // 发言cd（分钟）
              const _send_interval = Math.ceil(this.origin_send_interval / 60 / 1000)
              // 输入框发言cd placeholder
              this.chat_input_placeholder = i18n_t('chatroom.remain_send', [this.send_count, _send_interval])
              // 显示发言cd 提示
              this.is_cd = true

              // 发言倒计时
              this.run_send_message_interval()
            } else {
              this.is_cd = false
              this.chat_input_placeholder = i18n_t('chatroom.send_chat_content')
            }
          } else {
            this.is_cd = true
            this.chat_input_placeholder = i18n_t('chatroom.send_used_up')
          }

        } else {
          // 隐藏发言cd 提示
          this.is_cd = false
          this.$set(this.content_status_info, 'limit_send', false)
        }
      }
    },
    /**
     * @Description: 可发言倒计时
     */
    run_send_message_interval() {
      clearInterval(this.can_send_message_timer)
      this.can_send_message_timer = setInterval(() => {
        this.send_interval -= 1000
        // 发言cd 结束，放开输入框
        if (this.send_interval <= 0) {
          this.is_cd = false
          this.send_interval = this.origin_send_interval
          this.chat_input_placeholder = i18n_t('chatroom.send_chat_content')

          clearInterval(this.can_send_message_timer)
        } else {
          // 输入框失焦，用户不可发言
          this.$refs['chat-input'] && this.$refs['chat-input'].blur()
          // 实时显示 发言cd状态
          this.is_cd = true
          if (this.send_count > 0) {
            const _send_interval = Math.ceil(this.origin_send_interval / 60 / 1000)
            this.chat_input_placeholder = i18n_t('chatroom.remain_send', [this.send_count, _send_interval])
          } else {
            // 显示 发言次数用完
            this.chat_input_placeholder = i18n_t('chatroom.send_used_up')
            clearInterval(this.can_send_message_timer)
          }
        }
      }, 1000)
    },
    /**
     * @Description: 用户输入处理
     */
    handle_user_input() {
      // 用户每次发言字数限制最多60字
      if (this.content.length > 60) {
        this.content = this.content.slice(0, 60)
      }
    },
    /**
     * @Description: 不可发言时，点击输入框 显示相应提示
     */
    chat_input_click(e) {
      if (this.is_cd && e.target.tagName === 'INPUT') {
        e.target.blur()

        this.$set(this.content_status_info, 'limit_send', true)

        clearTimeout(this.limit_send_timer)
        this.limit_send_timer = setTimeout(() => {
          this.$set(this.content_status_info, 'limit_send', false)
        }, 1500)
      }
    },
    /**
     * @Description: 
     * 三位以上了  就用前二 + 4个* + 后二
     * 例 ABCD  就显示AB****CD
     * 那小于三位的   就用前一 + 6个* + 后一
     * 例 A 就是 A******A
     */
    replace_middle_character(str) {
      const str_length = str.length
      if (str_length > 3) {
        const reg = new RegExp(`^(.{2})(.*)(.{2})$`)
        return  str.replace(reg, '$1****$3')
      } 
      else if (str_length === 3) {
        return  str.slice(0, 2) + '****' + str.slice(-2)
      }
      else {
        return str.slice(0, 1) + '******' + str.slice(-1)
      }
    },
    /**
     * @Description: 滚动消息内容至底部
     */
    scroll_to_bottom() {
      nextTick(() => {
        this.can_show_more_msg = false
        this.show_more_msg = false
        
        if (this.$refs['chat_scroll_area']) {
          this.$refs['chat_scroll_area'].scrollTop = this.$refs['chat_scroll_area'].scrollHeight

          this.init_chat_scroll_top = this.$refs['chat_scroll_area'].scrollTop
        }
      })
    },
    /**
     * @Description: 过滤晒单信息开关
     */
    toggle_mute_textmsg() {
      if (sessionStorage.getItem('is_mute_textmsg')) {
        sessionStorage.removeItem('is_mute_textmsg')
      } else {
        sessionStorage.setItem('is_mute_textmsg', '1')
      }

      this.is_mute_textmsg = sessionStorage.getItem('is_mute_textmsg')
      this.scroll_to_bottom()
    },
    /**
     * @Description: 关闭 用户首次进入聊天室的 过滤晒单tips
     */
    btn_cancel_tips(user_handle) {
      // 用户手动关闭
      if (user_handle) {
        this.show_mute_text_msg_tips = false
        this.set_user_first_enter_map()
        clearInterval(this.close_tips_timer)
      } else {
        clearInterval(this.close_tips_timer)
        this.close_tips_timer = setInterval(() => {
          this.countdown--
          // 倒计时结束后关闭
          if (this.countdown === 0) {
            this.show_mute_text_msg_tips = false
            this.set_user_first_enter_map()
            clearInterval(this.close_tips_timer)
          }
        }, 1000)
      }
    },
    /**
     * @Description: 更新当前用户初次进入聊天室状态
     */
    set_user_first_enter_map() {
      // 当前已显示过的用户提示map
      const curr_tips_map = JSON.parse(localStorage.getItem('show_mute_text_msg_tips')) || {}
      // 合并当前用户tips状态
      const tips_map = Object.assign({}, curr_tips_map, {[this.get_user.userId]: '0'})
      // 本地存储 已初次进入用户tips状态
      localStorage.setItem('show_mute_text_msg_tips', JSON.stringify(tips_map))
    },
    // 清除当前组件所有定时器
    clear_timer() {
      // timeout定时器列表
      const timeout_timer_arr = [
        'emoji_choose_timer',
        'toggle_chat_conditions_tips_timer',
        'send_fast_timer',
        'limit_send_timer',
        'scroll_timer',
        'bad_word_tips_timer',
      ]

      // interval定时器列表
      const interval_timer_arr = [
        'close_tips_timer',
        'can_send_message_timer',
        'ban_user_timer',
        'pull_message_timer',
      ]

      // 批量清除timeout定时器
      for (const timer of timeout_timer_arr) {
        clearTimeout(this[timer])
        this[timer] = null
      }

      // 批量清除interval定时器
      for (const timer of interval_timer_arr) {
        clearInterval(this[timer])
        this[timer] = null
      }
    },
  },
  destroyed() {
    // 标记当前组件已销毁
    this.curr_component_destroyed = true
    // 清除定时器
    this.clear_timer()
    const { mqtttopic } = this.get_chatroom_connect_info
    // 取消订阅主题
    this.chatroomWs && this.chatroomWs.unsubscribe(mqtttopic, function (error) {
      if (error) {
        console.error(error)
      } else {
        console.log('Unsubscribed')
      }
    })
    // 关闭客户端
    this.chatroomWs && this.chatroomWs.end()

    // 清空聊天室相关状态
    this.set_chatroom_id('')
    this.set_chatroom_available(0)
    this.set_chatroom_connect_info({})
    this.set_chatroom_curr_url_info({
      api_index: 0,
      mqtt_index: 0
    })

  }
}
</script>

<style scoped lang="scss">
.chatroom {
  margin-top: 4px;
  border-radius: 8px;
  overflow: hidden;
  .icon-arrow{
    font-size: 16px;
    transition: transform 0.3s;
    &.fold {
      transform: rotate(180deg);
    }
    &::before {
      color: #999
    }
  }
  .chat-scroll-area {
    height: 350px;
    padding: 2px 16px 0 16px;
    overflow: auto;
    :deep() {
      .q-message {
        margin-bottom: 10px;
      }
      .q-message-text + .q-message-text {
        margin-top: 6px;
      }
      .q-message-text:last-child {
        min-height: unset;
      }
      .q-message-sent {
        .q-message-container {
          > div {
            flex-direction: row-reverse;
          }
        }
      }
      .q-message-text--sent {
        border-radius: 8px;
        padding: 5px 10px;
        &:last-child::before {
          top: 10px;
        }
      }
      .q-message-text--received {
        border-radius: 8px;
        padding: 5px 10px;
        &:last-child::before {
          top: 10px;
        }
      }
      .q-message-container {
        > div {
          display: flex;
        }
      }
      .q-message-name {
        font-size: 12px;
        margin-top: 4px;
        user-select: all;
      }
      .q-message-text {
        user-select: all;
      }
      .q-message-name--received {
        margin-right: 12px;
      }
      .q-message-name--sent {
        margin-left: 12px;
      }
      .message-show-time{
        .q-message-text-content{
          display: flex;
          .q-message-stamp{
            margin-top: 0;
            padding-left: 2px;
            white-space:nowrap;
            font-size: 12px;
            align-self: flex-end;
          }
        }
      }
      .message-show-order {
        .q-message-name {
          margin-top: 0;
        }
        .q-message-name--received {
          margin-right: 10px;
        }
        .q-message-name--sent {
          margin-left: 10px;
        }
        .q-message-text {
          border-radius: 10px;
          padding: 2px 10px;
          height: 20px;
          line-height: 16px;
          &::before {
            border: 0 !important;
          }
        }
        .q-message-text-content {
          color: var(--q-gb-t-c-1);
        }
        .q-message-container {
          > div {
            flex-wrap: wrap;
            align-items: center;
            > div:last-child {
              flex: 0 0 100%;
              height: 100%;
              padding: 0;
            }
          }
        }
      }
    }
  }

  .more-msg {
    position: absolute;
    bottom: 52px;
    left: 50%;
    transform: translateX(-50%);
    height: 24px;
    line-height: 24px;
    padding: 0 10px 0 14px;
    color: var(--q-gb-t-c-1);
    border-radius: 14px;
    .inner-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .icon-arrow-down {
      width: 14px;
      height: 14px;
      background-repeat: no-repeat;
      background-size: 100%;
      margin-right: 6px;
    }
  }

  .chat-handle-bar {
    height: 48px;
    padding: 8px 20px 8px 16px;
    .chat-item-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;

      :deep() {
        .emoji-mart {
          position: absolute;
          bottom: 32px;
          height: 358px;
        }
      }

      .item-user-input {
        flex: 1;
        height: 32px;
        border: 1px solid rgba(220,224,229,1);
        border-radius: 6px;
        position: relative;
        :deep() {
          .q-field__control, .q-field__marginal {
            height: 32px;
          }
          input {
            padding-left: 16px;
            font-size: 12px;
          }
          .q-icon {
            cursor: pointer;
            &:first-child {
              margin-right: 4px;
            }
            &[class*=icon-] {
              width: 16px;
              height: 16px;
              background-repeat: no-repeat;
              background-size: 100%;
            }
            &[class*=icon-send] {
              margin-bottom: 2px;
            }
            &.icon-cd-tips {
              background-image: url($SCSSPROJECTPATH+'/image/svg/chat-conditions.svg');
            }
          }
          .btn-send {
            position: relative;
            font-size: 12px;
            &::before {
              content: '';
              width: 1px;
              height: 12px;
              background-color: #D8D8D8;
              border-radius: 0.5px;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
            }
            .q-icon {
              margin-left: 8px;
              margin-right: 12px;
            }
          }

          .chat-conditions-tips {
            position: absolute;
            top: -68px;
            left: -108px;
            padding: 5px 15px 7px 15px;
            border-radius: 18px;
            font-size: 12px;
            &::before {
              content: "";
              position: absolute;
              width: 0;
              height: 0;
              border: 6px solid transparent;
              bottom: -12px;
              left: 50%;
            }
            &::after {
              content: '';
              position: absolute;
              width: 0;
              height: 0;
              border: 6px solid transparent;
              bottom: -11px;
              left: 50%;
            }
            .tips-flex {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              height: 100%;
              line-height: 16px;
            }
            .tips-title {
              position: relative;
              padding-left: 15px;
              font-weight: 700;
              &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 6px;
                height: 6px;
                border-radius: 50%;
              }
            }
          }
        }
        .muted{
          position: absolute;
          bottom: 7px;
          right: 7px;
          width: 15px;
          height: 15px;
          background: url($SCSSPROJECTPATH+"/image/svg/ask-icon.svg") center center no-repeat;
          background-size: 100%;
          cursor: pointer;
        }
        .muted_tips{
          position: absolute;
          max-width: 251px;
          bottom: 36px;
          right: -120px;
          border-radius: 6px;
          padding: 8px 9px;
          word-wrap: break-word;
          font-size: 12px;
          &::after {
            content: "";
            width: 10px;
            height: 10px;
            transform: rotate(45deg);
            position: absolute;
            bottom: -5px;
            left: calc(50% - 14px);
         }
        }
      }

      .other-btn {
        flex: 0 0 24px;
        .item-btn {
          margin-left: 8px;
        }
        .btn-mute-user-input, .btn-normal-user-input {
          position: relative;
          width: 24px;
          height: 24px;
          background-repeat: no-repeat;
          background-size: 100%;
          margin-right: 35px;
          cursor: pointer;
          .tips {
            position: absolute;
            top: -39px;
            left: -117px;
            width: 245px;
            height: 30px;
            padding: 3px 3px 3px 10px;
            border-radius: 18px;
            &::before {
              content: "";
              position: absolute;
              width: 0;
              height: 0;
              border: 6px solid transparent;
              bottom: -12px;
              left: 50%;
            }
            &::after {
              content: '';
              position: absolute;
              width: 0;
              height: 0;
              border: 6px solid transparent;
              bottom: -11px;
              left: 50%;
            }
            .tips-flex {
              display: flex;
              align-items: center;
              height: 100%;
              .tips-text {
                margin-right: 2px;
              }
              .btn-cancel-tips {
                width: 72px;
                line-height: 24px;
                text-align: center;
                border-radius: 14px;
              }
            }
          }
        }
      }
      .show-order {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        flex: 0 0 52px;
      }
      .icon-show-order, .icon-ban-show-order {
        width: 24px;
        height: 24px;
        background-repeat: no-repeat;
        background-size: 100%;
        margin-right: 3px;
      }
    }
  }
}
</style>
<style lang="scss">
  .dialog-wrap {
    width: 320px;
    height: 278px;
    overflow-y: hidden;
    .card-header{
        padding: 18px 0 8px 0;
        font-size: 16px;
        color: #000;
        font-weight: 600;
    }
    .card-body{
      padding: 16px 10px 10px 16px;
      width: 100%;
      .dialog-scroll {
        width: 100%;
        height: 148px;
        overflow-y: auto;
        margin: 0 auto;
        padding-right: 10px;
        font-size: 14px;
        color: #000;
        .bulletin-item{
          font-weight: 400;
          line-height: 22px;
          word-break:break-all; 
        }
     }
    }
    .card-footer {
      border-top: 1px solid rgba(102,102,102,0.1);
      height: 48px;
      width: 100%;
      .btn {
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 47px;
        font-size: 16px;
        font-weight: 400;
        color: #6D7278;
        cursor: pointer;
      }
    }
  }
</style>