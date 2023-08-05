<!--
 * @Author: Cronus
 * @Date: 2020-07-14 17:46:47
 * @Description: 投注项赔率
-->

<template>
  <div class="odd-column-item" :class="odds_class_object" @click.stop="item_click3" :id="DOM_ID_SHOW && `list-${_.get(odd_item, 'oid')}`">
    <!-- 占位  或者  关盘 -->
    <div v-if="placeholder == 1 || is_close(get_odd_status())" class="item-inner">
      <img class="icon-lock" :class="{standard:n_s}" :src="match_icon_lock" />
    </div>

    <!-- 全封(不显示盘口值) 占位时显示封-->
    <div v-else-if="is_fengpan(get_odd_status())" class="item-inner">
      <!--csid:1足球全封,不显示盘口名-->
      <div class='odd-title'
        :class="{three:column_ceil > 2,standard:n_s == 2}"
        v-if="(!is_fengpan(get_odd_status()) && [18,19].includes(+_.get(current_tab_item, 'id'))) || ((odd_item.on || convert_num(odd_item) === 0) && match.csid != 1)"
        v-html="transfer_on(odd_item)">
      </div>
      <img class="icon-lock" :class="{standard:n_s}" :src="match_icon_lock" />
    </div>

    <!-- 半封(显示盘口值)与赔率显示 -->
    <div v-else class="item-inner have-on" :class="{close: is_fengpan(get_odd_status()) || get_obv_is_lock(odd_item)}">
      <!--csid:1足球全封,不显示盘口名-->
      <div class='odd-title'
        :class="{three:column_ceil > 2,standard:n_s == 2}"
        v-if="(odd_item.on || convert_num(odd_item) === 0 || (!is_fengpan(get_odd_status()) && [18,19].includes(+_.get(current_tab_item, 'id'))) ) ||
              (is_fengpan(get_odd_status())  || get_obv_is_lock(odd_item))
              && match.csid != 1"
        v-html="transfer_on(odd_item)">
      </div>
      <!-- 显示赔率 -->
      <div class='odd-value' v-show="!is_fengpan(get_odd_status()) && (+odd_item.ov ) && !get_obv_is_lock(odd_item)"
        :class="{
          three:column_ceil > 2,
          red:red_green_status === 1,
          green:red_green_status === -1,
          orange:(get_cur_odd === 'ID' || get_cur_odd === 'MY') && odds_value < 0,
          focus:odd_item.result == 4 || odd_item.result == 5,
          win:[4,5].includes(+odd_item.result),
          lose:[0,1,2,3,6].includes(+odd_item.result),
          standard:n_s == 2,
        }">
        {{odd_append_value}}<!--获取赔率或赛果-->
        <span class="change-icon" v-show="red_green_status"
              :class="{'icon-red':red_green_status === 1,'icon-green':red_green_status === -1}">
        </span>
      </div>
      <!-- 半封(显示盘口值on) -->
      <img class="icon-lock" :class="{standard:n_s}" v-if="(is_fengpan(get_odd_status()) || get_obv_is_lock(odd_item))"
           :src="match_icon_lock" />
    </div>

  </div>
</template>
<script>
import {mapGetters, mapMutations} from "vuex";
import odd_convert from "src/public/mixins/odds_conversion/odds_conversion.js";
import betting from 'src/project/mixins/betting/betting.js';

export default{
  name:"oddColumnItem",
  props:{
    current_tab_item:Object, //
    ol_list_item:Object, //
    odd_item_i:Number,
    match:Object,
    odd_field:Object,
    hl_hs:Number,  // 0.开盘，1封盘，2关盘 ，3 锁盘    和 match.mhs   是一样的意思
    placeholder:Number,// 是否为占位
    n_s:Number,    // 1新手版 2标准版
    column_ceil:Number, //列数量
  },
  mixins:[odd_convert,betting],
  data(){
    return {
      // 投注项
      odd_item:{},
      //红升绿降状态
      red_green_status:0,
      //虚拟体育开0 封1
      virtual_odds_state:0,
      odd_append_value:'',
      ol_dictionary:{},
      is_local_lock:0,
      match_icon_lock: "image/wwwassets/bw3/common/match-icon-lock.svg",
    }
  },
  created () {
    this.timer_=0;
    this.timer1_=0;
    // 设置是否显示投注项dom的id属性值
    this.DOM_ID_SHOW = window.env.config.DOM_ID_SHOW;
  },
  mounted(){
    this.get_odd_data();
    this.$root.$on(this.emit_cmd.EMIT_ARRIVED10,this.arrived10_handle);
    this.$root.$on(this.emit_cmd.EMIT_MATCH_RESULT_DATA_LOADED,this.match_result_data_loaded);
    // 点击事件防抖处理
    this.item_click3 = this.debounce(this.item_click3, 450, {'leading': true, trailing: false});
  },
  computed:{
    ...mapGetters([
      "get_bet_list",
      "get_current_menu",
      "get_cur_odd",
      "get_newer_standard_edition",
      "get_menu_type",
      "get_theme",
      "get_foot_ball_screen_changing",
      'get_lang',// 当前语言
    ]),
    ...mapGetters({
      footer_sub_menu_id:"get_footer_sub_menu_id",
    }),
    // 当前玩法ID
    hpid(){
      return _.get(this.odd_field,'hpid');
    },
    // 判断边框border-radius样式
    odds_class_object(){
      let result = {
        'odd-column-item2':this.is_selected,
        'is-standard':this.get_newer_standard_edition === 2,
        'first-radius': this.odd_item_i === 0,
        'last-radius': this.odd_item_i > 1,
        'is-jiaoqiu':this.footer_sub_menu_id == 114,
        'mred':  this.red_green_status === 1 && this.no_lock() && (!this.is_selected),
        'mgreen': this.red_green_status === -1 && this.no_lock() && (!this.is_selected),
      };
      if(this.get_newer_standard_edition == 2){
        delete result['first-radius'];
        delete result['last-radius'];
      }
      return result;
    },
    /**
     * @description: 计算最终显示的赔率
     * @return {number} 最终显示的赔率
     */
    odds_value(){
      if(!this.odd_field) return 0;
      let ov = this.odd_item.ov,hsw = this.odd_field.hsw;
      let csid = null;
      if(this.get_menu_type == 3000){
        csid = this.match.csid;
      }
      let r1 = this.compute_value_by_cur_odd_type(ov / 100000,null, hsw, false ,csid);
      return r1 || 0;
    },
    /**
     * @description: 盘口状态  1.开盘，    2封盘，   3关盘 ，    4 锁盘
     * @return number 1开盘     4锁盘正常显示    2 封盘显示锁,     3关盘显示短横线
     */
    odd_s(){
      clearTimeout(this.timer1_)
      this.timer1_ = setTimeout(() => {
        this.get_odd_data();
      },600);

      if(!this.odd_item) return 3;
      if(this.hl_hs == 1 || this.virtual_odds_state == 1){
        return 2
      }
      else if(this.hl_hs == 2){
        return 3
      }
      else if(this.hl_hs == 3){
        return 4
      }
      return this.$common.odds.get_odds_active(this.odd_item.ms,this.odd_item.hs,this.odd_item.os);
    },
    /**
     *@description 投注项是否被选中
     *@return {Undefined} undefined
     */
    is_selected(){
      let flag;
      if (this.get_menu_type == 900) {  //虚拟体育
        flag = this.get_bet_list.includes(this.odd_item.oid);
      } else {
        let id_ = _.get(this.odd_field,'hl[0].hn')? `${this.match.mid}_${this.odd_field.chpid || this.odd_field.hpid}_${this.odd_item.ot}_${this.odd_field.hl[0].hn}` : this.odd_item.oid
        flag = this.get_bet_list.includes(id_);
      }
      this.$emit('select_change',{flag,i:this.odd_item_i});
      return flag;
    }
  },
  methods:{
    ...mapMutations([
      "set_toast",
    ]),
     /**
     * @description: 不是锁
     * @return boolean
     */
    no_lock() {
      let result = false;
      if(this.placeholder == 1){
        result = true;
      }
      else if(this.is_close(this.odd_s)){
        result = true;
      }
      else if(this.is_fengpan(this.odd_s) && (!this.odd_item.on || this.odd_item.on == 0)){
        result = true;
      }
      else if(this.is_fengpan(this.odd_s) || this.get_obv_is_lock(this.odd_item)){
        result = true;
      }
      return !result;
    },
    /**
     * 获取到赛果数据
     */
    match_result_data_loaded(data){
      data.forEach(result => {
        result.forEach(hl_list => {
          if(hl_list && hl_list.hl && hl_list.hl.length){
            hl_list.hl[0].ol.forEach(ol_item => {
              this.ol_dictionary[ol_item.oid] = ol_item.result;
            });
          }
        });
      });
      this.is_local_lock = 11;
      this.get_odd_append_value(this.odd_item);
    },
    // 获取赔率或赛果
    get_odd_append_value(ol_item){
      let r = "";
      if(ol_item.result === "0" || ol_item.result){
        r = this.$root.$t(`virtual_sports.result[${ol_item.result}]`);
      } else{
        let dict_result = this.ol_dictionary[ol_item.oid];
        if(dict_result === "0" || dict_result){
          r = this.$root.$t(`virtual_sports.result[${dict_result}]`);
        } else{
          r = this.odds_value;
        }
      }
      this.odd_append_value = r;
    },
    arrived10_handle(){
      this.virtual_odds_state = 1;
    },
    // 获取 投注项数据，
    get_odd_status(){
      this.get_odd_data();
      if(!this.odd_item) return 3;
      if(this.hl_hs == 1 || this.virtual_odds_state == 1){
        return 2
      }
      else if(this.hl_hs == 2){
        return 3
      }
      else if(this.hl_hs == 3){
        return 4
      }
      return this.$common.odds.get_odds_active(this.odd_item.ms,this.odd_item.hs,this.odd_item.os);
    },
    // on转换html
    transfer_on(odd_item){
      if(this.match.csid == 1 && [19].includes(+_.get(this.current_tab_item, 'id')) ){
        return odd_item.onb || odd_item.on;
      }
      let on = odd_item.onb || odd_item.on;
      if(this.match.csid == 1 && [18].includes(+_.get(this.current_tab_item, 'id')) ){
        on = odd_item.ot
        if(odd_item.ot == 'Other' && ['zh', 'tw'].includes(this.get_lang)){
          on = '其他'
        }
      }
      let color = ''
      if(this.is_fengpan(this.odd_s) || this.get_obv_is_lock(this.odd_item)){
        if(this.get_theme.includes('theme01')){
          // color = '#d1d1d1';
        }
        else{
          // color = '#414141';
        }
      } else{
        color = 'var(--qq-color-fs-color-13)';
      }
      let replaced = on
      if(![18].includes(+_.get(this.current_tab_item, 'id'))){
        replaced = on.replace(/[\/0-9\+\-\.]/ig,found => {
          return `<span style="color:${color}">${found}</span>`
        });
      }
      return replaced;
    },
    // on转换为数字
    convert_num(odd_item){
      let on = odd_item.onb || odd_item.on;
      if(on === 0 || on === "0"){
        return 0;
      }
      else if(!on){
        return ''
      }
      else{
        return on;
      }
    },
    /**
     * @description: 原始赔率(ov / 100000)小于1.01 强制显示封盘(显示锁)
     * @return boolean 是否显示封盘样式
     */
    get_obv_is_lock(odd_item){
      return odd_item.ov < 101000;
    },
    //  获取指定下标的投注项数据
    get_odd_data(){
      let ol = null;
      try{
        if(_.get(this.odd_field,'hl[0]')){
          ol = this.odd_field.hl[0].ol;
        }
      } catch(e){
        console.error(e);
      }
      if(ol && ol.length){
        if([18,19].includes(+_.get(this.current_tab_item, 'id'))){
          this.odd_item = this.ol_list_item
        }else{
          this.odd_item = ol[this.odd_item_i];
        }
      } else {
        this.odd_item = {"oid":"","mid":_.get(this.odd_field,'mid')}
      }
    },
    /**
     * @description: 获取（开盘与关盘）非封盘和锁盘的盘口
     * @return Array 投注项列表
     */
    get_ollist_no_close(odd_field){
      let hl_list = [],ol = [];
      if(odd_field && odd_field.hl && odd_field.hl.length){
        hl_list = odd_field.hl;
      }

      for(let i = 0; i < hl_list.length;i++){
        let hl = hl_list[i];
        if(hl.hs == 0 || hl.hs == 11){
          ol = hl.ol;
          break;
        }
      }
      return ol;
    },
    /**
     * @description: 是否封盘odd_s == 2
     * @return boolean
     */
    is_fengpan(odd_s){
      if(this.is_local_lock == 11) return false;
      if(this.match.mhs == 1) return true; // mhs： 0 开,  1 封,  2 关,  11 锁
      if(this.hl_hs == 1) return true;
      return odd_s == 2;
    },
    /**
     * @description: 是否是关盘
     * @return boolean
     */
    is_close(odd_s){
      let r = false;
      if(this.is_local_lock == 11) return false;
      if(this.match.mhs == 2) return true; // mhs： 0 开,  1 封,  2 关,  11 锁
      if(this.hl_hs == 2){ // 投注项父类关盘
        return true;
      }
      if(odd_s == 2) {
        return false;
      }
      if(odd_s == 3){
        r = true;
      }
      return r;
    },
    /**
     * @description bw3新版点击列表小方块投注
     * @param {Undefined} Undefined
     * @return {Undefined} undefined
     */
    item_click3(){
      if (!this.odd_item.ov || this.odd_item.ov < 101000) return;   //对应没有赔率值或者欧赔小于101000
      let flag = this.$common.odds.get_odds_active(this.match.mhs, this.hl_hs, this.odd_item.os);
      if (flag == 1 || flag == 4) {   //开盘和锁盘可以点击弹起来
        if (this.get_menu_type == 900 && this.$route.name == 'virtual_sports') { //虚拟体育走这里逻辑
          if (this.match.match_status) return
          this.bet_click3(this.match, this.odd_field, this.odd_item);
        } else { //正常赛事走这里逻辑
          this.bet_click(this.match, this.odd_field, this.odd_item);
        }
      }
    },
  },
  watch:{
    // 监听玩法变化
    hpid(){
      this.get_odd_data();
    },
    match:{
      handler(){
        let ol_list = this.get_ollist_no_close(this.odd_field);
        if(ol_list){
          if([18,19].includes(+_.get(this.current_tab_item, 'id'))){
            this.odd_item = this.ol_list_item
          }else{
            if(this.odd_item)
            {
              Object.assign(this.odd_item, ol_list[this.odd_item_i]);
            } else{
              this.odd_item = ol_list[this.odd_item_i];
            }
          }
        }
      },
      deep:true
    },
    /**
     * @description: 监听赔率变化实现红升绿降
     * @param v1 新值
     * @param v0 旧值
     * @return undefined
     */
    'odd_item.ov'(v1,v0){
      if(this.get_foot_ball_screen_changing){
        return;
      }
      let curr = Number(v1);
      let old = Number(v0);

      clearTimeout(this.timer_);
      if(curr > old){
        this.red_green_status = 1;
      }else if(curr < old){
        this.red_green_status = -1;
      }
      this.timer_ = setTimeout(() => {
        this.red_green_status = 0;
      },3000);
    },
    odds_value(){
      this.get_odd_append_value(this.odd_item);
    }
  },
  destroyed(){
    this.$root.$off(this.emit_cmd.EMIT_ARRIVED10,this.arrived10_handle);
    this.$root.$off(this.emit_cmd.EMIT_MATCH_RESULT_DATA_LOADED,this.match_result_data_loaded);
    this.debounce_throttle_cancel(this.item_click3);
    clearTimeout(this.timer_);
    this.timer_ = null;
    clearTimeout(this.timer1_);
    this.timer1_ = null;
  },
}
</script>
<style lang="scss" scoped>
.odd-column-item {
  flex: 1;
  height: 100%;
  display: flex;
  flex-shrink: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  &.first-radius {
    border-radius: 0.03rem 0 0 0.03rem;
  }

  &.last-radius {
    border-radius: 0 0.03rem 0.03rem 0;
  }

  &:after {
    content: ' ';
    display: block;
    width: 0.01rem;
    height: 0.24rem;
    position: absolute;
    left: 0;
    top: 0.16rem;
  }

  &.is-jiaoqiu, &.is-standard {
    &:after {
      display: none;
    }
  }

  .odd-is-empty {
    .icon-lock {
      width: 0.14rem;
      height: 0.14rem;
    }
  }

  .item-inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 2px;

    .icon-lock {
      width: 0.14rem;
      height: 0.14rem;

      &.standard {
        width: 0.12rem;
        height: 0.15rem;
      }
    }
  }

  &.is-double-row {
    height: 50%;
  }

  &.is-trible-row {
    height: 31%;

    .odd-title {
      margin-bottom: 0.02rem;
    }

    .icon-lock {
      font-size: 0.12rem !important;
    }
  }

  .odd-value {
    font-size: 0.16rem;
    display: flex;
    align-items: center;
    line-height: 1;
    position: relative;
    min-height: 0.16rem;
    color: var(--q-color-fs-color-115);

    &.standard {
      font-size: 0.14rem;
    }

    &.three {
      font-size: 0.12rem;
    }
  }

  .odd-title {
    word-break: break-all;
    text-align: center;
    margin-bottom: 0.09rem;
    font-size: 0.14rem;
    line-height: 1;

    &.standard {
      margin-bottom: 0.03rem;
      font-size: 0.12rem;
    }

    &.three {
      font-size: 0.09rem;
    }
  }

  .change-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -0.12rem;
    width: 0.06rem;
    height: 0.05rem;
    display: inline-block;
    margin-right: 0.03rem;
    background-repeat: no-repeat;
    background-size: contain;

    &.icon-green {
      background-image: var(--q-color-com-img-bg-18);
    }

    &.icon-red {
      background-image: var(--q-color-com-img-bg-19);
    }
  }
}

.flag-random {
  display: none;
}
</style>
