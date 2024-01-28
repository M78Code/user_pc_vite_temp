<template>
  <div class="component information">
    <template v-if="article">
      {{ console.log(article) }}
      <ArticleContent :data="article"></ArticleContent>
      <ArticleMaylike :list="favoriteArticle" :activeId="activeId"></ArticleMaylike>
    </template>
    <NoData v-else></NoData>
  </div>
</template>

<script setup name="Information">
import { ref } from 'vue'
import { api_common } from "src/api/index";
import NoData from "../NoData.vue"
import { useRoute } from "vue-router";
import ArticleContent from '../components/ArticleContent.vue';
import ArticleMaylike from '../components/ArticleMaylike.vue';

/** @type {{match_detail:TYPES.MatchDetail}} */
const props = defineProps({
  match_detail:{
    type: Object,
  }
})

const route = useRoute()
const matchId = route.params?.mid
/** @type {Ref<TYPES.Article>} 资讯文章 */ const article = ref()
/** @type {Ref<Array<Any>>} 猜你喜欢 */ const favoriteArticle = ref([])
/** @type {Ref<>} */ const activeId = ref()

;(function initial(){
  getArticle().then(()=>{
    getFavoriteArticle()
  })
})()

/** 获取资讯内容 */
function getArticle(){
  return api_common.getArticle({
    type:1,
    matchId
  }).then((res)=>{
    return article.value = res.data
  })
}
/** 获取猜你喜欢列表 */
function getFavoriteArticle(){
  return api_common.getFavoriteArticle({
    id: article.value.id,
    matchId
  }).then((res)=>{
    return favoriteArticle.value = res.data
  })
}

</script>

<style scoped lang="scss">

</style>