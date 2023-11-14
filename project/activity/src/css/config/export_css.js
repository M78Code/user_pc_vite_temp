/*
 * @Author: nuanYang
 * @Date: 2023-04-09 13:11:07
 * @Description: css配置导出json
 */
const {writeFileSync} = require("fs")
let common_color = require('./module/color.js');
let common_border = require('./module/border.js');
let common_background = require('./module/background.js');


const created_json = (css_obj = {}, group = "") => {
	let css_all_obj = {}
	for (const key in css_obj) {
		css_all_obj[key] = {
			group,
			project: 2,
			root: 1,
			description: '',
			mark: '',
			night: css_obj[key].t2,
			day: css_obj[key].t1,
		}
	}
	return css_all_obj
}


const created_file = async () => {
	let css_str = JSON.stringify({ ...created_json(common_color, 'color'), ...created_json(common_border, 'border'), ...created_json(common_background, 'background') }, null, 2)
	try {
		let data = await writeFileSync('./css根变量-PC.json', css_str)
		if (!data) {
			console.log("写入成功");
		}
	} catch (error) {
		console.log("写入失败", error);
	}
}
created_file()