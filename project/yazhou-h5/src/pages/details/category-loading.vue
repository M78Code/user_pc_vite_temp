<!--
 * @Author: Cronus
 * @Date: 2020-07-14 17:46:47
 * @Description: 赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <div>
  </div>
</template>

<script>
  import {mapMutations} from "vuex";

  export default {
    name: "category_loading",
    mounted(){
      this.set_is_close_video(Math.random());
      this.$router.push({name:'category', params: {mid: this.$route.params.mid}});
    },
    methods:{
      ...mapMutations(['set_is_close_video']),
    }
  }
</script>




