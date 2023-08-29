<template>
  <div class="yb-match-list full-height virtual-list column  relative-position">
    <span
      v-if="wsl == 9999"
      style="
        color: red;
        font-size: 24px;
        position: absolute;
        top: 0;
        right: 200px;
        z-index: 99999;
      "
    >
      {{_.get(match_list,'0.csid')}}
    </span>

    <div
      class="scroll-fixed-header"
      :class="{ 'no-data': load_data_state != 'data' }"
    >

    <!-- 虚拟体育列表顶部菜单 -->
    <!-- 虚拟体育列表顶部菜单 -->
      <virtual-list-header :state="load_data_state"  />
    </div>
     <!-- 列表容器 -->
    <load-data :state="load_data_state">
      <!-- 列表 -->
      <scroll-list>
        <template v-slot:before>
          <div style="height: 143px"></div>
        </template>

        <template >
          <!--虚拟体育 赛事列表 赛事头-->
          <virtual-match-type
            v-for="(match_item, match_index) in match_list" 
            :key="`match_type_${match_item.mid}`"
            :mid="match_item.mid"
            :match_index="match_index"
            :style="`width:${vx_get_layout_size.list_content_width}px  !important;`"
          />
          <!-- 虚拟体育足球 最后两场位置放侧边  -->
          <div class="v-scroll-item" :style="`width:${vx_get_layout_size.list_content_width}px  !important;`">
            <div v-if="wsl" class="test">{{match_index}}———{{match_item.mid}}-----{{match_item.flex_index}}</div>
            <!--玩法模板-->
            <component
              :is="match_tpl_component"
              :mid="match_item.mid"
            />
          </div>
        </template>

          <!--列表底部信息提示-->
          <template v-slot:after>
          <div style="height: 15px"></div>
        </template>
      </scroll-list>
    </load-data>
  </div>
</template>

<script>
// import match_list_version_mixin from "src/project/yabo/mixins/match_list/match_list_version_mixin.js"; //模板引入及主要业务逻辑
import { VirtualMatchTpl1FullVersionWapper as virtualMatchTpl1} from 'src/components/match-list/match-tpl-new-data/virtual-match-tpl-1/index.js'
import { VirtualMatchTpl2FullVersionWapper as virtualMatchTpl2} from 'src/components/match-list/match-tpl-new-data/virtual-match-tpl-2/index.js'
export default {
  name: "VirtualMatchList",

  // mixins: [match_list_version_mixin],
  components: {
    // 虚拟足球 、 虚拟篮球
    virtualMatchTpl1,
    // 虚拟赛马 、 虚拟赛狗
    virtualMatchTpl2,
    
    // 虚拟体育头部  赛事列表
    // VirtualListHeader: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/public/components/match_list/virtual_list_header.vue"),
    // 虚拟体育 赛事列表 赛事头
    // VirtualMatchType: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/public/components/match_list/virtual_match_type.vue"),
  },
};
</script>
