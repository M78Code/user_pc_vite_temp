/*
 * @Author:
 * @Date: 2022-10-17 14:03:48
 * @Description:
 */
import all_in_one from "project/activity/src/css/config/module/all_in_one";
import alltheme from "project/activity/src/css/config/theme";
//为压缩js文件大小此处暂时转换一下，后期可整体替换

const oldKeys={
    // theme01: 't1',
    theme01: 'y1',
    theme02: 't2',
    theme01_y0: 'y1',
    theme02_y0: 'y2',
}

class setTheme {
    change_theme_variable(theme,theme_custom_callback) {
       
        theme = oldKeys[theme]
        // root-var 全局变量样式表内容
        let theme_style_content = ''
        
        for (const key in all_in_one) {
            // 设置 root 公共变量 
            theme_style_content += `\n  --qq--${key}: ${all_in_one[key]};`
        }
        if(theme_custom_callback){
            theme_custom_callback(alltheme);
        }
        // 当前样式主题对象
        for (const key in alltheme) {            
            let val = alltheme[key][theme]            
            if (val) {
                // 设置 root 变量 
                theme_style_content += `\n  --qq--${key}: ${val};`
            }
        }
        theme_style_content = `:root{${theme_style_content}\n}` 
        const root_var_stylesheet = document.querySelector('#root-var')
        if (!root_var_stylesheet) {
            // 创建style标签
            const style = document.createElement('style')
            // 设置style属性
            style.type = 'text/css'
            style.id = 'root-var'
            // 将主题样式写入style内
            style.innerHTML = theme_style_content
            // 将style样式存放到head标签
            document.querySelector('head').appendChild(style)
        } else {
            root_var_stylesheet.innerHTML = theme_style_content
        }

    }
}


export default  new setTheme

