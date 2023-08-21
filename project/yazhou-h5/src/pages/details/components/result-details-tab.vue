<!--
 * @Author: Supermark
 * @Date: 2021-02-9 11:35:53
 * @Description: 详情赛果tab区域
-->
<template>
  <div ref='result_details_tab' v-show="tab_item_list.length" class="result-details-tab row items-center" v-cloak>
    <!-- 收起icon -->
    <div class="tab-fat">
      <div class="tab-btn" :class="{collapsed:get_fewer != 2}" @click="change_btn()"></div>
    </div>
    <!-- 赛果tab区域 -->
    <div class="menu-s row" ref="reset_scroll_dom">
      <div v-for="(tab_item,i) of tab_item_list" :key="i"
        class="common-style" @click="result_tab(i,tab_item)" :class="{'t_color':item_index == i || i == tab_item_list.length -1 && item_index == 3}">
        {{tab_item.text}}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters,mapMutations } from "vuex"
import {api_betting, api_result} from 'src/project/api/index.js'

export default {
  name: 'result_details_tab',
  props: {
    // 详情Details接口的数据
    result_detail_data: Object,
    tab_index: Number | String,
  },
  data(){
    return {
      // 默认高亮显示第一个
      item_index:0,
      tab_item_list:[
        // 所有赛果
        {id:1, text: i18n.t('match_info.all_result')},
        // 精选赛事
        {id:2, text: i18n.t('match_info.select_event')}
      ],
      list_data: [],
    }
  },
  watch: {
    // 监听csid的变化
    'result_detail_data.csid': {
      handler(n,o){
        // 切换顶部菜单，csid变化，触发tab事件
        this.result_tab(0, this.tab_item_list[0])
        this.get_list()
      },
      deep: true
    },
    tab_index(n,o){
      if(n!=2){
        this.result_tab(n, this.tab_item_list[n])
      }
    }
  },
  created() {
    // 监听 刷新 注单记录----请求
    this.$root.$on(MITT_TYPES.EMIT_UPDATE_ORDER_LIST, this.update_order_list)
  },
  computed:{
    ...mapGetters(["get_fewer","get_menu_type", "get_current_menu", 'get_user']),
    ...mapGetters({ matchid: "get_goto_detail_matchid" }),
  },
  methods:{
    ...mapMutations(['set_fewer','set_note_sheet_records_data']),
    /**
     * 标签数据初始化
     */
    tab_data_init(){
      this.tab_item_list =[
        // 所有赛果
        {id:1, text: i18n.t('match_info.all_result')},
        // 精选赛事
        {id:2, text: i18n.t('match_info.select_event')}
      ];
      if(this.get_menu_type == 28 && [100,101,102,103,104].includes(+this.result_detail_data.csid))  {
        this.tab_item_list =[
          // 所有赛果
          {id:1, text: i18n.t('match_info.all_result')}
        ];
      }
    },
    // 点击高亮显示tab
    result_tab(index,tab_item){
      let search_term = this.$route.query.search_term
      useMittEmit(MITT_TYPES.EMIT_CHANGE_TAB, true)
      if(this.item_index != index){
        this.item_index = tab_item.id === 4 ? 3 : index
      }
      if(tab_item && tab_item.id == 3 && [100,101,102,103,104].includes(+this.result_detail_data.csid)){
        index = 2
        this.item_index = 1
      }
      if(this.result_detail_data && this.result_detail_data.mid){
        let mid = this.result_detail_data.mid;
        // todo 考虑优化此处代码
        this.$router.replace({
          name:'match_result',
          params:{mid, index: this.item_index},
          query: {search_term: search_term}
        });
      }
    },
    // 获取订单记录页面接口，判断赛果有没有 订单记录，有则显示在页面
    async get_list() {
      try {
        let params = {
          matchId: this.matchid,
          timeType: 3,
          orderStatus: 1,
          orderBy: 2,
          }
        let {code , data} = await api_betting.post_getOrderList(params)
        useMittEmit(MITT_TYPES.EMIT_RESULT_LIST_LOADING, true)

        if(code == 200) {
          this.tab_data_init()
          if (data && data.record) {
            this.list_data = data.record
            this.set_note_sheet_records_data(this.list_data)
            if(Object.keys(this.list_data).length>0) {
              this.tab_item_list.push({
                id:3,
                // 我的注单
                text: i18n.t('match_info.my_bets')
              });
            }

            // 刷新 注单记录----重载页面
            useMittEmit(MITT_TYPES.EMIT_RELOAD_NOTE_SHEET)
          }
        }
      } catch (error) {
        this.no_data = false;
        console.error(error)
        useMittEmit(MITT_TYPES.EMIT_RESULT_LIST_LOADING, false)
        this.tab_data_init()
      } finally {
        const { configValue, eventSwitch } = _.get(this.get_user, 'merchantEventSwitchVO', {})
        if (configValue == 1 && eventSwitch == 1 && _.get(this.result_detail_data, 'csid') == 1) {
          this.get_football_replay(0)
        }
      }
    },
    /**
     * 获取精彩回放事件
     * @param {String} event_code 事件code
     */
    get_football_replay(event_code) {
      const params = {
        mid: _.get(this.result_detail_data, 'mid'),
        device: 'H5',
        eventCode: event_code
      }
      api_result.get_replay_football(params)
          .then(res => {
            if (res.code == 200 && _.get(res.data, 'eventList.length')) {
              // 足球类型赛果需添加精彩回放菜单
              this.tab_item_list.push({
                id: 4,
                // 精彩回放
                text: i18n.t('highlights.title')
              });
            }
          })
          .catch(err => {
            console.error(err)
          })
          .finally(() => {
           
          })
    },
    // 展开收起按钮
    change_btn(){
      // 设置vuex变量值,当选中"所有赛果"时才可以点击
      if (this.item_index != 0) return;
      if(this.get_fewer == 1 || this.get_fewer == 3){
        this.set_fewer(2)
      }else{
        this.set_fewer(1)
      }
    },
    // 刷新 注单记录----请求
    update_order_list() {
      if (this.tab_index === 2) {
        this.get_list()
      }
    },
  },
  beforeUnmount() {
    this.set_fewer(1);

    this.$root.$off(MITT_TYPES.EMIT_UPDATE_ORDER_LIST, this.update_order_list)
  }
}
</script>

<style lang="scss" scoped>
.result-details-tab {
  height: 0.4rem;
  width: 100vw;
  max-width:3.78rem;
}

.menu-s {
  width: 3rem;
  line-height: 0.4rem;
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow-x: auto;
}

/*************** 选中的玩法集 *************** -S*/

/*************** 选中的玩法集 *************** -E*/
.tab-fat {
  margin-right: 0.23rem;
  position: relative;

  &:after {
    position: absolute;
    content: ' ';
    display: block;
    width: 1px;
    height: 0.14rem;
    right: 0;
    top: 50%;
    transform: translateY(-0.07rem);
  }
}

.tab-btn {
  position: relative;
  width: 0.4rem;
  height: 0.4rem;
  background-image: var(--q-color-img-bg-97);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 0.12rem 0.12rem;
  transform: rotateZ(180deg);
  // @include webkit(transition, transform 0.3s);

  // &.collapsed {
  //   transform: rotateZ(0);
  //   @include webkit(transition, transform 0.3s);
  // }
}

.menu-third {
  height: 0.4rem;
  line-height: 0.4rem;
  position: relative;
  float: left;
  text-align: center;

  &:after {
    content: ' ';
    display: block;
    width: 1px;
    height: 0.14rem;
    position: absolute;
    top: 0.16rem;
  }
}

.tab-fixed {
  position: fixed;
  top: 2.04rem;
  z-index: 90;
}

.common-style {
  margin-right: 0.23rem;
  font-size: 0.14rem;
  letter-spacing: 0;
  text-align: center;
  &:last-child {
    margin-right: 0;
  }
}

.common-fat {
  margin-left: 0.23rem;
}

.t_color {
  position: relative;
  font-size: 0.14rem;
  letter-spacing: 0;
  text-align: center;
  font-weight: bold;

  &:after {
    content: ' ';
    display: block;
    position: absolute;
    width: 0.18rem;
    height: 0.03rem;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    border-radius: 1.5px;
  }
}
</style>
