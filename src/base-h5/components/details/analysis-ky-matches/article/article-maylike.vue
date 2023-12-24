<!--
 * @Author: 
 * @Description: 赛事分析页文章底部猜你喜欢模块（目前只有足蓝球有）
-->
<template>
  <div class="article-maylike yb_px16">
    <div class="title yb_fontsize14">{{ i18n_t('home_popular.you_may_also_like') }}</div>
    <hr />  
    <template v-for="(item, index) in favorite_article_data">
      <div class="content row justify-between yb_pt12 yb_pb10" :key="index" @click="show_details(index)" v-if="item.id != dialog_article_id">
        <div class="column justify-between col">
          <div class="detail ellipsis-2-lines yb_fontsize14"><span class="label yb_mr4 yb_px4 yb_pt2" v-if="item.tagName" :style="{'background-color': item.tagColor}">{{item.tagName}}</span><span>{{item.articleTittle}}</span></div>
          <div class="detail2 row"><span class="author-name ellipsis">{{item.authorName}}</span><span class="yb_ml6">{{item.readCounts}}阅读</span><span style="margin-left: auto;">{{ formete_date(item.updateTime)    }}</span></div>
        </div>
        <img :src="img_src(item.thumbnails)" alt="" @error="handle_img_load_error" class="yb_ml12" />
      </div> 
    </template>
    <template v-if="!favorite_article_data.length || favorite_article_data.length == 1 && favorite_article_data[0].id == dialog_article_id">
      <div class="empty text-center" style="padding: 0.3rem 0 0.3rem">{{ i18n_t('msg.msg_nodata_02') }}~</div>
    </template>
  </div>
</template>

<script setup>
  import { formete_date, i18n_t  } from "src/output/index.js";
  import { get_server_file_path } from "src/core/file-path/file-path.js";
  const emit = defineEmits(['maylike_click'])

  const props = defineProps({
    // 接口响应数据
    favorite_article_data: {
      type: Array,
      default: () => []
    },
    // 接口响应数据
    maylike_click: {
      type: Function,
      default: () => {}
    },
    // 弹框里面展示的文章的文章id
    dialog_article_id: {
      type: String,
      default: '',
    }
  }) 
  const show_details= (index) => {
    // TODO: emit 后续修改调整
    emit('maylike_click', index)
  }
  /**
   * 获取图片地址
   * @param {string} val 用;分割的地址，取第一个
   */
  const img_src= (val) => {
    let src = (val || '').split(';')[0]
    return get_server_file_path(src)
  }
  const handle_img_load_error= (e) => {
    e.target.hidden = true
    e.target.onerror = null
  }
</script>

<style scoped lang="scss">
.title {
  width: min-content;
  line-height: 0.44rem;
  white-space: nowrap;
  color:  var(--q-gb-t-c-18);
  border-bottom: 2px solid var(--q-gb-bd-c-10);
}
hr {
  margin: 0;
  border: 0;
  transform: translateY(-1px);
  border: 1px solid var(--q-gb-bd-c-6);
}
.content {
  height: 0.98rem;
  color:  var(--q-gb-t-c-18);
  border-bottom: 1px solid var(--q-gb-bd-c-6);
  .detail2 {
    color: var(--q-gb-t-c-4);
  }
}
.detail {
  line-height: 1.3;
}
.label {
  border-radius: 3px;
  color: var(--q-gb-t-c-14);
}
img {
  width: 1.1rem;
  height: 0.76rem;
}
.author-name {
  display: inline-block;
  max-width: 1rem;
}
</style>