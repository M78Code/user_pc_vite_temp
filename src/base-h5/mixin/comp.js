
/**
 * @description 需要动态传入的组件
 */
import { PROJECT_NAME } from 'src/core'
import { defineAsyncComponent } from 'vue'

const comp_alias = {
  'yazhou-h5': '',
  'app-h5': 'app'
}

const comp_name = comp_alias[PROJECT_NAME] ? comp_alias[PROJECT_NAME] : ''


// 赛事卡片组件
export const matchContainer = defineAsyncComponent(() => 
  () => import(`src/base-h5/components/match-list/components/match-container-${comp_name}.vue`)
)