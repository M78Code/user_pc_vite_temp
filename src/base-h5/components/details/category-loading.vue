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
  // import {mapMutations} from "vuex";
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()
  export default {
    name: "category_loading",
    mounted(){
      set_is_close_video(Math.random());
      router.push({name:'category', params: {mid: route.params.mid}});
    },
    methods:{
      // ...mapMutations(['set_is_close_video']),
      set_is_close_video() {
        
      }
    }
  }
</script>




