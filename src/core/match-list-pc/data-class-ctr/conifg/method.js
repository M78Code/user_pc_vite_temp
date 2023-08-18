import lodash from 'lodash';

/**
    * @Description 设置默认模板
    * @param {Number} num 列数   
    * @param {Object} ol_template  单个投注项
    * @param {Number} ol_count 投注项数量   
  */
const set_default_tpl = (num, ol_template, ol_count = 3) => {
    let tpl_arr = []
    for (let index = 0; index < num; index++) {
        let ols = []
        for (let i = 0; i < ol_count; i++) {
            ols.push({ ...ol_template })
        }
        tpl_arr.push({ ols })
    }
    return tpl_arr
}
/**
   * @Description 修改模板玩法id
   * @param {Number} hpid  玩法id
   * @param {Array} temp_arr  原始模板
   * @param {String} calssName  添加样式
 */
const update_tpl_hpid = (hpid, temp_arr,calssName) => {
    let new_temp_arr = []
    lodash.each(temp_arr, hl => {
        let ols = []
        lodash.each(hl.ols, ol => {
            let cur_ol_template = { ...ol }
            ol._hpid && (cur_ol_template._hpid = hpid)
                if(calssName && ol.ot === 'Other'){
                    cur_ol_template.other_class+= ` ${calssName}`
                }
            ols.push(cur_ol_template)
        })
        new_temp_arr.push({ ols })
    })
    return new_temp_arr
}
/**
   * @Description 克隆数组
   * @param {Array} arr  克隆数组的数组
 */
const clone_arr = (arr) => {
    let new_arr = []
    lodash.merge(new_arr, arr || [])
    return new_arr
}


/**
 * @Description 构建13玩法模板
 * @param {Object} template_0 0号模板
 * @param {Object} template_13 13号模板
*/

const set_tpl_13_config = (template_0, template_13) => {
    let template_13_confg = {}
    let tem_name = Object.keys(template_13)
    lodash.each(tem_name, cur_tem_name => {
        template_13_confg[cur_tem_name] = [
            ...clone_arr(template_0[cur_tem_name]),
            ...clone_arr(template_13[cur_tem_name]),
        ]
    })
    return template_13_confg
}

/**
 * @Description 构建足球附加盘
 * @param {Array} main_temp 主盘
 * @return {Array} add_temp 附加盘
*/

const created_add_temp_config = (main_temp) => {
    let add_temp = []
    lodash.each(main_temp, col => {
       let ols = col.ols.slice(0,2)
       add_temp.push({ols})
    })
    return add_temp 
}

export { clone_arr, update_tpl_hpid, set_default_tpl, set_tpl_13_config,created_add_temp_config }