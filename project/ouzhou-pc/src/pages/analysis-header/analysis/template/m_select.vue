<template>
  <div class="select-wrap">
    <div class="tab-menu">
      <span 
        v-for="(item,index) in typeData" 
        :key="index" 
        @click="select_option(index, 'typeSelected')"
        :class="{'active': typeSelected==index}">
        {{item}}
      </span>
    </div>

    <div class="selct-menu  relative-position" :class="{'open_select':time}">
      <div class="select-lable" @click="show_select('time')">
        <span class="label">{{timeData[timeSelected]}}</span>
        <span class="yb-icon-arrow"></span>
      </div>
      <div class="select-page">
        <div class="options-box"></div>
        <div class="options" 
          v-for="(item,index) in timeData" 
          :key="index" @click="select_option(index, 'timeSelected')"
          :class="{'selected': timeSelected==index}">{{item}}</div>
          <div class="options-box"></div>
      </div>
    </div>

    <!-- <div class="selct-menu" :class="{'open_select':type}">
      <div class="select-lable" @click="show_select('type')">
        <span class="label">{{typeData[typeSelected]}}</span>
        <span class="yb-icon-arrow"></span>
      </div>
      <div class="select-page">
        <div class="options" 
          v-for="(item,index) in typeData" 
          :key="index" @click="select_option(index, 'typeSelected')"
          :class="{'selected': typeSelected==index}">{{item}}</div>
      </div>
    </div> -->
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
export default {
  data() {
    return {
      time: false, 
      type: false,
      // 近期场数
      timeData:[],
      // 筛选类型
      typeData:[],
      timeSelected: 0,
      typeSelected: 0,
      timer:null
    };
  },
  computed:{
    // ...mapGetters(['get_global_click']),
  },
  watch:{
    // get_global_click(){
    //   this.time = false
    //   this.type = false
    // }
  },
  props:{
    name: String
  },
  created(){
    // 最近5场 最近10场 最近15场
    this.timeData = [i18n_t("analysis.record_clashes_1"),i18n_t("analysis.record_clashes_2"),i18n_t("analysis.record_clashes_3")]
    // '默认'，'同赛事','同主客','同赛事+同主客'
    this.typeData = [i18n_t("analysis.original"),i18n_t("analysis.same_game"),i18n_t("analysis.same_host_guest"),i18n_t("analysis.same_all")]
  },
  destroyed(){
          /**清除定时器 */
        if(this.timer) {
          clearTimeout(this.timer)
          this.timer =null
    }
    this.timeData = null;
    this.typeData = null;
  },
  methods: {
    /**
     * 选择查询的数据类型
     */
    select_option(index, type){
      this[type] = index
      let timeSelected = lodash.cloneDeep(this.timeSelected)
      this.$emit("click",{name: this.name, cps: timeSelected*5+5, flag: this.typeSelected})
      this.time = false;
    },
    /**
     * 展示下拉框
     */
    show_select(type){
      if(!this[type]){
          /**清除定时器 */
        if(this.timer) {
          clearTimeout(this.timer)
          this.timer =null
        }
        this.timer =setTimeout(()=>{
          this[type] = !this[type]
        },20)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.select-wrap {
  display: flex;
  align-items: center;
  .selct-menu {
    width: 160px;
    height: 24px;
    // border: 1px solid var(--qq--yb-border-color9);
    border: 1px solid #EBECF3;
    background: #ffffff;
    border-radius: 12px;
    cursor: pointer;
    &:first-child {
      margin-right: 10px;
    }
    .select-lable {
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      .yb-icon-arrow {
        transition: transform 0.3s;
        transform: rotate(90deg);
      }
    }
    .select-page {
      display: none;
      width: 160px;
     // border: 1px solid var(--qq--yb-border-color9);
      background: #ffffff;
      filter: drop-shadow(0 0 5px rgba(0, 0, 0, .3));
      position: absolute;
      border-radius:6px;
      z-index: 1;
      text-align: center;
      top: 40px;
      right: 0;
      &:before{
        content: '';
        width:0px;
        height: 0px;
        border: 10px solid ;
        position: absolute;
        top: -20px;
        border-color: transparent transparent #ffffff;
        z-index: 9;
        left: 70px;
      }
      &:after{
        content: "";
        width: 15px;
        height: 15px;
        position: absolute;
        // box-shadow: 0px 2px 8px 0px #E2E2E4;
        transform: rotate(128deg);
        top: -7px;
        z-index: 6;
        left: 70px;
      }
      .options {
        padding: 0 15px;
        cursor: pointer;
        position: relative;
        z-index: 19;
        background: #ffffff;
        &:hover,
        &.selected {
          color: #ff7000;
          background: #FF70000D;
        }
      }
      .options-box{
        position: relative;
        z-index: 19;
        width: 100%;
        background: #ffffff;
        height: 6px;
        border-radius: 12px;
      }
    }
    &.open_select {
      .yb-icon-arrow {
        transform: rotate(270deg);
      }
      .select-page {
        display: block;
      }
    }
  }
  .tab-menu {
    display: flex;
    span {
      line-height: 24px;
      min-width: 64px;
      text-align: center;
      padding: 0 8px;
      // border: var(--qq--yb-border-color9);
      border: 0.5px solid #EBECF3;
      background: #ffffff;
      cursor: pointer;
      margin-right: 10px;
      border-radius: 12px;
      font-family: PingFangSC-Regular;
      // 赛事分析那边设计的字体颜色是 --qq--theme-color-tab-item #555555/#A0A0A0
      // 未避免覆盖, 赛事分析处src\public\components\analysis\index.vue通过v-deep设置
      color: #1d1d1d;
      &.active {
        background-color: #ff7000 !important;
        // background-image: linear-gradient(225deg, var(--qq--background-gradient-color-1-s) 0%, var(--qq--background-gradient-color-1-e) 100%);
        color: #ffffff !important;
      }
    }
  }
}
</style>