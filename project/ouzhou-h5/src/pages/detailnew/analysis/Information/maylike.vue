<script setup name="maylike">
import AnalysisCard from "../AnalysisCard.vue"
import { compute_image_src } from "src/core/utils/common"

const props = defineProps({
    favorite_article_data: {
        type: Array,
        default: () => []
    },
    // 弹框里面展示的文章的文章id
    dialog_article_id: {
        type: String,
        default: '',
    }
})

const formete_date = (val) => {
    val = Number(val)
    let difference = Date.now() - val, str = ''
    if (difference > 1000 * 60 * 60 * 24) {
        str = new Date(val).getMonth() + 1 + '月' + new Date(val).getDate() + '日'
    } else if (difference > 1000 * 60 * 60) {
        str = Math.ceil(difference / (1000 * 60 * 60)) + '小时前'
    } else {
        str = Math.ceil(difference / (1000 * 60)) + '分钟前'
    }
    return str
}

const img_src = function(val) {
    let src = (val || '').split(';')[0]
    return compute_image_src(src)
}
const handle_img_load_error = function(e) {
    e.target.hidden = true
    e.target.onerror = null
}

</script>

<template>
    <AnalysisCard title="猜你喜欢">
        <template #body>
            <div class="maylike" v-for="(item,index) of favorite_article_data" :key="index">
                <!-- <div class="content row justify-between yb_pt12 yb_pb10" :key="index" @click="show_details(index)" v-if="item.id != dialog_article_id">
                    <div class="column justify-between col">
                        <div class="detail ellipsis-2-lines yb_fontsize14">
                            <span class="label yb_mr4 yb_px4 yb_pt2" v-if="item.tagName" :style="{'background-color': item.tagColor}">{{item.tagName}}</span>
                            <span>{{item.articleTittle}}</span>
                        </div>
                        <div class="detail2 row">
                            <span class="author-name ellipsis">{{item.authorName}}</span>
                            <span class="yb_ml6">{{item.readCounts}}阅读</span>
                            <span style="margin-left: auto;">{{ formete_date(item.updateTime) }}</span>
                        </div>
                    </div>
                    <img :src="item.thumbnails" alt="" @error="handle_img_load_error" class="yb_ml12" />
                </div> -->
                <div class="maylike--left">
                    <p class="top">
                        <span class="label" v-if="item.tagName" :style="{'background-color': item.tagColor}">{{item.tagName}}</span>
                        <span>{{item.articleTittle}}</span>
                    </p>
                    <p class="bottom">
                        <span class="author-name ellipsis">{{item.authorName}}</span>
                        <span class="yb_ml6">{{item.readCounts}}阅读</span>
                        <span style="margin-left: auto;">{{ formete_date(item.updateTime) }}</span>
                    </p>
                </div>
                <div class="maylike--right">
                    <img :src="item.thumbnails" alt="" @error="handle_img_load_error">
                </div>
            </div>
        </template>
    </AnalysisCard>
</template>

<style scoped lang="scss">
.maylike{
    width: 100%;
    padding: .12rem .08rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 104px;
    &--left{
        flex-basis: 65%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .top{
            color: #1A1A1A;
            font-size: .12rem;
            font-weight: 600;
            .label{
                padding: .02rem .04rem;
                border-radius: .04rem;
                color: #fff;
                margin-right: .04rem;
            }
        }
        .bottom{
            display: flex;
            justify-content: space-between;
            color: #8A8986;
        }
    }
    &--right{
        flex-basis: 35%;
        height: 100%;
        margin-left: .08rem;
        img{
            width: 100%;
            height: 100%;
        }
    }
}

</style>