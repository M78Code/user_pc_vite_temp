<!--
 * @Author: Router
 * @Description: 赛事分析页文章底部猜你喜欢模块（目前只有足蓝球有）
-->
<template>
  <div class="article-maylike yb_px16">
    <div class="title yb_fontsize14">猜你喜欢</div>
    <hr />  
    <template v-for="(item, index) in favorite_article_data">
      <div class="content row justify-between yb_pt12 yb_pb10" :key="index" @click="show_details(index)" v-if="item.id != dialog_article_id">
        <div class="column justify-between col">
          <div class="detail ellipsis-2-lines yb_fontsize14"><span class="label yb_mr4 yb_px4 yb_pt2" v-if="item.tagName" :style="{'background-color': item.tagColor}">{{item.tagName}}</span><span>{{item.articleTittle}}</span></div>
          <div class="detail2 row"><span class="author-name ellipsis">{{item.authorName}}</span><span class="yb_ml6">{{item.readCounts}}阅读</span><span style="margin-left: auto;">{{ item.updateTime | formete_date }}</span></div>
        </div>
        <img :src="img_src(item.thumbnails)" alt="" @error="handle_img_load_error" class="yb_ml12" />
      </div> 
    </template>
    <template v-if="!favorite_article_data.length || favorite_article_data.length == 1 && favorite_article_data[0].id == dialog_article_id">
      <div class="empty text-center" style="padding: 0.3rem 0 0.3rem">空空如也~</div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'article_maylike',
  data() {
    return {
    };
  },
  props: {
    // 接口响应数据
    favorite_article_data: {
      type: Array,
      default: () => []
    },
    // 弹框里面展示的文章的文章id
    dialog_article_id: {
      type: String,
      default: '',
    }
  },
  methods: {
    show_details(index) {
      this.$emit('maylike_click', index)
    },
    /**
     * 获取图片地址
     * @param {string} val 用;分割的地址，取第一个
     */
    img_src(val) {
      let src = (val || '').split(';')[0]
      return this.get_file_path(src)
    },
    handle_img_load_error(e) {
      e.target.hidden = true
      e.target.onerror = null
    },
  },
}
</script>

<style scoped lang="scss">
.title {
  width: min-content;
  line-height: 0.44rem;
  white-space: nowrap;
}
hr {
  margin: 0;
  border: 0;
  transform: translateY(-1px);
}
.content {
  height: 0.98rem;
}
.detail {
  line-height: 1.3;
}
.label {
  border-radius: 3px;
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