<!--
 * @Author: Supermark
 * @Date: 2021-02-07 20:53:16
 * @Description:赛果详情bottom区域组价分离
-->
<template>
  <div>
    <!-- 所有赛果 -->
    <category v-if="filtration(1)"></category>
    <!-- 精选赛事 -->
    <!-- <detailMatchList v-if="filtration(2)"></detailMatchList> -->
    <!-- 注单 -->
    <!-- <myNoteSheet v-if="filtration(3)"></myNoteSheet> -->
    <!-- 精彩回放 -->
    <highlights v-if="filtration(4)"></highlights>
  </div>
</template>

<script setup>
// import { mapGetters } from "vuex";
// 所有赛果
import category from 'src/base-h5/components/details/children/category.vue' 
// 精选赛事
// import detailMatchList from 'src/base-h5/components/details/components/detail-match-list.vue' 
// 我的注单
// import myNoteSheet from 'src/base-h5/components/details/components/details-match-results/my-note-sheet.vue' 
// 精彩回放
import highlights from 'src/base-h5/components/details/analysis-matches/highlights/highlights.vue';   
import { useRoute, useRouter } from "vue-router"
import { onMounted } from 'vue';

const route = useRoute()
const router = useRouter()
  // computed:{
  //   // ...mapGetters(["get_detail_data","get_goto_detail_matchid"]),
  // },
  onMounted(() => {
    let search_term = route.query.search_term
    if(search_term){

    }else{
      router.push({
        name: 'match_result',
        params: {
          // mid: route.params.mid,
          mid: route.params.mid,
          index: '0'
        }
      })

      // 更新浏览器url
      let url = window.location.href
      setTimeout(() => {
        window.history.replaceState(window.history.state, '', url);
      }, 0);

    }
  })
  // components:{
  //   // 所有赛果
  //   category,
  //   // 精选赛事
  //   detailMatchList,
  //   // 注单
  //   myNoteSheet,
  //   // 精彩回放
  //   highlights
  // },
  // methods:{
  const filtration = (i) => {
      return  route.params.index == i - 1
    }
  // }
</script>

<style lang="scss" scoped>

</style>
