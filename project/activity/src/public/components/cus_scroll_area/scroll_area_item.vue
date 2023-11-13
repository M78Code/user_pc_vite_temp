<!--
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 滚动区域子项操作组件
-->
<template>
  <div ref="item_layout">
    <template>
        <slot :item="item" :index="index"></slot>
    </template> 
  </div>
</template>

<script>
export default {
  name: "ScrollAreaItem",
  props: {
    item: Object,
    index: Number,
  },
  data() {
    return {
    };
  },


  components: {
  },
  updated(){
    
  },
  created() {
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  },
  // watch:{
  // }
};
</script>


<style scoped>
</style>
