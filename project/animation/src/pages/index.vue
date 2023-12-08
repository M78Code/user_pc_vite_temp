<!-- 事件组件，必须参数： 赛种ID：sportId 赛事id：matchId 数据源：dataSourceCode -->
<template>
    <div class="row q-pa-lg" style="background: #1a1a1a;">
        <!-- <div class="col-12" @click="get_data_list" style="">拉取数据</div> -->
        <div class="col-6" style="height: 100vh;overflow: auto;">
            <timeline
                class="components-item" 
                :list="dataObj"
            />
            <BackendConfig />
        </div>
       <div class="col q-ml-sm" style="height: 100vh;overflow: auto;">
         <svg_area  @get_event_code="get_event_code" :svg_src="svg_src" :current_event_code="current_event_code" />
        <!-- <div
            v-for="(item, index) in dataObj"
            :key="index"
            class="content-list-item text-panda-text-light"
            style="margin:10px"
            :class="item.class"
          >
            <div class="content-list-item-circle"></div>
            <div class="content-list-item-time">
            </div>
            <div class="content-list-item-info">
              <span>
                {{ item.currentTime }}' - {{ item.eventName }}-{{ item.eventCode }}
              </span>
            </div>
        </div> -->
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
import BackendConfig from "project/animation/src/pages/components/backend_config.vue"
import _ from 'lodash';
import axios from "axios";
import { uid } from "quasar"
import { event_animation } from 'project/animation/src/globle/event.js'
let WEB_ENV = axios.prototype.WS_DOMAIN_FRNGKONG_1
export default defineComponent({
    components: {
        timeline,
        svg_area,
        BackendConfig,
    },
    mixins:[websocket_base],
 data() {
    // sportId=1&dataSourceCode=PA&matchId=2928959
    
    return {
        svg_src: '',
        current_event_code: '',
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
        }
    }
 },
 created() {
    console.warn(this.$route.query)
    let { sportId, matchId, dataSourceCode } = this.$route.query || {}
    console.warn(sportId)
    console.warn(matchId)
    console.warn(dataSourceCode)
    // 必须参数判断
    if(!sportId || !matchId || !dataSourceCode) {
        console.error('参数缺失')
    }else {
        this.get_query_params()
        this.websocket_connection_connect(1);
        console.warn(this.websocket_connection_connect)
        this.get_data_list()
    }
    
 },
 methods: {
    set_websocket_data(data) {
        // console.warn('页面接收到消息')
        // console.warn(data)
        console.log(/\{/.test(data.data))
        if (/\{/.test(data.data)) {
           let convert_data = JSON.parse(data.data);
           let { command, responseData,ack,msgId } = convert_data;
           if (command === 30013) {
            this.dataObj.unshift(responseData)
           }
        }
    },
    // 获取query参数
    get_query_params() {
        let { sportId, matchId, dataSourceCode } = this.$route.query || {}
        this.queryParams = {
            sportId,
            matchId,
            dataSourceCode
        }
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
    // 生成随机事件
    get_event_code() {
        let index = Math.floor(Math.random()*5)
        console.warn(index)
        let data_ = test_data[index] 
      const {eventCode} = data_ || {}
      this.current_event_code = eventCode
        this.svg_src = (event_animation[eventCode] || {}).animation_svg_path
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
</style>