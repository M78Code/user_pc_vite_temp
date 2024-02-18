<!--
 * 老虎机组件
 * @Author: Echo
 * @Date: 2022-03-02 11:57:09
-->
<template>
  <div class="number-scroll" :style="`width:${config.col_width * config.col}px !important;height:${config.col_height}px !important;`">
    <!-- 老虎机列 -->
    <div
      class="col-item"
      v-for="col in config.col"
      :key="col"
      :style="`width:${config.col_width}px !important;height:${config.col_height}px !important;`"
    >
      <!-- 老虎机行 -->
      <div
        class="row-item"
        :class="'row-item-'+row"
        v-for="row in config.row"
        :key="row"
        :style="`width:${config.item_width}px !important;height:${config.item_height}px !important;top:${(config.col_height - config.item_height) / 2}px;transform: translateY(${position_obj[col+'_'+row].top}px);`"
      ></div>
    </div>
    <!-- 老虎机停止时的音效 -->
    <audio :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/slot_machine/media/num_scroll_stop.mp3`" ref="num_scroll_stop"></audio>
  </div>
</template>

<script>
import { LOCAL_COMMON_FILE_PREFIX } from "project_path/src/core/index.js";
export default {
  props:{
    // 老虎机配置
    config: {
      type: Object,
      default(){
        return {
          // 老虎机列数
          col:4,
          // 老虎机行数
          row:10,
          // 每列宽度
          col_width:123,
          // 每列高度
          col_height:245,
          // 单个数字宽度
          item_width:120,
          // 单个数字高度
          item_height:124,
          // 初始数字
          init_number:[10,10,10,10],
          // 老虎机滚动速度 越大越快
          speed:100
        }
      }
    },
    // 老虎机状态 stop 停止 stopping 停止中 runing 运行中
    status: String,
    // 老虎机滚动结果
    result: Array,
    initArr: Array
  },
  data() {
    let position_obj = {}
    for(let col = 1; col <= this.config.col; col++){
      for(let row = 1; row <= this.config.row; row++){
        position_obj[col+'_'+row] = {
          top:0,
          map_top:0,
          speed:0,
        }
      }
    }
    return {
      // 每个数字位置对象
      position_obj,
      LOCAL_COMMON_FILE_PREFIX: LOCAL_COMMON_FILE_PREFIX
    }
  },
  watch:{
    // 监听老虎机状态变化
    status(res){
      if(res == 'runing'){
        this.start()
      }else if(res == 'stopping'){
        this.stop()
      }
    },
    initArr: {
      handler(n) {
        if(n.length == 0){
          return
        }
        let numbers = n.map(item => item > 0 ? item : 10)
        this.set_position_obj('init', numbers)
      },
      immediate: true,
      deep: true
    }
  },
  created(){
    this.stop_time = 0
    // 数字居中时和老虎机间距
    this.padding = (this.config.col_height - this.config.item_height) / 2
    // 所有数字总高度
    this.item_total_height = this.config.item_height * this.config.row
    this.set_position_obj('init')
  },
  methods: {
    /**
     * @Description 设置每个数字的位置
     * @param {undefined} undefined
    */
    set_position_obj(type, result){
      let row1_top
      let position_obj = {}
      for(let col = 1; col <= this.config.col; col++){
        // 1号数字位置
        row1_top = this.position_obj[col+'_1'].map_top
        row1_top += parseInt(this.position_obj[col+'_1'].speed * this.config.speed * 0.5) / 100
        for(let row = 1; row <= this.config.row; row++){
          position_obj[col+'_'+row] = position_obj[col+'_'+row] || {}
          let init_row;
          if (result) {
            init_row = result[col-1]
          } else {
            init_row = type == 'init' ? this.config.init_number[col-1] : 0
          }
          // 获取每个数字top值
          let top = this.get_item_top({ col, row, row1_top, init_row },position_obj)
          Object.assign(position_obj[col+'_'+row],top)
        }
      }
      _.merge(this.position_obj,position_obj)
    },
    /**
     * @Description 获取top值
     * @param {undefined} undefined
    */
    get_item_top(obj,position_obj){
      let { col, row, row1_top, init_row } = obj
      let { item_height } = this.config
      let map_top = 0

      // 如果是1号数字 并且不是初始化
      if(row == 1 && init_row == 0){
        map_top = row1_top
        if(map_top > this.item_total_height){
          map_top -= this.item_total_height
        }
      }
      // 如果是1号数字 并且是初始化
      else if(row == 1){
        map_top = item_height * (init_row - 1)
      }
      // 其他数字
      else{
        let pre_item = col+'_'+(row - 1)
        map_top = position_obj[pre_item].map_top - item_height
      }
      let top = map_top
      // 3个数字高度
      let item_height3 = item_height * 3
      let padding = this.padding
      if(map_top < -item_height3){
        top = map_top + this.item_total_height
      }
      if(map_top > item_height3){
        top = map_top - this.item_total_height
      }
      if(top < -(item_height + padding)){
        top = -(item_height + padding)
      }
      if(top > (item_height + padding)){
        top = (item_height + padding)
      }
      return {map_top,top}
    },
    /**
     * @Description 启动老虎机
     * @param {undefined} undefined
    */
    start(){
      // 老虎机启动时间
      this.start_time = new Date().getTime()
      clearInterval(this.timer_id)
      this.timer_id = setInterval(() => {
        this.set_speed()
        this.set_position_obj()
      },16)
    },
    /**
     * @Description 停止老虎机
     * @param {undefined} undefined
    */
    stop(){
      // 老虎机停止时间
      this.stop_time = new Date().getTime()
    },
    /**
     * @Description 强制停止 并复位
     * @param {undefined} undefined
    */
    force_stop(){
      clearInterval(this.timer_id)
      for(let col = 1; col <= this.config.col; col++){
        this.position_obj[col+'_1'].speed = 0
      }
      this.set_position_obj('init')
      this.$emit('stop')
    },
    /**
     * @Description 设置滚动速度
     * @param {undefined} undefined
    */
    set_speed(){
      let obj
      // 上一个对象
      let pre_obj = {speed:0}
      // 停止中
      if(this.status == 'stopping' && (new Date().getTime() - this.stop_time) > 1500){
        let is_all_stop = true
        for(let col = 1; col <= this.config.col; col++){
          obj = this.position_obj[col+'_1']
          let res = this.get_is_slow_speed(col,obj,pre_obj)
          // 播放音效
          if(res === 0 && obj.speed != 0){
            this.$refs.num_scroll_stop.load()
            this.$refs.num_scroll_stop.play()
          }
          if(res > 0){
            obj.speed -= 1
          }
          if(res == -1){

          }
          else if(res == 0){
            obj.speed = 0
          }
          // else if(res < 4 && obj.speed > 70){
          //   obj.speed = 70
          // }
          else if(res < 3 && obj.speed > 50){
            obj.speed = 50
          }
          else if(res < 2 && obj.speed > 40){
            obj.speed = 40
          }
          else if(res < 1 && obj.speed > 10){
            obj.speed = 10
          }
          // 减速最新速度为10
          if(obj.speed > 0 && obj.speed < 10){
            obj.speed = 10
          }
          if(obj.speed != 0){
            is_all_stop = false
          }
          pre_obj = obj
        }
        if(is_all_stop){
          clearInterval(this.timer_id)
          this.$emit('stop')
        }
      }
      // 运行中
      else{
        // 距离启动过去了多少时间
        let now_time = new Date().getTime() - this.start_time
        for(let col = 1; col <= this.config.col; col++){
          if((col - 1) * 300 < now_time){
            obj = this.position_obj[col+'_1']
            if(obj.speed < 100){
              // 初始速度最低5
              if(obj.speed < 5){
                obj.speed = 5
              }
              if(obj.speed > 20 ){
                obj.speed += parseInt(now_time / 5) / 100
              }else{
                obj.speed += parseInt(now_time / 10) / 100
              }
            }
          }
        }
      }
    },
    /**
     * @Description 获取是否可以减速
     * @param {undefined} undefined
    */
    get_is_slow_speed(col,obj,pre_obj){
      let result = this.result[col-1]
      result = result > 0 ? result : 10
      let result_top = this.config.item_height * (result - 1)
      let map_top = obj.map_top
      if(result_top < map_top){
        map_top = map_top - this.item_total_height
      }
      let dif = result_top - map_top
      // 速度小于30 并且 和目标距离误差2px 停止滚动
      if(obj.speed < 20 && Math.abs(dif) <= parseInt(10 * this.config.speed * 0.5) / 100){
        obj.map_top = result_top
        return 0
      }
      // 和上一列速度差  小于20
      if(pre_obj.speed > 20){
        return -1
      }
      if(dif > 0 && dif < this.config.item_height * 1){
        return 1
      }
      if(dif > 0 && dif < this.config.item_height * 2){
        return 2
      }
      if(dif > 0 && dif < this.config.item_height * 3){
        return 3
      }
      if(dif > 0 && dif < this.config.item_height * 4){
        return 4
      }
      return -1
    }
  },

};
</script>
<style lang="scss" scoped>
.number-scroll {
  display: flex;
  position: relative;
  &:after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    box-shadow: 0 10px 30px #000 inset, 0 -10px 60px #000 inset;
  }
  .col-item {
    position: relative;
    background-color: #fefefe;
    border: 2px solid rgb(0, 0, 0);
    overflow: hidden;
    &:before {
      content: "";
      position: absolute;
      width: 2px;
      top: 0;
      height: 100%;
      background-image: linear-gradient(
        180deg,
        #282623 0%,
        #ffffff 51%,
        #282623 100%
      );
    }
    &:after {
      content: "";
      position: absolute;
      width: 2px;
      right: 0;
      height: 100%;
      background-image: linear-gradient(
        180deg,
        #282623 0%,
        #ffffff 51%,
        #282623 100%
      );
    }
  }
  .row-item {
    position: absolute;
    left: 2px;
    background-size: 115px auto;
    background-image: var(--qq--activity-number-bg);
  }
  .row-item-1 {
    background-position: 4.5px 0;
  }
  .row-item-2 {
    background-position: 4.5px -115px;
  }
  .row-item-3 {
    background-position: 4.5px -230px;
  }
  .row-item-4 {
    background-position: 4.5px -345px;
  }
  .row-item-5 {
    background-position: 4.5px -460px;
  }
  .row-item-6 {
    background-position: 4.5px -575px;
  }
  .row-item-7 {
    background-position: 4.5px -690px;
  }
  .row-item-8 {
    background-position: 4.5px -805px;
  }
  .row-item-9 {
    background-position: 4.5px -920px;
  }
  .row-item-10 {
    background-position: 4.5px -1035px;
  }
}
</style>

