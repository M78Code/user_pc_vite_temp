import { api_common } from "src/api/index.js"
import lodash_ from "lodash"
import { MenuData } from "src/output/project/index.js"

// 获取最近访问的赛种信息
const get_visit_sports_list = () => {
  api_common.get_visit_sports().then(res=>{

  })
}

// 点击赛种设置最近访问信息
const set_visit_count_list = () => {
  let parmas = {
    sportId: MenuData.current_ball_type
  }
  api_common.set_visit_count(parmas).then(res => {
    let code = lodash_.get(res,'code','')
    if(code == 200){
      // 添加成功后 获取最新的访问记录
      get_visit_sports_list()
    }
  })
}

export {
  get_visit_sports_list,
  set_visit_count_list,
}