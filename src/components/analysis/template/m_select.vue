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
        <div class="options" 
          v-for="(item,index) in timeData" 
          :key="index" @click="select_option(index, 'timeSelected')"
          :class="{'selected': timeSelected==index}">{{item}}</div>
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
import { mapGetters } from "vuex";
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
    ...mapGetters(['get_global_click']),
  },
  watch:{
    get_global_click(){
      this.time = false
      this.type = false
    }
  },
  props:{
    name: String
  },
  created(){
    // 最近5场 最近10场 最近15场
    this.timeData = [this.$root.$t("analysis.record_clashes_1"),this.$root.$t("analysis.record_clashes_2"),this.$root.$t("analysis.record_clashes_3")]
    // '默认'，'同赛事','同主客','同赛事+同主客'
    this.typeData = [this.$root.$t("analysis.original"),this.$root.$t("analysis.same_game"),this.$root.$t("analysis.same_host_guest"),this.$root.$t("analysis.same_all")]
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
      let timeSelected = _.cloneDeep(this.timeSelected)
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
    background: var(--qq--analysis-bg-color-1);
    border: 1px solid var(--qq--yb-border-color9);
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
      border: 1px solid var(--qq--yb-border-color9);
      background: var(--qq--analysis-bg-color-1);
      padding: 5px 0;
      position: absolute;
      z-index: 1;
      .options {
        padding: 0 15px;
        cursor: pointer;
        &:hover,
        &.selected {
          background: var(--qq--analysis-bg-color-11);
        }
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
      padding: 0 7px;
      border: var(--qq--yb-border-color9);
      background: var(--qq--analysis-bg-color-1);
      cursor: pointer;
      margin-right: 10px;
      border-radius: 2px;
      font-family: PingFangSC-Regular;
      color: var(--qq--analysis-text-color-5);
      &.active {
        background-image: var(--qq--analysis-bg-gradient-2);
        color: var(--qq--analysis-text-color-13);
      }
    }
  }
}
</style>