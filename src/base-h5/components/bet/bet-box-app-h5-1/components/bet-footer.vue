

<template>

  <div v-show="false">{{BetData.bet_data_class_version}}-{{BetViewDataClass.bet_view_version}}-{{BetViewDataClass.error_code}}-{{BetViewDataClass.error_message}}-{{UserCtr.user_version}}</div>
  
  <!-- 自动接受更好的赔率 -->
  <div class="accept" :class="UserCtr.user_bet_prefer == 1 ? 'active':'' " @click="set_bet_is_accept()" v-if="BetViewDataClass.bet_order_status == 1">
      自动接受更好的赔率 
  </div>

  <div class="f-e-c bet-submit" v-if="BetViewDataClass.bet_order_status == 1">

    <div v-if="!BetData.is_bet_single" class="bet-single del" @click="BetData.set_clear_bet_info()&BetData.set_bet_box_h5_show(false)">
      <img :src="compute_local_project_file_path('/image/svg/delete5.svg')" alt="">
    </div>

    <div class="bet-silider_1" ref="bet_silder" :class="{'disabled-line': set_special_state(BetData.bet_data_class_version) }">

      <!-- <q-slider class="bet-box-line" @pan="change_slider_model" v-model="ref_data.basic_model" :inner-min="8" :inner-max="92" :min="0" :max="100"/> -->
      <div class="bet-box-line">
        <div class="bet-box" ref="bet_silder_box" :style="{left:ref_data.basic_model/100+'rem'}"></div>
      </div>
      <div class="bet-info f-b-c">
        <div class="middle font16" v-if="!set_special_state(BetData.bet_data_class_version)">
          {{ i18n_t('bet.betting') }}
          <!-- 单关 -->
          <span class="yb-info-money font14" v-if="BetData.is_bet_single"> {{ i18n_tc('app_h5.bet.bet_win',{"total": bet_win_money(BetData.bet_data_class_version) }) }}</span>
          <span class="yb-info-money font14" v-else>{{ i18n_t('bet.sum') }}{{bet_total(BetViewDataClass.bet_view_version) }}</span>
        </div>
        <div class="middle font16 ml-4" v-else>{{ i18n_t('bet.close') }}</div>
        <img :src="compute_local_project_file_path('/image/bet/roll-right-arrow.png')" alt="">
      </div>

    </div>
  
    <!-- 单关/串关 切换 -->
    <div @click="set_bet_single" class="bet-single f-c-c font600" :class="{'disabled': MenuData.is_kemp() || !is_bet_special,'font16':BetData.is_bet_single,'font14':!BetData.is_bet_single, }">
      <p v-if="!BetData.is_bet_single">单关投注</p>
      <div v-else class="bet-chuan"><div class="bet-add-icon" :style="compute_css_obj({ key: 'h5-strand-add-icon' })"></div> 串</div>
    </div>

  </div>

    <!-- 投注后 -->
    <div v-else>
      <!--  单关 -->
      <div v-if="BetData.is_bet_single" @click="set_confirm" class="sub font500">{{ i18n_t('app_h5.bet.confirm') }}</div>
      <!--  串关  -->
      <div v-else>
        <div @click="set_confirm" class="sub">{{ i18n_t('app_h5.bet.bet_confirm') }} <span class="sub-total">{{ i18n_t('bet.sum') }}{{bet_total(BetViewDataClass.bet_view_version)}}</span></div>
        <div @click="set_retain_selection" class="reserve font500">保留选项，继续投注</div>
      </div>

    </div>
    
</template>

<script setup>
import lodash_ from "lodash"
import { computed, onMounted, reactive, onUnmounted,ref } from "vue"
import BetData from 'src/core/bet/class/bet-data-class.js'
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import { submit_handle } from "src/core/bet/class/bet-box-submit.js"
import { useMittEmit, MITT_TYPES,useMittOn } from "src/core/mitt/index.js"
import mathJs from 'src/core/bet/common/mathjs.js'
import { UserCtr ,format_money2,compute_local_project_file_path,MenuData, compute_css_obj} from "src/output/index.js"
import { odds_table } from "src/core/constant/common/module/csid.js"
import { i18n_tc } from "src/boot/i18n.js"
import { useRoute,useRouter } from "vue-router"


const router = useRouter()

const bet_silder = ref('')
const bet_silder_box = ref('')

const ref_data = reactive({
  show_title: '',
  // 滑块初始值
  basic_model: 5,
  emit_lsit: {},
  // 第一次滑动 限频
  count: 0,
  // 串关/单关 滑动区域
  move_leng: 255,
  // 同上
  end_leng: 200,
  // 滑块启动位置
  bet_leng: 50,
})
// 是否可以投注
let is_bet_single = true
// 是否支持串关
let is_bet_special = true

onMounted(()=>{
  ref_data.emit_lsit = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_INIT_SLIDER_CONFIG, init_slider_config).off,
  }
  window.addEventListener('touchmove' ,set_touch_move_bet, { passive: false})

  window.addEventListener('touchend',set_touch_end_bet, {passive: false})
  window.addEventListener('resize',get_leng_px, {passive: false})
})

// 滑动监听
const set_touch_move_bet = event => {
  event.preventDefault();
  let fit = lodash_.get(event,'target.className','')
  get_leng_px()
  if(fit == 'bet-box'){
    let page_x = lodash_.get(event,'changedTouches[0].pageX',0)- ref_data.bet_leng
    if(page_x > 5 && page_x < ref_data.move_leng){
      ref_data.basic_model = page_x
    }
  }
}

// 减少渲染卡顿
requestAnimationFrame(() => {
  set_touch_move_bet(event)
}, 16)

let timer = null
// 滑动结束
const set_touch_end_bet = event => {
  // event.preventDefault();
  clearTimeout(timer)
  timer = setTimeout(() => {
    get_leng_px()
    let fit = lodash_.get(event,'target.className','')
    if(fit == 'bet-box' && ref_data.count < 1){
      ref_data.count++
      let page_x = lodash_.get(event,'changedTouches[0].pageX',0) - ref_data.bet_leng
      if( page_x < ref_data.end_leng){
        init_slider_config()
      } else {
        //  如果投注项有不允许投注的内容 提示 并且滑动到默认位置 
        if( !is_bet_single ) {
          init_slider_config()
          let text = '当前投注项不允许投注'
          useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, text);
        }else {
          // 未投注之前 可以点击
          if (BetViewDataClass.bet_order_status == 1){
            submit_handle()
          }
        }
      }
    }
  }, 50);
}

onUnmounted(() => {
  clearTimeout(timer)
  Object.values(ref_data.emit_lsit).map((x) => x());
  window.removeEventListener('touchmove',set_touch_move_bet)
  window.removeEventListener('touchend',set_touch_end_bet)
  window.removeEventListener('resize',get_leng_px)
})

// 投注验证失败 初始化滑块
const init_slider_config = () => {
  ref_data.basic_model = 5
  setTimeout(() => {
    ref_data.count = 0
  }, 50);
}

// 串关/单关 获取到限制的距离
const get_leng_px = () => {
  let wind_leng = window.outerWidth || lodash_.get(document,'body.clientWidth')
  let bet_leng = lodash_.get(bet_silder,'value.clientWidth')
  let silder_box = lodash_.get(bet_silder_box,'value.clientWidth') + 5

  // console.error('wind_leng',wind_leng,'bet_leng',bet_leng,'silder_box',silder_box,)
  // 设置 区块比例
  let cont_leng = bet_leng - 4 // 4 左右两边编剧
  // 47 是滑块的宽高 （47是宽高） 5 是初始位置 2.2 是滑块的2.2倍位置
  let wind_bet = wind_leng / 390
  ref_data.move_leng = ( cont_leng - silder_box ) / wind_bet
  ref_data.end_leng = ( cont_leng - silder_box * 2.2 ) / wind_bet

  if(BetData.is_bet_single){
    ref_data.bet_leng = silder_box
  } else {
    // 串关左侧有删除键 需要再往后50
    ref_data.bet_leng = silder_box * 2
  }
  // console.error('ref',ref_data)
}

// status 是响应式的 可以用于重新计算
const bet_win_money = computed(()=> status => {
  // 获取单关投注的数据
  const { bet_amount ='', oddFinally = '', odds_hsw = '' } = lodash_.get(BetData,'bet_single_list[0]',{})
  let bet_win = bet_amount
  // 香港赔 不用减去投注金额
  if(odds_hsw.includes(odds_table[UserCtr.odds.cur_odds]) && UserCtr.odds.cur_odds == 'HK' ){
    bet_win = 0
  }
  // 计算出可赢金额
  return format_money2(mathJs.subtract(mathJs.multiply(bet_amount,oddFinally), bet_win)) 
})

// status 是响应式的 可以用于重新计算
const bet_total = computed(()=> status => {
  // 获取串关投注的数据
  let bet_total_money = BetViewDataClass.bet_special_series.reduce((pre, cur) => {
    return pre*1 + (cur.bet_amount * cur.count || 0)*1;
  }, 0)
  
  // 串关 复刻串关
  if(BetViewDataClass.bet_order_status != 1 && !BetData.is_bet_single){
    bet_total_money = BetViewDataClass.orderNo_bet_single_obj.reduce((pre, cur) => {
      return pre*1 + (cur.seriesBetAmount || 0)*1;
    }, 0)

    bet_total_money = mathJs.divide(bet_total_money,100)
  }
  // 计算出合计金额
  return format_money2(bet_total_money)
})

// status 是响应式的 可以用于重新计算
const set_special_state = computed(()=> status => {
  is_bet_single = true
  is_bet_special = true
  let bet_list = []
  let is_repeat_match = false
  if( BetData.is_bet_single ) {
    bet_list = lodash_.cloneDeep(BetData.bet_single_list)
    let bet_obj = lodash_.get(bet_list,'[0]', {})
    // 单关 电竞赛事 不支持串关 串关切换按钮置灰
    if(!bet_obj.ispo && bet_obj.bet_type == 'esports_bet'){
      is_bet_special = false
    }
  } else {
    bet_list = lodash_.cloneDeep(BetData.bet_s_list)
    // 判断有没有相同的赛事 有则不能投注 false 没有 true 有
    is_repeat_match = lodash_.uniqBy(bet_list, 'matchId').length !== bet_list.length
    // 获取商户配置的 串关投注项
    let min_series = lodash_.get(UserCtr.user_info,'configVO.minSeriesNum',2)
    let man_series = lodash_.get(UserCtr.user_info,'configVO.maxSeriesNum',10)
    if(is_repeat_match) {
        is_bet_single = false
        return true
    }
    // 不能超过 用户设置的最大最小串关数量
    if(min_series > bet_list.length || man_series < bet_list.length){
      // 不允许投注
      is_bet_single = false
      return true
    }
   
  } 

  for(let item of  bet_list) {
    // 盘口已关闭 盘口关闭不允许投注
    // <!-- 投注项状态 1：开 2：封 3：关 4：锁 -->
    // <!-- 盘口状态，玩法级别 0：开 1：封 2：关 11：锁 -->
    // <!-- 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态） -->
    if([2,3].includes(item.ol_os*1) || [1,2].includes(item.hl_hs*1) || [1,2].includes(item.mid_mhs*1)){
      ref_data.show_title = i18n_t('bet.close')
      // 不允许投注
      is_bet_single = false
      return true
    }
    // 当前投注项中混入不能串关的投注项
    if(item.is_serial && !BetData.is_bet_single ){
      // 不允许投注
      is_bet_single = false
      return true
    }
  }
  return false
})

// 自动接受更好的赔率
const set_bet_is_accept = () => {
  let bet_prefer = UserCtr.get_user_bet_prefer()
  UserCtr.set_api_user_bet_prefer(bet_prefer == 1 ? 2 : 1)
}

// 投注模式切换
const set_bet_single = () => {
  // 冠军没有串关 电竞不支持串关的赛事 不切换
  if(MenuData.is_kemp() || !is_bet_special){
    return
  }
  
  BetData.set_is_bet_single()
  // 电竞vr切换 单/串关 不跳转和设置一级菜单
  if(MenuData.is_esports() || MenuData.is_vr()){
    BetData.set_clear_bet_info()
    BetViewDataClass.set_clear_bet_view_config()
    // 后续优化逻辑 
  }else{
    let menu_id = 2
    // 切换到串关 进入到串关页面 
    if(BetData.is_bet_single){
      BetData.set_clear_bet_info()
      BetViewDataClass.set_clear_bet_view_config()
      menu_id = 2
    }

    // 切换到串关 进入到串关页面 
    if(!BetData.is_bet_single){
      // 额额额 单关切换串关 需要把单关的数据 赋值给串关
      BetData.bet_s_list = lodash_.cloneDeep(BetData.bet_single_list)
      menu_id = 6
    }
    MenuData.set_current_lv1_menu(menu_id);
    MenuData.search_data_tab_index();//清除足球联赛缓存
    // 详情里面切换投注类型 
    router.push({ name: "matchList" });
    
  }

  BetData.set_bet_box_h5_show(false)
  
}

// 保留投注项
const set_retain_selection = () => {
    BetViewDataClass.set_bet_order_status(1)
    BetData.set_bet_amount(0)
    BetViewDataClass.set_bet_before_message({})
    BetViewDataClass.set_is_finally(true)
    if(!BetData.is_bet_single){
      // 清空串关类型 的投注金额
      return BetViewDataClass.set_clear_bet_special()
    }
    setTimeout(() => {
        useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
    }, 200);
}

// 清空投注项 和投注后的内容
const set_confirm = () => {
    BetViewDataClass.set_is_finally(true)
    BetData.set_clear_bet_info()
    BetViewDataClass.set_clear_bet_view_config()
    BetData.set_bet_box_h5_show(false)
    //电竞、VR串关投注成功后转为单关 并清空数据
    if(MenuData.old_current_lv_1_menu_i==6) {
      BetData.set_is_bet_single('single')
      BetData.set_clear_bet_info()
   }
}

</script>

<style scoped lang="scss">
  @import "../css/bet.scss";
</style>

<style scoped lang="scss">
.bet-chuan {
  display: flex;
  justify-content: space-between;
}
.bet-add-icon {
  width: 16px;
  height: 16px;
}
.reserve{
  width: calc(100% - 0.1rem);
  background: var(--q-gb-bg-c-22);
  margin-left: 0.05rem;
  padding: 0.1rem 0;
  text-align: center;
  margin-top: 0.1rem;
  border-radius: 0.12rem;
  font-size: 0.16rem;
  color: var(--q-gb-t-c-1);
}
.sub{
  width: calc(100% - 0.1rem);
  background: var(--q-gb-t-c-1);
  margin-left: 0.05rem;
  padding: 0.12rem 0;
  text-align: center;
  margin-top: 0.05rem;
  border-radius: 0.12rem;
  font-size: 0.16rem;
  color: var(--q-gb-t-c-14);
  
}
.sub-total{
  font-size: 0.14rem;
  color: rgba(255, 255, 255, 0.6);
}

.yb-info{
    background: linear-gradient(358deg, #179CFF 1.96%, #45B0FF 98.3%) !important;
    display: flex;
    justify-content: space-between;
    // padding-right: 0.26rem;
    border-radius: 0.7rem;
    color: var(--q-gb-t-c-14);
    font-size: 0.14rem;
    // padding-left: 0.08rem;
  }
  .yb-info-hui{
  background: var(--q-gb-t-c-5) !important;
  }
  .yb-info-money{
    color:rgba(255, 255, 255, 0.6);
    margin-left: 0.05rem;
  }
  
  .yb-info-one{
    color: var(--q-gb-t-c-6);
  }
  .yb-info-two{
    color: var(--q-gb-t-c-7);
  }
  .accept {
    color: var(--q-gb-t-c-11);
    margin: .08rem 0;
		text-indent: .18rem;
		background: url($SCSSPROJECTPATH+"/image/bet/select_b.svg") no-repeat left / .14rem;
  }
	.active {
		background-image: url($SCSSPROJECTPATH+"/image/bet/select_fuke.svg");
	}
  

  .bet-silider{
    height: .44rem;
    position: relative;
  }
  .bet-silider_1{
    position: relative;
    width: 100%;
    height: .5rem;
    border-radius: .3rem;
    background: linear-gradient(358deg, #179CFF 1.96%, #45B0FF 98.3%);
    box-shadow: 0rem .02rem .12rem 0rem rgba(0, 174, 255, 0.10);
    &.disabled-line{
      background: var(--q-gb-bg-c-45);
      box-shadow: 0 2px 12px rgba(0,0,0,.1);
      .bet-box-line{
        .bet-box{
          background: rgba(255, 255, 255, 0.96) url($SCSSPROJECTPATH+"/image/bet/right-arrow1.svg") center no-repeat;
          border: none;
          width: 0.4rem !important;
          height: 0.4rem !important;
          margin-top: .03rem;
        }
      }
      .bet-info{
        z-index: 100;
      }
    }
  }

  .bet-submit{
    width: 100%;
    height: .5rem ;
    justify-content: space-between;
    margin-top: 0.08rem;
    .bet-info{
      position: absolute;
      z-index: 22;
      top: 0;
      right: 0;
      height: 0.5rem;
      width: 100%;
     
      .middle {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: .55rem;
        font-size: 0.16rem;
        color: var(--q-gb-t-c-14);
      }
      img {
        width: 0.4rem;
        height: 0.16rem;
        margin-right: .16rem;
      }
    }
    .bet-box-line{
      position: relative;
      z-index: 99;
      width: 100%;
      height: 100%;

      .bet-box{
        height: 0.44rem !important;
        width: 0.44rem  !important;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--q-gb-t-c-1);
        font-size: 0.2rem;
        border: .03rem solid #50B5FF;
        margin-right: -.2rem;
        background: #FFFFFF url($SCSSPROJECTPATH+"/image/bet/right-arrow.svg") center no-repeat;
        position: absolute;
        top: .03rem;
      }
      :deep(.q-slider__track-container){
        padding: 0 !important;
      }

      :deep(.q-slider__thumb-shape){
        display: none !important;
      }
      :deep(.q-slider__thumb){
        height: 0.44rem !important;
        width: 0.44rem  !important;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--q-gb-t-c-1);
        font-size: 0.2rem;
        border: 0.03rem solid #50B5FF;
        margin-right: -.2rem;
        background: #FFFFFF url($SCSSPROJECTPATH+"/image/bet/right-arrow.svg") center no-repeat;
        z-index: 99;
      }

      :deep(.q-slider__track) {
        width: 100%;
        height: .5rem !important;
        border-radius: .3rem;
        background: linear-gradient(358deg, #179CFF 1.96%, #45B0FF 98.3%);
        box-shadow: 0rem .02rem .12rem 0rem rgba(0, 174, 255, 0.10);
      }

      :deep(.q-slider__selection){
        background: transparent !important;
      }
      :deep(.q-slider__inner){
        background: transparent !important;
      }
     
      &.disabled-line {
        background: #C9CDDB;
      }
    }
  }

  .del {
    padding: 0 .25rem !important;
    margin-left: 0 !important;
    margin-right: .08rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

 
  .bet-single{
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--q-gb-bg-c-31);
    color: var(--q-gb-t-c-1);
    padding: .03rem 0.1rem;
    text-align: center;
    line-height: .16rem;
    margin-left: .08rem;
    &.disabled{
      background: var(--q-gb-bg-c-18);
      color: var(--q-gb-t-c-19);
    }
    p {
      width: 0.34rem;
    }
  }
</style>