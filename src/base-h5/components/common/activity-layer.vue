<!--
 * @Author:
 * @Description: 为商户定制的活动页弹层,只在home页展示
-->
<template>
  <div class="activity-layer fullscreen" @click="emits('activity_hide')">
    <img :src="get_server_file_path(activity_layerimg)" class="fixed-center img1" @error="handle_img_load_error">
    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/activity/colse2.png`" class="fixed-center img2" @click.self="emits('activity_hide')">
    <div class="cover fixed-center" @click.stop="go_activity"></div>
    <div class="cd_time fixed-center">{{ count_down_time }}</div>
  </div>
</template>

<script setup>
// import { mapGetters, mapMutations } from "vuex";
import lodash from 'lodash'
import { UserCtr, get_server_file_path, LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
const props = defineProps({
  activity_layerimg: {
    type: String,
    default: ''
  },
  count_down_time: {
    type: [Number, String],
    default: 5
  },
})
const emits = defineEmits(['activity_hide'])
const get_banner_obj = ({})
// computed: {
//   ...mapGetters(['get_banner_obj', 'UserCtr', 'get_golistpage', 'get_hot_list_item'])
// },
// ...mapMutations(['set_menu_type', 'set_goto_detail_matchid', 'set_details_item', 'set_home_tab_item', 'set_hot_tab_item']),
const handle_img_load_error = (e) => {
  e.target.parentElement.hidden = true
  e.target.onerror = null
}
const go_activity = () => {
  let _url = lodash.get(get_banner_obj.value, 'type4.hostUrl')
  let _type = lodash.get(get_banner_obj.value, 'type4.urlType')
  if (!_url) return
  if (_url.startsWith('http') && _type === '2') {
    window.open(_url, '_blank')
  } else if (_type === '1') {
    if (/#*\/*details/.test(_url) && $route.name != 'category') {
      const { groups: { mid, csid } } = /#*\/*details\/(?<mid>\d+)\/(?<csid>\d+)/.exec(_url) || { groups: {} }
      if (mid && csid) {
        if ([100, 101, 102, 103].includes(+csid)) {  // 如果是电竞赛事，需要设置菜单类型
          set_menu_type(3000)
        }
        set_goto_detail_matchid(mid);
        set_details_item(0);
        $router.push({ name: 'category', params: { mid, csid } });
      }
    } else if (_url == 'act' && UserCtr.activityList) {
      $router.push({ name: 'activity_task', query: { rdm: new Date().getTime() } })
    } else if (_url.startsWith('hot') && !get_golistpage) {
      let tid = _url.split('/')[1]
      let is_existtid = get_hot_list_item && get_hot_list_item.subList && get_hot_list_item.subList.find(item => {
        return item.field2 == tid
      })
      if (tid && is_existtid) {
        set_home_tab_item({ component: 'hot', index: 1, name: '热门' })
        set_hot_tab_item({ field2: tid })
        useMittEmit(MITT_TYPES.EMIT_HOME_TAB)
      }
    }
  }
  $emit('activity_hide')
}
</script>
<style lang="scss" scoped>
.activity-layer {
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;

  img {
    user-select: none;
  }

  .img1 {
    width: 3.25rem;
    -webkit-filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
  }

  .img2 {
    width: 0.36rem;
    transform: translate(-0.18rem, 2.25rem);
  }

  .cover {
    width: 2.58rem;
    height: 3.36rem;
  }

  .cd_time {
    font-size: 16px;
    transform: translate(-46%, 1.9rem);
    color: #fff;
  }
}
</style>