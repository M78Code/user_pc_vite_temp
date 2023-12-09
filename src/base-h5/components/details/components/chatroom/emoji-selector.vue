<!--
 * @FilePath: d:/projects/user-h5/src/base-h5/components/details/components/chatroom/emoji_selector.vue
 * @Description:
-->

<template>
  <div class="popper t-popper">
    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/bet_close.svg`" class="close_icon" @click.stop="onEmojiSelect('')" />
    <div class="popper_content">
      <div v-for="emoji in emojiList" :key="emoji" class="emoji-container flex flex-center" @click="onEmojiSelect(emoji)">
        {{ emoji }}
      </div>
    </div>
  </div>

</template>

<script>
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
export default defineComponent({
  name: 'emoji_selector',
  setup(props, evnet) {
    let data = reactive({
      emojiList: [],
    });
    onMounted(() => {
      const start = 0x1F601;
      const tempEmojiList = [];
      for (let i = 0; i < 79; i++) {
        const emojiUnicode = start + i;
        tempEmojiList.push(String.fromCodePoint('0x' + emojiUnicode.toString(16)));
      }
      emojiList = tempEmojiList;
    })
    const onEmojiSelect = (emoji) => {
      // #TODO emit
      // $emit('emoji_select', emoji);
    }
    return {
      ...toRefs(data),
      LOCAL_PROJECT_FILE_PREFIX,
      onEmojiSelect
    }
  }
})
</script>


<style scoped lang="scss">
.popper {
  width: 2.25rem;
  height: 1.8rem;
  text-align: center;
  border-radius: 0.05rem;
  z-index: 200000;
  position: absolute;
  top: -1.9rem;
  right: -0.55rem;
  padding: 0.25rem 0.1rem;
  padding-bottom: 0.1rem;


  &::before {
    content: "";
    width: 0.1rem;
    height: 0.1rem;
    box-sizing: border-box;
    transform: rotate(-135deg);
    position: absolute;
    bottom: -0.06rem;
    left: 1.5rem
  }

  .popper_content {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    font-size: 0.1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    right: 0;
  }

  .emoji-container {
    width: 0.4rem;
    height: 0.4rem;
    font-size: 0.2rem;
  }

  .close_icon {
    position: absolute;
    right: 0.1rem;
    top: 0.1rem;
  }
}
</style>