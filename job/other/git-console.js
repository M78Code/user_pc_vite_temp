//执行命令 npm run  git-console.js  30 ,后面的 30 为天数，统计天数 ，为数字 ，不传默认为 0 

import * as path from "node:path";
import fs from "node:fs";
import lodash from "lodash";
import colors from "colors"
import {

  write_file,
  remove_file,
} from "../util-and-config/write-folder-file.js";
// 商户版本 最终配置
 
import dayjs from "dayjs"; 


import shell from   "shelljs"
import open from "open";
 
if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  }
  
 

// console.log(process.argv);
// console.log(process.argv[2]);
let  argv_2=   parseInt(process.argv[2] )  
argv_2 = isNaN(argv_2)   ? 0 : argv_2
console.log('统计天数 -',argv_2);
//统计天数 
let tianshu = argv_2

 
//统计开始时间：
// let since = '2023-12-26T00:00:00+08:00'
let since =  dayjs() . subtract(tianshu,'day').format("YYYY-MM-DDT00:00:00Z") 
//统计截止时间：
// let until = '2023-12-26T23:59:00+08:00'
  
let until =  dayjs(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ")   
 
let since_name =  dayjs() . subtract(tianshu+30,'day').format("YYYY-MM-DDT00:00:00Z") 

 
let commond4 =`git log --since ='${since_name}' --until='${until}'   --format='%aN' `
//   let commond4 =`git log --since ='2023-12-23' --until='2023-12-26'   --format='%aN' `

//git log --since ='2023-12-24-00-00' --until='2023-12-26-23-59'   --format='%aN'
  let names=  shell.exec(commond4).split('\n')

  names =Array.from(new Set(names))

  names=  names.map(x=>{
   
let arr= x.split("")
 arr =lodash.pullAll(arr,['\'',"\""])
return arr.join("")
  })
  names=names.filter(x=>!!x)
console.log('names', JSON.stringify(names)  );
console.log('names',  names.length  );



let commond1 =`git log --format='%aN' | sort -u | while read name; do echo -en "$name|"; git log --author="$name" --pretty=tformat: --since =${since} --until=${until} --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done`


 

// let cmd1 =(name)=> `git log --author="${name}" --pretty=tformat: --since =${since} --until=${until} --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -;`
let cmd1 =(name)=> `git log --author="${name}" --pretty=tformat: --since =${since} --until=${until} --numstat `



const resolve_one=(str)=>{
    let add=0;
    let subs=0;

let arr= str.split('\n')

arr.map(x=>{
    let arr2=  x.split('\t')
    // console.log( arr2);
    add+= ( Number(arr2[0])||0)
    subs+=( Number( arr2[1]) ||0)
})

    let loc  = add - subs

    return  { add, subs, loc  }
}



let fial_obj={}
let resolve_lines=(str,x)=>{

    fial_obj[x]=  {...resolve_one(str),name:x}

}



names.map(x=>{
 
 
   let str =  shell.exec(cmd1(x)  ).toString()

   resolve_lines( str ,x)
})


 


// 输出目录
let write_folder = "./job/output/git";

 
let result_str =JSON.stringify(fial_obj)
write_file(`${write_folder}/index.json`, result_str);




//仓库地址
let fetch_remote_address = shell.exec( 'git remote -v  ' ).toString().split('\n')[0]
 


let force_formart=(str,len=20)=>{
    str= ''+str 

    str = str.padEnd( len," ")
    return str
}


let all_result= Object.values(fial_obj)


all_result.sort((a,b)=>a.add-b.add)

//git branch  --show-current
//  git  rev-parse --abbrev-ref HEAD
let current_branch =  shell.exec('git  rev-parse --abbrev-ref HEAD'  ).toString()
let formart_str=  `` 
formart_str+="\n"
formart_str+="\n"
formart_str+= `统计文件路径: ${write_folder}/formart.md\n`
formart_str+= `远程仓库地址: ${fetch_remote_address}\n`
formart_str+= `统计分支名字: ${current_branch}`
formart_str+= `统计完整天数: ${tianshu} \n`
formart_str+= `统计开始时间：${since} \n`
formart_str+= `统计截止时间：${until} \n`
formart_str+="\n"
formart_str+="\n"

formart_str+=  `| ${force_formart('名字',18)}|${force_formart('新增行数',16)}|${force_formart('删除行数',16)}|${force_formart('逻辑行数',16)}|\n`
formart_str+= " | ---- | ---- | ---- |---- |\n"
let all_add=0
let all_subs=0
all_result.map(x=>{

formart_str+=`|${ force_formart(x.name) } |${ force_formart(x.add)}| ${force_formart(x.subs)} | ${force_formart(x.loc)} |\n`
all_add+=x.add
all_subs+=x.subs
})


formart_str+= `|${force_formart('总计')}|${force_formart(all_add)}| ${force_formart(all_subs)} | ${ force_formart(all_add-all_subs)   } |\n`

formart_str+="\n"
formart_str+="\n"
console.log(formart_str);


write_file(`${write_folder}/formart.md`, formart_str);


open(`${write_folder}/formart.md`,{wait:true})

shell.exit(1)