

<template>

    <div v-show="false">{{BetData.bet_data_class_version}}-{{BetViewDataClass.bet_view_version}}-{{BetViewDataClass.error_code}}-{{BetViewDataClass.error_message}}-{{UserCtr.user_version}}</div>
    
    <!-- 自动接受更好的赔率 -->
    <div class="accept" :class="!BetData.bet_is_accept ? 'active':'' " @click="set_bet_is_accept()" v-if="BetViewDataClass.bet_order_status == 1">
        自动接受更好的赔率
    </div>
   <div class="f-e-c bet-submit" v-if="BetViewDataClass.bet_order_status == 1">
        <div class="bet-silider">
            <q-page-sticky ref="silider" position="bottom-left" :offset="fab_pos">
                <div class="jiantou" :class="{'disabled-silider-bg': set_special_state(BetData.bet_data_class_version)}" :disable="dragging_fab" v-touch-pan.right.prevent.mouse="handle_silider">
                    <img v-if="!set_special_state(BetData.bet_data_class_version)" :src="compute_local_project_file_path('/image/bet/right-arrow.svg')" alt="" draggable="false">
                    <img v-else :src="compute_local_project_file_path('/image/bet/right-arrow1.svg')" alt="" draggable="false">
                </div>
            </q-page-sticky>
        </div>

        <div v-show="!BetData.is_bet_single" class="bet-single del" @click="BetData.set_clear_bet_info()&BetData.set_bet_box_h5_show(false)">
          <img :src="compute_local_project_file_path('/image/svg/delete5.svg')" alt="">
        </div>

     
        <div class="bet-box-line" :class="{'disabled-line': set_special_state(BetData.bet_data_class_version) }">
          <div class="middle font16">
            {{ i18n_t('bet.betting') }}
            <!-- 单关 -->
            <span class="yb-info-money font14" v-if="BetData.is_bet_single"> {{ i18n_tc('app_h5.bet.bet_win',{"total": bet_win_money(BetData.bet_data_class_version) }) }}</span>
            <span class="yb-info-money font14" v-else>{{ i18n_t('bet.sum') }}{{bet_total(BetViewDataClass.bet_view_version) }}</span>
          </div>
          <!-- <img :src="compute_local_project_file_path('/image/gif/roll-right.gif')" alt=""> -->
          <img :src="compute_local_project_file_path('/image/bet/roll-right-arrow.png')" alt="">
        </div>

        <!-- 串关 -->
        
        <div @click="set_bet_single" class="bet-single f-c-c font500" :class="{'disabled': MenuData.is_kemp(),'font16':BetData.is_bet_single,'font14':!BetData.is_bet_single, }">
          <p>{{ !BetData.is_bet_single ? '单关投注':'+串' }}</p>
        </div>
    </div>

    <!-- 投注后 -->
    <div v-else>
      <!--  单关 -->
      <div v-if="BetData.is_bet_single" @click="set_confirm" class="sub font500">确认</div>
      <!--  串关  -->
      <div v-else>
        <div @click="set_confirm" class="sub">注单已确认 <span class="sub-total">合计{{bet_total(BetViewDataClass.bet_view_version)}}</span></div>
        <div @click="set_retain_selection" class="reserve font500">保留选项，继续投注</div>
      </div>

    </div>
    
</template>

<script setup>
import lodash_ from "lodash"
import { computed, onMounted, reactive, ref } from "vue"
import BetData from 'src/core/bet/class/bet-data-class.js'
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import { submit_handle } from "src/core/bet/class/bet-box-submit.js"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import mathJs from 'src/core/bet/common/mathjs.js'
import { UserCtr ,format_money2,compute_local_project_file_path,MenuData} from "src/output/index.js"
import { odds_table } from "src/core/constant/common/module/csid.js"
import { i18n_tc } from "src/boot/i18n.js"

let timer;
// 向右滑动投注
const fab_pos = ref([20, 23])
const dragging_fab = ref(false)
// 滑块组件数据
const silider = ref(null)

const ref_data = reactive({
  is_bet_single: true,
  show_title: ''
})

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
  // 计算出合计金额
  return format_money2(bet_total_money)
})

// status 是响应式的 可以用于重新计算
const set_special_state = computed(()=> status => {
  let bet_list = []
  if( BetData.is_bet_single ) {
    bet_list = lodash_.cloneDeep(BetData.bet_single_list)
  } else {
    bet_list = lodash_.cloneDeep(BetData.bet_s_list)
  } 

  for(let item of  bet_list) {
    // 盘口已关闭 盘口关闭不允许投注
    if(item.ol_os != 1 || item.hl_hs != 0 || item.mid_mhs != 0){
      ref_data.show_title = "盘口已关闭"
      // 不允许投注
      ref_data.is_bet_single = false
      return true
    }
    // 当前投注项中混入不能串关的投注项
    if(item.is_serial){
      // 不允许投注
      ref_data.is_bet_single = false
      return true
    }
  }
})





// 滑动投注
const handle_silider = (e) => {
  // 不允许投注
  if(!ref_data.is_bet_single) {
    return
  }
  dragging_fab.value = e.isFirst !== true && e.isFinal !== true
  // 拖拽超过滑板或放开重置silider位置 255 235
  if(e.isFinal && e.distance.x < 255) {
    reset_silider()
    return
  }
  if(e.distance.x >= 255 && e.isFinal) {
    // 未投注之前 可以点击
    if(BetViewDataClass.bet_order_status == 1){
      submit_handle()
    }
    reset_silider()
  }
  if (e.isFinal || e.distance.x > 256) {
    reset_silider()
    return
  }
  fab_pos.value[0] = e.distance.x
  silider.value.offset[0] = e.distance.x
}

// 重置solider位置
const reset_silider = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    init_silider_position()
  }, 300)
}

// 滑块初始化坐标
// 处理单关和串关投注的silider位置
const init_silider_position = () => {
  let offset = lodash_.get( silider,'value',{})
  if(offset?.offset){
    if(BetData.is_bet_single) {
      fab_pos.value[0] = 20
      offset.offset[0] = 20
    } else {
      fab_pos.value[0] = 77
      offset.offset[0] = 77
    }
    silider.value = offset
  }
}

// 自动接受更好的赔率
const set_bet_is_accept = () => {
    let state = !BetData.bet_is_accept
    BetData.set_bet_is_accept(state)
}

// 投注模式切换
const set_bet_single = () => {
  // 冠军没有串关
  if(MenuData.is_kemp()){
    return
  }
  BetData.set_bet_box_h5_show(false)
  BetData.set_is_bet_single()
  BetData.set_clear_bet_info()
  BetViewDataClass.set_clear_bet_view_config()

  // 电竞vr切换 单/串关 不跳转和设置一级菜单
  if(MenuData.is_esports() || MenuData.is_vr()){
    // 后续优化逻辑 
  }else{
    // 切换到串关 进入到串关页面 
    if(BetData.is_bet_single){
      MenuData.set_current_lv1_menu(2);
    }

    // 切换到串关 进入到串关页面 
    if(!BetData.is_bet_single){
      MenuData.set_current_lv1_menu(6);
    }
  }
  
  init_silider_position()
}

// 保留投注项
const set_retain_selection = () => {
    BetViewDataClass.set_bet_order_status(1)
    BetData.set_bet_amount(0)
    BetViewDataClass.set_bet_before_message({})
    BetViewDataClass.set_is_finally(true)
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
}

onMounted(()=>{
  init_silider_position()
})

</script>

<style scoped lang="scss">
  @import "../css/bet.scss";
</style>

<style scoped lang="scss">
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
  font-family: PingFang SC;
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
		text-indent: .24rem;
		background: url($SCSSPROJECTPATH+"/image/bet/select_b.svg") no-repeat left / contain;
  }
	.active {
		background-image: url($SCSSPROJECTPATH+"/image/bet/select_fuke.svg");
	}
  .jiantou{
    height: 0.44rem;
    width: 0.44rem;
    border-radius: 50%;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--q-gb-t-c-1);
    font-size: 0.2rem;
    border: 3px solid #50B5FF;
    margin-right: -.2rem;
    &.disabled-silider-bg {
      background: rgba(255, 255, 255, 0.96);
      border-color: rgba(201, 205, 219, 0.8);
      img {
        fill: rgba(201, 205, 219, 0.8);
      }
    }
  }

  .bet-silider{
    height: .44rem;
    position: relative;
  }

  .bet-submit{
    width: 100%;
    height: .5rem ;
    justify-content: space-between;
    margin-top: 0.08rem;
  }

  .del {
    padding: 0 .25rem !important;
    margin-left: 0 !important;
    margin-right: .08rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bet-box-line{
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: .5rem;
    border-radius: 30px;
    background: linear-gradient(358deg, #179CFF 1.96%, #45B0FF 98.3%);
    box-shadow: 0px 2px 12px 0px rgba(0, 174, 255, 0.10);
    
    &.disabled-line {
      background: #C9CDDB;
    }
    .middle {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: .55rem;
      color: var(--q-gb-bg-c-15);
    }
    // img {
    //   width: 0.5rem;
    // }
    img {
      width: 0.4rem;
      height: 0.16rem;
    }
  }
  .bet-single{
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--q-gb-bg-c-31);
    color: var(--q-gb-t-c-1);
    padding: .03rem 0.1rem;
    text-align: center;
    line-height: 16px;
    margin-left: .08rem;
    &.disabled{
      background: var(--q-gb-bg-c-18);
      color: var(--q-gb-t-c-19);
    }
    p {
      width: 0.34rem;
    }
  }
//后续删掉
  .bet-betting{
    width: 1.2rem;
    background: var(--q-gb-bg-c-19);
    color: var(--q-gb-t-c-1);
    height: 100%;
  }
</style>