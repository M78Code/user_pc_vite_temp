<!--
 * @
 * @Author: Yellow
 * @Description: 详情区--网羽斯乒手比分面板
 * @Date: 2020-07-18 10:33:46
-->

<template>
  <div class="more-info" v-if="isRouterAlive">
    <div class="more-time">
      <div class="time-tips">
        <match-date :match="match_info"></match-date>
      </div>
      <div class="scorll-handel">
        <span
          v-if="is_scroll"
          class="scroll-arrow"
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

        <div class="time-node" v-if="lodash.get(match_info, 'csid')!='14'" :class="[($route.name == 'details' && !right)?'is_details':'',`stage-${match_info.mmp}`]" ref="scroll_handel">
          <!-- 16水球、15曲棍球 -->
          <template v-if="['16','15'].includes(lodash.get(match_info, 'csid'))">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
          </template>
          <template v-else>
            <span
              v-for="(item, index) in num_title"
              :key="index"
              :class="{'current_color':index == active_index}"
            >{{item}}</span>
          </template>
        </div>
        <span
          v-if="is_scroll"
          class="scroll-arrow arrow-right"
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

        <!-- 11手球，16水球、15曲棍球、14橄榄球 -->
        <div class="add-stage" v-if="['11','16','15','14'].includes(lodash.get(match_info, 'csid'))">{{ i18n_t('common.half_')}}</div>
        <!-- 半场 -->
        <!-- 4冰球、11手球16水球、15曲棍球、14橄榄球 加时赛、点球大战 -->
        <div class="hockey_add" v-if="['4','11','16','15','14'].includes(lodash.get(match_info, 'csid'))">
          <!-- 加时 -->
          <span v-if="lodash.get(match_info,'msc.S7')">{{ i18n_t('common.add_time')}}</span>
          <!-- 点球 -->
          <span v-if="lodash.get(match_info,'msc.S170')">{{ i18n_t('icon_tips.penalty_kick')}}</span>
        </div>
        <!-- 冰球加时赛、点球大战 -->

         <!-- 4冰、5网、7斯诺克、8乒乓、9排球、10羽毛球、12拳击、13沙滩排球  -->
        <div
          :class="lodash.get(match_info, 'csid')=='7'?'score':'add-stage'"
          v-if="['5','7','10','8','9','12','13'].includes(lodash.get(match_info, 'csid'))">
          <!-- "赛盘":"局" -->
          {{stage_name}}
        </div>
        <div class="score" v-if="lodash.get(match_info, 'csid')!='7'">{{result_name}}</div>
      </div>
    </div>

    <div class="more-both">
      <div class="both-item relative-position">
        <div class="wrap-round">
          <span
            class="round"
            v-if="lodash.get(match_info, 'mat') == 'home'&&lodash.get(match_info, 'mmp')!=0&&lodash.get(match_info, 'csid')!='4'"
          ></span>
        </div>
        <div class="logo">
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
        </div>
        <div class="both-name ellipsis">
          <span class="ellipsis allow-user-select" v-tooltip="{content:lodash.get(match_info,'mhn'),overflow:1}">{{lodash.get(match_info, 'mhn')}}</span>
        </div>
        <div class="scorll-handel">
          <div
            class="time-node"
            :class="[($route.name == 'details' && !right)?'is_details':'',`stage-${match_info.mmp}`]"
            ref="scroll_home"
            :style="{'margin': more_left_icon||more_right_icon?'0px 25px 0 14px':'0'}"
             v-if="lodash.get(match_info, 'csid')!='14'"
          >
            <!-- 16水球、15曲棍球 -->
            <template v-if="['16','15'].includes(lodash.get(match_info, 'csid'))">
              <!-- 第一节比分 -->
              <span>{{lodash.get(match_info, 'msc.S19.home')}}</span>
              <!-- 第二节比分 -->
              <span>{{lodash.get(match_info, 'msc.S20.home')}}</span>
              <!-- 第三节比分 -->
              <span>{{lodash.get(match_info, 'msc.S21.home')}}</span>
              <!-- 第四节比分 -->
              <span>{{lodash.get(match_info, 'msc.S22.home')}}</span>
            </template>
            <template v-else>
              <span
                v-for="(item, index) in msc_data"
                :key="index"
                :class="{'current_color':index == active_index}"
              >{{item ? item.home : ' '}}</span>
            </template>
          </div>

          <!-- 11手球,16水球、15曲棍球、14橄榄球 -->
          <div class="add-stage" v-if="['11','16','15','14'].includes(lodash.get(match_info, 'csid'))">{{lodash.get(match_info,'msc.S2.home')}}</div>

          <!-- 4冰球、11手球16水球、15曲棍球、14橄榄球 加时赛、点球大战 -->
          <div class="hockey_add" v-if="['4','11','16','15','14'].includes(lodash.get(match_info, 'csid'))">
            <!-- 加时 -->
            <span v-if="lodash.get(match_info,'msc.S7')">{{lodash.get(match_info,'msc.S7.home')}}</span>
            <!-- 点球 -->
            <span v-if="lodash.get(match_info,'msc.S170')">{{lodash.get(match_info,'msc.S170.home')}}</span>
          </div>
          <!-- 冰球加时赛、点球大战 -->

          <!-- 4冰、5网、6美足、7斯诺克、8乒乓、9排球、10羽毛球、13沙滩排球 -->
          <!-- 5网、8乒乓、9排球、10羽毛球、13沙滩排球 -->
          <template v-if="['5','8','9','10','13'].includes(lodash.get(match_info, 'csid'))">
            <div class="add-stage">{{lodash.get(match_info,'msc.S1.home') || 0}}</div>
            <div class="score">{{current_data.home}}</div>
          </template>

          <!-- 6美足 -->
          <template v-else-if="lodash.get(match_info, 'csid') == '6'">
            <div class="score">{{current_data.home}}</div>
          </template>

          <!-- 4冰、7斯诺克、11手球、12拳击,16水球、15曲棍球、14橄榄球 -->
          <template v-else-if="['4','7','11','12','16','15','14'].includes(lodash.get(match_info, 'csid'))">
            <div class="score">{{lodash.get(match_info,'msc.S1.home')}}</div>
          </template>
        </div>
      </div>
      <div class="both-item relative-position">
        <div class="wrap-round">
          <span
            class="round"
            v-if="lodash.get(match_info, 'mat') == 'away'&&lodash.get(match_info, 'mmp')!=0&&lodash.get(match_info, 'csid')!='4'"
          ></span>
        </div>

        <div class="logo">
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
        </div>

        <div class="both-name ellipsis">
          <span class="ellipsis allow-user-select" v-tooltip="{content:lodash.get(match_info,'man'),overflow:1}">{{lodash.get(match_info, 'man')}}</span>
        </div>
        <div class="scorll-handel">
          <div
            class="time-node"
            :class="[($route.name == 'details' && !right)?'is_details':'',`stage-${match_info.mmp}`]"
            ref="scroll_away"
            :style="{'margin': more_left_icon||more_right_icon?'0px 25px 0 14px':'0'}"
             v-if="lodash.get(match_info, 'csid')!='14'"
          >
            <!-- 16水球、15曲棍球 -->
            <template v-if="['16','15'].includes(lodash.get(match_info, 'csid'))">
              <!-- 第一节比分 -->
              <span>{{lodash.get(match_info, 'msc.S19.away')}}</span>
              <!-- 第二节比分 -->
              <span>{{lodash.get(match_info, 'msc.S20.away')}}</span>
              <!-- 第三节比分 -->
              <span>{{lodash.get(match_info, 'msc.S21.away')}}</span>
              <!-- 第四节比分 -->
              <span>{{lodash.get(match_info, 'msc.S22.away')}}</span>
            </template>
            <template v-else>
              <span
                v-for="(item, index) in msc_data"
                :key="index"
                :class="{'current_color':index == active_index}"
              >{{item ? item.away : ' '}}</span>
            </template>
          </div>

          <!-- 11手球,16水球、15曲棍球、14橄榄球 -->
          <div class="add-stage" v-if="['11','16','15','14'].includes(lodash.get(match_info, 'csid'))">{{lodash.get(match_info,'msc.S2.away')}}</div>

          <!-- 4冰球、11手球16水球、15曲棍球、14橄榄球 加时赛、点球大战 -->
          <div class="hockey_add" v-if="['4','11','16','15','14'].includes(lodash.get(match_info, 'csid'))">
            <!-- 加时 -->
            <span v-if="lodash.get(match_info,'msc.S7')">{{lodash.get(match_info,'msc.S7.away')}}</span>
            <!-- 点球 -->
            <span v-if="lodash.get(match_info,'msc.S170')">{{lodash.get(match_info,'msc.S170.away')}}</span>
          </div>

          <!-- 4冰、5网、6美足、7斯诺克、8乒乓、9排球、10羽毛球、13沙滩排球 -->
          <!-- 5网、8乒乓、9排球、10羽毛球、13沙滩排球 -->
          <template v-if="['5','8','9','10','13'].includes(lodash.get(match_info, 'csid'))">
            <!-- 全场比分 -->
            <div class="add-stage">{{lodash.get(match_info,'msc.S1.away') || 0}}</div>
            <div class="score">{{current_data.away}}</div>
          </template>

          <!-- 6美足 -->
          <template v-else-if="lodash.get(match_info, 'csid') == '6'">
            <div class="score">{{current_data.away}}</div>
          </template>

          <!-- 4冰、7斯诺克、11手球、12拳击,16水球、15曲棍球、14橄榄球 -->
          <template v-else-if="['4','7','11','12','16','15','14'].includes(lodash.get(match_info, 'csid'))">
            <!-- 全场比分 -->
            <div class="score">{{lodash.get(match_info,'msc.S1.away')}}</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import format_desc from "src/project/yabo/mixins/match_details/index";
import {MatchProcessFullVersionWapper} from "src/components/match-process/index.js";
import BetCommonHelper from "src/core/bet/common-helper/index.js";
import { IconWapper } from 'src/components/icon'
import { nextTick } from "vue";
import { socre_dict,stage_dict} from "src/output/index.js";
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
      current_data: {//羽毛球、网球、乒乓球总分
        home: 0,
        away: 0,
      },
      num_title: [],//总盘数|总局数
      active_index: "", //高亮比分项
      isRouterAlive: true,//重载页面开关
      is_scroll: false,//是否展示滚动条
      scrollTimer: null, //定时器
      offset: 5,
    };
  },
  props: {
    match_info: Object,
    right: Boolean
  },
  methods: {
    enter(type) {
      type ? (this.el_active = "right") : (this.el_active = "left");
    },

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

      if (this.right) {
        this.offset = 5;
      }
      let _scroll_left = BetCommonHelper.get_refs_info('scroll_handel', 'scrollLeft', this);
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
      csid == '4' && (mft = mft || 3)
      let dict = socre_dict(csid);
      //斯诺比赛阶段字段为mct，其他球种为mmp
      let is_sinuoke = csid=='7'
      mmp = parseInt(is_sinuoke ? mct : mmp)
      for (var k in dict) {
        if (!msc[dict[k]] && k <= mft && is_sinuoke) {
          msc[dict[k]] = {
            home: "",
            away: "",
          };
        }
        if (k == mmp && !msc[dict[k]]) {
          msc[dict[k]] = {
            home: 0,
            away: 0,
          };
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
          // 羽毛球、乒乓球、斯洛克，排球，冰球，棒球，沙滩排球 会出现不返回某一局比分的情况，所以手动计算排序
          // http://lan-confluence.sportxxxr1pub.com/pages/viewpage.action?pageId=12817576       S120-S159 所对应的比分阶段是连续的，所以允许这样处理
          both_data[item - 120] = msc[i];
          // both_data.push(msc[i]);
        }
      }
      if (mft) {
        let num_title = [];
        for (var i = 0; i < mft; i++) {
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
      } else {
        // 这里需要置空处理，否则从有局数的赛事切换到不展示局数的赛事会错误显示局数
        this.num_title = []
      }

      if(['4','5','8','9','10'].includes(csid)){
        this.active_index = stage_dict(csid, mmp, mct) - 1
      } else {
        //斯诺克
        this.active_index = mct - 1
      }
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
      if (["S120", "S121", "S122", "S123", "S124", "S125", "S126"].includes(i)) {
        this.current_data.home += parseInt(score[i].home || 0);
        this.current_data.away += parseInt(score[i].away || 0);
      }
    }
   },

   /**
   * @description: 重载页面
   * @return {undefined} undefined
   */
    reload_data() {
      this.isRouterAlive = false;
      nextTick(()=> {
        this.isRouterAlive = true;
      });
    },
  },
  watch: {
    match_info: {
      handler(res) {
        this.msc_data = [];
        this.active_index = "";
        this.current_data = {
          home: 0,
          away: 0,
        };
        if (res.ms !=0 && res.mmp == "0") {
          Object.assign(res, {
            mmp: "8",
            mct: 1,
          });
        }
        if (res.csid == "5") {//网球
          let dict = socre_dict(5);
          let msc = res.msc;
          for (var k in dict) {
            if (msc[dict[k]]) {
              this.msc_data.push(msc[dict[k]]);
            } else if (k == parseInt(res.mmp) && !msc[dict[k]]) {
              this.msc_data.push({
                home: 0,
                away: 0,
              });
            } else if (
              ["8", "9", "10", "11", "12"].includes(res.mmp) &&
              k < parseInt(res.mmp) &&
              !msc[dict[k]]
            ) {
              this.msc_data.push({
                home: "",
                away: "",
              });
            }
          }

          if (this.msc_data.length > res.mft) {
            this.msc_data.splice(res.mft, this.msc_data.length);
          }

          let num_title = [];
          for (let i = 0; i < res.mft; i++) {
            num_title.push(i + 1);
          }
          this.num_title = num_title;

          // 补全比分和总盘数|总局数的列数
          for (var i = 0; i < res.mft; i++) {
            if (this.msc_data.length - 1 < i) {
              this.msc_data.push({
                home: "",
                away: "",
              });
            }
          }

          this.active_index = stage_dict(res.csid, res.mmp, res.mct) - 1
          if (res.msc.S103) {
            this.current_data = res.msc.S103;
          }
        } else {
          this.format_msc(res)
          this.computed_score(res)// 计算总分
        }

        // 比分滚动条配置偏移量
        if((this.right && res.mft>5) || (!this.right && res.mft>9)){
          this.is_scroll = true
        } else {
          this.is_scroll = false
          this.more_left_icon = false
          this.more_right_icon = false
        }

        if (this.is_scroll) {
          if (this.scrollTimer) clearTimeout(this.scrollTimer);
          this.scrollTimer = setTimeout(() => {
            nextTick(() => {
              // 如果是右侧就是5个，中间就是9个
              if (this.right) {
                this.offset = 5
              } else {
                this.offset = 9
              }
              let scroll_left = (res.mct - this.offset) * this.one_item_width;

              BetCommonHelper.get_refs_info('scroll_handel', null, this).scrollLeft = scroll_left;
              BetCommonHelper.get_refs_info('scroll_home', null, this).scrollLeft = scroll_left;
              BetCommonHelper.get_refs_info('scroll_away', null, this).scrollLeft = scroll_left;
              if(scroll_left > this.one_item_width){
                this.more_left_icon = true;
              } else {
                this.more_left_icon = false;
              }
              if(res.mft > res.mct){
                this.more_right_icon = true;
              } else {
                this.more_right_icon = false
              }
            });
          }, 10);
        }
      },
      immediate: true,
      deep: true,
    },
    "match_info.mid":{
      handler(){
        this.reload_data();
      },
      immediate: true
    }
  },
  computed:{
    /**
    * @description: 局、盘展示文本
    * @param {}
    * @return {undefined} undefined
    */
    stage_name(){
      let str = i18n_t('common.bureau')//"局"
      switch(this.match_info.csid){
        case '3': str = 'R';break;//3棒球 ’R'
        case '5': str = i18n_t('common.dish');break;//5网球 ‘赛盘’
        case '9': str = i18n_t('common.bureau');break;//9排球 ‘盘’
        default: str = i18n_t('common.bureau');break;//"局"
      }
      return str
    },

    /**
    * @description: 结算展示文本
    * @return {undefined} 结算文字
    */
    result_name(){
      let str = i18n_t('common.total')//'总分'
      switch(this.match_info.csid){
        case '3': str = 'H';break;//3棒球 ’H'
        case '5': str = i18n_t('common.score_');break;//5网球 '得分'
        case '11': str = i18n_t('icon_tips.overall');break;//11手球 全场
        case '16': str = i18n_t('icon_tips.overall');break;//16水球 全场
        case '15': str = i18n_t('icon_tips.overall');break;//15曲棍球 全场
        case '14': str = i18n_t('icon_tips.overall');break;//14橄榄球 全场
        default: str = i18n_t('common.total');break;//'总分'
      }
      return str
    }
  },
  beforeUnmount() {
    clearTimeout(this.scrollTimer);
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
    .hockey_add {
      display: flex;
      text-align: center;
      span {
        width: 26px;
        margin-right: 10px;
      }
    }
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
    }
  }
  .stage-13 {
    span {
      &:nth-child(1) {
        color: var(--qq--yb-text-color1);
      }
    }
  }
  .stage-14,
  .stage-301 {
    span {
      &:nth-child(2) {
        color: var(--qq--yb-text-color1);
      }
    }
  }
  .stage-15,
  .stage-302 {
    span {
      &:nth-child(3) {
        color: var(--qq--yb-text-color1);
      }
    }
  }
  .stage-16,
  .stage-303 {
    span {
      &:nth-child(4) {
        color: var(--qq--yb-text-color1);
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
    margin: 0 6px;
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
      scrollbar-width: none;
    }
    .logo {
      height: 28px;
      min-width: 28px;
      overflow: hidden;
      margin-right: 6px;
      .both-logo {
        width: 28px;
        &.logo-double {
          margin-left: -14px;
        }
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
.esports-head-info-7 .is_details {
  max-width: 314px !important;
}
</style>