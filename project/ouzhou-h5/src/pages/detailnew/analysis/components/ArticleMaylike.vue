<template>
  <div class="component article-maylike yb_px16">
    <div class="title yb_fontsize14">猜你喜欢</div>
    <hr />
    <template v-for="(item, index) in list">
      <div class="content row justify-between yb_pt12 yb_pb10" :key="index" @click="onItemClick(item)"
        v-if="item.id != activeId">
        <div class="column justify-between col">
          <div class="detail ellipsis-2-lines yb_fontsize14"><span class="label yb_mr4 yb_px4 yb_pt2" v-if="item.tagName"
              :style="{ 'background-color': item.tagColor }">{{ item.tagName }}</span><span>{{ item.articleTittle
              }}</span>
          </div>
          <div class="detail2 row"><span class="author-name ellipsis">{{ item.authorName }}</span><span class="yb_ml6">{{
            item.readCounts }}阅读</span><span style="margin-left: auto;">{{ formete_date(item.updateTime) }}</span></div>
        </div>
        <img :src="imageSrc(item.thumbnails)" alt="" @error="handleImageLoadError" class="yb_ml12" />
      </div>
    </template>
    <template v-if="!list.length || list.length == 1 && list[0].id == activeId">
      <div class="empty text-center" style="padding: 0.3rem 0 0.3rem">空空如也~</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formete_date } from 'src/output/index';
type ItemType = Props['list'][number]

type Props = {
  list: Array<TYPES.Article>,
  activeId?: TYPES.Article['id']
}
const props = defineProps<Props>()
const emit = defineEmits <{
  (e:'itemClick', item:ItemType):void
}>()

function onItemClick(item:ItemType) {
  emit('itemClick',item)
}

const imageSrc = computed(() => getImageSrc)
/** 获取图片地址
* @param {TYPES.Article['thumbnails']} val 用;分割的地址，取第一个
*/
function getImageSrc(thumbnails: TYPES.Article['thumbnails']) {
  let src = (thumbnails || '').split(';')[0]
  return this.get_file_path(src)
}

function handleImageLoadError(e) {
  e.target.hidden = true
  e.target.onerror = null
}

</script>