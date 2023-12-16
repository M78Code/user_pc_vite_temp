<!-- 事件组件，必须参数： 赛种ID：sportId 赛事id：matchId 数据源：dataSourceCode -->
<template>
    <div style="background: #1a1a1a; border: 1px solid #1a1a1a">
        <div>
            <!-- 参数栏 <b class="text-red">xingxing</b> -->
          <top-form
            @submit="submit"
            @pause="pause"
            @reset="reset"
            @emitEvent="emitEvent"
            @emitPauseEvent="emitPauseEvent"
          />
        </div>
        <div class="row q-pa-lg">
            <!-- 左边 -->
            <div class="col-6">
                <!-- 动画 -->
                <div class="q-ml-sm">
                    <!-- <b class="text-red">足球动画区域（xingxing）</b> -->
                    <br>
                    <q-btn 
                        color="secondary" 
                        @click="get_event_code()" 
                        label="随机推送事件" 
                    />
                    <!-- <b class="text-blue">自动生成事件开启中。。。</b> -->
                    <svg_area :current_event_obj="current_event_obj" />
                </div>
                <!-- 比分 -->
                <div style="height: 100px;">
                    <!-- 赛事比分区域<b class="text-red">lowen</b> -->
                    <score-animation :params="queryParams" />
                </div>
                <!-- 对接后台展示区域 -->
                <div style="height: 100px;">
                    <!-- 对接后台展示区域<b class="text-red">freeze</b> -->
                </div>
            </div>
            <!-- 右边 -->
            <div class="col-6">
                <!-- 最新的2条事件 -->
                <div class="q-py-sm border-1">
                    <b class="text-red">最新的2条事件</b>
                    <timeline
                        class="components-item" 
                        :list="dataObj.slice(0,2)"
                    />
                </div>
                <!-- 全部事件 -->
                <div class="q-py-sm q-mt-sm border-1" style="height: calc(100vh - 240px); overflow: auto;">
                    <b class="text-red">全部事件</b>
                    <!-- <BackendConfig /> -->
                    <timeline
                        class="components-item" 
                        :list="dataObj"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { api_event } from "project/animation/src/public/api/index"
import { defineComponent } from "vue";
import websocket_base from "project/animation/src/mixins/modules/websocket/websocket_base.js"
import timeline from "project/animation/src/pages/components/timeline.vue"
import svg_area from "project/animation/src/pages/components/svg-area.vue"
import { test_data } from "project/animation/src/globle/event_data.js"
import event_json_data from "project/animation/src/globle/event.json"
import BackendConfig from "project/animation/src/pages/components/backend_config.vue"
import TopForm from "project/animation/src/pages/components/form.vue"
import ScoreAnimation from "project/animation/src/pages/components/score_animation.vue"
import _ from 'lodash';
import axios from "axios";
import { uid } from "quasar"
import { event_animation } from 'project/animation/src/globle/event.js'
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
let WEB_ENV = axios.prototype.WS_DOMAIN_FRNGKONG_1
export default defineComponent({
    components: {
        timeline,
        svg_area,
        TopForm,
        BackendConfig,
        ScoreAnimation
    },
    mixins:[websocket_base],
 data() {
    // sportId=1&dataSourceCode=PA&matchId=2928959
    
    return {
        current_event_obj: {},
        websocket_connection_1_url: WEB_ENV,
        dataObj: [],
        queryParams: null,
        params: {
            "needCommands": [
                // 30001,
                // 30003,
                30013,
                // 30051
            ],
            "protocolVersion": 2,
            "uuid": uid()
        },
        selfAddIndex: -1,
        autoEventTimer: null,
        moniEventTimer: null,
    }
 },
 created() {
 },
 methods: {
   // 启动
   submit(form){
     this.initSocket(form)
     useMittEmit(MITT_TYPES.EMIT_SHOW_SCORE,form)
   },
   // 停止
   pause(){
     this.set_timer(3)
     this.websocket_connection_close(1)
   },
   // 清空
   reset(){
    this.dataObj = []
   },
   // 模拟推送
   emitEvent(){
     this.emitPauseEvent()
     this.moniEventTimer = setInterval(() => {
       this.get_event_code(true)
     }, 1000)
   },
   // 暂停模拟推送
   emitPauseEvent(){
     clearInterval(this.moniEventTimer)
     this.moniEventTimer = null
   },
   // 初始化socket
   initSocket(form = {}){
    console.warn('------')
    console.warn(form)
    this.get_query_params(form)
    this.websocket_connection_connect(1);
    this.get_data_list()
   },
   // 获取query参数
   get_query_params(from) {
        let { sportId, matchId, dataSourceCode } = from
        this.queryParams = {
            sportId,
            matchId,
            dataSourceCode
        }
        console.warn(this.queryParams)
    },
    // 获取ws请求参数
    get_ws_params() {
        let subscribe = {}
        this.params.needCommands.forEach(item => {
            let arr = []
            if(item == 30013) {
                arr = [{
                    matchId: this.queryParams.matchId,
                    dataSourceCode: this.queryParams.dataSourceCode
                }]
            }else {
                arr = [{
                    sportId: this.queryParams.sportId,
                    matchId: this.queryParams.matchId
                }]
            }
            subscribe[item] = arr
        })
        this.params.subscribe = subscribe
    },
    websockt_fn(which) {
        console.warn('WS连接成功')
        this.get_ws_params()
        this.websocket_send(this.params, which)
    },
    get_data_list(type) {
        console.warn('-=-=-=-=-')
        api_event.get_event_info(
            {"matchId":this.queryParams.matchId,
            "dataSource":this.queryParams.dataSourceCode,
            "limit":500
        }).then(res => {
          let sus = _.get(res, "data.code");
          let data = _.get(res, "data.data.customizedEventBeanVoList") || [];
            //   let map = _.get(res, "data.data.customizedEventBeanVoListMap") || {};
            //   let msg = _.get(res, "data.msg");
            if(sus == 200) {
                data.forEach(item => {
                    let Mtime = Math.ceil(item.currentTime / 60); //秒数 显示分秒
                    item.currentTime = Mtime;
                    if (Mtime < 10) { //分秒小于十分钟前面加0
                    item.currentTime = "0" + Mtime;
                    }
                })
                if(type == 1){ // 直接获取数据
                    this.dataObj = [...data];
                }else { // 加载更多
                    this.dataObj = [...this.dataObj, ...data];
                }
            }
        }).catch(err => {
            console.error(err)
        })
    },


    // type 1 开始 2 结束
    set_timer(type) {
        if(type == 1) {
            this.set_timer(2)
            this.autoEventTimer = setInterval(()=> {
                this.get_event_code()
            },2000)
        }else {
            clearInterval(this.autoEventTimer)
            this.autoEventTimer = null
        }
    },
    set_websocket_data(data) {
        // console.warn('页面接收到消息')
        // console.warn(data)
        console.log(/\{/.test(data.data))
        if (/\{/.test(data.data)) {
           let convert_data = JSON.parse(data.data);
           let { command, responseData,ack,msgId } = convert_data;
           if (command === 30013) {
            this.current_event_obj = responseData || {}
            this.dataObj.unshift(responseData)
           }
        }
    },
    // 生成随机事件
    get_event_code(isFullMockData) {
        console.warn('自动获取生成时间')
      // let data_ = event_json_data[index]
        let index = Math.floor(Math.random()*5)
        let data_ = test_data[index] 
      if(isFullMockData){
        // 全量mock
        this.selfAddIndex++
        index = this.selfAddIndex
        const arr = event_json_data.reverse()
        data_ = arr[index]
      }
        const {eventCode} = data_ || {}
        this.current_event_obj = data_ || {}
        console.warn(data_)
        let ws_obj = {
            "ack": 0,
            "command": 30013,
            "globalId": "BG_0af508f320231206115740840017cca9df66",
            "msgId": "BG_0af508f320231206115740840017cca9df66",
            "responseData": data_,
            "time": new Date().valueOf()
        }
        let send = {
            "data": JSON.stringify(ws_obj)
        }
        this.set_websocket_data(send)
    },
},
})
</script>
<style lang="scss" scoped>
.components-item {
    max-width: 850px;
    // bug单 7658 要求这样做
    padding-left: 30px;
    // margin auto
}
.border-1 {
    border: 1px solid var(--q-color-panda-table-border);
}
</style>