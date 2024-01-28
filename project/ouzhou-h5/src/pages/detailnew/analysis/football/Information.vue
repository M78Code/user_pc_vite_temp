<template>
  <div class="component information">
    <template v-if="article"> </template>
    <NoData v-else></NoData>
  </div>
</template>

<script setup name="Information">
import { inject, onBeforeMount, reactive, ref } from "vue";
import { api_common } from "src/api/index";
import NoData from "../NoData.vue";

/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject("match_detail");

const State = reactive({
  is_show_dialog: false, // 弹框是否显示
  article_detail: {}, // 详情页文章标签下的文章详情
  article_detail2: {}, // 详情页弹框里面的文章详情
  favorite_article_data: [], // 猜你喜欢
  matchids: [], // 记录点击过的赛事id
  is_loading: true, // 内容加载中？
  enter_article_time: 0, // 进入文章页面时间
});

/* 增加一次阅读数 */
const addArticleCount = function (id) {
  api_common.addArticleCount({ id: +id });
};

const maylike_click = function (index) {
  const item = State.favorite_article_data[index];
  if (!item) return;
  const articleid = item.id;

  const articleContent = item.articleContent;
  // 有文章内容时就不用调用接口
  const api_fn = articleContent
    ? Promise.resolve({
        code: 200,
        data: Object.assign(item, { articleContent }),
      })
    : api_common.getArticle({
        // type 1-matchId是赛事id 2-matchId是文章id
        matchId: articleid,
        type: 2,
      });
  api_fn
    .then((res) => {
      if (res.code == 200 && res.data) {
        // 替换图片域名
        let domain = this.get_file_path("getArticle").replace("getArticle", "");
        if (res.data.articleContent) {
          res.data.articleContent = res.data.articleContent.replace(
            /IMAGE_DOMAIN_YUNYING_PLACEHOLDER/g,
            domain
          );
        }
        State.article_detail2 = res.data;
        State.favorite_article_data[index].articleContent =
          res.data.articleContent;

        add_article_count(res.data.id);
        State.matchids.push(index);
        State.matchids.last_click = true;
        calc_height();

        // 触发停留时长埋点
        const article_id =
          this.matchids.length === 1
            ? State.article_detail.id
            : State.favorite_article_data[State.matchids.length - 2].id;
        handle_stay_duration(article_id);
      }
      State.is_show_dialog = true;
    })
    .catch((err) => {
      console.error(err);
    });
};
/**
 * 返回按钮点击
 */
const back = function () {
  handle_stay_duration(State.article_detail2.id);

  if (State.matchids.last_click) {
    State.matchids.last_click = false;
    State.matchids.pop();
  }
  if (State.matchids.length) {
    State.article_detail2 = State.favorite_article_data[State.matchids.pop()];
  } else {
    this.is_show_dialog = false;
    this.matchids.length = 0;
  }
  calc_height();
};
/** 逐个埋点——文章停留时长 */
const handle_stay_duration = function (article_id) {
  const EVENT_NAME = "H5_赛事文章_页面停留";
  const stay_duration = parseInt(
    (Date.now() - State.enter_article_time) / 1000
  );
  const zhuge_obj = {
    页面停留时长: stay_duration,
    文章ID: article_id,
  };

  // 若文章不存在或停留时长为0，则不发送埋点数据
  if (!article_id || !stay_duration) {
    return;
  }

  $utils.zhuge_event_send(EVENT_NAME, get_user, zhuge_obj);
  State.enter_article_time = Date.now();
};
/**
 * 点击顶部遮罩 退出 猜你喜欢 时触发埋点
 * @param e
 */
const handle_hide_dialog = function (e) {
  handle_stay_duration(State.article_detail2.id);
};

/** 获取猜你喜欢列表 */
const getFavoriteArticle = function () {
  return api_common
    .getFavoriteArticle({
      id: State.article_detail.id,
      matchId: match_detail?.mid,
    })
    .then((res) => {
      State.favorite_article_data = (res.data || [])
        .filter((item) => {
          return item.id != this.article_detail.id;
        })
        .slice(0, 3);
    });
};

/** 获取资讯内容 */
const getArticle = function () {
  api_common
    .getArticle({
      type: 1,
      matchId: match_detail?.mid,
    })
    .then((res) => {
      let domain = this.get_file_path("getArticle").replace("getArticle", "");
      if (res.data?.articleContent) {
        res.data.articleContent = res.data.articleContent.replace(
          /IMAGE_DOMAIN_YUNYING_PLACEHOLDER/g,
          domain
        );
      }
      State.article_detail = res.data;
      getFavoriteArticle();
      addArticleCount(State.article_detail.id);

      // 记录进入文章时间
      State.enter_article_time = Date.now();
    });
};

onBeforeMount(() => {});
</script>

<style scoped lang="scss">
</style>