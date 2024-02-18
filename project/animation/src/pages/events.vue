<!-- 事件组件，必须参数： 赛种ID：sportId 赛事id：matchId 数据源：dataSourceCode -->
<template>
  <div>
    <div class="top">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md form"
        ref="form"
      >
        <span class="label">参数ID</span>
        <input
          v-model="name"
          label="参数ID"
        />
        <span class="label">数据源</span>
        <input
          v-model="name1"
          label="数据源"
        />
        <span class="label">token</span>
        <input
          v-model="token"
          label="token"
        />
        <q-btn label="启动" type="submit" color="primary" flat class="q-ml-sm"/>
        <q-btn label="停止"  color="primary" flat class="q-ml-sm" @click="pause" />
        <q-btn label="清空" type="reset" color="primary" flat class="q-ml-sm" />
      </q-form>
    </div>
    <div class="container">
      <div class="left">
        <div class="bg">
          <Svg3 :height="svgHeight" :width="svgWidth" v-if="isShowSvg1" />
<!--          <img ref="bgConainer" src="/public/animation/足球背景.png">-->
        </div>
        <div>11</div>
      </div>
      <div class="right">
        <div class="row q-pa-lg" style="background: #1a1a1a;">
          <div class="col-6" style="height: 100vh;overflow: auto;">
            <timeline
              class="components-item"
              :list="dataObj"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { api_event } from 'project/animation/src/public/api/index'
import { defineComponent } from 'vue'
import websocket_base from 'project/animation/src/mixins/modules/websocket/websocket_base.js'
import timeline from "project/animation/src/pages/components/timeline.vue"
import Svg1 from './svg1.vue'
import Svg2 from './svg2.vue'
import Svg3 from './svg3.vue'
import _ from 'lodash'
import axios from 'axios'
import { uid } from 'quasar'
let WEB_ENV = axios.prototype.WS_DOMAIN_FRNGKONG_1
import events from '../event.json'
export default defineComponent({
  components: {
    timeline,
    Svg1,
    Svg2,
    Svg3,
  },
  mixins: [websocket_base],
  data () {
    // sportId=1&dataSourceCode=PA&matchId=2928959
    return {
      isShowSvg1: true,
      websocket_connection_1_url: WEB_ENV,
      dataObj: events,
      queryParams: null,
      name: '',
      name1: '',
      token: '',
      svgWidth: 0,
      svgHeight: 0,
      params: {
        'needCommands': [
          // 30001,
          // 30003,
          30013
          // 30051
        ],
        'protocolVersion': 2,
        'uuid': uid()
      }
    }
  },
  created () {
    console.warn(this.$route.query)
    let { sportId, matchId, dataSourceCode } = this.$route.query || {}
    console.warn(sportId)
    console.warn(matchId)
    console.warn(dataSourceCode)
    // 必须参数判断
    if (!sportId || !matchId || !dataSourceCode) {
      console.error('参数缺失')
    } else {
      this.get_query_params()
      this.websocket_connection_connect(1)
      console.warn(this.websocket_connection_connect)
    }
  },
  mounted () {
    this.calc()
    window.addEventListener('resize', this.calc)
  },
  methods: {
    calc(){
      this.$refs.bgConainer.onload = () => {
        const {clientHeight,clientWidth} = this.$refs.bgConainer
        this.svgWidth = clientWidth
        this.svgHeight = clientHeight
      }
      this.$nextTick(() => {
        const {clientHeight,clientWidth} = this.$refs.bgConainer
        this.svgWidth = clientWidth
        this.svgHeight = clientHeight
      })
    },
    pause(){
      
    },
    onSubmit () {
      this.$refs.form.validate()
        .then(success => {
          if (success) {
            console.log(this.name, this.name1, this.token)
            this.isShowSvg1 = !this.isShowSvg1
            // yay, models are correct
          } else {
            // oh no, user has filled in
            // at least one invalid value
          }
        })
    },
    onReset () {
      this.name = ''
      this.name1 = ''
      this.token = ''
    },
    set_websocket_data (data) {
      console.warn('页面接收到消息')
      console.warn(data)
      console.log(/\{/.test(data.data))
      if (/\{/.test(data.data)) {
        let convert_data = JSON.parse(data.data)
        console.warn(convert_data)
        let { command, responseData, ack, msgId } = convert_data
        console.warn(responseData)
        if (command === 30013) {
          this.dataObj.unshift(responseData)
        }
      }
    },
    // 获取query参数
    get_query_params () {
      let { sportId, matchId, dataSourceCode } = this.$route.query || {}
      this.queryParams = {
        sportId,
        matchId,
        dataSourceCode
      }
    },
    // 获取ws请求参数
    get_ws_params () {
      let subscribe = {}
      this.params.needCommands.forEach(item => {
        let arr = []
        if (item == 30013) {
          arr = [{
            matchId: this.queryParams.matchId,
            dataSourceCode: this.queryParams.dataSourceCode
          }]
        } else {
          arr = [{
            sportId: this.queryParams.sportId,
            matchId: this.queryParams.matchId
          }]
        }
        subscribe[item] = arr
      })
      this.params.subscribe = subscribe
    },
    websockt_fn (which) {
      console.warn('WS连接成功')
      this.get_ws_params()
      this.websocket_send(this.params, which)
    },
    get_data_list (type) {
      console.warn('-=-=-=-=-')
      api_event.get_event_info(
        {
          'matchId': this.queryParams.matchId,
          'dataSource': this.queryParams.dataSourceCode,
          'limit': 500
        })
        .then(res => {
          let sus = _.get(res, 'data.code')
          let data = _.get(res, 'data.data.customizedEventBeanVoList') || []
          //   let map = _.get(res, "data.data.customizedEventBeanVoListMap") || {};
          //   let msg = _.get(res, "data.msg");
          if (sus == 200) {
            data.forEach(item => {
              let Mtime = Math.ceil(item.currentTime / 60) //秒数 显示分秒
              item.currentTime = Mtime
              if (Mtime < 10) { //分秒小于十分钟前面加0
                item.currentTime = '0' + Mtime
              }
            })
            if (type == 1) { // 直接获取数据
              this.dataObj = [...data]
            } else { // 加载更多
              this.dataObj = [...this.dataObj, ...data]
            }
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
})
</script>
<style lang="scss" scoped>
.top {
  margin-top: 20px;
  margin-bottom: 20px;
}

.form {
  display: flex;
  align-items: center;
}
.container{
  display: flex;
  .left{
    flex: 1;
    width: 800px;
    .bg{
      position: relative;
      img{
        width: 100%;
      }
      svg{
        position: absolute;
        top: 0;
        left: 0;
      }

      //background-image: url("/public/animation/足球背景.png");
      //background-repeat: no-repeat;
      //background-size: contain;
    }
  }
  .right{
    width: 700px;
    //flex: 1;
  }
}
</style>