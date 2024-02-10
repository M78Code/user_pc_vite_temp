<!--
 * @Description: app-h5 切换语言
-->
<template>
  <div class="language-switch">
    <div class="header">
      <GoBackSvg class="go-back" @click="go_back" />
        <span class="title">
            {{i18n_t('setting_menu.chan_lan')}}
        </span>
    </div>
    <div class="content">
      <template v-for="(item, key) in lang_obj" :key="key">
        <div
          class="lang-item"
          :class="{ active: UserCtr.lang == key }"
          @click="setting_language_handle(key)"
        >
          <i class="lang-icon yb_mr4" :class="`lang-${key}`"></i>
          <div class="col">{{ item }}</div>
          <div class="icon"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import UserCtr from 'src/core/user-config/user-ctr.js';
import { api_account } from 'src/api/index';
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref } from 'vue'
import GoBackSvg from 'src/components/go_back/index.vue';
import { loadLanguageAsync, useMittEmit, MITT_TYPES} from "src/output/index.js";
import BaseData from "src/core/base-data/base-data.js";

const router = useRouter();
// 默认展示语言 复刻版多语言暂时只支持
const lang_default = {
  'zh': '简体中文',
  'tw': '繁體中文',
  'en': 'English',
  'vi': 'Tiếng Việt',
  "pt": "Português",
  "ko": "한국인",
  "ru": "ру́сский язы́к",
}
// 语言项
const lang_obj = ref(lang_default)
// 当前语言
const lang = ref(UserCtr.lang || 'zh')
// 返回列表
const go_back = () => {
  router.push({ name: "matchList" });
}
// 语言项
onMounted(() => {
  lang.value = UserCtr.lang == 'hk' ? 'zh' : UserCtr.lang
  const language_list = lodash.get(UserCtr, 'user_info.languageList')
  if (language_list) {
    const lang_arr = language_list.split(",");
      Object.keys(lang_default).forEach((item) => {
        if (lang_arr.includes(item)) {
          lang_obj.value[item] = lang_default[item];
        }
      });
  }
})
// 切换语言
const setting_language_handle = (key) => {
  BaseData.set_base_data_menu_i18n()
  // 切换语言后需要更新接口缓存数据get_user_language_switch
  api_account.get_user_language_switch({
        languageSwitch: key == 'hk' ? 1 : 0
  })
  api_account.set_user_lang({ token: UserCtr.get_user_token(), languageName: key }).then(res => {
    let code = lodash.get(res, 'code');
    if (code == 200) {
      lang.value = key
      // 设置国际化语言
      UserCtr.set_lang(key)
      // 设置国际化语言
      loadLanguageAsync(lang.value).then().finally(() => {
        go_back()
      })
    } else if (code == '0401038') {
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("msg.msg_nodata_22"))
    }
  })
}

</script>

<style scoped lang="scss">
.language-switch {
  background-color: var(--q-gb-bg-c-18);
  height: 100%;
  .header {
  display: flex;
  align-items: center;
  padding-left: 0.15rem;
  padding-top: 0.01rem;
  position: relative;
  height: 0.44rem;
  position: fixed;
  width: 100%;

  .go-back {
    color: #A3A3A3;
  }

  .title {
    font-size: 0.16rem;
    color: var(--q-gb-t-c-18);
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}
.content {
  background-color: var(--q-gb-bg-c-18);
  // 语言包
    margin-top: 0.44rem;
    height: 100%;
    transition: max-height 0.3s;

    .lang-item.active {
      max-height: 5.58rem;
      color: var(--q-gb-t-c-12)
    }
    
    .lang-item {
      height: 0.44rem;
      font-size: 0.14rem;
      display: flex;
      padding-left: 0.43rem;
      padding-right: 0.2rem;
      align-items: center;
      color: var(--q-gb-t-c-18);

      &:last-child {
        border-bottom: none;
      }
      .icon {
        display: none;
        width: 0.11rem;
        height: 0.07rem;
      }

      &.active {
        .icon {
          display: block;
        }
      }
    
  }
  /* ************** 切换语言前面的图标 ************** -S */
.lang-icon {
  width: 0.16rem;
  height: 0.125rem;
  --per: -0.17rem;
  // transform: translateY(-1px);
  background-image: url($SCSSPROJECTPATH + "/image/png/h5_lang_icon.png");
}

/*语言国旗图标*/
@each $code,
  $index
    in (
      zh: 0,
      en: 1,
      tw: 2,
      vi: 3,
      th: 5,
      ms: 4,
      ad: 6,
      mya: 7,
      ry: 8,
      pt: 9,
      ko: 10,
      es: 11,
      ru: 12
    )
{
  .lang-#{$code} {
    background-position-y: calc(var(--per) * #{$index});
    background-size: cover;
  }
}
/* ************** 切换语言前面的图标 ************** -E */
}
}

</style>