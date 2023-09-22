<!--
 * @Author: ledron
 * @Date: 2020-11-20 18:35:53
 * @Description: 筛选页 以前的排序逻辑不变
-->
<template>
  <div class="boss-box">
    <!--  筛选骨架屏  -->
    <SFilter v-if="list_data_loading" />
    <!-- 中间滚动选择项 -->
    <q-scroll-area class="scroll-area" v-if="!no_find_content && !list_data_loading" ref="scrollArea">
      <div v-if="list.length" v-scroll="scrolled" class="yb_mb18">
        <!-- 循环整个后台返回数据 -->
        <div class="scroll-area1" v-for="(item1, index) in list" :key="index" ref="scroll_area1">
          <div class="bg-f6f7f8" ref="bg_f6f7f8" v-if="item1.title">{{ item1.title }}</div>
          <!-- 联赛国家Tab栏目 -->
          <div class="row justify-between tittle_text items-center half-border-bottom" ref="tittle_text"
            v-if="item1.title !==$t('search.hot_league')" @click.stop.prevent="is_hide(item1, index)">
            <!-- 左边联赛箭头及名称  -->
            <span>
              <img class="arrow_up" :class="{ collapse: !item1.hide }"
                src="image/wwwassets/bw3/list/league-collapse-icon-black.svg" alt="">
              <span class="name-text">{{ ((type == 1 && get_sport_all_selected == true) || (type == 28 &&
                get_curr_sub_menu_type == 29)) ? item1.nameText : item1.introduction }}</span>
            </span>
            <!-- 右边选择icon -->
            <img class="icon-search" @click.stop.prevent="select_sport_ctr(item1, index)"
              v-if="(item1.select || (((type != 1 && get_curr_sub_menu_type != 29) || (type == 1 && get_sport_all_selected == false)) && item1.sportVOs[0].select))"
              :src="`${$g_image_preffix}/image/bw3/svg/check_circle_outline-24px${on_suffix}.svg`" />
            <img src="image/wwwassets/bw3/svg/selected-no.svg" alt="" class="icon-search"
              @click.stop.prevent="select_sport_ctr(item1, index)" v-else>
          </div>
          <!-- 联赛名称部分 -->
          <q-slide-transition>
            <div v-if="!item1.hide">
              <div v-for="(item2, index) in computed_item(item1)" :key="index + 'League-name'"
                class="row  items-center content_box1">
                <div class="row justify-between items-center content_box2"
                  :class="{ 'content_box3': index == computed_item(item1).length - 1 }"
                  @click.stop.prevent="select_li_ctr(item2, computed_item(item1), item1)">
                  <div class="row items-center">
                    <div class="row items-center">
                      <!-- 联赛icon -->
                      <img
                        :src="item2.picUrlthumb ? get_file_path(item2.picUrlthumb) : get_theme.includes('theme02') ? none_league_icon_black : default_url"
                        @error="league_icon_error" class="match_logo" />
                      <div class="name-overhide">{{ item2.nameText }}</div>
                      <div class="nums"
                        v-show="!(type == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(get_curr_sub_menu_type))">
                        {{ item2.num }}</div>
                    </div>
                  </div>
                  <img v-if="item2.select" class="icon-search"
                    :src="`${$g_image_preffix}/image/bw3/svg/check_circle_outline-24px${on_suffix}.svg`" />
                  <img src="image/wwwassets/bw3/svg/selected-no.svg" alt="" class="icon-search" v-else>
                </div>
              </div>
            </div>
          </q-slide-transition>
        </div>
      </div>
    </q-scroll-area>

    <!-- 右边字母切换按钮 quasar提供的平移上下左右操作v-touch-pan.-->
    <ul class="right-side" v-touch-pan.vertical.prevent="handler" v-show="!no_find_content && !list_data_loading">
      <li @click.stop.prevent="bar_click(item)"
        :class="{ actived: active_index == item, hot: item ==$t('search.hot') }"
        v-for="(item, index) in anchor_arr" :key="index + 'letter'">
        <template v-if="item ==$t('search.hot')">
          <img style="width: 28px;"
            :src="`${$g_image_preffix}/image/bw3/svg/match-list/match_filter${active_index == item ? '_select' : ''}${on_suffix}.svg`"
            alt="">
        </template>
        <div class="t-wrap" v-else>{{ item }}</div>
      </li>
    </ul>

    <!-- 字母悬浮图标 -->
    <div class="active-point" v-if="is_show" :style="{ top: fixed_top + 150 + 'px' }"
      :class="{ 'is-black': get_theme.includes('theme02'), 'y0-bg-img-zimu': get_theme.includes('y0') }">
      <span>{{ active_index }}</span>
    </div>

    <!-- 底部固定部分 -->
    <!-- 全选/反选/确定 -->
    <div class="allCheck row justify-between items-center" v-if="change && !list_data_loading">
      <div class="row items-center"
        :style="{ lineHeight: ['vi', 'en', 'th', 'ms', 'ad'].includes(get_lang) ? '1' : 'unset' }">
        <template>
          <img v-if="all_checked" class="icon-search" @click="all_checked_click"
            :src="`${$g_image_preffix}/image/bw3/svg/check_circle_outline-24px${on_suffix}.svg`" />
          <img src="image/wwwassets/bw3/svg/selected-no.svg" alt="" class="icon-search" @click="all_checked_click" v-else>
          <span class="txt ellipsis-2-lines" @click="all_checked_click">{{$t('common.all_select') }}</span>
        </template>
        <span class="txt ellipsis-3-lines" @click="select_btn_click">{{$t('filter.reverse_election') }}</span>
      </div>
      <!-- 确定选择按钮 -->
      <div class="right-box" @click="search_btn">
        <p class="confirm">{{$t('common.ok') }}</p>
        <p class="round-box">{{ select_num }}</p>
      </div>
    </div>
    <!-- 无数据展示 -->
    <no-data which="noMatch" style="margin-top: 0.26rem" :height="100"
      v-if="!list_data_loading && no_find_content"></no-data>
  </div>
</template>

<script>
// import { mapGetters, mapMutations } from "vuex";
import { api_filter } from "src/api/index.js";
// 无网络展示组件
import noData from "project_path/src/components/common/no-data.vue";
import SFilter from "project_path/src/components/skeleton/filter.vue"
import { UserCtr, MenuData } from 'src/core/'
export default {
  name: "match_filter_old",
  components: { noData, SFilter },
  data() {
    return {
      // 构建版本
      // BUILD_VERSION:window.env.config.BUILD_VERSION,
      list_data_loading: false,    //数据加载中
      default_url: "image/bw3/svg/match_cup.svg",  //默认图片地址
      // 无联赛logo图标黑色版
      none_league_icon_black: "image/bw3/svg/match_cup_black.svg",
      list: [], //数据列表整个赛事
      type: undefined,  //筛选类型 1-滚球 3-今日  4-早盘  100-冠军 28 赛果
      all_checked: false, //是否全选
      anchor_arr: [this.$t('search.hot'), "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], //右边字母数组
      active_index: "",   //活动的下标
      active_index_position: "",   // 活动的下标对应的position，在右侧字母的时候，scroll 不支持传float，这个值用于记录
      is_show: false, //悬浮图标是否展示
      is_scroll_right: false, //是否滚动到正确位置
      is_on_clicking: false, //是否正在点击
      scroll_obj: {},  //滚动对象集合
      scroll_obj2: {}, //滚动对象集合
      scroll_obj2_val: [], //滚动对象集合备份
      fixed_top: 0,   //到顶部的距离
      no_find_content: false, //是否显示未查找到相关搜索
      change: true, //是否显示全选按钮
      selected: {},   //选中的赛事集合
      select_num: 0, //选中的赛事数量
      dom_: null, // dom操作对象

      get_lang: UserCtr.lang,
      get_current_sub_menuid: MenuData.get_current_sub_menuid(),
      get_curr_sub_menu_type: MenuData.get_current_lv_2_menu_type(),
      get_menu_type: MenuData.get_menu_type(),
      get_theme: UserCtr.theme
    };
  },
  created() {
    this.timer2 = 0; // 计时器对象
    // 当前二级菜单选中的菜单类型
    this.type = _.get(this.get_current_menu, 'main');
    this.get_top();
    this.fetch_filter_match();
    this.selected = this.get_filter_list || {};
    // 如果是 竟足，则初始化 二级菜单的值为 null，解决赛果我的投注 切换到竞足时的  22690 bug单号
    if (this.get_menu_type == 30) {
      this.set_curr_sub_menu_type(null);
    }
  },
  mounted() {
    this.dom_ = this.$refs
  },
  computed: {
    // ...mapGetters([
    //   "get_lang",
    //   "get_current_sub_menuid",
    //   "get_curr_sub_menu_type",
    //   "get_menu_type",
    //   "get_req_match_list_params",
    //   "get_filter_list",
    //   "get_uid",
    //   // "get_newer_standard_edition",
    //   "get_current_menu",
    //   'get_md',
    //   'get_sport_all_selected',
    //   'get_theme',
    // ]),
    on_suffix() {
      let suffix = '';
      if (this.get_theme.includes('_y0')) {
        suffix += '_y0';
      }
      if (this.get_theme.includes('theme02')) {
        suffix += '_dark';
      }
      return suffix;
    }
  },
  watch: {
    // 活动的下标监听
    active_index(newVal) {
      let dom_scrollArea = this.dom_.scrollArea
      if (this.is_scroll_right && this.scroll_obj2.hasOwnProperty(newVal) && dom_scrollArea) {
        this.active_index_position = this.scroll_obj2[newVal]
        dom_scrollArea.setScrollPosition(this.scroll_obj2[newVal]);
      }
    },
    /**
     * 进页面时，默认选择全部
     */
    list(val) {
      // if(val && Object.keys(this.get_filter_list).length == 0) this.all_checked_click()
    },
    // 监听选中的赛事数量
    select_num(new_) {
      if (new_ < 0) {
        this.select_num = 0
      }
    }
  },
  methods: {
    // ...mapMutations([
    //   "set_filter_list",
    //   // "set_toast",
    //   "set_curr_sub_menu_type",
    //   'set_collapse_csid_map',
    //   'set_collapse_map_match',
    // ]),
    /**
     * @description: 联赛联赛图标出错
     * @param {Object} $event 错误事件对象
     */
    league_icon_error($event) {
      if (this.get_theme.includes('theme02')) {
        $event.target.src = this.none_league_icon_black;
      } else {
        $event.target.src = this.default_url;
      }
      $event.target.onerror = null
    },

    /**
     *@description 初始化默认选中
     *@return {Number} undefined
     */
    default_selected() {
      // 如果选中的是全部
      if (this.selected == this.$t('footer_menu.all')) {
        this.all_checked = true;
        this.list.length > 0 && this.list.forEach((item, index) => {
          if (((this.type == 1 && this.get_sport_all_selected == true) || (this.type == 28 && this.get_curr_sub_menu_type == 29)) || this.type == 2) {
            item && item.tournamentList.length && item.tournamentList.forEach(item2 => {
              item2.select = true;
              if (item2.select) {
                this.select_num += item2.num
              } else {
                this.select_num -= item2.num
              }
            })
            item.select = true

          } else {
            item.sportVOs && item.sportVOs[0].tournamentList.length && item.sportVOs[0].tournamentList.forEach(item2 => {
              item2.select = true;
              if (item2.select) {
                this.select_num += item2.num
              } else {
                this.select_num -= item2.num
              }
            })
            item.sportVOs[0].select = true
          }
        })
      } else {
        this.all_checked = false;
        this.list.length > 0 && this.list.forEach((item, index) => {
          let selected_num = 0;
          if (((this.type == 1 && this.get_sport_all_selected == true) || (this.type == 28 && this.get_curr_sub_menu_type == 29)) || this.type == 2) {
            item.tournamentList && item.tournamentList.forEach(item2 => {
              if (this.selected[item2.tournamentId]) {
                ++selected_num;
                item2.select = true;
                if (item2.select) {
                  this.select_num += item2.num
                } else {
                  this.select_num -= item2.num
                }
              }
            })
            if (item.tournamentList && (selected_num == item.tournamentList.length)) {
              item.select = true;
            }
          } else {
            item.sportVOs && item.sportVOs[0].tournamentList && item.sportVOs[0].tournamentList.forEach(item2 => {
              if (this.selected[item2.tournamentId]) {
                ++selected_num;
                item2.select = true;
                if (item2.select) {
                  this.select_num += item2.num
                } else {
                  this.select_num -= item2.num
                }
              }
            })
            if (item.sportVOs[0].tournamentList && (selected_num == item.sportVOs[0].tournamentList.length)) {
              item.sportVOs[0].select = true;
            }
          }

        })
      }
      this.$forceUpdate()
    },
    get_top() {
      if (window.screen.availHeight > 700) {
        this.fixed_top = (window.innerHeight - 351) / 2;
      } else {
        this.fixed_top = (window.innerHeight - 351) / 2 + 34;
      }
    },
    /**
     *@description quasar滚动事件
     *@param {Number} 滚动的距离
     *@return {Undefined} undefined
     */
    scrolled(position) {
      // 存在 active_index_position 证明点击右侧字母，在前面的逻辑已经赋值了 this.active_index
      // 所以不需要走下面的逻辑
      if (this.active_index_position) {
        this.active_index_position = '' // 复原数据
        return
      }


      this.is_scroll_right = false;
      let position2;
      for (let i = 0; i < this.scroll_obj2_val.length; i++) {
        if (this.scroll_obj2_val[i + 1] > position && this.scroll_obj2_val[i] < position) {
          position2 = this.scroll_obj2_val[i];
        }
      }
      if (position >= this.scroll_obj2_val[this.scroll_obj2_val.length - 1]) {
        position2 = this.scroll_obj2_val[this.scroll_obj2_val.length - 1];
      }
      let key = _.findKey(this.scroll_obj2, function (val) {
        return val == position2;
      });
      if (key) {
        if (this.is_on_clicking) {
          return; // 正在点击 不设置滚动中获取的
        }
        this.active_index = key;
      }
    },
    /**
     *@description 根据list计算出字母对应的滚动高度
     *@param {Number} index_num 在this.list中的下标
     *@return {Undefined} undefined
     */
    scroll_obj_fn(index_num) {
      this.scroll_obj = {};
      let scrollY = 0;
      // 页面渲染后执行
      this.$nextTick(() => {
        let dom_title = this.dom_.tittle_text && this.dom_.tittle_text[index_num]
        let dom_bg = this.dom_.bg_f6f7f8
        this.list.map((item, index2) => {
          if (index2 == index_num) {
            // scrollY += 86;
            if (dom_title) {
              scrollY += (dom_title).offsetHeight
            }
            if (dom_bg) {
              scrollY += dom_bg[0].offsetHeight
            }
          } else {
            //动态获取元素的高度offsetHeight 返回元素的高度（包括元素高度、内边距和边框，不包括外边距）+10 是因为外边距是10px
            // scrollY += this.dom_.scroll_area1 && this.dom_.scroll_area1[index2] && this.dom_.scroll_area1[index2].offsetHeight
            scrollY += this.dom_.scroll_area1 && this.dom_.scroll_area1[index2] && (+window.getComputedStyle(this.dom_.scroll_area1[index2], null).height.split('px')[0])
          }
          let index = item.spell == "HOT" ? this.$t('search.hot') : (item.spell ? item.spell[0] : item.nameText[0]);
          // toFixed 存在精度问题，因为不是特别长的列表，所以暂时不会出现滚动到差异的地方。
          this.scroll_obj[index] = +scrollY.toFixed(2);
        });
        let keys = Object.keys(this.scroll_obj);
        let values = Object.values(this.scroll_obj);
        let obj = {};
        for (let i = 0; i < keys.length; i++) {
          if (i == 0) {
            obj[keys[i]] = 0;
          } else {
            obj[keys[i]] = values[i - 1];
          }
        }
        this.scroll_obj2 = obj;
        this.scroll_obj2_val = Object.values(this.scroll_obj2);
        if (index_num == -1) {
          this.active_index = Object.keys(this.scroll_obj)[0];
        }
      })
    },
    /**
     *@description 点击左边字母或滑动时出现悬浮警示图文显示时间
     *@param {String} item 字母
     *@return {Undefined} undefined
     */
    bar_click(item) {
      this.is_scroll_right = true;
      this.active_index = item;
      this.is_show = true;
      this.is_on_clicking = true;
      this.timer2 = setTimeout(() => {
        this.is_show = false;
        this.is_on_clicking = false;
      }, 500);
    },
    /**
     *@description 根据高度计算绑定左边按钮所在的位置
     *@param {Object} obj 触摸事件对象
     *@return {Undefined} undefined
     */
    handler(obj) {
      let Y = obj.position.top - this.fixed_top, distance = 15;
      this.is_scroll_right = true;
      obj.isFirst && (this.is_show = true);
      obj.isFinal && (this.is_show = false);
      // 滑动 动态 字母对应到左边赛选列表内容
      for (let i = 0; i < this.anchor_arr.length; i++) {
        if (Y > (338 - ((this.anchor_arr.length - 1 - i) * distance))) {
          this.active_index = this.anchor_arr[i]
        }
      }
      if (Y < distance) {
        this.active_index = this.$t('search.hot');
      }
    },
    /**
     *@description 右上角确定按钮事件,更新vuestore 中的 filter_list
     *@return {Undefined} undefined
     */
    search_btn() {
      if (this.select_num == 0) {
        this.$toast(this.$t('filter.please_select_league'), 2000)
        return
      }
      let data = {};
      if (this.all_checked) {
        data = this.$t('footer_menu.all');
      } else {
        if (this.list && this.list.length) {
          this.list.map(item => {
            if ((this.type == 1 && this.get_sport_all_selected == true) || (this.type == 28 && this.get_curr_sub_menu_type == 29)) {
              if (item.tournamentList) {
                item.tournamentList.map(item2 => {
                  item2.select && (data[item2.tournamentId] = true);
                });
              }
            } else {
              if (item.sportVOs[0].tournamentList) {
                item.sportVOs[0].tournamentList.map(item2 => {
                  item2.select && (data[item2.tournamentId] = true);
                });
              }
            }

          });
        }
      }

      // 筛选前重置联赛折叠状态
      this.set_collapse_csid_map({})
      this.set_collapse_map_match({});

      this.set_filter_list(data);
      this.$root.$emit(this.emit_cmd.EMIT_HID_SEARCH_DIA)
      //触发列表页监听事件，调接口拉取指定赛事
      this.$root.$emit(this.emit_cmd.EMIT_MENU_CHANGE_FOOTER_CMD, {
        text: "filter"
      });

    },
    /**
     *@description 数据处理，不同的菜单返回的结构不一样
     *@param {Object} value this.list 中的每一项
     *@return {Undefined} undefined
     */
    computed_item(value) {
      if ((this.type == 1 && this.get_sport_all_selected == true) || (this.type == 28 && this.get_curr_sub_menu_type == 29)) {
        return value.tournamentList;
      } else {
        return value.sportVOs[0].tournamentList;
      }
    },
    //全选按钮事件
    all_checked_click() {
      this.select_num = 0;
      this.all_checked = !this.all_checked;
      if (!(this.list && this.list.length)) {
        return;
      }
      this.list.forEach(item => {
        if ((this.type != 1 && this.get_curr_sub_menu_type != 29) || ((this.type == 1 && this.get_sport_all_selected == false))) {
          item = item.sportVOs[0];
        }
        item.select = this.all_checked;

        if (item.tournamentList && item.tournamentList.length) {
          item.tournamentList.forEach(item2 => {
            item2.select = this.all_checked;
            if (item2.select) {
              this.select_num += item2.num
            } else {
              this.select_num -= item2.num
            }
          });
        }
      });
      this.$forceUpdate(); //强制刷新页面，解决页面不会重新渲染的问题
    },
    // 反选按钮事件
    select_btn_click() {
      if (this.select_num == 0) return
      if (this.all_checked) {
        this.select_num = 0;
        this.all_checked = false;
      }
      if (!(this.list && this.list.length)) {
        return;
      }
      this.list.forEach(item => {
        if ((this.type != 1 && this.get_curr_sub_menu_type != 29) || (this.type == 1 && this.get_sport_all_selected == false)) {
          item = item.sportVOs[0];
        }
        if (item.tournamentList && item.tournamentList.length) {
          item.tournamentList.forEach(item2 => {
            item2.select = !item2.select

            if (item2.select) {
              this.select_num += item2.num
            } else {
              this.select_num -= item2.num
            }

          });
          item.select = _.every(item.tournamentList, item2 => {
            return item2.select == true
          })
        }
      });
      this.$forceUpdate(); //强制刷新页面，解决页面不会重新渲染的问题
    },
    /**
     * @Description:选择/取消联赛
     * sport_item 赛事信息
     * status-false-取消,true-选中
     */
    select_sport_ctr(sport_item) {
      let list;
      //不在滚球
      if ((this.type != 1 && this.get_curr_sub_menu_type != 29) || (this.type == 1 && this.get_sport_all_selected == false)) {
        list = _.map(this.list, "sportVOs");
        list = _.map(list, item => {
          return item[0];
        });
        sport_item.sportVOs[0].spell = sport_item.spell || '';
        sport_item = sport_item.sportVOs[0];
      } else {
        list = this.list;
      }
      let status = !sport_item.select;
      sport_item.select = status;
      if (sport_item.tournamentList && sport_item.tournamentList.length) {

        sport_item.tournamentList.forEach(item2 => {
          item2.select = status;
          if (status) {
            this.select_num += item2.num;
          } else {
            this.select_num -= item2.num;
          }
        });
      }
      if (status) {
        if (this.all_true_select_item(list)) {
          this.all_checked = true;
        }
      } else {
        if (this.all_false_select_item(list)) {
          this.all_checked = false;
        }
      }
      this.$forceUpdate();
    },
    // @Description:单个选择
    select_li_ctr(li_item, wrapItem, item1) {
      let list;
      if ((this.type != 1 && this.get_curr_sub_menu_type != 29) || (this.type == 1 && this.get_sport_all_selected == false)) {
        list = _.map(this.list, "sportVOs");
        list = _.map(list, item => {
          return item[0];
        });
        item1.sportVOs[0].spell = item1.spell || '';
      } else {
        list = this.list;
      }
      if (li_item.select) {
        li_item.select = false;
        this.select_num -= li_item.num;
        if (this.part_false_select_item(wrapItem)) {
          if ((this.type != 1 && this.get_curr_sub_menu_type != 29) || (this.type == 1 && this.get_sport_all_selected == false)) {
            item1 = item1.sportVOs[0];
          }
          item1.select = false;
        }
        this.all_checked = false;
      } else {
        li_item.select = true;
        this.select_num += li_item.num;
        if (this.part_true_select_item(wrapItem)) {
          if ((this.type != 1 && this.get_curr_sub_menu_type != 29) || (this.type == 1 && this.get_sport_all_selected == false)) {
            item1 = item1.sportVOs[0];
          }
          item1.select = true;
          if (this.all_true_select_item(list)) {
            this.all_checked = true;
          }
        }
      }
      this.$forceUpdate();
    },
    all_true_select_item(wrapItem) {
      return _.every(wrapItem, ["select", true]);
    },
    all_false_select_item(wrapItem) {
      return _.some(wrapItem, ["select", false]);
    },
    part_true_select_item(wrapItem) {
      return _.every(wrapItem, ["select", true]);
    },
    part_false_select_item(wrapItem) {
      return _.some(wrapItem, ["select", false]);
    },
    // 设置是否隐藏
    is_hide(sport_item, index) {
      sport_item.hide = !sport_item.hide;
      this.$forceUpdate();
      this.scroll_obj_fn(index);
    },
    // 获取筛选数据外层列表
    fetch_filter_match() {
      let m_type = -1, m_id = -1;
      if (this.get_current_menu && this.get_current_menu.main) {
        m_type = this.get_current_menu.main;
        m_id = this.get_current_menu.main.menuId;
      }
      let params = {}, api_match_filter;
      if (m_type == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(this.get_curr_sub_menu_type)) {
        params = {
          sportType: this.get_req_match_list_params.sportType,
          startTime: this.get_req_match_list_params.startTime,
          endTime: this.get_req_match_list_params.endTime,
          isVirtualSport: 1,
          page: {
            size: 100,
            current: 1
          }
        };
        api_match_filter = api_filter.get_filter_match_list
      } else {
        params = {
          type: m_type == 28 && this.get_curr_sub_menu_type == 29 ? '29' : this.type, // 29 是代表 赛果里边的 我的投注的选项
          euid: m_type == 30 ? m_id : this.get_current_sub_menuid, // menuType 30竞足
          inputText: '',
          cuid: this.get_uid,
          device: 'v2_h5',
          md: _.get(this.get_current_menu, 'date_menu.field1')
        };
        api_match_filter = api_filter.get_fetch_filter_match_old
        //三级日期菜单时间戳
        this.get_md > -1 && m_type != 1 && Object.assign(params, { md: this.get_md });
      }
      this.list_data_loading = true;
      //调用：v1/m/getFilterMatchList接口
      api_match_filter(params).then(({ code, data }) => {
        try {
          this.list_data_loading = false;
          if (data && data.length > 0) {
            this.no_find_content = false;
            this.change = true;
          } else {
            this.no_find_content = true;
            this.change = false;
            return
          }
          //数据过滤,过滤出那些有数据的
          data = data.filter(item => {
            // 过滤掉热门赛事：item.spell != 'HOT'
            if (item.sportVOs && item.sportVOs[0].tournamentList) {
              return item
            }
          })
          //滚球的话取第一个全部里的sportVOs
          if ((this.type == 1 && this.get_sport_all_selected == true) || (this.type == 28 && this.get_curr_sub_menu_type == 29)) {
            let data2 = [];
            data.length > 0 && data.map(item => {
              if (item.spell == 'HOT' && item.sportVOs) {
                let data3 = {};
                data3.id = item.id;
                data3.nameText = item.introduction;
                data3.spell = item.spell;
                data3.tournamentList = [];
                item.sportVOs.map(item2 => {
                  if (item2.tournamentList) {
                    data3.tournamentList.push(...item2.tournamentList)
                  }
                  // item2.tournamentList && data3.tournamentList.concat(item2.tournamentList)
                })
                data2.push(data3)
              }
              if (item.spell == 'ALL' && item.sportVOs) {
                item.sportVOs.map(item3 => {
                  data2.push(item3)
                })
              }
            })
            this.list = data2;
          } else {
            this.list = data || [];
          }
          // 筛选时，把首字母相同的集合 放在第一个item 上,
          this.filter_alphabet(this.list)
          // 动态生成有联赛的字母，并非A - Z 全量字母；
          this.dynamic_letters(this.list)
          this.scroll_obj_fn(-1);
          if (JSON.stringify(this.selected) !== "{}") {
            //初始化默认选中
            this.default_selected();
          }
        } catch (e) {
          console.error(e);
        }
      }).catch(err => {
        this.list_data_loading = false;
        this.no_find_content = true;
        console.error(err)
      });
    },
    // 首字母过滤放在放在第一个item 上
    filter_alphabet(arr) {
      for (let i = 0; i < arr.length; i++) {
        // 如果数组只有一个的话
        if (arr.length == 1) {
          arr[i].spell === 'HOT' ? arr[i].title = this.$t('search.hot_league') : arr[i].title = arr[i].spell[0]
          return arr[i].title
        } else {
          // 如果数组大于一个以上
          for (let j = 1; j < arr.length; j++) {
            // 如果下标是第1个之后才执行下边
            if (i > 0) {
              // 如果第一个和后边的其中一个相等，并且 第一个和上一个相比，不一样，title 塞进当前元素
              if ((arr[i].spell[0] == arr[j].spell[0]) && (arr[i].spell[0] !== arr[i - 1].spell[0])) {
                arr[i].title = arr[i].spell[0]
              }
            } else { // 代表第0个元素，
              arr[i].spell === 'HOT' ? arr[i].title = this.$t('search.hot_league') :
                arr[i].title = arr[i].spell[0]
            }
          }
        }
      }
    },
    // 动态生成有联赛的字母，并非A - Z 全量字母；
    dynamic_letters(arr) {
      try {
        let arr_initials = []
        arr.forEach((item) => {
          if (item.title == this.$t('search.hot_league')) {
            arr_initials.push(this.$t('search.hot'))
          } else if (item.title) {
            arr_initials.push(item.title)
          }
        })
        this.anchor_arr = arr_initials
      } catch (e) {
        console.error(e);
      }
    }
  },
  // 组件销毁时
  destroyed() {
    if (this.timer2) { clearTimeout(this.timer2) }
  }
};
</script>
<style lang="scss" scoped>
.boss-box {
  padding: 0.5rem 0 0.64rem;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-top: 1px solid transparent;

  .allCheck {

    width: 3.78rem;
    position: fixed;
    bottom: 0;
    height: 0.64rem;
    line-height: 0.64rem;
    padding-right: 0.2rem;
    padding-left: 0.2rem;
    text-align: right;
    font-size: 0.14rem;

    z-index: 2999;

    i {
      position: relative;
      top: 1px;
    }

    .icon_selected-no {
      position: relative;
      top: -0.01rem;
    }

    .txt {

      margin-left: 0.05rem;
      margin-right: 0.1rem;

      font-size: 0.14rem;

      text-align: center;
      max-width: 0.59rem;
    }
  }

  .right-side {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0.1rem;
    z-index: 200;
    list-style: none;
    text-align: center;

    li {
      width: 0.14rem;
      height: 0.14rem;
      /*line-height: 0.14rem;*/
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.12rem;
      box-sizing: content-box;
      border: 2px solid transparent;
      margin: 0.04rem 0;

      .t-wrap {
        width: 0.14rem;
        height: 0.13rem;
        margin-bottom: 0.03rem;
      }

      &.hot {

        border-radius: 50%;

        font-size: 0.09rem;
      }

      &.actived {


        background-clip: content-box;
        border-radius: 50%;

        font-size: 0.12rem;
      }
    }
  }

  .active-point {
    position: fixed;
    top: 3.4rem;
    right: 0.85rem;
    z-index: 100;
    width: 0.7rem;
    height: 0.6rem;
    font-size: 0.28rem;
    background: var(--q-color-com-img-bg-108) no-repeat center / 98%;

    &.is-black {
      background-image: var(--q-color-com-img-bg-109);
    }

    &.y0-bg-img-zimu {
      background-image: var(--q-color-com-img-bg-110);
    }

    span {
      display: inline-block;
      width: 0.65rem;
      height: 0.6rem;
      line-height: 0.6rem;
      text-align: center;
    }
  }
}

/* overflow-y: scroll; */
.tittle_text {
  height: 0.56rem;
  line-height: 0.56rem;
  margin-right: 0.46rem;
  margin-left: 0.2rem;

  font-weight: bold;
}

.content_box1 {
  height: 0.56rem;

  font-size: 12px;

  .content_box2 {
    width: 100%;
    margin-right: 0.46rem;
    font-size: 0.16rem;
    position: relative;
    margin-left: 0.08rem;

    &:before {
      content: "";
      display: block;
      position: absolute;
      bottom: -0.16rem;
      width: 2.89rem;
      left: 0.43rem;
      height: 1px;
      transform: scaleY(0.5);
      transform-origin: 0 0;
    }

    &.content_box3 {
      &:before {
        display: none;
      }
    }
  }

  img {
    width: 0.2rem;
    height: 0.2rem;
    margin-left: 0.08rem;
  }

  .nums {

    font-size: 0.14rem;
    margin-left: 0.05rem;
    position: absolute;
    right: 0.31rem;
  }

  i {
    position: relative;
  }
}

.right-box {
  flex-shrink: 0;
  width: 1.6rem;
  height: 0.44rem;
  text-align: center;

  border-radius: 0.04rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .round-box {
    width: 0.28rem;
    height: 0.17rem;
    line-height: 0.17rem;

    margin-left: 0.1rem;
    border-radius: 0.13rem;

    font-size: 0.12rem;
  }

  .confirm {

    font-size: 0.16rem;
  }
}

.name-text {

  font-size: 0.16rem;
  margin-left: 0.2rem;
}

.arrow_up {
  transform: translateY(-0.03rem) rotateZ(180deg);
  transition: transform 0.3s;

  &.collapse {
    transform: translateY(-0.03rem) rotateZ(0deg);
  }
}

.scroll-area {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  ::v-deep.q-scrollarea__thumb--v {
    display: none;
    width: 5px;
  }
}

.scroll-area1 {

  border-radius: 0.1rem;

  &:nth-last-child(1) {
    margin-bottom: 0.3rem;
  }

  .bg-f6f7f8 {
    height: 0.3rem;
    line-height: 0.3rem;

    padding-left: 0.2rem;

    font-size: 0.14rem;
  }
}

.name-overhide {
  max-width: 2.3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 0.15rem;

  font-size: 0.16rem;
}

.icon-search {
  width: 0.2rem;
  height: 0.2rem;
}

.icon_selected-no:before {
  content: "\e939";


  border-radius: 50%;
}

.icon-search:before {}
</style>
