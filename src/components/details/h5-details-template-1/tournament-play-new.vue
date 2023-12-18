<template>
  <div
      class="component tournament-play"
      :class="{
        'tournament-play-outer': !get_is_hengping,
        'result-details': get_menu_type === 28,
        'esports-play': [100, 101, 102, 103].includes(+get_detail_data.csid)
      }"
      v-show="!hid && !is_remove">
    <template v-if="!hid && !is_remove">
      <!-- 玩法title栏 -->
      <div class="play-name-outer-wrapper">
        <div class="play-name" :class="{'vir-mar':item_data.hotName}">
          <div class="row items-center" :class="{'bottom-style':is_show_underline}">
            <!-- 玩法名称 -->
            <div class="line-style" @click="set_hshow(item_data)">
              <div class="text-color details_t_color1">
                <!-- 虚拟体育的热门 -->
                <div class="vir-sport row" v-if="item_data.hotName">
                  <div class="fat-sty">
                    {{ item_data.hotName }}
                  </div>
                  <div class="special-style justify-between row">
                    <div class="dis-block">{{item_data.plays && item_data.plays[0] &&item_data.plays[0].hpn}}</div>
                    <div class="dis-block">{{item_data.plays && item_data.plays[1] &&item_data.plays[1].hpn}}</div>
                    <div v-if="'1009' !== get_detail_data.csid"
                         class="dis-block">{{item_data.plays && item_data.plays[2] &&item_data.plays[2].hpn}}</div>
                  </div>
                </div>
                <!-- 角球相关玩法 -->
                <div v-else-if="corner_ball_show" class="corner-ball">
                  <!-- 角球玩法名称 -->
                  <div class="corner-ball-weg">{{ item_data.hpn }}</div>
                  <!-- 角球总比分 -->
                  <div class="basic-score" v-if="corner_ball_show && new_score"> {{ i18n_t('match_info.total_score')}}:&nbsp;{{ new_score }}</div>
                </div>
                <!-- 罚牌比分 -->
                <div v-else-if="is_show_info"    :style="{ '--q-position-left-before':other_way_style.offset_icon_position_before,'--q-position-left-after':other_way_style.offset_icon_position_after}" class="corner-ball">
                  <!-- 罚牌玩法名称 -->
                  <div class="corner-ball-weg">
                    <div>{{ item_data.hpn }}</div>
                    <!-- 罚牌感叹号 -->
                    <div v-if="is_show_info" class="penalty-card" :class="{'penalty-card-no':!new_score}" @click.stop="info_icon_click">
                      <i ref="information_icon" class="icon" :class="!is_high_light ? 'information-icon-gray' : 'information-icon'"></i>
                    </div>
                  </div>
                  <!-- 罚牌比分 -->
                  <div class="basic-score" v-if="is_show_info && new_score"> {{ i18n_t('match_info.total_score')}}:&nbsp;{{ new_score }}</div>

                  <!-- 罚牌玩法说明弹窗 -->
                  <div 
                    v-if="is_high_light" 
                    :class="other_way_style.is_rotate ? 'mat-info2' : 'mat-info'"
                    :style="{left:`${other_way_style.left}px`,top:`${other_way_style.top}px`}"
                    @click.stop
                  >
                    <div class="penalty">
                      <!-- 角球 -->
                      <div v-if="['125','230'].includes(item_data.hpid)" class="ply-cd">
                        {{ i18n_t('football_playing_way.corner')}}
                      </div>
                      <!-- 罚牌 -->
                      <div v-else class="ply-cd">
                        {{ i18n_t('football_playing_way.penalty_cards')}}
                      </div>
                      <!-- 关闭按钮 -->
                      <i   @click="info_icon_close"
                          style="margin-top:-0.04rem" :style="compute_css_obj('icon-close')"></i>
                      
                    </div>
                    <!-- 角球说明文本 -->
                    <div v-if="['125','230'].includes(item_data.hpid)" class="info-content">{{ i18n_t('play_way_info.6')}}</div>
                    <!-- 罚牌说明文本 -->
                    <div v-else class="info-content">{{ i18n_t('play_way_info.5')}}</div>
                  </div>
                </div>
                <!-- 普通赛事基准分 -->
                <div v-else class="row font-weg">
                  <!-- 玩法名称 -->
                  <div class="base-font-weg">{{ item_data.hpn }}</div>
                  <!-- 基准分 -->
                  <div class="vir-sport" v-if="new_score && show_new_score">({{ new_score }})</div>
                </div>

              </div>
            </div>
            <!-- 置顶按钮 -->
            <div  v-if="!item_data.hotName" class="text-right" @click.stop="set_hton(item_data)" :class="icon_name">
            </div>
          </div>
          <!-- 调试专用勿删除 -->
          <span v-if="wsl_flag" style="color:red;font-size:12px;" text = "调试用span">模板(hpt)<span>{{item_data.hpt}}玩法(hpid)=>{{item_data.hpid}}</span></span>
        </div>
      </div>
      <template v-if="[0,1,2,3,4,5,6,7,9,10,11,12,13,14,15,18,51].includes(+item_data.hpt)">
        <q-slide-transition :duration="200">
          <div v-show="judage_hshow == 'Yes'">
            <!-- 模板id  hpt -->
            <component
                :is="`temp${item_data.hpt}`"
                :item_data="item_data"
                :title="title"
                @bet_click_="bet_click_"
            />
          </div>
        </q-slide-transition>
      </template>
      <template v-else-if="item_data.hotName">
        <q-slide-transition :duration="200">
          <div v-show="judage_hshow == 'Yes'">
            <!-- 模板id=8 --用于虚拟体育-热门 -->
            <temp8
                v-show="item_data.hotName"
                :item_data="item_data"
                :title="title"
                @bet_click_="bet_click_"
            ></temp8>
          </div>
        </q-slide-transition>
      </template>
    </template>
    <template v-else>
      <q-slide-transition></q-slide-transition>
    </template>
  </div>
</template>

<script>
// #TODO vuex 
// import { mapGetters, mapMutations } from "vuex";
import { api_common } from "src/api/index.js";
// #TODO mixins
// import betting from "src/project/mixins/betting/betting.js";
import lodash from "lodash";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent, nextTick } from "vue";
import { compute_css_obj,useMittOn, useMittEmit, MITT_TYPES  } from "src/output/index.js";

export default defineComponent({
  name: "tournament_play_new",
  props: {
    // 父级传来的数据
    item_data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 所有数据集合
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 滚动
    scorllIndex: {
      type: Number,
    },
  },
  components: {
    // 模板id=0(默认模板)
    temp0: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp0.vue"),
    // 模板id=1
    temp1: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp1.vue"),
    // 模板id=2
    temp2: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp2.vue"),
    // 模板id=3
    temp3: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp3.vue"),
    // 模板id=4
    temp4: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp4.vue"),
    // 模板id=5
    temp5: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp5.vue"),
    // 模板id=6
    temp6: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp6.vue"),
    // 模板id=7
    temp7: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp7.vue"),
    // 模板id=8
    temp8: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp8.vue"),
    // 模板id=9
    temp9: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp9.vue"),
    // 模板id=10
    temp10: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp10.vue"),
    // 模板id=11
    temp11: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp11.vue"),
    // 模板id=12
    temp12: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp12.vue"),
    // 模板id=13
    temp13: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp13.vue"),
    // 模板id=14
    temp14: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp14.vue"),
    // 模板id=15
    temp15: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp15.vue"),
    // 模板id=18
    temp18: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp18.vue"),
    // 模板id=51
    temp51: () => import(/* webpackChunkName: "user-h5-min-sm" */ "./template/temp51.vue"),
  },
  // #TODO mixins
  // mixins: [betting],
  setup(props, evnet) {
    const component_data = reactive({
      emitters: [],
      wsl_flag:sessionStorage.getItem('wsl') == 9999,
      // 玩法集合
      play_item_data: {},
      // 数据集合
      page_data: {},
      // 是否显示下划线
      is_show_underline: false,
      // 玩法集合栏
      title: "",
      // 足球是否显示基准分
      new_score: "",

      // 涉及15分钟的玩法有6个，其中 33 和 232 展示为基准分
      // 32	  15分钟进球-赛果({a}-{b})
      // 34	  15分钟进球-大小({a}-{b})
      // 231	15分钟角球-赛果({a}-{b})
      // 233	15分钟角球-大小({a}-{b})

      // 33	  15分钟进球-让球({a}-{b})
      // 232	15分钟角球-让球({a}-{b})

      // 有些玩法（主要是角球）要换行显示比分,有总比分和基准分要展示时，只展示基准分不显示总比分,所以后面6个玩法从数组中去除了
      // 33 -->  15分钟进球({a}-{b})-让球  232 --> 15分钟角球({a}-{b})-让球 113 --> 角球让球(全场) 121 --> 上半场角球让球
      // 32、231 --> 15分钟(进球/角球)独赢  34、233 --> 15分钟(进球/角球)大小
      corner_ball: ["111","114","115","116","117","118","119","122","123","124","226","227","228","229"],
      // 部分玩法id显示罚牌或者角球玩法说明,其中 125 和 230 显示角球玩法说明,其中 306 和 308 虽然是罚牌比分，但是要显示基准分，所以从数组里去除了
      // corner_ball 与 penalty_hpid 的相同点在于都有换行要显示比分，不同的在于 penalty_hpid 需要在右边显示玩法说明
      penalty_hpid: ["307","309","310","311","312","313","314","315","316","317","318","319","320","321","322","323","125","230"],
      // 默认置灰罚牌感叹
      is_high_light: false,
      // 罚牌等说明弹窗坐标
      other_way_style:{
        left:0,
        top:0,
        is_rotate: false,
        offset_icon_position_before:'0.11rem',
        offset_icon_position_after:'0.115rem'
      },
      timer1_: null,
      timer2_: null,
    });
    onMounted(() => {
      // 原 created 
      // 延时器
      component_data.timer1_ = null;
      component_data.timer2_ = null;
      // 默认调用接口 此时如果基准分为空 则不显示基准分
      try {
        component_data.new_score = props.item_data.hps ? props.item_data.hps.split("|")[1].replace(/:/, "-") : "";
      } catch (error) {
        console.error('hps格式不正确')
      }
      // 满足ws推送的监听 实时响应数据变化
      if (component_data.new_score) {
        // #TODO emit 
        component_data.emitters = [
          useMittOn(MITT_TYPES.EMIT_CHANGE_BASE_SCORE, updata_item_score).off,
        ]
        // useMittOn(MITT_TYPES.EMIT_CHANGE_BASE_SCORE, updata_item_score);
      }
      // 切换玩法集的时候判断全局收起时 或者该玩法默认收起时:加上下划线
      // if(get_fewer == 2 || item_data.hshow == 'No'){
      if(get_fewer.value == 2 || judage_hshow.value == 'No'){
        component_data.is_show_underline = true;
      }

      // 滚动时隐藏罚牌/角球等说明弹窗
      // #TODO emit 
      component_data.emitters.push(useMittOn(MITT_TYPES.EMIT_HIDE_GAMEPLAY_TITLE, hide_gameplay_titlehandler).off)
      // useMittOn(MITT_TYPES.EMIT_HIDE_GAMEPLAY_TITLE, hide_gameplay_titlehandler)

      // 点击事件防抖处理
      bet_click_ = debounce(bet_click_, 450, { 'leading': true, 'trailing': false })
    });
    
    // #TODO vuex 
    // computed: {
    // ...mapGetters([
    //   "get_uid",
    //   "get_detail_data",
    //   "get_fewer",
    //   "get_is_close_info",
    //   "get_is_clicked_mat_info",
    //   'get_is_hengping',
    //   'get_bet_show',
    //   'get_hshow_map',
    //   'get_details_data_cache',
    // ]),

    const get_uid = computed(() => {
      return "";
    });
    const get_detail_data = computed(() => {
      return "";
    });
    const get_fewer = computed(() => {
      return "";
    });
    const get_is_close_info = computed(() => {
      return "";
    });
    const get_is_clicked_mat_info = computed(() => {
      return "";
    });
    const get_is_hengping = computed(() => {
      return false;
    });
    const get_bet_show = computed(() => {
      return "";
    });
    const get_hshow_map = computed(() => {
      return "";
    });
    const get_details_data_cache = computed(() => {
      return "";
    });
    const judage_hshow = computed(() => {
      const hshow = props.item_data.hshow
      const vuex_hshow = get_hshow_map.value[`${props.item_data.mid}_${props.item_data.hpid}`]
      // 以vuex中优先级为准，没有就用接口的
      return vuex_hshow === 'No' ? 'No' : hshow
    });
    // 角球换行显示
    const corner_ball_show = computed(() => {
      return component_data.corner_ball.includes(props.item_data.hpid)
    });
    // 罚牌玩法说明显示
    const is_show_info = computed(() => {
      return component_data.penalty_hpid.includes(props.item_data.hpid)
    });
    // 当ms=0的时候不显示基准分
    const show_new_score = computed(() => {
      return get_detail_data.value.ms != 0
    });
    /**
     *@description 判断玩法盘口的显示或者是隐藏
     *@param {Undefined}
     *@return {String} 是否显示主盘或者附加盘
     */
    const hid = computed(() => {
      var ret = false;
      var len = lodash.get(props.item_data, "hl.length");
      let hot_name = lodash.get(props.item_data, "hotName");
      if(hot_name){
        return false
      }
      if (len) {
        //主盘
        if (len < 0) {
          ret = true;
        }
      } else {
        ret = true;
      }
      return ret;
    });
    /**
     *@description hl里面的每一个盘口都关盘的话，移除这个玩法
     *@return {Boolean}
     */
    const is_remove = computed(() => {
      let hl_ = lodash.get(props.item_data, "hl");
      let res
      if(hl_){
        res =  hl_.every((item) => item.hs == "2");
      }
      let hot_name = lodash.get(props.item_data, "hotName");
      if(hot_name){
        return false
      }
      return res
    });
    /**
     *@description 根据置顶排序值的状态显示置顶按钮的颜色
     *@param {Undefined}
     *@return {String} class名
     */
    const icon_name = computed(() => {
      return props.item_data.hton != 0 ? "icon_zd_select" : "icon_zd_default";
    });
    /**
     *@description 是否有子项投注项需要显示(现在关盘的盘口，也要占位显示，这个函数应该用不到)
     *@param {Undefined}
     *@return {String} 盘口显示判断
     */
    const isEmpty = computed(() => {
      let hl_list = lodash.get(props.item_data, "hl");
      let ol_list = null;
      let status = 0;
      let ret = true;
      props.item_data.hmm == 1; //多盘口
      if (hl_list && hl_list instanceof Array) {
        for (let i = 0; i < hl_list.length; i++) {
          ol_list = lodash.get(hl_list[i], "ol");
          if (props.item_data.hmm == 1) {
            //主盘
            if (i >= 1) {
              break;
            }
          }
          if (ol_list && ol_list instanceof Array) {
            for (let j = 0; j < ol_list.length; j++) {
              if (ol_list[j]) {
                status = $common.odds.get_odds_active(
                    ol_list[j].ms,
                    ol_list[j].hs,
                    ol_list[j].os
                );
                // 当等于非关盘时
                if ([1, 2, 4].includes(status)) {
                  ret = false;
                  break;
                }
              }
            }
          }
          if (!ret) {
            break;
          }
        }
      }
      return ret;
    });
    // 横屏状态改变时，隐藏角球/罚牌等说明弹窗
    watch(
      () => get_is_hengping.value,
      () => {
        component_data.is_high_light = false
      }
    );
    // 监听到状态改变从而关闭所有弹窗
    watch(
      () => get_is_close_info.value,
      () => {
        separate_closed()
      }
    );
    watch(
      () => get_fewer.value,
      (new_val) => {
        if(new_val==2){
          component_data.is_show_underline = true;
        }
        // 当一键按钮展开时,去除下划线
        if(new_val==1){
          component_data.is_show_underline = false;
        }
      }
    );
    // 32, 34, 231, 233 这4个玩法要对应C103比分集合的变动
    // watch(
    //   () => get_detail_data.value.msc,
    //   (newVal) => {
    //     if(!(component_data.new_score && [32, 34, 231, 233].includes(+item_data.hpid))) return
    //     let str1 = item_data.hps.split("|")[0]
    //     newVal.forEach(item => {
    //       let [str2, str3] = item.split("|")
    //       if(str1 == str2) {
    //         component_data.new_score = str3.replace(/:/, "-")
    //       }
    //     })
    //   }
    // );

    // #TODO vuex 
    //  methods: {
    // ...mapMutations([
    //   "set_is_close_info",
    //   "set_is_clicked_mat_info",
    //   'set_hshow_map',
    //   'set_details_data_cache',
    // ]),
    const set_is_close_info = () => {};
    const set_hshow_map = () => {};
    const set_details_data_cache = () => {};
    // 滑动时，隐藏 罚牌玩法显示
    const hide_gameplay_titlehandler = () => {
      component_data.is_high_light = false
    };
    /**
      *@description: 点击关闭当前弹窗
      *@param {Undefined}
      *@return {Undefined} undefined
      */
    const info_icon_close = () => {
      return info_icon_click()
    };
    /**
     * @description: 参考iphone6,7,8窗口宽度(375)模拟rem
     * @param {Number} value 需要转换的值
     * @return {Number}
     */
    const rem = (value) => {
      let font_size = innerWidth * 100 / (get_bet_show.value ? 667 : 375);
      return Math.ceil(value * font_size);
    };
    /**
      *@description: 点击显示罚牌info说明
      *@param {Undefined}
      *@return {Undefined} undefined
      */
    const info_icon_click = (e) => {
      let info_status = !component_data.is_high_light
      set_is_close_info()

      if (e) {
        component_data.other_way_style.left = e.target.offsetLeft + rem(0.12);
        component_data.other_way_style.top = e.clientY + rem(0.16);
      }
      component_data.other_way_style.offset_icon_position_before = '0.11rem'
      component_data.other_way_style.offset_icon_position_after = '0.115rem'
      if( e && e.target.offsetLeft > (window.innerWidth/2.8)){
        component_data.other_way_style.offset_icon_position_before = window.innerWidth/2.5 +'px'
        component_data.other_way_style.offset_icon_position_after = window.innerWidth/2.5 +'px'
        component_data.other_way_style.left = e.target.offsetLeft + rem(0.12)-(window.innerWidth/2.5) + 12;
      }

      component_data.other_way_style.is_rotate=false;
      if( e && (window.innerHeight-e.clientY) < 100){
        // 距离底部过近,向上显示
        component_data.other_way_style.top-=rem(1.3) + 10
        component_data.other_way_style.is_rotate=true;
      }
      
      nextTick(() => {
        component_data.is_high_light = info_status
        // 初次进入详情页面罚牌tips展示，ios显示问题42039处理
        set_is_clicked_mat_info(true)
        clearTimeout(component_data.timer1_)
        component_data.timer1_ = setTimeout(()=>{
          set_is_clicked_mat_info(false)
        }, 30)
      })
    };

    /**
      *@description: 点击关闭所有弹窗
      *@param {Undefined}
      *@return {Undefined} undefined
      */
    const separate_closed = () => {
      component_data.is_high_light = false
    };

    /**
     *@description 点击玩法名称,隐藏或是显示玩法赔率
     *@param {String} 单个投注项的数据集合
     *@return {Undefined}
     */
    const set_hshow = (item_data) => {
      const payload = {
        key: `${item_data.mid}_${item_data.hpid}`
      }
      if (judage_hshow.value == "Yes") {
        item_data.hshow = "No";
        payload.value = "No";
        component_data.is_show_underline = true;
      } else {
        item_data.hshow = "Yes";
        payload.value = "Yes";
        component_data.is_show_underline = false;
      }
      set_hshow_map(payload)
      $emit("change_show")
    };
    /**
     *@description 点击置顶或者取消置顶
     *@param {Object} 单个投注项的数据集合
     *@return {Undefined}
     */
    const set_hton = (item_data,e) => {
      if(component_data.timer2_) { clearTimeout(component_data.timer2_) }
      component_data.timer2_ =setTimeout(()=>{
        // item_data = lodash.cloneDeep(item_data)
        // 取消置顶
        if (item_data.hton != 0) {
          item_data.hton = '0';
        } else {
          // #TODO emit 
          useMittEmit(MITT_TYPES.EMIT_ANIMATE_RESET_MYSCROLL_TOP, 100);
          useMittEmit(MITT_TYPES.EMIT_RESET_SET_HTON);
          // useMittEmit(MITT_TYPES.EMIT_ANIMATE_RESET_MYSCROLL_TOP, 100);
          // useMittEmit(MITT_TYPES.EMIT_RESET_SET_HTON);
          // 获取最大置顶排序值
          var hton_ = 0;
          for (let i = 0; i < list.length; i++) {
            var hton = parseInt(list[i].hton);
            if (hton > hton_) {
              hton_ = hton;
            }
          }
          // 将点击置顶的hton设置为:最大置顶排序值+1
          item_data.hton = Date.now() + '';
        }
        
        // 置顶状态变化时，更新相应玩法存储状态
        const key = `${item_data.mid}-0`
        const all_list_data = lodash.cloneDeep(get_details_data_cache.value[key]) || []
        const target_play_id = item_data.chpid || item_data.hpid
        all_list_data.forEach((item, i) => {
          if ([item.chpid, item.hpid].includes(target_play_id)) {
            item.hton = item_data.hton
            // 置顶时hton为即时时间戳，如果hton长度与时间戳长度相同，则将目标玩法放在数组第一个位置
            if (item.hton.length === 13) {
              all_list_data.splice(i, 1)
              all_list_data.unshift(lodash.cloneDeep(item_data))
            }
          }
        })
        // 更新当前赛事所有玩法状态
        set_details_data_cache({
          [key]: all_list_data
        })
        
        let status = item_data.hton != 0 ? "0" : "1",
            playId = item_data.hpid,
            matchId = get_detail_data.value.mid,
            cuid = get_uid.value,
            // 玩法置顶接口增加topKey字段
            topKey = item_data.topKey;
        let params = { status, playId, matchId, cuid, topKey};
        handle_zhiding(params);
      },50)

    };
    /**
     *@description 发送置顶接口请求 可参考:/api/module/common/index.js
     *@param {String} 请求参数
     *@return {Undefined}
     */
    const handle_zhiding = (params) => {
      api_details
          .get_category_playTop(params)
          .then(() => {})
          .catch((err) => console.error(err));
    };
    /**
     *@description 详情页点击投注项小方块,内嵌版走这里逻辑(@Author:router)
     *@param {String} 投注框使用的组装数据
     *@return {Undefined}
     */
    const bet_click_ = ({ol_item, hl_data}) => {
      if(ol_item.os == 2 || ol_item.result) return
      if (!ol_item.ov || ol_item.ov < 101000) return;
      let match = lodash.cloneDeep(get_detail_data.value);
      const item_data = props.item_data;
      match.hps = [item_data];
      if(get_menu_type == 900){  //虚拟体育
        if (match.match_status) return
        if(hl_data){
          let hl_data_ = lodash.cloneDeep(hl_data)
          Object.assign(hl_data_.hl[0],{ol:[ol_item]})
          match.hps = [hl_data_];
          set_bet_obj_config(match, hl_data_, ol_item);
        }else{
          set_bet_obj_config(match, item_data, ol_item);
        }
      }else{   //普通赛事
        set_bet_obj_config(match, item_data, ol_item);
      }
    };

    /**
     *@description WS推送C105(C106)更新足球基准分
     *@param {Object} C105(C106)推送过来的盘口数据集合
     *@return {Undefined}
     */
    const updata_item_score = (hls) => {
      const item_data = props.item_data;
      //15分钟进球-让球({a}-{b})   15分钟角球-让球({a}-{b})
      if([232,33].includes(item_data.hpid*1)){
        hls.forEach((hl) => {
          if (hl.hps && hl.hpid == item_data.hpid && hl.hid == item_data.hid) {
            component_data.new_score = hl.hps.split("|")[1].replace(/:/, "-");
          }
        });
      } else {
        hls.forEach((hl) => {
          // 这4个玩法对应C103比分集合更新比分，不对应C105
          let flag = [32, 34, 231, 233].includes(+hl.hpid)
          if (hl.hps && hl.hpid == item_data.hpid && !flag) {
            component_data.new_score = hl.hps.split("|")[1].replace(/:/, "-");
          }
        });
      }
    };
    onUnmounted(() => {
      // #TODO emit 
      emitters.map((x) => x())
      // useMittOn(MITT_TYPES.EMIT_CHANGE_BASE_SCORE).off();
      // useMittOn(MITT_TYPES.EMIT_HIDE_GAMEPLAY_TITLE, hide_gameplay_titlehandler).off()
      debounce_throttle_cancel(bet_click_);
      clearTimeout(component_data.timer1_)
      clearTimeout(component_data.timer2_)
      component_data.timer1_ = null
      component_data.timer2_ = null
    })
    return {
      ...toRefs(component_data),
      get_uid,compute_css_obj,
      get_detail_data,
      get_fewer,
      get_is_close_info,
      get_is_clicked_mat_info,
      get_is_hengping,
      get_bet_show,
      get_hshow_map,
      get_details_data_cache,
      judage_hshow,
      corner_ball_show,
      is_show_info,
      show_new_score,
      hid,
      is_remove,
      icon_name,
      isEmpty,
      set_is_close_info,
      set_hshow_map,
      set_details_data_cache,
      hide_gameplay_titlehandler,
      info_icon_close,
      rem,
      info_icon_click,
      separate_closed,
      set_hshow,
      set_hton,
      handle_zhiding,
      bet_click_,
      updata_item_score
    }
  }
})
</script>
<style scoped lang="scss">
  @import "src/base-h5/components/details/styles/details.scss";
</style>