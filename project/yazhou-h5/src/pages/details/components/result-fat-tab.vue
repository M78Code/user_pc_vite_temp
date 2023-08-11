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
    <detailMatchList v-if="filtration(2)"></detailMatchList>
    <!-- 注单 -->
    <myNoteSheet v-if="filtration(3)"></myNoteSheet>
    <!-- 精彩回放 -->
    <highlights v-if="filtration(4)"></highlights>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import category from 'src/project/pages/details/children/category.vue' // 所有赛果
import detailMatchList from 'src/project/pages/details/components/detail_match_list.vue' // 精选赛事
import myNoteSheet from 'src/project/pages/details/components/details_match_results/my_note_sheet.vue' // 我的注单
import highlights from 'src/project/pages/details/analysis-matches/highlights/highlights.vue';   // 精彩回放


export default {
  name:"result_fat_tab",
  computed:{
    ...mapGetters(["get_detail_data","get_goto_detail_matchid"]),
  },
  created() {
    let search_term = this.$route.query.search_term
    if(search_term){

    }else{
      this.$router.push({
        name: 'match_result',
        params: {
          // mid: this.$route.params.mid,
          mid:this.get_goto_detail_matchid,
          index: '0'
        }
      })

      // 更新浏览器url
      let url = window.location.href
      setTimeout(() => {
        window.history.replaceState(null, '', url);
      }, 0);

    }
  },
  components:{
    // 所有赛果
    category,
    // 精选赛事
    detailMatchList,
    // 注单
    myNoteSheet,
    // 精彩回放
    highlights
  },
  methods:{
    filtration(i) {
      return  this.$route.params.index == i - 1
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
