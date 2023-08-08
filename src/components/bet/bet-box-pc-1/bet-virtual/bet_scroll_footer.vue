<!--
 * @Author: Amor
 * @Date: 2020-09-05 20:13:44
 * @Description: 左侧菜单 投注相关 尾部
-->
<template>
  <div class="bet-menu-wrap"  :class="{'virtual-bottom':vx_get_virtual_bet_list.length>1}">
    <!-- 投注记录 ------------------------->
    <div v-if="bet_recode_this && vx_layout_left_show=='bet_history' && _.get(bet_recode_this,'record_data.records.length')>0">
      <template
        v-if="bet_recode_this.total_page>bet_recode_this.cur_page"
      >
        <div class="row cursor-pointer" style="padding-top: 10px">
          <div class="col text-center load-more" @click="bet_recode_this.load_more">
            {{$root.$t('bet.bet_load_more')}}
            <!-- 加载更多投注 -->
          </div>
        </div>
      </template>

      <div class="row cursor-pointer">
        <div
          class="col text-center load-all"
          :class="{'review-all-only':!(bet_recode_this.total_page>bet_recode_this.cur_page)}"
          @click="bet_recode_this.show_all_record"
        >
          {{$root.$t('bet.view_all_notes')}}
          <!-- 查看所有注单 -->
        </div>
      </div>
    </div>
    <!-- 串关 投注栏 ------------------------->
    <div v-if="bet_this && vx_layout_left_show=='bet_list'" class="bottom-wrap" :class="{'bottom-cofirm':(bet_this.view_ctr_obj.order_confirm_complete>0)}">
      <template v-if="bet_this.bet_flag && vx_get_virtual_bet_list.length==1">
        <div class="bet-message text-center">
          <!--大于最大金额时的提示和小于最小金额时的提示已经在input输入框下面提示了此处不予提示-->
          {{bet_this.view_ctr_obj.error_message}}
        </div>
        <div class="full-width">
          <!--投注部分及取消-->
          <div class="row bet-buttons">        
            <!--接受变化accept_hanlde-->
            <div
              class="full-width cursor-pointer bet-accpet"
              @click.stop="bet_this.submit_handle('accept')"
              v-if="bet_this.accept_button_show"
            >
              {{bet_this.button_text}}
            </div>
            <div
              class="full-width cursor-pointer bet-submit"
              @click.stop="bet_this.submit_confirm"
              v-else-if="bet_this.bet_confirm_show"
              :id="DOM_ID_SHOW && `but-bet-single-common-confirm`"
            >
              <!-- 确定 -->
              {{$root.$t('common.confirm')}}
            </div>                                              
            <div
              class="full-width cursor-pointer bet-submit"
              :class="{'bet-submit2': bet_this.show_valid_btn}"                   
              @click.stop="bet_this.submit_handle('submit')"
              :id="DOM_ID_SHOW && `but-bet-single-submit`"
              v-else-if="!bet_this.bet_confirm_show"
            >
              <template v-if="['0400459','0400475','0400483','0400486','0400517','0400519','0400540'].includes(bet_this.view_ctr_obj.error_code)">
                  <!-- 确定 -->
                  {{$root.$t('common.confirm')}}
                </template>
                <template v-else>                        
                  <span :style="{'opacity': ['M400005'].includes(bet_this.view_ctr_obj.error_code)? '0.5': '1'}">{{$root.$t('common.betting')}}</span>
                  <!-- 投注 -->
                </template>      
            </div>   
            <div
              class="full-width cursor-pointer bet-delete-all"
              :class="{'bet-delete2': bet_this.bet_loadding,'bet-delete-over': bet_this.bet_delete_over}"
              @click.stop="bet_this.cancel_handle"
            >
              {{$root.$t('bet.bet_cancel')}}
              <!-- 删除 -->
            </div>
          </div>
        </div>
        <template v-if="vx_get_virtual_bet_list.length>0">          
          <div class="full-width bet-foot-menu">
            <div class="row check-bet-prefer cursor-pointer" :class="{'checked': bet_this.user_bet_prefer}" @click.stop="bet_this.toggle_bet_prefer">
                <!--底部菜单部分-->
                <check-box :checked="bet_this.user_bet_prefer" /> {{$root.$t('bet.bet_auto_msg_1')}}
              </div>
            <div class="row check-box cursor-pointer" :class="{'checked': bet_this.is_common_amount}" @click.stop="bet_this.toggle_amount">
              <check-box :checked="bet_this.is_common_amount" /> {{$root.$t('bet.common_amount')}}
            </div>
          </div>
        </template>      
      </template>
      <template v-else-if="!bet_this.bet_flag && vx_get_virtual_bet_list.length==1">
        <div class="full-width bet-foot-complete" :class="{'mt10':[2,3].includes(bet_this.view_ctr_obj.order_confirm_complete)}">      
          <div
            class="full-width cursor-pointer"
            :class="{'bet-complete':bet_this.bet_loadding,'bet-confirm':!bet_this.bet_loadding}"
            @click.stop="bet_this.complete_handle"
            v-if="bet_this.bet_complete_show"
          >
            <template v-if="bet_this.bet_loadding">              
              <span class='bet-confirming'>{{$root.$t('bet.bet_loading')}}</span><q-spinner-dots size="16" style="color:#FFF"></q-spinner-dots>
            </template>
            <template v-else>
              {{$root.$t('common.confirm')}}
              <!-- 确定 -->
            </template>
          </div>        
        </div>
        <div class="full-width bet-foot-save">       
          <!--保留这些选项--> 
          <div
            class="full-width cursor-pointer bet-save-items"
            @click.stop="bet_this.save_bet_items"
          >
            {{$root.$t('bet.save_item')}}
          </div>        
        </div>
      </template>
      <template v-else-if="bet_this.bet_flag && vx_get_virtual_bet_list.length>1">
        <q-separator class="bet-mix-separator"></q-separator>
        <!--投注总额及预计收益 -->
        <div class="full-width pt15">
          <div class="row bet-total">
            <div class="col bet-total-left">
              {{$root.$t('bet.total_bet')}}
              <!-- 总投注 -->
              <template v-if="bet_this.bet_total_count>0">
                {{bet_this.bet_total_count}}
              </template>
            </div>
            <div class="col-auto bet-total-right">
              {{bet_this.bet_total_money||format_currency}}
            </div>
          </div>
          <div class="row bet-total">
            <div class="col bet-total-left">
              {{$root.$t('bet.total_income')}}
              <!-- 预计总收益 -->
            </div>
            <div class="col-auto bet-total-right bet-gold-text">
              {{bet_this.bet_total_win_money||format_currency}}
            </div>
          </div>
          <template v-if="!bet_this.show_invalid_btn">
            <q-separator class="bet-mix-separator"></q-separator>
          </template>
          <!--提示区域 您所选择的盘口、赔率或有效性已经发生了变化-->
           <div class="bet-message text-center">
              <template v-if="bet_this.vx_get_virtual_bet_list.length<bet_this.vx_get_mix_min_count">
                <!--至少选择2场比赛-->
                {{$root.$t("bet.bet_min_item").replace('%s',bet_this.vx_get_mix_min_count)}}
              </template>
              <template v-else>
                <!--错误提示-->
                {{bet_this.view_ctr_obj.error_message}}
              </template>
            </div>
          <!--投注部分及取消-->
          <div class="row bet-buttons">
            <!--接受变化accept_hanlde-->
            <div
              v-if="bet_this.accept_button_show && !bet_this.show_valid_btn"
              class="full-width cursor-pointer bet-accpet"
              @click.stop="bet_this.submit_handle('accept')"
            >
              {{$root.$t('bet.accept_change')}}
              <!-- 接受变化并投注 -->
            </div>
            <div class="full-width" v-else-if="bet_this.bet_confirm_show">
              <div
                class="full-width cursor-pointer bet-submit"
                @click.stop="bet_this.submit_confirm"
              >
                <!-- 确定 -->
                {{$root.$t('common.confirm')}}
              </div>
            </div>
            <div class="full-width" v-else-if="bet_this.bet_submit_show || bet_this.bet_flag">
              <div
                class="full-width cursor-pointer bet-submit"
                :class="{
                  'bet-submit2': bet_this.has_disable_item || 
                  bet_this.show_valid_btn ||
                  bet_this.vx_get_virtual_bet_list.length<bet_this.vx_get_mix_min_count ||   
                  ['0400477','0400478'].includes(bet_this.view_ctr_obj.error_code)
                }"
                @click.stop="bet_this.submit_handle('submit')"
                :id="DOM_ID_SHOW && `but-bet-single-submit`"
              >
                <template v-if="['0400459','0400475','0400517','0400519'].includes(bet_this.view_ctr_obj.error_code)">
                  <!-- 确定 -->
                  {{$root.$t('common.confirm')}}
                </template>
                <template v-else>
                  <!--投注-->
                  {{$root.$t('common.betting')}}
                </template>
              </div>
            </div>
            <div class="full-width">
              <div
                class="full-width cursor-pointer bet-delete-all"
                :class="{'bet-delete-all2': bet_this.bet_loadding, 'bet-delete-over': bet_this.bet_delete_over}"
                @click.stop="bet_this.cancel_handle"
                @mouseover="bet_this.bet_delete_over=true"
                @mouseout="bet_this.bet_delete_over=false"
              >
                <!--  {{$root.$t('common.del_all')}} -->
                {{$root.$t('bet.remove_all')}}
                &nbsp;
                <icon
                  name="icon-del"
                  class="bet-del"/>
                <!-- 取消 -->
              </div>
            </div>
          </div>
        </div>
        <template v-if="bet_this.vx_get_virtual_bet_list.length>0">
          <div class="full-width bet-foot-menu">
            <div class="row check-bet-prefer cursor-pointer" :class="{'checked': bet_this.user_bet_prefer}" @click.stop="bet_this.toggle_bet_prefer">
              <!--用户选择喜好的菜单-->
              <check-box :checked="bet_this.user_bet_prefer" /> {{$root.$t('bet.bet_auto_msg_1')}}
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="!bet_this.bet_flag && vx_get_virtual_bet_list.length>1">
        <template v-if="bet_this.view_ctr_obj.order_confirm_complete!=0">
          <!--提示区域 您所选择的盘口、赔率或有效性已经发生了变化 -->
          <div class="bet-confirm-message  text-center yb-fontsize12"
            :id="DOM_ID_SHOW && `but-bet-single-ok`"
            :class="{
              'bet-success-order':(bet_this.view_ctr_obj.order_confirm_complete==2),
              'bet-fail-order':[3,4].includes(bet_this.view_ctr_obj.order_confirm_complete)
            }">
            <template v-if="[1,4].includes(bet_this.view_ctr_obj.order_confirm_complete)">
              <!--订单需要系统审核,请关注投注记录-->
              {{$root.$t('bet.bet_order_info1')}}
            </template>
            <template v-else-if="bet_this.view_ctr_obj.order_confirm_complete==2">
              <!--您的订单已确认-->
              {{$root.$t('bet.bet_order_info2')}}
            </template>
            <template v-else-if="bet_this.view_ctr_obj.order_confirm_complete==3">
              <!--投注失败-->
              {{$root.$t('bet.bet_order_info3')}}
            </template>
            <template v-else>
              {{bet_this.view_ctr_obj.order_confirm_complete}}
            </template>
          </div>
        </template>
        <div class="full-width bet-foot-complete" :class="{'mt10':[2,3,4].includes(bet_this.view_ctr_obj.order_confirm_complete)}">
          <div
            class="full-width cursor-pointer bet-submit"
            @click.stop="bet_this.submit_handle('submit')"
            :id="DOM_ID_SHOW && `but-bet-single-submit`"
            v-if="!bet_this.bet_complete_show"
          >
            <template v-if="['0400459','0400475','0400483','0400486','0400517'].includes(bet_this.view_ctr_obj.error_code)">
              {{$root.$t('common.confirm')}}
            </template>
            <template v-else>
              {{$root.$t('common.betting')}}
            </template>
          </div>
          <div
            class="full-width cursor-pointer"
            :class="{'bet-complete':bet_this.bet_loadding,'bet-confirm':!bet_this.bet_loadding}"
            @click.stop="bet_this.complete_handle"
            v-else
          >
            <template v-if="bet_this.bet_loadding">
              <span class='bet-confirming'>{{$root.$t('bet.bet_loading')}}</span><q-spinner-dots size="16" style="color:#FFF"></q-spinner-dots>
            </template>
            <template v-else>
              {{$root.$t('common.confirm')}}
              <!-- 完成 -->
            </template>
          </div>
        </div>
        <div class="full-width bet-foot-save mb10">
          <!--保留这些选项-->
          <div
            class="full-width cursor-pointer bet-save-items"
            @click.stop="bet_this.save_bet_items"
          >
            {{$root.$t('bet.save_item')}}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import CheckBox from "../common/filter-checkbox.vue"
// import { mapGetters } from "vuex";
// import betting from "src/public/mixins/betting/betting2.js";
// export default {
//   name: "VirtualBetScrollFooter",
//   mixins: [betting],
//   components: {
//     "check-box": () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/filter_checkbox.vue"),  //选择框
//   },
//   props: {
//     bet_recode_this: Object,// 投注记录组件this
//     bet_this: Object // 串关组件this
//   },
//   data() {
//     return {
//     };
//   },
//   created () {
//     // 显示部分dom ID
//     this.DOM_ID_SHOW = window.env.config.DOM_ID_SHOW;
//   },
//   computed: {
//     ...mapGetters({
//       vx_get_virtual_bet_list: "get_virtual_bet_list", //虚拟体育投注列表
//       vx_get_menu_change: "get_menu_change",   // 菜单是否改变
//       vx_layout_left_show: "get_layout_left_show" // 左侧布局
//     })
//   }
// };
</script>

<style lang="scss" scoped>
.bet-menu-wrap {
  /*  加载更多, 加载所有注单 */
  .load-more,
  .load-all {
    height: 36px;
    line-height: 36px;
    margin-left: 10px;
    margin-right: 10px;

    /*  加载更多投注 */
    &.load-all {
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }
  &.virtual-bottom {
    margin-top: -5px;
  }
}
</style>
