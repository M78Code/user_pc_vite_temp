<!--
 * @Author: iverson
 * @Date: 2022-08-28 18:24:36
 * @Description: 晒单信息展示
-->
<template>
  <div class="bet-wrapper">
    <div class="bet-item">
      <!-- 头部 -->
      <div class="bet-header">
        <span class="tips"></span>
        <span>{{bet_data.matchInfo}}</span>
        <span class="msg-time">{{$formatDate(msgInfo.updateTime, 'HH:mm')}}</span>
      </div>

      <!-- 中间内容区 -->
      <div class="bet-content">
        <div class="content-item">
          <span>
            {{i18n_data.type}}{{bet_data.playName}}
            [{{`${i18n_data.market_type_name}`}}]
          </span>
          <!-- 输、赢、走水...-->
          <span v-if="[2, 3, 4, 5, 6].includes(+bet_data.outcome)" :class="[4, 5].includes(+bet_data.outcome) ? 'highlight' : 'normal'">{{outcome2[bet_data.outcome]}}</span>
          <!--跟单-->
          <span class="bet-submit" @click="handle_bet" v-else>{{i18n_t('chatroom.follow_bet')}}</span>
        </div>
        <div class="content-item font-size14">
          <template v-if="bet_data.playOptionName&&bet_data.playOptionName.includes(' ')">
            <span class="part1">
              <span class="name">{{ bet_data.playOptionName.replace(/\s+/g, ' ').split(' ')[0] }}</span>
              <span class="part2">{{ bet_data.playOptionName.replace(/\s+/g, ' ').split(' ')[1] }}</span>
            </span>
          </template>
          <template v-else>
            <span class=name>{{ bet_data.playOptionName }}</span>
          </template>
        </div>
        <div class="content-item font-size14">
          <span class="odds">@{{format_odds(bet_data.oddFinally)}}</span>

          <!-- 点赞 -->
          <span class="thumbs" @click="likeMessage">
            <span :class="`${hasLiked?'thumbs-img2':'thumbs-img'}`" />
            <span>{{msgInfo.like}}</span>
          </span>
        </div>
      </div>

      <!-- 底部 -->
      <div class="bet-footer">
        <!-- 投注额 -->
        <span class="label">{{i18n_t('bet_record.bet_val')}}:
          <span>{{ format_currency(bet_data.originalOrderAmountTotal)}}</span>
        </span>
        <!-- 返还 -->
        <template v-if="[2, 3, 4, 5, 6].includes(+bet_data.outcome)">
          <span class="label">{{ i18n_t('bet_record.go_back') }}: <span :class="[4, 5].includes(+bet_data.outcome) ? 'highlight' : null">{{ format_currency(bet_data.settleAmount) }}</span></span>
        </template>
        <!-- 最高可赢 -->
        <template v-else-if="msgInfo.status == 1">
          <span class="label">{{i18n_t('bet_record.bet_max_win')}}:
            <span>{{ format_currency(bet_data.originalMaxWinAmount) }}</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
// import betting from 'src/project/mixins/betting/betting.js';
import { api_chatroom } from "src/project/api/index.js";
import { api_common } from 'src/project/api/index.js'
// #TODO vuex
// import { mapGetters, mapMutations } from "vuex";
// import chatroom_mixin from 'src/base-h5/components/details/components/chatroom/chatroom_mixin'
import { create_gcuuid } from "src/core/uuid/index.js";
import { format_currency, format_odds,  } from "src/output/index.js"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
;
//国际化

export default defineComponent({
  name: 'bet_info',

  // #TODO mixins
  // mixins: [betting, chatroom_mixin],
  props: {
    msgInfo: {
      type: Object,
      default() {
        return '';
      }
    }
  },
  setup(props, evnet) {
    let data = reactive({
      outcome2: {
        // #TODO $root
        // "2": i18n_t("bet_record.bet_no_status02"), //'走水',
        // "3": i18n_t("bet_record.bet_no_status03"), //'输',
        // "4": i18n_t("bet_record.bet_no_status04"), //'赢',
        // "5": i18n_t("bet_record.bet_no_status05"), //'赢半',
        // "6": i18n_t("bet_record.bet_no_status06"), //'输半',
      },
    });
    // #TODO vuex
    // ...mapGetters([
    //   'get_chatroom_id',  // 聊天室ID
    //   'get_details_item', //玩法集id
    //   'get_uid', //用户id
    //   'get_detail_data',
    //   'get_like_info', // 用户点赞信息
    //   'get_chatroom_http_url' // 聊天室域名
    // ]),
    const bet_data = computed(() => {
      let data = {};
      try {
        const { content } = msgInfo || {};
        data = JSON.parse(content);
      } catch (e) {
        console.log(e);
      }
      return data;
    });
    const i18n_data = computed(() => {
      const lang = 'zh';
      return {
        // #TODO $root
        // sport_name: i18n_t(`common_lang.${lang}.sport2`)[bet_data.sportId],
        // type: i18n_t(`common_lang.${lang}.matchtype`)[bet_data.matchType],
        // market_type_name: i18n_t(`common_lang.${lang}.odds`)[bet_data.marketType]
      }
    });
    // 用户是否已点赞
    const hasLiked = computed(() => {
      const likeList = get_like_info || [];
      const { messageId } = msgInfo || {};
      return likeList.includes(messageId);
    });
    // #TODO vuex
    // methods: {
    // ...mapMutations(['set_toast', 'set_bet_list', 'set_bet_obj', 'set_like_info', 'set_chat_bet']),
    /**
     * 跟单
     */
    const handle_bet = () => {
      const data = bet_data
      const params = {
        mcid: 0,
        mid: data.matchId
      }
      send_gcuuid = uid();
      params.gcuuid = send_gcuuid;
      api_common.get_matchDetail_getMatchOddsInfo(params).then((res) => {
        if(send_gcuuid != res.gcuuid) return;
        if (res.code == 200) {
          const data_details = _.cloneDeep(get_detail_data)
          let ol_field_data, ol_item
          ol_field_data = _.find(res.data, (o) => {
            return o.hpid == data.playId
          })
          //玩法存在，去找对应的投注项
          if (ol_field_data) {
            let hl_list = _.get(ol_field_data, 'hl') || []
            for (let i = 0; i < hl_list.length; i++) {
              let hl_item = hl_list[i]
              for (let k = 0; k < hl_item.ol.length; k++) {
                hl_item.ol[k].csid = data_details.csid
                hl_item.ol[k].hs = hl_item.hs
                hl_item.ol[k].mid = ol_field_data.mid
                hl_item.ol[k].ms = data_details.ms
                hl_item.ol[k].hid = hl_item.hid
                hl_item.ol[k].id_ = hl_item.hn ?
                  `${ol_field_data.mid}_${ol_field_data.hpid}_${hl_list[i].ol[k].ot}_${hl_item.hn}` : hl_list[i].ol[k].oid;
              }
            }
            let hl_obj_index = _.findIndex(hl_list, (o) => {
              return _.find(o.ol, (item) => {
                return item.oid == data.playOptionsId
              })
            })
            //如果投注项id找不到，去找投注项类型相同的
            if (hl_obj_index < 0) {
              hl_obj_index = _.findIndex(hl_list, (o) => {
                return _.find(o.ol, (item) => {
                  return item.ot == data.playOptions
                })
              })
              ol_item = _.find(_.get(hl_list[hl_obj_index], 'ol'), (o) => {
                return o.ot == data.playOptions
              })
            } else {
              console.log(hl_list[hl_obj_index])
              ol_item = _.find(hl_list[hl_obj_index].ol, (o) => {
                return o.oid == data.playOptionsId
              })
            }
          }
          if (ol_field_data && ol_item && data_details) {
            const mhs = data_details.mhs, hs = ol_item.hs, os = ol_item.os;
            const flag = mhs == 1 || mhs == 2 || hs == 1 || hs == 2 || os == 2 || os == 3
            if (flag) {  // 提示盘口失效
              // #TODO $root
              // set_toast({ 'txt': i18n_t('bet.msg12')});
              return
            }
            data_details.hps = [ol_field_data]
            set_bet_list([])
            set_bet_obj({})
            set_chat_bet(true)
            set_bet_obj_config(data_details, ol_field_data, ol_item)
          } else {  // 提示盘口失效
            // #TODO $root
            // set_toast({ 'txt': i18n_t('bet.msg12')});
          }
        }
      })
    };
    // 点赞消息
    const likeMessage = () => {
      if (hasLiked) {
        return;
      }
      const { messageId } = msgInfo || {};
      api_chatroom.post_chat_likemessage({ chatRoomId: get_chatroom_id, messageId }, {base_url:get_chatroom_http_url}).then((res) => {
        if (res && res.code == 0) {
          set_like_info([...get_like_info, messageId]);
        }
        if (res && res.code != 0) {
          set_toast({ txt: res.msg });
        }
      }).catch((err) => {
        console.log(err);
      });
    };
    return {
      ...toRefs(data),
      bet_data,
      i18n_data,
      hasLiked,
      handle_bet,
      likeMessage,
    }
  }
})
</script>
<style lang="scss" scoped>
.bet-wrapper {
  padding: 0 .25rem 0 0;
  display: flex;
  flex-direction: column;

  .bet-item {
    border-radius: .06rem;
    overflow: hidden;

    .bet-header {
      height: .28rem;
      display: flex;
      align-items: center;
      font-size: .12rem;
      font-weight: 500;
      position: relative;

      .tips {
        width: 2px;
        height: .12rem;
        margin: 0 .04rem 0 .14rem;
      }

      .msg-time {
        position: absolute;
        top: 50%;
        right: .1rem;
        transform: translateY(-48%);
        font-size: .1rem;
      }

    }

    .bet-content {
      padding: .08rem .1rem .08rem .2rem;
      font-size: .13rem;

      .content-item {
        display: flex;
        justify-content: space-between;
        line-height: .14rem;
        margin-bottom: .04rem;
        align-items: center;

        &:nth-last-child(1) {
          margin-bottom: 0;
        }

        img {
          margin-right: .04rem;
        }

        .name {
          margin-right: .06rem;
          font-weight: 500;
        }

        .rate {
          font-weight: 500;
        }

        .odds {
          font-weight: 700;
        }

        .thumbs {
          font-size: .12rem;
          display: flex;
          align-items: center;
          height: .12rem;
          padding: 0.1rem 0;

          .thumbs-img,
          .thumbs-img2 {
            width: .08rem;
            height: .08rem;
            margin-right: .06rem;
          }
        }

        .bet-submit {
          width: .48rem;
          height: .18rem;
          line-height: 1.6;
          text-align: center;
          border-radius: .12rem;
          font-size: .12rem;
        }
      }

      .font-size14 {
        font-size: .14rem;
      }
    }

    .bet-footer {
      height: .28rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 .1rem;

      .label {
        font-size: .09rem;
        font-weight: 500;
      }
    }
  }
}
</style>