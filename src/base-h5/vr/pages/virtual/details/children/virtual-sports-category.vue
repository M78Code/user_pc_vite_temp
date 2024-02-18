<!--
 * @Author: Supermark
 * @Date: 2020-12-23 20:19:33
 * @Description: 虚拟体育玩法投注项区域
-->
<template>
  <div class='category virtual-sport'>
    <!-- loading效果 -->
    <loading v-if="is_loading" :top="$route.name == 'virtual_sports' ? '76%' : '64%'"></loading>
      <!-- 详情玩法投注项有数据 -->
    <div v-if="!is_no_data && !is_loading" style="width:100%;height:auto;">
      <div  class="scrollList">
        <!-- 置顶操作时增加动画 -->
        <transition-group name="transition-play-list">
          <!-- 置顶 -->
          <template v-for="(item,keyscorll) in match_list_new">
            <template v-if="item.hton!=0">
              <tournament-play-new @change_show="change_show" :key="item.topKey + item.hpid" :list="get_list" :item_data="item" :scorllIndex="keyscorll"></tournament-play-new>
            </template>
          </template>
          <!-- 非置顶 -->
          <template v-for="(item,keyscorll) in match_list_normal">
            <template v-if="item.hton==0">
              <template v-if="match_list_new.length == 0">
                <tournament-play-new @change_show="change_show" :key="item.topKey + item.hpid" :list="get_list" :item_data="item" :scorllIndex="keyscorll"></tournament-play-new>
              </template>
              <template v-else>
                <tournament-play-new @change_show="change_show" :key="item.topKey + item.hpid" :list="get_list" :item_data="item"></tournament-play-new>
              </template>
            </template>
          </template>
        </transition-group>
      </div>
      <div class="empty-box"></div>
    </div>
  </div>
</template>

<script>
import virtual_sports_category_mixin from "src/core/vr/mixin/pages/virtual/details/children/virtual-sports-category-mixin.js";
// 引入加载中的组件
import loading from 'src/components/loading/loading.vue';
import tournament_play_new from "src/base-h5/components/details/components/tournament-play/tournament-play-new-2.vue"
export default {
  mixins:[virtual_sports_category_mixin],
  name:'virtual_sports_category',
  components: {
    'tournament-play-new': tournament_play_new,
    loading
  },
}
</script>
<style lang="scss" scoped>
.category {
  width: 100%;
  height: auto;
  max-width: 7rem;

  .scrollList {
    &::-webkit-scrollbar {
      display: none;
    }

    overflow-x: scroll;
    overflow-y: hidden;
  }
}

.no-data-style {
  position: absolute;
  left: 0;
  right: 0;
}

.max-width {
  max-width: 7rem;
}

.dom_play {
  width: 100%;
  height: 0.47rem;
  max-width: 7rem;
}

.empty-box {
  height: 0.18rem;
}
</style>
