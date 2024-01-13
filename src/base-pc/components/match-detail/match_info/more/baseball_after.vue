<!--
 * @
 * @Author: Yellow
 * @Description: 棒球比分扳
 * @Date: 2020-07-18 10:33:46
-->

<template>
  <div class="more-info" v-if="isRouterAlive">
    <div class="more-time">
      <div class="time-tips">
        <match-date :match="match_info"></match-date>
      </div>
      <div class="scorll-handel">
        <!-- 左侧滚动按钮 -->
        <span
          v-if="is_scroll"
          class="scroll-arrow"
          :class="el_active=='left' ? 'active' : ''"
          @click="scorll(0)"
          @mouseenter="enter(0)"
          @mouseleave="leave"
        >
          <icon-wapper
            name="icon-arrow-left"
            size="10px"
            :color="el_active=='left'?'#FF7000':'#6D7278'"
            v-show="more_left_icon"
          />
        </span>
        <div class="time-node" :class="[screen_class, ($route.name == 'details' && !right)?'is_details':'']" ref="scroll_handel">
          <span
            v-for="(item, index) in num_title"
            :key="index"
            :class="{'current_color':index == active_index}"
          >{{item}}</span>
        </div>
        <!-- 右侧滚动按钮 -->
        <span
          v-if="is_scroll"
          class="scroll-arrow arrow-right"
          :class="el_active=='right' ? 'active' : ''"
          @click="scorll(1)"
          @mouseenter="enter(1)"
          @mouseleave="leave"
        >
          <icon-wapper
            name="icon-arrow-right"
            size="10px"
            :color="el_active=='right'?'#FF7000':'#6D7278'"
            v-show="more_right_icon"
          />
        </span>
        <div class="add-stage score">R</div>
        <div class="other-score">H</div>
      </div>
    </div>

    <div class="more-both">
      
      <!-- 客队 -->
      <div class="both-item relative-position">
        <div class="wrap-round">
          <span class="round" v-if="lodash.get(match_info, 'mat') == 'away' && !isStop"></span>
        </div>

        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          v-img="([lodash.get(match_info,'malu[0]'),lodash.get(match_info,'frman[0]')])"
          class="both-logo"
        />
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          v-if="lodash.get(match_info,'malu').length>1"
          v-img="([lodash.get(match_info,'malu[1]'),lodash.get(match_info,'frman[1]')])"
          class="both-logo logo-double"
        />

        <div class="both-name ellipsis">
          <span class="ellipsis" v-tooltip="{content:lodash.get(match_info,'man'),overflow:1}">{{lodash.get(match_info, 'man')}}</span>
        </div>
        <div class="scorll-handel">
          <div
            class="time-node"
            :class="[screen_class, ($route.name == 'details' && !right)?'is_details':'']"
            ref="scroll_away"
            :style="{'margin': more_left_icon||more_right_icon?'0px 19px 0 14px':'0'}"
          >
            <span
              v-for="(item, index) in msc_data"
              :key="index"
              :class="{'current_color':index == active_away}"
            >{{active_home == index ? (!Number(item.away) ? "" : item.away) : item.away}}</span>
          </div>
					<div class="score add-stage">{{lodash.get(match_info,'msc.S1.away')}}</div>
					<!-- 棒球 安打数之比-->
					<div class="other-score">{{lodash.get(match_info,'msc.S3015.away') || 0}}</div>
        </div>
      </div>
      
      <!-- 主队 -->
      <div class="both-item relative-position">
        <div class="wrap-round">
          <span class="round" v-if="lodash.get(match_info, 'mat') == 'home' && !isStop"></span>
        </div>
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          v-img="([lodash.get(match_info,'mhlu[0]'),lodash.get(match_info,'frmhn[0]')])"
          class="both-logo"
        />
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          v-if="lodash.get(match_info,'mhlu').length>1"
          v-img="([lodash.get(match_info,'mhlu[1]'),lodash.get(match_info,'frmhn[1]')])"
          class="both-logo logo-double"
        />
        <div class="both-name ellipsis">
          <span class="ellipsis" v-tooltip="{content:lodash.get(match_info,'mhn'),overflow:1}">{{lodash.get(match_info, 'mhn')}}</span>
        </div>
        <div class="scorll-handel">
          <div
            class="time-node"
            :class="[screen_class, ($route.name == 'details' && !right)?'is_details':'']"
            ref="scroll_home"
            :style="{'margin': more_left_icon||more_right_icon?'0px 19px 0 14px':'0'}"
          >
            <span
              v-for="(item, index) in msc_data"
              :key="index"
              :class="{'current_color':index == active_home}"
            >{{active_away == index ? (!Number(item.home) ? "" : item.home) : item.home}}</span>
          </div>
					<div class="score add-stage">{{lodash.get(match_info,'msc.S1.home')}}</div>
					<!-- 棒球 安打数之比-->
					<div class="other-score">{{lodash.get(match_info,'msc.S3015.home') || 0}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import format_desc from "src/project/yabo/mixins/match_details/index";
import {MatchProcessFullVersionWapper} from "src/components/match-process/index.js";
import store from "src/store-redux/index.js";
import BetCommonHelper from "src/core/bet/common-helper/index.js";
import { IconWapper } from 'src/components/icon'
import { nextTick } from "vue";
import { socre_dict,useMittOn, MITT_TYPES, useMittEmit} from "src/output/index.js";
import LayOutMain from "src/core/layout/index.js"
// 两局之间的局间休息--根据赛事阶段比对文档[http://lan-confluence.sportxxxr1pub.com/pages/viewpage.action?pageId=24127556]，特殊处理为 mct +1 和不显示发球方
const _mmp = [422, 424, 426, 428, 430, 432, 434, 436, 43810, 43811, 43812, 43813, 43814, 43815, 43816, 43817, 43818, 43819];
// 一局的上下半局间休息--不需要处理
// const mmp_break = [423, 425, 427, 429, 431, 433, 435, 437, 43910, 43911, 43912, 43913, 43914, 43915, 43916, 43917, 43918, 43919, 43920]
export default {
  components: {
    "match-date": MatchProcessFullVersionWapper,
    IconWapper,
  },
  // mixins: [format_desc],
  data() {
    return {
      el_active: "default",//左右滚动条active， right | left
      more_left_icon: false,//向左箭头显隐
      more_right_icon: false,//向右箭头显隐
      one_item_width: 36,//滚动一次的距离
      default: {//默认比分
        home: "",
        away: "",
      },
      msc_data: [],//比分数据
      current_data: {//各局总分
        home: 0,
        away: 0,
      },
      num_title: [], //总盘数|总局数
      active_index: "", //高亮比分项
      active_home: "",//主队比分高亮项
      active_away: "",//客队比分高亮项
      isRouterAlive: true,
      is_scroll: false,//是否出现比分滚动
      screen_class: "",
      offset: 5, // 比分板显示出来的局数
      scrollTimer: null, // 计时器
      matchInfo: {}, // 存放比分板数据
      isStop: false, // 当前是否是局间休息，局间休息时不显示当前发球方指示
      curMct: null, // 计算后的当前局
      un_subscribe: null,
      // get_layout_list_size: store.getState().layoutReducer.layout_list_size,
    };
  },
  mounted() {
    this.un_subscribe = store.subscribe(() => {
      let state_ = store.getState();
      // this.get_layout_list_size = state_.layoutReducer.layout_list_size;
    });
  },
  props: {
    match_info: Object,
    right:{
      type:Boolean,
      default:false
    }
  },
  created() {
    // ws 推送时更新比分
  //  let { off: off_ } = useMittOn('update_baseball_score', this.update_baseball_score);
  },
  methods: {
    /**
     * 鼠标移入
     */
    enter(type) {
      type ? (this.el_active = "right") : (this.el_active = "left");
    },
    /**
     * 鼠标移出
     */
    leave() {
      this.el_active = "default";
    },

    /**
    * @description: 比分扳左右滚动
    * @param {Number} type 0左滚动 1右滚动
    * @return {undefined} undefined
    */
    scorll(type) {
      if (type) {
        if (!this.more_right_icon) {
          return;
        } 
       BetCommonHelper.get_refs_info('scroll_handel', null, this).scrollLeft += this.one_item_width;
       BetCommonHelper.get_refs_info('scroll_home', null, this).scrollLeft += this.one_item_width;
       BetCommonHelper.get_refs_info('scroll_away', null, this).scrollLeft += this.one_item_width;
      } else {
        if (!this.more_left_icon) {
          return;
        }
       BetCommonHelper.get_refs_info('scroll_handel', null, this).scrollLeft -= this.one_item_width;
       BetCommonHelper.get_refs_info('scroll_home', null, this).scrollLeft -= this.one_item_width;
       BetCommonHelper.get_refs_info('scroll_away', null, this).scrollLeft -= this.one_item_width;
      }

      // let offset = this.$route.name=='home' ? 5:9
      let _scroll_left =BetCommonHelper.get_refs_info('scroll_handel', 'scrollLeft', this);
      let _msc_length = this.msc_data.length * this.one_item_width;
      let _max_scroll = _msc_length - this.one_item_width * this.offset;

      // 更多-左图标 显隐
      this.more_left_icon = _scroll_left > 0;
      // 更多-右图标 显隐
      this.more_right_icon = _scroll_left < _max_scroll;
    },
   
    /**
    * @description: 比分排序、添加0:0、添加横向滚动条件
    * @param {Object} detials 赛事详情
    * @param {Boolean} is_stop 是否有局间休息
    * @return {undefined} undefined
    */
    format_msc(detials) {
      /**
       * csid 比赛阶段的对象变量名
       * msc比分数据
       * mmp 赛事阶段
       * mft 比赛总局数|总盘数
       * mct 当前第几局
       * mat 发球方
       */
			let {csid, msc, mmp, mft, mct, mat} = detials
      mmp = parseInt(mmp)
      let _mct;
      // 是否是局间休息，局间休息时 mct 需要特殊处理 http://lan-confluence.sportxxxr1pub.com/pages/viewpage.action?pageId=24127556
      if ( _mmp.includes(mmp) ) {
        this.isStop = true;
        // 局间休息时，高亮调整到下一局
        _mct = parseInt(mct) + 1;
      } else {
        this.isStop = false;
        _mct = mct;
      }
      this.curMct = _mct;
      let dict = socre_dict(3);
      for (var k in dict) {
        if(!msc[dict[k]]){
           if( k < mmp ){
            msc[dict[k]] = {
              home: "",
              away: "",
            }
          } else if( k == mmp ){
            //棒球单独处理
            if (mat == 'home') {
              msc[dict[k]] = {
                home: this.isStop ? '' : "0",
                away: "0",
              }
            } else {
              msc[dict[k]] = {
                home: "",
                away: this.isStop ? '' : "0",
              };
            }
          }
        }else{
					if(k == mmp){
            // 不显示比分的一方不能直接置空，置空后选中投注项的时候获取不到比分，所以改成直接在模板里去做判断
            if(mat == 'away'){//上半局
              !msc[dict[k]].away && (msc[dict[k]].away = "0")
              // !msc[dict[k]].home && (msc[dict[k]].home = "")
            } else {//下半局
              !msc[dict[k]].home && (msc[dict[k]].home = "0")
              // !msc[dict[k]].away && (msc[dict[k]].away = "")
            }
					}
				}
      }
      
      let both_data = [];
      Object.keys(msc)
        .sort()
        .map((key) => {
          both_data[key] = msc[key];
        });
      for (let i in both_data) {
        let item = parseInt(i.replace("S", ""));
        if (item >= 120 && item < 160) {
          both_data.push(msc[i]);
        }
      }
      
      //计算总局数
      let num_title = [];
      let title_lenght = Math.max(_mct,mft)
			for (var i = 0; i < title_lenght; i++) {
				num_title.push(i + 1);
        
				// 补全比分和总盘数|总局数的列数
				if (both_data.length - 1 < i) {
					both_data.push({
						home: "",
						away: "",
					});
				}
			}
      this.num_title = num_title;

      // 截取有效比分
      if(both_data.length > title_lenght){
        both_data = both_data.splice(0, title_lenght)
      }

			if(mat == 'away'){
				this.active_away = _mct - 1
				this.active_home = -1
			}else{
				this.active_home = _mct - 1
				this.active_away = -1
			}
			this.active_index = _mct - 1

      this.msc_data = both_data;
    },
    
    /**
    * @description: 计算总分
    * @param {}
    * @return {undefined} undefined
    */
   computed_score(res){
     let score = res.msc;
     if(!Object.keys(score).length) {
       this.current_data = {
        home: 0,
        away: 0,
       }
       return false
     }
    for (var i in score) {
      // 第1局比分.....第...局比分
      if (["S120", "S121", "S122", "S123", "S124", "S125", "S126"].includes(i)) {
        this.current_data.home += parseInt(score[i].home || 0);
        this.current_data.away += parseInt(score[i].away || 0);
      }
    }
   },

    /**
    * @description: 重置比分扳滚动条件
    * @return {}
    */
  init_scroll(){
    // 如果是右侧就是5个，中间就是9个
    if (this.right) {
      this.offset = 5
    } else {
      this.offset = 9
    }
    let scroll_left = (this.curMct - this.offset) * this.one_item_width;
   BetCommonHelper.get_refs_info('scroll_handel', null, this).scrollLeft = scroll_left;
   BetCommonHelper.get_refs_info('scroll_home', null, this).scrollLeft = scroll_left;
   BetCommonHelper.get_refs_info('scroll_away', null, this).scrollLeft = scroll_left;
    // 如果左侧滚动宽度大于等于一个比分位的宽度，就展示左侧按钮
    if(scroll_left >= this.one_item_width){
      this.more_left_icon = true;
    } else {
      this.more_left_icon = false;
    }
    // 如果总局数大于当前局数 就展示右侧按钮
    if(this.match_info.mft > this.curMct){
      this.more_right_icon = true;
    } else {
      this.more_right_icon = false
    }
  },

   /**
   * @description: 重载页面
   * @return {undefined} undefined
   */
    reload_data() {
      this.isRouterAlive = false;
      nextTick(()=>{
        this.isRouterAlive = true;
      });
    },
    /**
     * ws 推送后更新比分
     * @param {*} data ws 推送的数据
     */
    update_baseball_score(data) {
      // 合并 ws 推送来的比分数据
      this.matchInfo.msc = data.score_obj;
      this.matchInfo.mmp = data.mmp;
      // 格式化比分
      this.format_msc(this.matchInfo);
      // 计算总分
      this.computed_score(this.matchInfo);
      // 更新滚动条
      this.update_scroll(this.matchInfo.mft);
    },
    /**
     * 数据更新后同步更新滚动条
     * @param {*} mft 总局数
     */
    update_scroll(mft) {
      //offset 大屏5，详情页9 ，右侧 小屏 4
      if ( !this.right ) {
        this.screen_class = "is_details"
        this.offset = 9
      } else {
        // 右侧 小屏 
        if( LayOutMain.layout_content_width < 1440 ) {
          this.offset = 4
        } else {
          this.screen_class = ""
          this.offset = 5
        }
      }
      /**
       * 总局数大于比分板展示的局数，就开启滚动并且展示左侧滚动按钮
       */
      let num = Math.max(this.curMct, mft)
      // 如果是右侧，并且当前局或者总局数大于可展示的局数
      if( this.right && num > this.offset){
        this.is_scroll = true
        this.more_left_icon = true
      } else {
        // 非右侧
        // 当前局或总局数大于可显示的局数，就开启滚动并且显示左侧按钮，隐藏右侧按钮
        if (num > this.offset) {
          this.is_scroll = true;
          this.more_left_icon = true
          this.more_right_icon = false
        } else {
          // 否则就关闭滚动 关闭两侧按钮
          this.is_scroll = false
          this.more_left_icon = false
          this.more_right_icon = false
        }
      }
      
      // 比分滚动条配置偏移量
      if (this.is_scroll) {
        clearTimeout(this.scrollTimer);
        this.scrollTimer = setTimeout(() => {
          nextTick(() => {
            this.init_scroll()
          });
        }, 10);
      }
    },
  },
  watch: {
    match_info: {
      handler(res, old) {
        this.reload_data();
        this.matchInfo = res;
        this.msc_data = [];
        this.active_index = "";
        this.current_data = {
          home: 0,
          away: 0,
        };
        this.format_msc(res);
        this.computed_score(res)
        // 更新滚动条
        this.update_scroll(res.mft);
      },
      immediate: true,
    },
  },
  beforeUnmount() {
    this.un_subscribe();
    clearTimeout(this.scrollTimer);
    // off_()
    this.matchInfo = null;
  }
};
</script>

<style lang="scss" scoped>
.screen-medium,
.screen-min {
  .more-info {
    width: 506px;
  }
}
.more-info {
  overflow: hidden;
  width: 560px;
  border-radius: 2px;
  color: var(--q-gb-bd-c-13) !important;
  font-size: 12px;
  .more-time,
  .both-item {
    display: flex;
    justify-content: space-between;
    padding: 0 19px 0 27px;
  }
  .more-time {
    height: 40px;
    background: #1f2129;
    line-height: 40px;
  }
  .both-item {
    background: rgba(31, 33, 41, 0.8);
    &:first-child {
      border-bottom: 1px solid rgba(225, 225, 225, 0.08);
    }
  }
  .time-tips {
    display: flex;
    flex: 1;
    min-width: 66px;
  }
  .scorll-handel {
    display: flex;
  }
  .time-node {
    overflow-x: auto;
    max-width: 170px;
    white-space: nowrap;
    -moz-scrollbar-width: none;
    -webkit-scrollbar-width: none;
    scrollbar-width: none;
    scrollbar-width: none;
    &.is_details {
      max-width: 314px;
    }
    &::-webkit-scrollbar {
      display: none;
    }

    span,
    div {
      display: inline-block;
      margin-right: 10px;
      width: 26px;
      text-align: center;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .scroll-arrow {
    display: flex;
    align-items: center;
    margin: 0;
    width: 13px;
    cursor: pointer;
  }
  .arrow-right {
    margin-left: 6px;
  }
  .add-stage {
    margin-right: 10px;
    width: 26px;
    text-align: center;
  }
  .score {
    width: 26px;
    text-align: center;
  }
  .other-score {
    width: 26px;
    text-align: center;
  }
  .both-item {
    align-items: center;
    height: 45px;
    .time-node {
      margin: 0px 26px 0 14px;
      scrollbar-width: none;
    }
    .both-logo {
      margin-right: 6px;
      min-width: 28px;
      height: 28px;
      &.logo-double {
        margin-left: -14px;
      }
    }
    .both-name {
      display: flex;
      flex: 1;
      min-width: 32px;
    }
    .wrap-round {
      position: absolute;
      top: 50%;
      left: 10px;
      margin: -8px 13px 1px 0;
      width: 8px;
      height: 8px;
      .round {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 8px;
      }
    }
  }
}
</style>
<style>
.esports-head-info-3 .is_details {
  max-width: 314px !important;
}
</style>