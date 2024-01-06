
<template>
  <div class="e-select  relative-position" :class="optionsIsShow ? 'up' : 'down'" @click.stop>
    <input v-if="showInput"
      type="text"
      v-model="sport"
      class="select-value select-input handel-select ellipsis"
      @focus="showOption"
      >
    <div v-else class="select-value ellipsis" @click.stop="showOption">{{sport}}
    </div>
    <div class="opitons-wrap" v-if="optionsIsShow">
      <q-scroll-area ref="scrollArea" class="rule-scroll-area" :style="{height: '100%'}">
        <template v-for="(item, index) in options">
          <p v-if="item!==''" class="item ellipsis" v-tooltip="{content: item,overflow:1, m_width: 15}" :class="{'active': value == item}" :key="index" @click.stop="selectSport(item)">{{item}}</p>
        </template>
      </q-scroll-area>
    </div>
  </div>
</template>
<script>
// import { mapGetters } from "vuex";
export default {
  name: 'normalSelect',
  props: {
    // 当前选中的球种
    value: String,
    // 球种名字列表
    options: Array,
    // 是否展示输入框
    showInput: {
      type: Boolean,
      default: false
    },
    isChampion: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      optionsIsShow: false, // 下拉框选项是否展示
      sport: this.value
    }
  },
  computed:{
    // ...mapGetters(['get_global_click'])
  },
  created() {
    // this.$root.$on('hideSportSelect', this.showOption)
  },
  watch: {
    value: {
      handler(n) {
        this.sport = n;
      }
    },
    // 全局点击事件
    get_global_click(){
      this.optionsIsShow = false
    }
  },
  methods: {
    /**
     * 展示或隐藏下拉框
     */
    showOption(type) {
      if (type == 'close') {
        if (this.optionsIsShow == true) {
          this.optionsIsShow = false;
          return;
        }
      } else {
        this.optionsIsShow = !this.optionsIsShow;
        this.$root.$emit('startTimeShowFunc', 'close')
      }
    },
    /**
     * @description 下拉框选择球种
     * @param String item 球种名称
     */
    selectSport(item) {
      this.sport = item;
      this.showOption();
      this.$root.$emit('change-sport', {currentItem: item, isChampion: this.isChampion});
      this.$root.$emit('select-sport', this.isChampion);
    },
  },
  destroyed() {
    this.$root.$off('hideSportSelect', this.showOption)
  }
}
</script>
<style lang="scss" scoped>
.e-select {
  width: 100px;
  height: 28px;
  color: var(--qq--yb-text-color3);
  border-radius: 2px;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  position: relative;
  .select-value {
    width: 100%;
    height: 28px;
    line-height: 28px;
    padding: 0 6px;
    position: relative;
    border: 1px solid var(--q-match-result-boreder-1);
    background: #ffffff;
    cursor: pointer;
    &:hover {
      border: 1px solid var(--qq--y0-text-color1);
    }
  }
  .select-input {
    cursor: text;
    outline: none;
    // background-color: rgba(16,16,16,0.95);
  }
  .opitons-wrap {
    width: 100%;
    height: 420px;
    max-height: 65vh;
    position: absolute;
    left: 0;
    z-index: 1;
    background: transparent;
    border-bottom: 1px solid #d0d8de;
    .item {
      width: 100%;
      height: 30px;
      line-height: 30px;
      margin: 0;
      padding-left: 15px;
      cursor: pointer;
      color: #1d1d1d;
      border-left: 1px solid #d0d8de;
      border-right: 1px solid #d0d8de;
      &:first-child {
        border-top: 1px solid #d0d8de;
      }
      &:hover {
        background: #e3e9ee;
      }
    }
    .active {
      background: #e3e9ee;
    }
    .rule-scroll-area {
      &:deep(.q-scrollarea__content){
        width: 100%;
        background: #fff;
  }
     
    }
  }
}
.down::after {
  content: "";
  display: block;
  width: 6px;
  height: 6px;
  border-right: 1px solid #d1d1d1;
  border-bottom: 1px solid #d1d1d1;
  transform: rotate(45deg);
  position: absolute;
  top: 10px;
  right: 10px;
}
.up::after {
  content: "";
  display: block;
  width: 6px;
  height: 6px;
  border-top: 1px solid #d1d1d1;
  border-left: 1px solid #d1d1d1;
  transform: rotate(45deg);
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>

