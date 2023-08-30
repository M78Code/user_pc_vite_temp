<!--
 * @Author:
 * @Description: 跳活动页的确认弹框
-->
<template>
  <div class="activity-layer2 fullscreen" @click.self="set_activity_msg({})" @touchmove.prevent>
    <div class="content fixed-center yb_px12 yb_py16 text-center">
      <!-- 二次确认的提示信息 -->
      <div class="text yb_fontsize14 yb_px6 yb_py8">{{get_activity_msg.secondComfirm}}</div>
      <div class="row yb_px6 justify-between btn">
        <!-- 确认 -->
        <span @click.self="confirm" class="ellipsis yb_px4">{{get_activity_msg.comfirmTxt}}</span>
        <!-- 拒绝 -->
        <span @click="set_activity_msg({})" class="ellipsis yb_px4">{{get_activity_msg.rejectTxt}}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { mapGetters, mapMutations } from 'vuex'
import lodash from 'lodash'
import UserCtr from "src/core/user-config/user-ctr.js";

  const props = defineProps({
    activity_layerimg: {
      type: String,
      default: ''
    },
  })
  const name = computed(() => {
    // ...mapGetters(['get_activity_msg', 'UserCtr', 'get_golistpage', 'get_hot_list_item']),
    // this.data
      // return data

  })


    // ...mapMutations(['set_activity_msg', 'set_goto_detail_matchid', 'set_details_item', 'set_home_tab_item', 'set_hot_tab_item']),
    /**
     *@description 跳转逻辑
     *@return {Undefined} undefined
     */
  const confirm = () => {
      let _url = lodash.get(get_activity_msg, 'hostUrl')
      let _type = lodash.get(get_activity_msg, 'urlType')
      set_activity_msg({})
      if (!_url) return
      if (_url.startsWith('http') && _type === '2') {
          window.open(_url, '_blank')
      } else if (_type === '1') {
        if (/#*\/*details/.test(_url) && $route.name != 'category') {
          const {groups: {mid, csid}} = /#*\/*details\/(?<mid>\d+)\/(?<csid>\d+)/.exec(_url) || {groups:{}}
          if (mid && csid) {
            if ([100,101,102,103].includes(+csid)) {  // 如果是电竞赛事，需要设置菜单类型
            set_menu_type(3000)
          }
          set_goto_detail_matchid(mid);
          set_details_item(0);
          $router.push({name:'category', params: {mid, csid}});
          }
        } else if (_url == 'act' && UserCtr.activityList) {
          $router.push({ name: 'activity_task', query: { rdm: new Date().getTime() } })
        } else if (_url.startsWith('hot') && !get_golistpage) {  // 跳热门联赛
            let tid = _url.split('/')[1]
            let is_existtid = get_hot_list_item && get_hot_list_item.subList && get_hot_list_item.subList.find(item => {
              return item.field2 == tid
            })
            if (tid && is_existtid) {
              set_home_tab_item({component: 'hot', index: 1, name: '热门'})
              set_hot_tab_item({field2: tid})
              $router.push({name: 'home'})
            }
          }
      }
    }

</script>
<style lang="scss" scoped>
.activity-layer2 {
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  .content {
    width: 2.8rem;
    min-height: 1.4rem;
    background-color: #ffffff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    .text {
      flex: 1;
    }
    .btn {
      height: 0.4rem;
      line-height: 0.4rem;
    }

    span {
      width: 0.96rem;
      border-radius: 4px;
      color: #fff;
      background: linear-gradient(90deg, rgb(253, 153, 28), rgb(248, 175, 5));
    }
  }
}
</style>
