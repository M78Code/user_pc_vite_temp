<!--
 * @Author: land land@itcom888.com
 * @Date: 2023-11-11 15:03:04
 * @LastEditors: land land@itcom888.com
 * @LastEditTime: 2023-11-11 17:21:36
 * @FilePath: \user-pc-vite\project\ouzhou-h5\src\pages\match-page\components\top-leagues.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
* @Description: 顶级赛事 -- 国家
-->

<template>
  <div class="top_leagues_page">
        <collapse v-for="(item, index) in leagues_matchs" :key="index" :title="item.national" v-model="item.visible">
          <!-- 图片 -->
          <template v-slot:title_icon>
            <img class="national_icon" :src="item.nationalIcon" alt="" @click.stop="onCollect(item)" />
          </template>
          <!-- 右侧 -->
          <template v-slot:title_right>
            <span v-show="!item.visible">{{ item.children.length }}</span>
          </template>
          <template v-slot:content>
            <div class="game" v-for="(game, index) in item.children" :key="index" @click.stop="onLeagueChange(item, game)">
              <!-- <span> <img :src="no_collect_ouzhou" alt=""> {{ game.title }} </span> -->

              <span>
                <!-- 联赛收藏 -->
                <template v-if="![3000, 900].includes(menu_type)" @click.stop="handle_league_collect">
                  <img v-if="!league_collect_state" class="favorited-icon"
                    src="/src/base-h5/assets/match-list/ico_fav_nor.png" alt="" @click.stop="handle_league_collect" />
                  <img v-if="league_collect_state" class="favorited-icon" src="/src/base-h5/assets/match-list/ico_fav_sel.png"
                    @click.stop="handle_league_collect" />
                </template>
                {{ game.title }}
              </span>
          <span>{{ game.value }}</span>
        </div>
      </template>
    </collapse>
  </div>
</template>

<script>
import { have_collect_ouzhou, no_collect_ouzhou } from 'src/base-h5/core/utils/local-image.js'
import collapse from "../../home/components/collapse.vue"

import default_mixin from 'src/base-h5/components/match-container/mixins/default.mixin.js'
export default {
  name: "top-leagues",
  // mixins: [default_mixin],
  props: {
    leagues_matchs: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  components: {
    collapse
  },
  setup(props) {
    const { leagues_matchs } = props
    //联赛点击
    const onLeagueChange = (league) => {
      console.log(e)
    }





    return {
      leagues_matchs,
      onLeagueChange,
    }
  }
}
</script>

<style scoped lang="scss">
.top_leagues_page {
  background: #fff;

  :deep(.collapse_page) {
    &:not(:last-child) {
      border-bottom: 10px solid #f1f1f1;
    }

    .title {
      height: 50px;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid #ff7000;

      .national_icon {
        width: 24px;
        height: 15px;
        margin-right: 10px;
      }
    }

    .game {
      height: 50px;
      display: flex;
      font-weight: 400;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px 0 15px;
      border-bottom: 1px solid #eee;

      >span {
        font-size: 14px;
        display: flex;
        align-items: center;

        >img {
          width: 13px;
          height: 12px;
          margin-right: 8px;
        }
      }

      >span:last-child {
        font-weight: 500;
      }
    }
  }
}
</style>
