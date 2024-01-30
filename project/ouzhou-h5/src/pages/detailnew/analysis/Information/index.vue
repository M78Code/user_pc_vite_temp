<!--篮球资讯组件-->
<script setup name="Information">
import { api_analysis, api_common } from "src/api/index";
import { onBeforeMount, reactive, inject } from "vue";
import articleContent from "./content.vue";
import maylike from "./maylike.vue";
import NoData from "../NoData.vue";

import { get_server_file_path } from "src/core/file-path/file-path.js"

/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject("match_detail");

const State = reactive({
    is_show_dialog: false, // 弹框是否显示
    articleDetail: {}, // 详情页文章标签下的文章详情
    articleDetail2: {}, // 详情页弹框里面的文章详情
    favoriteArticleData: [], // 猜你喜欢
    matchids: [], // 记录点击过的赛事id
    loading: true, // 内容加载中？
    enterArticleTime: 0, // 进入文章页面时间
});

/* 增加一次阅读 */
const _addArticleReadCount = function(id){
    api_common.addArticleCount({ id: +id })
}

/* 获取文章 猜你喜欢 */ 
const _getFavoriteArticle = function(){
    api_common.getFavoriteArticle({
        id: State.articleDetail.id,
        matchId: match_detail.value.mid
    }).then(res => {
        if (res.code == 200 && res.data) {
            State.favoriteArticleData = res.data.filter(item => {
                return item.id != State.articleDetail.id
            }).slice(0, 3)
        }
    }).catch(err => {
        console.error(err);
    })
}

/* 逐个埋点——文章停留时长 */
const handle_stay_duration = function(article_id) {
    const EVENT_NAME = 'H5_赛事文章_页面停留'
    const stay_duration = parseInt((Date.now() - this.enter_article_time) / 1000)
    const zhuge_obj = {
        "页面停留时长": stay_duration,
        "文章ID": article_id
    }

    // 若文章不存在或停留时长为0，则不发送埋点数据
    if (!article_id || !stay_duration) return

    this.$utils.zhuge_event_send(EVENT_NAME, this.get_user, zhuge_obj)
    this.enter_article_time = Date.now()
}
/**
 * 点击顶部遮罩 退出 猜你喜欢 时触发埋点
 * @param e
 */
const handle_hide_dialog = function(e) {
    handle_stay_duration(State.articleDetail2.id)
}

/* 获取文章详情 */
const _getArticle = function () {
    api_analysis.getArticlePB({ 
        matchId: match_detail.value.mid,
        type: 1 
    }).then((res) => {
        console.log(res,"Information")
        State.loading = true
        if(res.code != 200 || lodash.isEmpty(res.data)) return
        
        /*
            替换富文本返回无用图片域名 
            IMAGE_DOMAIN_YUNYING_PLACEHOLDER 固定值
            get_server_file_path 会拼接传入图片地址并且获得完整路径
            这边随便传入参数然后替换 以获得 图片域名
        */ 
        let domain = get_server_file_path("getArticle").replace("getArticle", "");
        if (res.data.articleContent) {
            res.data.articleContent = res.data.articleContent.replace(/IMAGE_DOMAIN_YUNYING_PLACEHOLDER/g,domain);
        }
        State.articleDetail = res.data;
        _getFavoriteArticle();
        if(State.articleDetail?.id){
            _addArticleReadCount(State.articleDetail.id);
        }

        // 记录进入文章时间
        State.enterArticleTime = Date.now();
    }).finally(() => {
        State.loading = false;
    });
};

onBeforeMount(() => {
    _getArticle();
});
</script>

<template>
  <article class="analysisBasketball">
    <template v-if="lodash.isEmpty(State.articleDetail)">
        <NoData></NoData>
    </template>
    <template v-else>
        <articleContent :article_detail="State.articleDetail"></articleContent>
        <maylike @maylike_click="maylike_click" :favorite_article_data="State.favoriteArticleData"></maylike>
    </template>
  </article>
</template>

<style lang="scss" scoped></style>