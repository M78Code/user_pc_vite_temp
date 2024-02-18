<!--
 * @FilePath: d:/projects/user-h5/src/base-h5/components/details/components/chatroom/post_bet.vue
 * @Description:
-->
<!--
 * @Author: Router
 * @Description: 底部弹出的晒单弹层组件
-->
<template>
  <div v-if="visible" class="bet-record-page">
    <div class="shadow-box shadow-box2" @click="close_dialog(false)" @touchmove.prevent></div>
    <div class="bet-record" @click.stop :style="{ bottom: -bottom + 'px' }">
      <div class="top flex flex-center">
        <p class="yb_mr10" @click="change_record(0)" :class="get_main_item == 0 && 'active-p'">{{i18n_t('bet_record.no_account')}}<span></span></p>
        <p class="yb_ml10 yb_mr10" @click="change_record(1)" :class="get_main_item == 1 && 'active-p'">{{i18n_t('bet_record.account')}}<span></span></p>
      </div>
      <div class="bet-tips flex flex-center">{{  i18n_t('chatroom.post_bet_info2')  }}</div>
      <div class="content">
        <scroll ref="myScroll" :on-pull="onPull" v-if="list_data&&list_data.length">
          <div class="bet-content-item" v-for="(value,  index) in list_data" :key="index"
            @click="handle_bet_select(index)">
            <common-bet-item :data="value" :hasSharedIdList="hasSharedIdList"></common-bet-item>
          </div>
        </scroll>
        <no-data v-else which='noMatch'></no-data>
      </div>
      <div class="bet-footer flex justify-between">
        <div @click="clear_active_bet" class="cancle-button text-center yb_fontsize12 flex justify-center items-center"
          :class="get_active_bet  ?  'cancle-button-selected'  :  null">{{  i18n_t('chatroom.clear')  }}</div>
        <div @click="submit_bet" class="submit-button text-center yb_fontsize16 flex justify-center items-center"
          :class="get_active_bet  ?  'submit-button-selected'  :  null">{{  i18n_t('chatroom.post_bet2')  }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// #TODO vuex
// import { mapGetters, mapMutations } from "vuex"
import commonBetItem from "src/base-h5/components/details/components/chatroom/common_bet_item.vue";
import scroll from "src/project/components/record_scroll/scroll.vue";
import { api_chatroom } from "src/project/api/index.js";
import chatroom_mixin from 'src/base-h5/components/details/components/chatroom/chatroom_mixin'
import no_data from "src/project/components/common/no_data.vue";   // 无数据展示组件
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { i18n_t } from "src/boot/i18n.js";;
//国际化


export default defineComponent({
  name: 'post_bet',
  props: {
    visible: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    commonBetItem,
    scroll,
    "no-data": no_data
  },
  // #TODO mixins
  // mixins: [chatroom_mixin],
  setup(props, evnet) {
    const data = reactive({
      bottom: window.innerHeight,   // 距离
      list_data: [],  // 列表数据
      pageSize: 10,  // 每页的数量
      current: 1,  // 当前页
      is_hasnext: true,  // 是否有下一页
      hasSharedIdList: [],  // 已经晒单的orderID列表
    });
    const get_detail_data = ref({
        csid: '1',
        mid: '1',
    })
    watch(
      () => props.visible,
      (val) => {
        if (val) {
          $nextTick(() => {
            setTimeout(() => {
              bottom = 0;
            }, 5);
          });
        } else {
          bottom = window.innerHeight;
        }
      }
    );
    // computed: {
    // ...mapGetters([
    //   "get_detail_data",
    //   'get_chatroom_http_url', // 聊天室域名
    //   'get_main_item',
    // ]),
    const get_active_bet = computed(() => {
      const selected_bet = _.filter(list_data, (item) => {
        return item.isActive
      })
      return selected_bet.length > 0
    });
    onMounted(() => {
      // 原created
      getSharedOrderList();

      // 原mounted
      if (visible) {
        $nextTick(() => {
          setTimeout(() => {
            bottom = 0;
          }, 5);
        });
      }
      getRecord()
    });
    // #TODO vuex
    // methods: {
    // ...mapMutations(['set_post_bet_show', 'set_toast', 'set_main_item']),
    const change_record = (key) => {
      //已选中状态下不能点击
      if (get_main_item === key) return;
      set_main_item(key);
      getRecord();
    };
    //清除选中状态
    const clear_active_bet = () => {
      if (!get_active_bet) return
      let temp_list = _.cloneDeep(list_data)
      for (let i = 0; i < temp_list.length; i++) {
        temp_list[i].isActive = false
      }
      list_data = temp_list
    };
    //发布晒单
    const submit_bet = () => {
      const selected_bet = _.filter(list_data, (item) => {
        return item.isActive
      })
      if (selected_bet.length == 0) { return }
      let params = []
      selected_bet.map((item) => {
        const dataListItem = item.detailList[0] || {}
        /**
         * langCode
         * 前端  简体 zh 后端 zs
         * 前端  繁体 tw 后端 zh  tw
         */
        const langCode = ['zs', 'hk'].includes(item.langCode) ? 'zh' : 'tw'
        // console.log(item)
        params.push({
          chatRoomId: get_chatroom_id,
          orderId: item.orderNo,
          matchName: dataListItem.matchName,
          matchInfo: dataListItem.matchInfo,
          sportName: dataListItem.sportName,
          matchType: dataListItem.matchType,
          marketType: dataListItem.marketType,
          playOptionName: dataListItem.playOptionName,
          originalOrderAmountTotal: item.orderAmountTotal,
          originalMaxWinAmount: item.maxWinAmount,
          createTime: dataListItem.createTime,
          settleAmount: item.settledAmount,
          outcome: item.outcome,
          tournamentId: dataListItem.tournamentId,
          matchId: dataListItem.matchId,
          playId: dataListItem.playId,
          marketId: dataListItem.playId,
          playOptionsId: dataListItem.playOptionsId,
          placeNum: dataListItem.placeNum,
          playOptions: dataListItem.playOptions,
          marketValue: dataListItem.marketValue,
          oddFinally: dataListItem.oddFinally,
          playName: dataListItem.playName,
          tournameEnName: dataListItem.matchName,
          langCode: langCode,
        })
      })
      api_chatroom.shareOrder(params, { base_url: get_chatroom_http_url }).then((res) => {
        // const records = _.get(res, 'data.records')
        if (res.code == 0) {
          close_dialog();
          set_toast({ 'txt': res.msg, hide_time: 3000 });
        } else {
          set_toast({ 'txt': res.msg, hide_time: 3000 });
        }
      })
    };
    //切换注单选中状态
    const handle_bet_select = (index) => {
      // if (hasSharedIdList.includes(list_data[index].orderNo)) {  //已晒单的注单不可选择
      //   return;
      // }
      let temp_list = _.cloneDeep(list_data)
      temp_list[index].isActive = !temp_list[index].isActive
      list_data = temp_list
    };
    // 拉取注单消息ID列表
    const getRecord = () => {
      const params = {
        page: current,
        size: pageSize,
        matchId: get_detail_data.value.mid,
        orderStatus: get_main_item,
      }
      api_chatroom.roomBetRecord(params).then((res) => {
        const records = _.get(res, 'data.records')
        if (res.code == 200) {
          list_data = records || []
          if (records.length < pageSize) {
            is_hasnext = false
          }
        }
      }).catch((res) => {
        console.log(res)
      })
    };
    // 拉取已晒单orderID列表
    const getSharedOrderList = () => {
      api_chatroom.getSharedOrderList({
        chatRoomId: get_chatroom_id,
      }, { base_url: get_chatroom_http_url }).then((res) => {
        if (res && res.code == 0) {
          hasSharedIdList = res.data || [];
        }
      }).catch((err) => {
        console.log(err);
      });
    };
    /**
     *@description 页面上推分页加载
     *@return {Undefined} undefined
     */
    const onPull = () => {
      let ele = $refs.myScroll
      if (!is_hasnext) {
        ele.setState(7);  //没有更多
        return;
      }
      ele.setState(4);  //加载中
      api_chatroom.roomBetRecord({ page: current + 1, size: pageSize, matchId: get_detail_data.value.mid }).then((res) => {
        ele.setState(5);  //加载完成
        let records = _.get(res, "data.records");
        if (res.code == 200) {
          if (records.length < pageSize) {
            is_hasnext = false
          }
          current += 1
          // 合并数据
          let list = _.cloneDeep(list_data);
          list_data = _.concat(list, records)
        } else {
          ele.setState(7);  //没有更多
        }
      }).catch(err => { console.error(err) });
    };

    /**
     * 关闭弹层
     */
    const close_dialog = () => {
      bottom = window.innerHeight;
      setTimeout(() => {
        set_post_bet_show(false);
      }, 400);
    };
    onUnmounted(() => {
      set_main_item(0);
    })
    return {
      ...toRefs(data),
      get_active_bet,
      change_record,
      clear_active_bet,
      submit_bet,
      handle_bet_select,
      getRecord,
      getSharedOrderList,
      onPull,
      close_dialog,
    }
  }
})
</script>

<style lang="scss" scoped>
.bet-record-page {
  position: fixed;
  width: 100vw;
  height: 100vh;
  bottom: 0;
  z-index: 1001;

  .shadow-box {
    width: 100%;
    height: 100%;
    z-index: 1002;
    backdrop-filter: blur(5px);
  }

  .bet-record {
    width: 100%;
    left: 0;
    z-index: 1003;
    width: 100%;
    position: absolute;
    transition: all .4s;
    border-radius: 0.16rem 0.16rem 0 0;

    .collapse-icon {
      padding: .06rem;
    }

    .bet-tips {
      height: .24rem;
      font-size: .1rem;
    }

    .content {
      width: 100%;
      height: 4.2rem;
      overflow: hidden;
      padding: .15rem 0;

      .bet-content-item {
        padding: 0 .15rem;
        margin-bottom: .08rem;
      }
    }

    .bet-footer {
      padding: .19rem .15rem .21rem .19rem;

      .cancle-button {
        width: 24%;
        height: .34rem;
        border-radius: .24rem;
      }

      .submit-button {
        width: 64%;
        height: .34rem;
        font-weight: 500;
        border-radius: .24rem;
      }
    }
  }
}

.model {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.top {
  width: 100%;
  height: 0.4rem;
  border-radius: 0.16rem 0.16rem 0 0;
  font-size: .16rem;

  p {
    position: relative;
    color: var(--q-color-fs-color-161);

    span {
      position: absolute;
      display: block;
      width: 36%;
      height: 0;
      bottom: -0.06rem;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 0.08rem;
      border: 0.015rem solid transparent;
    }

    &.active-p {
      font-weight: 600;
      color: var(--q-color-fs-color-162);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}
</style>
