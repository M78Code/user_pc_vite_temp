

import * as path from "node:path";
import fs from "node:fs";
import lodash from "lodash";
import colors from "colors"
import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";
// 商户版本 最终配置
 
 


import shell from   "shelljs"
 
if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  }
  

 const format_date=(value)=>{
    let time = new Date(parseInt(value));
    let y = time.getFullYear();
    let m = (time.getMonth() + 1 + "").padStart(2, 0);
    let d = (time.getDate() + "").padStart(2, 0);
    let h = (time.getHours() + "").padStart(2, 0);
    let mm = (time.getMinutes() + "").padStart(2, 0);
    let s = (time.getSeconds() + "").padStart(2, 0);
    return `${y}-${m}-${d}T${h}:${mm}:${s}+08:00`;
  }

 


  
//   YYYY-MM-DD HH:MM   2019-03-06T08:00:00+08:00
//统计开始时间：
let since = '2023-12-24T00:00:00+08:00'
//统计截止时间：
// let until = '2023-12-26T23:59:00+08:00'
let until =  format_date(Date.now())
 

let commond4 =`git log --since ='2023-12-10T00:00:00+08:00' --until='${until}'   --format='%aN' `
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



let commond1 =`git log --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat: --since =${since} --until=${until} --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done`


 

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
//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
 
let result_str =JSON.stringify(fial_obj)
write_file(`${write_folder}/index.json`, result_str);





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
formart_str+= `统计分支名字: ${current_branch}`
formart_str+= `统计开始时间：${since} \n`
formart_str+= `统计截止时间：${until} \n`
formart_str+="\n"
formart_str+="\n"
formart_str+=  `${force_formart('名字',18)}\t${force_formart('新增行数',16)}\t${force_formart('删除行数',16)}\t${force_formart('逻辑行数',16)}\n`

let all_add=0
let all_subs=0
all_result.map(x=>{

formart_str+=`${ force_formart(x.name) } \t${ force_formart(x.add)}\t ${force_formart(x.subs)} \t ${force_formart(x.loc)} \n`
all_add+=x.add
all_subs+=x.subs
})


formart_str+= `${force_formart('总计')}\t${force_formart(all_add)}\t ${force_formart(all_subs)} \t ${ force_formart(all_add-all_subs)   } \n`

formart_str+="\n"
formart_str+="\n"
console.log(formart_str);


write_file(`${write_folder}/formart.md`, formart_str);