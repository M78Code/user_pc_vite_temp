

<template>

    <div v-show="false">  {{BetData.bet_data_class_version}}-{{BetViewDataClass.bet_view_version}}-{{BetViewDataClass.error_code}}-{{BetViewDataClass.error_message}}-{{UserCtr.user_version}}</div>
    
    <!-- 自动接受更好的赔率 -->
    <div class="accept" :class="BetData.bet_is_accept ? 'active':'' " @click="set_bet_is_accept()" v-if="BetViewDataClass.bet_order_status == 1">
        自动接受更好的赔率
    </div>
   <div class="f-e-c bet-submit" v-if="BetViewDataClass.bet_order_status == 1">
        <div class="bet-silider">
            <q-page-sticky ref="silider" position="bottom-left" :offset="fab_pos">
                <div class="jiantou" :disable="dragging_fab" v-touch-pan.right.prevent.mouse="handle_silider">
                    <img :src="compute_local_project_file_path('/image/bet/right-arrow.svg')" alt="" draggable="false">
                </div>
            </q-page-sticky>
        </div>

        <div v-show="!BetData.is_bet_single" class="bet-single del">
          <img :src="compute_local_project_file_path('/image/svg/delete5.svg')" alt="">
        </div>

        <div class="bet-box-line">
          <div class="middle font16">
            {{ i18n_t('bet.betting') }}
            <span class="yb-info-money font14">
            {{ i18n_tc('app_h5.bet.bet_win',BetData.bet_amount,{"total":BetData.bet_amount}) }}</span>
          </div>
          <img :src="compute_local_project_file_path('/image/gif/roll-right.gif')" alt="">
        </div>
        

        <div @click="set_bet_single" class="bet-single f-c-c font500" :class="BetData.is_bet_single ? 'font14':'font16'">
          <p>{{ BetData.is_bet_single ? '单关投注':'+串' }}</p>
        </div>
    </div>

    <!-- 投注后 -->
    <div v-else>
      <!--  单关 -->
      <div v-if="BetData.is_bet_single" @click="set_confirm" class="sub">确认</div>
      <!--  串关  -->
      <div v-else>
        <div @click="set_confirm" >注单已确认 <span>合计17,650.00</span></div>
        <div @click="set_retain_selection">保留选项，继续投注</div>
      </div>

    </div>
    
</template>

<script setup>
import lodash_ from "lodash"
import { onMounted, ref } from "vue"
import BetData from 'src/core/bet/class/bet-data-class.js'
import BetViewDataClass from 'src/core/bet/class/bet-view-data-class.js'
import { submit_handle } from "src/core/bet/class/bet-box-submit.js"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import mathJs from 'src/core/bet/common/mathjs.js'
import { UserCtr ,format_money2,compute_local_project_file_path} from "src/output/index.js"
import { i18n_t,i18n_tc } from "src/boot/i18n.js"

let timer;
// 向右滑动投注
const fab_pos = ref([20, 23])
const dragging_fab = ref(false)
// 滑块组件数据
const silider = ref(null)

// 滑动投注
const handle_silider = (e) => {
  dragging_fab.value = e.isFirst !== true && e.isFinal !== true
  if (e.distance.x > 234 || e.isFinal) {
    reset_silider()
    return
  }
  // console.log('e', e, silider);
  if(e.distance.x > 180) {
    // 未投注之前 可以点击
    if(BetViewDataClass.bet_order_status == 1){
      submit_handle()
    }
    reset_silider()
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
  BetData.set_is_bet_single()
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
.sub{
  width: calc(100% - 0.1rem);
  background: var(--q-gb-t-c-1);
  margin-left: 0.05rem;
  padding: 0.1rem 0;
  text-align: center;
  margin-top: 0.05rem;
  border-radius: 0.12rem;
  font-size: 0.16rem;
  color: var(--q-gb-t-c-14);
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
    margin: .08rem 0;
		text-indent: .3rem;
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
    width: 100%;
    height: .5rem;
    border-radius: 30px;
    background: linear-gradient(358deg, #179CFF 1.96%, #45B0FF 98.3%);
    box-shadow: 0px 2px 12px 0px rgba(0, 174, 255, 0.10);
    .middle {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: .55rem;
      color: var(--q-gb-bg-c-15);
    }
    img {
      width: 0.5rem;
    }
  }
  .bet-single{
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: #E8F5FF;
    color: var(--q-gb-t-c-1);
    padding: .03rem 0.1rem;
    text-align: center;
    line-height: 16px;
    margin-left: .08rem;
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