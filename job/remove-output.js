/**
 * 删除脚本生成文件
 */

// const   colors = require('colors/safe');
 
import colors from "colors"
import { remove_file } from "./write-folder-file.js";
console.log("----process.argv---");

console.log(colors.red('删除脚本生成文件 目录：/job/output'))
 
 
let full_path = `./job/output`;
remove_file(full_path);


 
remove_file(`./dist/`);
