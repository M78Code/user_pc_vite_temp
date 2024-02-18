<!--
 * @
 * @Author: bruce
 * @Description: 通用下拉框。组件设计思路应该按功能设计，而不是按业务
 * 1、实现需求 2、抽离为通用组件 3、替换其他页面相关组件 4、list_header_mixin应该合并
 * @Date: 2022-12-26 16:45
-->
<template>  
  <div class="select-wrap relative-position">
    <div class="select-btn" :class="{'active': visible}" @click.stop="onPopup"> 
      <slot name="prefix"/>
      <span class="fg2 mlr5">{{ selected? valueKey?selected[showKey]:selected : ''}}</span>
      <slot name="suffix"/>
      <i class="icon-arrow q-icon c-icon" size="14px"></i>
    </div>    
    <div class="list" v-if="visible">
      <div class="triangle"></div>
      <div v-for="(opt, i) in options" :key="i" @click="onClick(opt, i)"
       class="option" :class="{'active':(valueKey?opt[valueKey]:opt)==value}">        
        <span class="text">{{ valueKey ? opt[popupShowKey]:opt }}</span>
      </div>
    </div>
  </div>  
</template>

<script>
export default {
  props: {
    //下拉框子项
    options: Array,
    value: [String, Number, Object],
    //绑定值为对象类型时,作为value唯一标识的键名
    valueKey: {
        type: String,
        default: 'value'
    },
    //绑定值为对象类型时,作为选定项唯一标识的键名
    showKey: {
        type: String,
        default: 'label'
    },
    //绑定值为对象类型时,作为选择项唯一标识的键名
    popupShowKey: {
        type: String,
        default: 'label'
    }, 
  },
  data() {
    return {
      //下拉选项是否可见
      visible: false,
      //选中项
      selected: null,
    };
  },
  watch:{
    value(){
      this.setSelected(this.value)
    }
  },  
  created(){
    document.addEventListener("click", this.hide);
    this.setSelected(this.value)        
  },
  destroyed(){
     document.removeEventListener("click", this.hide);
  },
  methods: {
    /**
     * 设置选定项
     * @param {Object} val 选择的值
     */
    setSelected(val){
      // this.selected = this.options.find(x=> val == (this.valueKey?x[this.valueKey]:x))
    },
    onPopup() {
      this.visible = !this.visible;
    },
    /**
     * 点击事件
     * @param {Object} val 选择的值
     * @param {Number} i 索引
     */    
    onClick(val, i) {
      //获取值     
      const value = this.valueKey ? val[this.valueKey] : val 
      //相同选项不执行
      if(value == this.selected) return
      this.$emit('input', value, val, i)
    },
    hide(){
      this.visible = false
    },
  },
};
</script>

<style lang="scss" scoped>
.fg1{color: var(--qq--theme-small-menu-active);}
.fg2{color: var(--qq--y0-text-color5);}

.select-wrap{  
  cursor: pointer;

  .mlr5{margin-left: 5px; margin-right: 5px;}
  .icon-arrow{  
    transform: rotate(180deg);
    transition: transform 0.3s;
    &::before{
      color: #abbac8;
    }
  }

  .active .icon-arrow{  
    transform: none;
  }

  .select-btn {
    border-radius: 12px;
    padding: 2px 8px;
    &.active{ border-color: var(--qq--y0-text-color1)!important;}
  }
  //var(--qq--theme-bg-search-hover);
  .select-btn:hover{ background:var(--qq--background-gradient-7);}
  .option:hover{background: var(--qq--popup-wrap-bg-color-hover);}

  .list {
    position: absolute;
    top: 36px;
    border-radius: 4px;
    background: var(--qq--popup-wrap-bg-color);
    color: var(--qq--menu-text-color2);
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.1);
    width: 100%;
    text-align: center;
    padding: 5px 0;
    z-index: 99;
    .option {     
      min-height: 30px; 
      padding-top: 6px;
    }
    .active{//,.option:hover
      background: var(--qq--menu-bg-color8)!important;
    }        
  }
  .triangle {
    position: absolute;
    width: 5px;
    height: 5px;
    transform: rotate(45deg);
    top: -2px;
    left: 49%;
    background: var(--qq--popup-wrap-bg-color);
  }  
}
</style>
