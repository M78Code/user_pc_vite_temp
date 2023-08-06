<!--
 * @Author: Cable
 * @Date: 2021-08-04 17:13:55
 * @Description: 列表赛事盘口
-->
<template>
  <div :class="['c-match-handicap', {'unfold_multi_column':match.tpl_id == 13}, get_5min_classname()]">
    <div class="row no-wrap">
      <!-- 玩法列表 -->
      <div 
        class="handicap-col" 
        v-for="(col,col_index) in handicap_list" 
        :key="col_index"
      >
        <div 
          :class="['bet-item-wrap',ol_data.other_class]" 
          :style="get_bet_style(col_index,_.get(col,'ols.length'), ol_data)"
          v-for="(ol_data,ol_index) in col.ols" 
          :key="ol_index"
        >
          <!-- 投注项组件 -->
          <template v-if="match.tpl_id!='esports' || (match.tpl_id=='esports' && getCurState(ol_data._hipo))">
            <bet-item
              v-if="is_mounted && ol_data.oid"
              :ol_data="ol_data"
            />
          </template>
        </div>
      </div>
    </div>

    <!-- 赛事比分 -->
	  <match-footer-score
     v-if="is_show_score"
     :match="match"
     :is_show_score_content="is_show_score_content" 
     :score_wrap_width="_.get(match_list_tpl_size, 'bet_width', 0) * _.get(match_list_tpl_size,'bet_col_count',0)"
     >
     </match-footer-score>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import betItem from "src/public/components/bet_item/bet_item_list_new_data.vue"
import match_list_tpl_size from "src/public/utils/dataClassCtr/match_list_tpl_size.js"
export default {
  components:{
    betItem,
    matchFooterScore: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_footer_score.vue")
  },
  props: {  
    // 盘口列表
    handicap_list: Array,
    // 赛事
    match: Object,
    // 是否显示比分
    is_show_score:{
      type:Boolean,
      default:false
    },
    // 是否显示比分内容
    is_show_score_content:{
      type:Boolean,
      default:true
    },
    //是否主球次要玩法
    other_play:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      // 赛事模板宽度
      match_list_tpl_size:match_list_tpl_size['template'+this.match.tpl_id ] || {},
      // 组件是否已挂载
      is_mounted:false,
    }
  },
  computed:{
     ...mapGetters({
      // 获取当前串关模式
      vx_cur_esports_mode: "get_cur_esports_mode",
    })
  },
  mounted(){
    // 异步设置组件是否挂载完成
    setTimeout(()=>{
      this.is_mounted = true
    })
  },
  methods: {
    /**
     * @description 获取5分钟玩法时的类名，滚球时不需要背景色，早盘时需要背景色
     */
    get_5min_classname(){
      let className = ''
      if (
          this.other_play && ['hps5Minutes'].includes(this.match.play_current_key) // 5分钟玩法
        ) {
        // 滚球 不需要背景色
        if (this.$utils.get_match_status(_.get(this, 'match.ms'), [110]) == 1) {
          className = 'not-bg-handicap min5-roll-handicap'
        } else {
          // not-bg-handicap 清除被影响的背景色
          className = 'not-bg-handicap min5-early-handicap'
        }
      } 
      return className
    },
    /**
     * @description 获取投注项宽度
     * @param {Number} index 当前列表第几列
     * @param {string} other_class 样式类名
     * * @return {Number}  bet_width 投注项宽度 
     */
    get_bet_width(index,other_class = ''){
      let { bet_width } = this.match_list_tpl_size
      let { tpl_id } = this.match
      if(other_class.includes('col1.5')){
          bet_width *= 1.5
      }else if(other_class.includes('col2')){
          bet_width *= 2
      }else if(other_class.includes('col3')){
          bet_width *= 3
      }else if(tpl_id == 22) { 
          if(index <= 5){
            bet_width += 5
          }else{
             bet_width -= 10
          }
      }else if([0,24,1001].includes(+tpl_id) && this.$utils.is_iframe){
        if([0,3].includes(index)){
           bet_width -= 4
        }else{
           bet_width += 2
        }
      }
      return  bet_width
    },
    /**
     * @description 获取投注项宽度
     * @param {Object} length 当前列数量
     * @param { Object} ol_data 投注项
     * * @return {height} 投注项高度
     */
    get_bet_height(length){
      let height = 35
      let { tpl_id } = this.match
      if(length== 1){
        if(+tpl_id === 22){
         height = height*3
        }else{
         height = height*2
        }
      }
      return height
    },
     /**
     * @description 获取投注项样式
     * @param { Object} ol_data 投注项信息
     * * @return {String} 投注项样式
     */
    get_bet_style(col_index,length,ol_data){
      let other_class = _.get(ol_data,'other_class','')
      let style = `width:${this.get_bet_width(col_index,other_class)}px !important;height:${this.get_bet_height(length)}px !important;`
      if(other_class.includes('displacement')){
        let {tpl_id} = this.match
        let { bet_width, media_width } = this.match_list_tpl_size
        let right = tpl_id == 13 ? bet_width*7 + media_width-1 : media_width-1
        style+= `right: ${right}px;`
      }
      if (other_class.includes('row2')) {
        style+= `margin-top: ${this.get_bet_height(length)}px;`
      }
      return style
    },
    /**
     * @description: 根据串关模式是否显示投注项
     * @param {hipo} 盘口是否支持 0不支持 1支持  
     * @return {undefined} undefined
     */
    getCurState(hipo){
      if(this.vx_cur_esports_mode){
        //判断盘口是否支持
        return hipo == 1
      }else{
        //正常显示
        return true
      }
    },
   
  },
};
</script>
<style lang="scss" scoped>
.handicap-col{
  .bet-item-wrap{
    &.visibility{
      visibility: hidden;
    }
    &.right-rimless{
      border-right: none;
    }
  }
}
</style>