<template>
  <div class="component information">
    <template v-if="article"></template>
    <NoData v-else></NoData>
  </div>
</template>

<script setup name="Information">
import { ref } from 'vue'
import { api_common } from "src/api/index";
import NoData from "../NoData.vue"
import { useRoute } from "vue-router";

const route = useRoute()
const matchId = route.params?.mid
const article = ref()

;(function initial(){
  getArticle()
})()

/** 获取资讯内容 */
function getArticle(){
  api_common.getArticle({type:1,matchId}).then((res)=>{
    article.value = res.data
  })
}

</script>

<style scoped lang="scss">

</style>