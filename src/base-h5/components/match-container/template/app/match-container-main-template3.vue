<!--
 * @Description:   app-h5   赛果
-->
<template>
    app-h5   赛果app-h5   赛果app-h5   赛果app-h5   赛果app-h5   赛果
</template>

<script>

import { ref, computed, watch, nextTick } from 'vue'
import { LOCAL_PROJECT_FILE_PREFIX } from  "src/core"

import { IconWapper } from 'src/components/icon'
import CountingDownSecond from 'src/base-h5/components/common/counting-down.vue';
import CountingDownStart from 'src/base-h5/components/common/counting-down-start.vue';
import ScoreList from 'src/base-h5/components/match-list/components/score-list.vue';
import OddListWrap from 'src/base-h5/components/match-list/components/odd-list-wrap.vue';
import ImageCacheLoad from "src/base-h5/components/match-list/components/public-cache-image.vue";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"

import { i18n_t, compute_img_url, compute_css_obj  } from "src/core/index.js"
import { format_time_zone } from "src/core/format/index.js"
import { mearlys_icon } from 'src/base-h5/core/utils/local-image.js'

import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import { is_hot, menu_type, menu_lv2, is_detail, is_export, is_results, footer_menu_id } from 'src/base-h5/mixin/menu.js'

import default_mixin from '../../mixins/default.mixin.js'

export default {
  name: "match-container-main-template4",
  mixins: [default_mixin],
  props: {
    // 当前组件的赛事数据对应列表的赛事
    match_of_list: Object,
    // 赛事处于列表中的下标
    i: Number,
    // 赛事列表相关操作的类型封装对象
    matchCtr: Object,
    main_source:String,
  },
  components: {
    ScoreList,
    IconWapper,
    OddListWrap,
    ImageCacheLoad,
    CountingDownStart,
    CountingDownSecond,
  },
  setup () {
    return { 
      lang, theme, i18n_t, compute_img_url, format_time_zone, GlobalAccessConfig, footer_menu_id,LOCAL_PROJECT_FILE_PREFIX,
      is_hot, menu_type, menu_lv2, is_detail, is_export, is_results, standard_edition, mearlys_icon, compute_css_obj
    }
  }
}

</script>

<style scoped lang="scss">

</style>
  