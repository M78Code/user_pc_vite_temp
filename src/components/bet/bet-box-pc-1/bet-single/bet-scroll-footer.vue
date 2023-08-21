<!--
 * @Description: 左侧菜单 投注相关 尾部
-->
<template>
  <div class="bet-menu-wrap" :class="{ 'bet-menu-wrap-mix': !vx_is_bet_single }">
    <!-- 投注记录 ------------------------->
    <div
      v-if="bet_recode_this && vx_layout_left_show == 'bet_history' && _.get(bet_recode_this, 'record_data.records.length') > 0">
      <template v-if="bet_recode_this.total_page > bet_recode_this.cur_page">
        <div class="row cursor-pointer" style="padding-top: 10px">
          <div class="col text-center load-more" @click="bet_recode_this.load_more">
            {{ $root.$t('bet.bet_load_more') }}
            <!-- 加载更多投注 -->
          </div>
        </div>
      </template>
      <div class="row cursor-pointer">
        <div class="col text-center load-all"
          :class="{ 'review-all-only': !(bet_recode_this.total_page > bet_recode_this.cur_page) }"
          @click="bet_recode_this.show_all_record">
          {{ $root.$t('bet.view_all_notes') }}
          <!-- 查看所有注单 -->
        </div>
      </div>
    </div>
    <!-- 串关 投注栏 ------------------------->
    <template v-if="bet_this">
      <div class="bottom-wrap" :class="{ 'bottom-cofirm': (bet_this.view_ctr_obj.order_confirm_complete > 0) }">
        <div class="remove-invalid-item cursor-pointer text-center" @click.stop="bet_this.remove_invalid_item"
          v-if="bet_this.show_invalid_btn">
          <!--  移除无效(串关包括不支持串关投注项)投注 -->
          {{ $root.$t('bet.remove_invalid_item') }}
          <icon name="icon-del" class="bet-del" />
        </div>
        <template v-if="vx_is_bet_single">
          <template v-if="bet_this.bet_fail_flag">
            <div class="bet-fail-message text-center">
              <!--投注失败-->
              {{ $root.$t('bet.bet_fail') }}
            </div>
          </template>
          <template v-if="bet_this.bet_flag">
            <!--投注是的错误提示信息-->
            <!--这个错误提示信息一般预约状态时不显示除了0400540和0400483这个两个错误码-->
            <div class="bet-message text-center"
              v-if="!lock_btn || (this.vx_get_bet_appoint_obj && (bet_this.view_ctr_obj.error_code == '0400483' || bet_this.view_ctr_obj.error_code == '0400540' || bet_this.view_ctr_obj.error_code == 'M400004'))">
              {{ bet_this.view_ctr_obj.error_message }}
            </div>
            <div class="full-width">
              <!--投注部分及取消-->
              <div class="row bet-buttons">
                <!--接受变化accept_hanlde-->
                <div class="full-width cursor-pointer bet-accpet" @click.stop="bet_this.submit_handle('accept')"
                  v-if="bet_this.accept_button_show">
                  {{ bet_this.button_text }}
                </div>
                <div class="full-width cursor-pointer bet-submit" @click.stop="bet_this.submit_confirm"
                  v-else-if="bet_this.bet_confirm_show">
                  <!--确定按钮-->
                  {{ $root.$t('common.confirm') }}
                </div>
                <div class="full-width cursor-pointer bet-submit" :class="{
                  'bet-submit2': bet_this.show_invalid_btn || bet_this.show_valid_btn,
                  'disable-btn': lock_btn
                }" :id="DOM_ID_SHOW && `but-bet-single-submit`" @click.stop="bet_this.submit_handle('submit')"
                  v-else-if="!bet_this.bet_confirm_show && !['0400483'].includes(bet_this.view_ctr_obj.error_code)">
                  <template
                    v-if="['0400459', '0400475', '0400486', '0400517', '0400519', '0400540'].includes(bet_this.view_ctr_obj.error_code)">
                    <!--确定按钮-->
                    {{ $root.$t('common.confirm') }}
                  </template>
                  <template v-else>
                    <!-- 投注 -->
                    {{ $root.$t('common.betting') }}
                  </template>
                </div>
                <div class="full-width cursor-pointer bet-submit" :class="{
                  'bet-submit2': bet_this.show_invalid_btn || bet_this.show_valid_btn,
                  'disable-btn': lock_btn
                }" :id="DOM_ID_SHOW && `but-bet-single-submit`" @click.stop="bet_this.go_history"
                  v-else-if="!bet_this.bet_confirm_show && ['0400483'].includes(bet_this.view_ctr_obj.error_code)">
                  <template v-if="['0400483'].includes(bet_this.view_ctr_obj.error_code)">
                    <!--去注单记录查看-->
                    {{ $root.$t('common.betting_history') }}
                  </template>
                </div>
                <div class="full-width cursor-pointer bet-delete-all" @click.stop="bet_this.cancel_handle"
                  @mouseover="bet_this.bet_delete_over = true" @mouseout="bet_this.bet_delete_over = false">
                  <!-- 取消投注 -->
                  {{ $root.$t('bet.bet_cancel') }}
                </div>
              </div>
            </div>
            <!--底部菜单部分-->
            <div class="full-width bet-foot-menu">
              <div class="row check-bet-prefer cursor-pointer" :class="{ 'checked': bet_this.user_bet_prefer }"
                @click.stop="bet_this.toggle_bet_prefer">
                <!--底部菜单部分-->
                <check-box :checked="bet_this.user_bet_prefer" /> {{ $root.$t('bet.bet_auto_msg_1') }}
              </div>
              <div class="row check-box cursor-pointer" :class="{ 'checked': bet_this.is_common_amount }"
                @click.stop="bet_this.toggle_amount" v-if="bet_this.vx_get_bet_single_list.length == 1">
                <check-box :checked="bet_this.is_common_amount" /> {{ $root.$t('bet.common_amount') }}
              </div>
            </div>
          </template>
          <template v-else>
            <div class="full-width bet-foot-complete"
              :class="{ 'mt10': [2, 3].includes(bet_this.view_ctr_obj.order_confirm_complete) }">
              <div class="full-width cursor-pointer"
                :class="{ 'bet-complete': bet_this.bet_loadding, 'bet-confirm': !bet_this.bet_loadding }"
                @click.stop="bet_this.complete_handle" :id="DOM_ID_SHOW && `but-bet-single-common-confirm`"
                v-if="bet_this.bet_complete_show">
                <template v-if="bet_this.bet_loadding">
                  <span class='bet-confirming'>{{ $root.$t('bet.bet_loading') }}</span><q-spinner-dots size="16"
                    style="color:#FFF"></q-spinner-dots>
                </template>
                <template v-else>
                  {{ $root.$t('common.confirm') }}
                  <!-- 确定 -->
                </template>
              </div>
            </div>
            <div class="full-width bet-foot-save">
              <!--保留这些选项-->
              <div class="full-width cursor-pointer bet-save-items" @click.stop="bet_this.save_bet_items">
                {{ $root.$t('bet.save_item') }}
              </div>
            </div>
          </template>
        </template>
        <template v-else>
          <template v-if="bet_this.bet_fail_flag">
            <div class="bet-fail-message fail-message text-center">
              <template v-if="bet_this.view_ctr_obj.order_confirm_complete == 3">
                <!--投注失败-->
                {{ $root.$t('bet.bet_fail') }}
              </template>
              <template v-else>
                <!--部分投注失败-->
                {{ $root.$t('bet.bet_part_fail') }}
              </template>
            </div>
          </template>
          <template v-if="bet_this.bet_flag">
            <q-separator class="bet-mix-separator"></q-separator>
            <!--投注总额及预计收益 -->
            <div class="full-width pt15">
              <div class="row bet-total">
                <!-- 总投注 -->
                <div class="col bet-total-left">
                  {{ $root.$t('bet.total_bet') }}
                  <template v-if="bet_this.bet_total_count > 0">
                    {{ bet_this.bet_total_count }}
                  </template>
                </div>
                <div class="col-auto bet-total-right">
                  {{ bet_this.bet_total_money || format_currency }}
                </div>
              </div>
              <div class="row bet-total">
                <!-- 预计总收益 -->
                <div class="col bet-total-left">
                  {{ $root.$t('bet.total_income') }}
                </div>
                <div class="col-auto bet-total-right bet-gold-text">
                  {{ bet_this.bet_total_win_money || format_currency }}
                </div>
              </div>
              <q-separator class="bet-mix-separator"></q-separator>
              <!--提示区域 您所选择的盘口、赔率或有效性已经发生了变化-->
              <div class="bet-message text-center">
                <template v-if="bet_this.vx_get_bet_list.length < bet_this.vx_get_mix_min_count">
                  <!--至少选择2场比赛-->
                  {{ $root.$t("bet.bet_min_item").replace('%s', bet_this.vx_get_mix_min_count) }}
                </template>
                <template v-else-if="bet_this.vx_get_bet_list.length > bet_this.vx_get_mix_max_count">
                  {{ $root.$t("bet.bet_max_item").replace('%s', bet_this.vx_get_mix_max_count) }}
                </template>
                <template v-else>
                  <!--错误提示-->
                  {{ bet_this.view_ctr_obj.error_message }}
                </template>
              </div>
              <!--投注部分及取消-->
              <div class="row bet-buttons">
                <!--接受变化accept_hanlde-->
                <div v-if="bet_this.accept_button_show" class="full-width cursor-pointer bet-accpet"
                  @click.stop="bet_this.submit_handle('accept')">
                  {{ $root.$t('bet.accept_change_bet') }}
                  <!-- 接受变化并投注 -->
                </div>
                <div class="full-width" v-else-if="bet_this.bet_confirm_show">
                  <div class="full-width cursor-pointer bet-submit" @click.stop="bet_this.submit_confirm">
                    <!-- 确定 -->
                    {{ $root.$t('common.confirm') }}
                  </div>
                </div>
                <div class="full-width"
                  v-else-if="!bet_this.bet_confirm_show && !['0400483'].includes(bet_this.view_ctr_obj.error_code)">
                  <!--串关所有的金额都是空的时候或者金额不在限额范围内，或者不能够串关则按钮为灰色-->
                  <div class="full-width cursor-pointer bet-submit" :class="{
                    'bet-submit2': bet_this.show_invalid_btn ||
                      bet_this.show_valid_btn ||
                      bet_this.vx_get_bet_list.length < bet_this.vx_get_mix_min_count ||
                      bet_this.vx_get_bet_list.length > bet_this.vx_get_mix_max_count ||
                      bet_this.has_disable_item ||
                      ['0400477', '0400478'].includes(bet_this.view_ctr_obj.error_code)
                  }" :id="DOM_ID_SHOW && `but-bet-single-submit`" @click.stop="bet_this.submit_handle('submit')">
                    <!--一下错误码显示确定按钮点击可以二次发起请求-->
                    <template
                      v-if="view_ctr_obj.compute_show_xxx()">
                      <!-- 确定 -->
                      {{ $root.$t('common.confirm') }}
                    </template>
                    <template v-else>
                      <!--串关投注-->
                      {{ $root.$t('common.betting') }}
                    </template>
                  </div>
                </div>
                <div class="full-width"
                  v-else-if="!bet_this.bet_confirm_show && ['0400483'].includes(bet_this.view_ctr_obj.error_code)">
                  <!--串关所有的金额都是空的时候或者金额不在限额范围内，或者不能够串关则按钮为灰色-->
                  <div class="full-width cursor-pointer bet-submit" :class="{
                    'bet-submit2': bet_this.show_invalid_btn ||
                      bet_this.show_valid_btn ||
                      bet_this.vx_get_bet_list.length < bet_this.vx_get_mix_min_count ||
                      bet_this.vx_get_bet_list.length > bet_this.vx_get_mix_max_count ||
                      bet_this.has_disable_item ||
                      ['0400477', '0400478'].includes(bet_this.view_ctr_obj.error_code)
                  }" :id="DOM_ID_SHOW && `but-bet-single-submit`" @click.stop="bet_this.go_history">
                    <!--一下错误码显示确定按钮点击可以二次发起请求-->
                    <template v-if="['0400483'].includes(bet_this.view_ctr_obj.error_code)">
                      <!-- 确定 -->
                      {{ $root.$t('common.betting_history') }}
                    </template>
                  </div>
                </div>
                <div class="full-width">
                  <div class="full-width cursor-pointer bet-delete-all"
                    :class="{ 'bet-delete-all2': bet_this.bet_loadding, 'bet-delete-over': bet_this.bet_delete_over }"
                    @click.stop="bet_this.cancel_handle" @mouseover="bet_this.bet_delete_over = true"
                    @mouseout="bet_this.bet_delete_over = false">
                    <!--  移除所有投下注 -->
                    {{ $root.$t('bet.remove_all') }}
                    &nbsp;
                    <icon name="icon-del" class="bet-del" />
                    <!-- 取消 -->
                  </div>
                </div>
              </div>
            </div>
            <template v-if="bet_this.vx_get_bet_list.length > 0">
              <!--底部菜单部分-->
              <div class="full-width bet-foot-menu">
                <div class="row check-bet-prefer cursor-pointer" :class="{ 'checked': bet_this.user_bet_prefer }"
                  @click.stop="bet_this.toggle_bet_prefer">
                  <!--用户选择喜好的菜单-->
                  <check-box :checked="bet_this.user_bet_prefer" /> {{ $root.$t('bet.bet_auto_msg_1') }}
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <!--提示区域 您所选择的盘口、赔率或有效性已经发生了变化 -->
            <div class="bet-confirm-message  text-center yb-fontsize12" :id="DOM_ID_SHOW && `but-bet-single-ok`" :class="{
              'bet-success-order': (bet_this.view_ctr_obj.order_confirm_complete == 2),
              'bet-fail-order': [3, 4].includes(bet_this.view_ctr_obj.order_confirm_complete),
              'yn-message': ['ad', 'vi', 'th'].includes(lang)
            }">
              <template v-if="[1, 4].includes(bet_this.view_ctr_obj.order_confirm_complete)">
                <!--订单需要系统审核,请关注投注记录-->
                {{ $root.$t('bet.bet_order_info1') }}
              </template>
              <template v-else-if="bet_this.view_ctr_obj.order_confirm_complete == 2">
                <!--您的订单已确认-->
                {{ $root.$t('bet.bet_order_info2') }}
              </template>
              <template v-else-if="bet_this.view_ctr_obj.order_confirm_complete == 3">
                <!--投注失败-->
                {{ $root.$t('bet.bet_order_info3') }}
              </template>
            </div>
            <div class="full-width bet-foot-complete"
              :class="{ 'mt10': [2, 3, 4].includes(bet_this.view_ctr_obj.order_confirm_complete) }">
              <div class="full-width cursor-pointer"
                :class="{ 'bet-complete': bet_this.bet_loadding, 'bet-confirm': !bet_this.bet_loadding }"
                @click.stop="bet_this.complete_handle" v-if="bet_this.bet_complete_show">
                <template v-if="bet_this.bet_loadding">
                  <!--投注确认中-->
                  <span class='bet-confirming'>{{ $root.$t('bet.bet_loading') }}</span><q-spinner-dots size="16"
                    style="color:#FFF"></q-spinner-dots>
                </template>
                <template v-else>
                  {{ $root.$t('common.confirm') }}
                  <!-- 完成 -->
                </template>
              </div>
            </div>
            <div class="full-width bet-foot-save mb10">
              <!--保留这些选项-->
              <div class="full-width cursor-pointer bet-save-items" @click.stop="bet_this.save_bet_items">
                {{ $root.$t('bet.save_item') }}
              </div>
            </div>
          </template>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>

import { ref, onMounted } from "vue"
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import BetData from "src/core/bet/class/bet-view-data-class.js";


const props = defineProps({
  // 投注记录组件this
  bet_recode_this: Object,
  bet_custom_id:String
})
const view_ctr_obj =  BetData.get_bet_view_data_obj_by_bet_custom_id(props.bet_custom_id)
//是否失效
const lock_btn = ref(false)

onMounted(() => {
  useMittEmit(MITT_TYPES.EMIT_BTN_CHANGE, set_lock_btn())
})

/*** @description: 设置按钮失效
   * @param {boolean} value 是否锁定
   * @return {undefined} undefined
  */

const set_lock_btn = value => {
  lock_btn = value;
}


  // computed: {
  //   ...mapGetters({
  //     // 是否为单关投注
  //     vx_is_bet_single: "is_bet_single",
  //     // 菜单是否改变
  //     vx_get_menu_change: "get_menu_change",
  //     // 左侧布局
  //     vx_layout_left_show: "get_layout_left_show",
  //     //预约数据
  //     vx_get_bet_appoint_obj: "get_bet_appoint_obj",
  //     lang: "get_lang"
  //   })
  // },

  // beforeUnmount() {
    //按钮失效
    // $root.$off(MITT_TYPES.EMIT_BTN_CHANGE, set_lock_btn)
  // }
// };
</script>