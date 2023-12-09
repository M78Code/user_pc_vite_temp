
/**
 * @description 需要动态传入的组件
 */
import { PROJECT_NAME } from 'src/output/module/constant-utils.js'

// 组件配置 （需要使用相对路径）
const comp_config = {
  // 赛事卡片组件
  'match-container': {
    'app-h5': `/src/base-h5/components/match-list/components/match-container-2.vue`,
    'yazhou-h5': `/src/base-h5/components/match-list/components/match-container.vue`,
    'ou-zhou': '....'
  },
  // 投注组件
  'bet-wrapper': {
    'app-h5': `...`,
    'yazhou-h5': `...`
  },
  // 详情tab栏组件
  'details-tab': { 
    'app-h5': `/src/base-h5/components/details/components/details-tab-2.vue`,
    'yazhou-h5': `/src/base-h5/components/details/components/details-tab.vue`
  },
  // 详情盘口组件
  'tournament-play': { 
    'app-h5': `/src/base-h5/components/details/components/tournament-play/tournament-play-new-2.vue`,
    'yazhou-h5': `/src/base-h5/components/details/components/tournament-play/tournament-play-new.vue`
  }
}


// 导出动态组件 （根据 PROJECT_NAME 区分的组件， 组件内不要使用 v-if v-else 判断， 避免全部打包）
export const import_vue_component = async (name) => {
  if (!comp_config[name]) return
  const path = comp_config[name][PROJECT_NAME]
  const components = await import(/* @vite-ignore */`${path}`)
  return components;
};

