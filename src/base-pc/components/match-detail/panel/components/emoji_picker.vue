<template>
  <div class="emoji-picker" :style="emojiPickerStyle" @click.stop.prevent>
    <div class="qqface-container">
      <!--<span class="qqface-wrapper" v-for="[key, value] of Object.entries(emoijs)" :key="value">-->
      <!--  <img src="/wwwassets/yabo/png/emojis.png" class="qqface" :class="[`qqface${value}`]" @click="input(key)">-->
      <!--</span>-->
      <span class="qqface-wrapper" v-for="(emoji, index) in emoji_list" :key="index" @click="input(emoji)">
        {{ emoji }}
      </span>
      <!-- 删除emoji按钮 -->
      <!--<div class="picker-button" @click="deleteEmoji">-->
      <!--  <svg height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">-->
      <!--    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"/>-->
      <!--  </svg>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  import { deleteEmoji, qqfaceArr } from 'src/public/utils/emoji'
  // const emojisUrl = require(url)
  // const emojisUrl = require(url)

  export default {
    name: 'EmojiPicker',
    props: {
      value:{
        type: String,
        default: () => {
          return ''
        }
      },
      // button: {
      //   type: Boolean
      // },
      emojiPickerStyle: {
        type: String,
        default: ''
      },
      height: {
        type: String,
        default: 'auto'
      }
    },
    data(){
      return {
        emoijs: qqfaceArr,
      }
    },
    // inject: ['emojisUrl'],
    computed: {
      emoji_list() {
        const start = 0x1F601;
        const tempEmojiList = [];
        for (let i = 0; i < 79; i++) {
          const emojiUnicode = start + i;
          tempEmojiList.push(String.fromCodePoint('0x' + emojiUnicode.toString(16)));
        }
        return tempEmojiList
      }
    },
    methods: {
      input(key){
        this.$emit('input', this.value + key)
      },
      deleteEmoji(){
        this.$emit('input', deleteEmoji(this.value))
      }
    },
  }
</script>

<style lang="scss">
.qqface-wrapper {
  //width: 24px;
  //height: 24px;
  //margin-bottom: -5px;
  position: relative;
  overflow: hidden;
  .qqface {
    width: 280px;
    position: absolute;
    &.qqface0 {
      clip-path: circle(16px at 12px 12px);
    }
    &.qqface1 {
      left: -36px;
      clip-path: circle(16px at 48px 12px);
    }
    &.qqface2 {
      left: -72px;
      clip-path: circle(16px at 84px 12px);
    }
    &.qqface3 {
      left: -109px;
      clip-path: circle(16px at 120px 12px);
    }
    &.qqface4 {
      left: -145px;
      clip-path: circle(16px at 158px 12px);
    }
    &.qqface5 {
      left: -182px;
      clip-path: circle(16px at 194px 12px);
    }
    &.qqface6 {
      left: -219px;
      clip-path: circle(16px at 230px 12px);
    }
    &.qqface7 {
      left: -256px;
      clip-path: circle(16px at 266px 12px);
    }
    &.qqface8 {
      top: -36px;
      clip-path: circle(16px at 12px 48px);
    }
    &.qqface9 {
      top: -36px;
      left: -36px;
      clip-path: circle(16px at 48px 48px);
    }
    &.qqface10 {
      top: -36px;
      left: -72px;
      clip-path: circle(16px at 84px 48px);
    }
    &.qqface11 {
      top: -36px;
      left: -110px;
      clip-path: circle(16px at 120px 48px);
    }
    &.qqface12 {
      top: -36px;
      left: -146px;
      clip-path: circle(16px at 158px 48px);
    }
    &.qqface13 {
      top: -36px;
      left: -182px;
      clip-path: circle(16px at 194px 48px);
    }
    &.qqface14 {
      top: -36px;
      left: -219px;
      clip-path: circle(16px at 230px 48px);
    }
    &.qqface15 {
      top: -36px;
      left: -256px;
      clip-path: circle(16px at 266px 48px);
    }
    &.qqface17 {
      top: -74px;
      clip-path: circle(16px at 12px 84px);
    }
    &.qqface18 {
      top: -74px;
      left: -36px;
      clip-path: circle(16px at 48px 84px);
    }
    &.qqface19 {
      top: -74px;
      left: -72px;
      clip-path: circle(16px at 84px 84px);
    }
    &.qqface20 {
      top: -74px;
      left: -109px;
      clip-path: circle(16px at 120px 84px);
    }
    &.qqface21 {
      top: -74px;
      left: -145px;
      clip-path: circle(16px at 158px 84px);
    }
    &.qqface22 {
      top: -74px;
      left: -182px;
      clip-path: circle(16px at 194px 84px);
    }
    &.qqface23 {
      top: -74px;
      left: -219px;
      clip-path: circle(16px at 230px 84px);
    }
    &.qqface25 {
      top: -74px;
      left: -256px;
      clip-path: circle(16px at 266px 84px);
    }
    &.qqface26 {
      top: -110px;
      clip-path: circle(16px at 12px 121px);
    }
    &.qqface28 {
      top: -110px;
      left: -36px;
      clip-path: circle(16px at 48px 121px);
    }
    &.qqface29 {
      top: -110px;
      left: -72px;
      clip-path: circle(16px at 84px 121px);
    }
    &.qqface31 {
      top: -110px;
      left: -110px;
      clip-path: circle(16px at 120px 121px);
    }
    &.qqface32 {
      top: -110px;
      left: -146px;
      clip-path: circle(16px at 158px 121px);
    }
    &.qqface33 {
      top: -110px;
      left: -182px;
      clip-path: circle(16px at 194px 121px);
    }
    &.qqface34 {
      top: -110px;
      left: -219px;
      clip-path: circle(16px at 230px 121px);
    }
    &.qqface36 {
      top: -110px;
      left: -256px;
      clip-path: circle(16px at 266px 121px);
    }
    &.qqface37 {
      top: -147px;
      clip-path: circle(16px at 12px 157px);
    }
    &.qqface38 {
      top: -147px;
      left: -36px;
      clip-path: circle(16px at 48px 157px);
    }
    &.qqface39 {
      top: -147px;
      left: -73px;
      clip-path: circle(16px at 85px 160px);
    }
    &.qqface40 {
      top: -147px;
      left: -109px;
      clip-path: circle(16px at 120px 157px);
    }
    &.qqface41 {
      top: -147px;
      left: -145px;
      clip-path: circle(16px at 158px 157px);
    }
    &.qqface42 {
      top: -147px;
      left: -183px;
      clip-path: circle(16px at 194px 157px);
    }
    &.qqface44 {
      top: -147px;
      left: -219px;
      clip-path: circle(16px at 230px 157px);
    }
    &.qqface46 {
      top: -147px;
      left: -256px;
      clip-path: circle(16px at 266px 157px);
    }
    &.qqface48 {
      top: -184px;
      clip-path: circle(16px at 12px 196px);
    }
    &.qqface49 {
      top: -184px;
      left: -36px;
      clip-path: circle(16px at 48px 196px);
    }
    &.qqface50 {
      top: -184px;
      left: -72px;
      clip-path: circle(16px at 84px 196px);
    }
    &.qqface51 {
      top: -184px;
      left: -109px;
      clip-path: circle(16px at 120px 196px);
    }
    &.qqface52 {
      top: -184px;
      left: -145px;
      clip-path: circle(16px at 158px 196px);
    }
    &.qqface54 {
      top: -184px;
      left: -182px;
      clip-path: circle(16px at 194px 196px);
    }
    &.qqface53 {
      top: -184px;
      left: -219px;
      clip-path: circle(16px at 230px 196px);
    }
    &.qqface47 {
      top: -184px;
      left: -256px;
      clip-path: circle(16px at 266px 198px);
    }
    &.qqface35 {
      top: -222px;
      clip-path: circle(16px at 12px 234px);
    }
    &.qqface16 {
      top: -222px;
      left: -36px;
      clip-path: circle(16px at 48px 234px);
    }
    &.qqface45 {
      top: -222px;
      left: -72px;
      clip-path: circle(16px at 84px 234px);
    }
    &.qqface24 {
      top: -222px;
      left: -109px;
      clip-path: circle(16px at 120px 234px);
    }
    &.qqface27 {
      top: -222px;
      left: -145px;
      clip-path: circle(16px at 158px 234px);
    }
    &.qqface30 {
      top: -222px;
      left: -182px;
      clip-path: circle(16px at 194px 234px);
    }
    &.qqface43 {
      top: -222px;
      left: -219px;
      clip-path: circle(16px at 230px 234px);
    }
    &.qqface55 {
      top: -222px;
      left: -256px;
      clip-path: circle(16px at 266px 234px);
    }
    &.qqface56 {
      top: -258px;
      clip-path: circle(16px at 12px 270px);
    }
    &.qqface57 {
      top: -258px;
      left: -36px;
      clip-path: circle(16px at 48px 270px);
    }
    &.qqface58 {
      top: -258px;
      left: -72px;
      clip-path: circle(16px at 84px 270px);
    }
    &.qqface59 {
      top: -258px;
      left: -109px;
      clip-path: circle(16px at 120px 270px);
    }
    &.qqface60 {
      top: -258px;
      left: -145px;
      clip-path: circle(16px at 158px 270px);
    }
    &.qqface61 {
      top: -258px;
      left: -182px;
      clip-path: circle(16px at 194px 270px);
    }
    &.qqface62 {
      top: -258px;
      left: -219px;
      clip-path: circle(16px at 230px 270px);
    }
    &.qqface74 {
      top: -258px;
      left: -256px;
      clip-path: circle(16px at 266px 270px);
    }
    &.qqface63 {
      top: -294px;
      clip-path: circle(16px at 12px 306px);
    }
    &.qqface64 {
      top: -294px;
      left: -36px;
      clip-path: circle(16px at 48px 306px);
    }
    &.qqface65 {
      top: -294px;
      left: -72px;
      clip-path: circle(16px at 84px 306px);
    }
    &.qqface66 {
      top: -294px;
      left: -109px;
      clip-path: circle(16px at 120px 306px);
    }
    &.qqface67 {
      top: -294px;
      left: -145px;
      clip-path: circle(16px at 158px 306px);
    }
    &.qqface68 {
      top: -294px;
      left: -182px;
      clip-path: circle(16px at 194px 306px);
    }
    &.qqface69 {
      top: -294px;
      left: -219px;
      clip-path: circle(16px at 230px 306px);
    }
    &.qqface70 {
      top: -294px;
      left: -256px;
      clip-path: circle(16px at 266px 306px);
    }
    &.qqface71 {
      top: -330px;
      clip-path: circle(16px at 12px 342px);
    }
    &.qqface72 {
      top: -330px;
      left: -36px;
      clip-path: circle(16px at 48px 342px);
    }
    &.qqface73 {
      top: -330px;
      left: -73px;
      clip-path: circle(16px at 84px 342px);
    }
    &.qqface75 {
      top: -330px;
      left: -109px;
      clip-path: circle(16px at 120px 342px);
    }
    &.qqface76 {
      top: -330px;
      left: -145px;
      clip-path: circle(16px at 158px 342px);
    }
    &.qqface77 {
      top: -330px;
      left: -182px;
      clip-path: circle(16px at 194px 342px);
    }
    &.qqface78 {
      top: -330px;
      left: -219px;
      clip-path: circle(16px at 230px 342px);
    }
    &.qqface79 {
      top: -330px;
      left: -256px;
      clip-path: circle(16px at 266px 342px);
    }
    &.qqface80 {
      top: -366px;
      clip-path: circle(16px at 12px 378px);
    }
    &.qqface81 {
      top: -366px;
      left: -36px;
      clip-path: circle(16px at 48px 378px);
    }
    &.qqface82 {
      top: -366px;
      left: -72px;
      clip-path: circle(16px at 84px 378px);
    }
    &.qqface83 {
      top: -366px;
      left: -109px;
      clip-path: circle(16px at 120px 378px);
    }
    &.qqface84 {
      top: -366px;
      left: -145px;
      clip-path: circle(16px at 158px 378px);
    }
    &.qqface85 {
      top: -366px;
      left: -182px;
      clip-path: circle(16px at 194px 378px);
    }
    &.qqface86 {
      top: -366px;
      left: -219px;
      clip-path: circle(16px at 230px 378px);
    }
    &.qqface87 {
      top: -366px;
      left: -256px;
      clip-path: circle(16px at 266px 378px);
    }
    &.qqface88 {
      top: -404px;
      clip-path: circle(16px at 12px 416px);
    }
    &.qqface89 {
      top: -404px;
      left: -36px;
      clip-path: circle(16px at 48px 416px);
    }
    &.qqface90 {
      top: -404px;
      left: -72px;
      clip-path: circle(16px at 84px 416px);
    }
    &.qqface91 {
      top: -404px;
      left: -109px;
      clip-path: circle(16px at 120px 416px);
    }
    &.qqface92 {
      top: -404px;
      left: -145px;
      clip-path: circle(16px at 158px 416px);
    }
    &.qqface93 {
      top: -404px;
      left: -182px;
      clip-path: circle(16px at 194px 416px);
    }
    &.qqface94 {
      top: -404px;
      left: -219px;
      clip-path: circle(16px at 230px 416px);
    }
    &.qqface95 {
      top: -404px;
      left: -256px;
      clip-path: circle(16px at 267px 416px);
    }
    &.qqface96 {
      top: -441px;
      clip-path: circle(16px at 12px 452px);
    }
    &.qqface97 {
      top: -441px;
      left: -36px;
      clip-path: circle(16px at 48px 452px);
    }
    &.qqface98 {
      top: -441px;
      left: -72px;
      clip-path: circle(16px at 84px 452px);
    }
    &.qqface99 {
      top: -441px;
      left: -109px;
      clip-path: circle(16px at 120px 452px);
    }
    &.qqface100 {
      top: -441px;
      left: -145px;
      clip-path: circle(16px at 158px 452px);
    }
    &.qqface101 {
      top: -441px;
      left: -182px;
      clip-path: circle(16px at 194px 452px);
    }
    &.qqface102 {
      top: -441px;
      left: -219px;
      clip-path: circle(16px at 230px 452px);
    }
    &.qqface103 {
      top: -441px;
      left: -256px;
      clip-path: circle(16px at 266px 452px);
    }
    &.qqface104 {
      top: -477px;
      clip-path: circle(16px at 12px 489px);
    }
    &.qqface105 {
      top: -477px;
      left: -36px;
      clip-path: circle(16px at 48px 489px);
    }
    &.qqface106 {
      top: -477px;
      left: -72px;
      clip-path: circle(16px at 84px 489px);
    }
    &.qqface107 {
      top: -477px;
      left: -109px;
      clip-path: circle(16px at 120px 489px);
    }
    &.qqface108 {
      top: -477px;
      left: -145px;
      clip-path: circle(16px at 158px 489px);
    }
  }
  &:after {
    content: "";
  }
}

.emoji-picker {
  position: absolute;
  bottom: 32px;
  width: 355px;
  height: 250px;
  //padding-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
.qqface-container{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  overflow-y: auto;
  height: 100%;
  .qqface-wrapper{
    display: inline-block;
    //transform: scale(1.2);
    //margin: 12px
    font-size: 21px;
    flex: 0 0 32px;
    text-align: center;
  }
}

.picker-button{
  position: absolute;
  right: 20px;
  bottom: 20px;
  background: var(--q-gb-bg-c-4);
  padding: 10px 20px 4px 20px;
  border-radius: 6px;
}
</style>