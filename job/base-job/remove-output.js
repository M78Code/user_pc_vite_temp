/**
 * 删除脚本生成文件
 */

// const   colors = require('colors/safe');
 
import colors from "colors"
import { remove_file } from "../util-and-config/write-folder-file.js";
console.log("----process.argv---");

console.log(colors.red('删除脚本生成文件 目录：/job/output'))
 
 
remove_file(`./job/output/`);
remove_file(`./dist/`);
remove_file(`./src/output/project/`);
remove_file(`./src/api/index.js`);

remove_file(`./index.html`);