 
/**
 * 复制OSS 到本地
 * 前端代码内 OSS 添加一个计算出来的路径
 *
 * 前端当前域名+/oss/+(dev|test|lspre|play|prod)+.json
 *
 */

//  console.log(process.argv);
 const fs = require("fs");
 const axios = require("axios");
 let BUILD_VERSION =     require('./version.js').BUILD_VERSION;

 // is_dist  是 true 则 则 目录在 dist/spa 下生成oss 目录
 const is_dist =  (''+ process.argv[2]).trim() == 'dist'





 if(is_dist){
   fs.stat("./dist/spa", (err, stats) => {

    //  console.log('stats-----',stats);

     if(stats){
       fs.rm(`./dist/spa/${BUILD_VERSION}/oss`, { recursive: true, force: true },(err)=>{
         console.log(err);
       })


     }


   });


 }




 // return  false
 // OSS--开发---- https://api-json.sportxxx25o1bmw.com/dev.json
 // OSS--测试---- https://api-json.sportxxx25o1bmw.com/test.json
 // OSS--隔离---- https://api-json.sportxxx25o1bmw.com/lspre.json
 // OSS--试玩预发布---- https://api-json.sportxxx25o1bmw.com/play.json
 // OSS--生产---- https://xbnhjktbwggfvyok.ybgjhb.com/prod.json
 // OSS--生产---- https://aukukktsxfauannt.zyakxf.com/prod.json
 // OSS--生产---- https://xbnhjktbwggfvyok.chinazjyh.com/prod.json
 // OSS--生产---- https://xbnhjktbwggfvyok.lcjzgt.com/prod.json

 const oss_arr = [
   "https://api-json.sportxxx25o1bmw.com/dev.json",
   "https://api-json.sportxxx25o1bmw.com/test.json",
   "https://api-json.sportxxx25o1bmw.com/lspre.json",
   "https://api-json.sportxxx25o1bmw.com/play.json",
   "https://api-json.sportxxx25o1bmw.com/mini.json",
   "https://xbnhjktbwggfvyok.ybgjhb.com/prod.json",
   "https://aukukktsxfauannt.zyakxf.com/prod.json",
   "https://xbnhjktbwggfvyok.chinazjyh.com/prod.json",
   "https://xbnhjktbwggfvyok.lcjzgt.com/prod.json",
 ];

 //计算文件名字
 function compute_file_name(str = "") {
   let arr = str.split("/");

   return arr[arr.length - 1].trim();
 }
 // 创建文件夹
 let check_dir =  is_dist?'./dist/spa/oss/':  "./public/oss/";


 console.log(  "当前OSS 写入 目录： " +check_dir );
 if (!fs.existsSync(check_dir)) {
   fs.mkdirSync(check_dir);
   console.log("文件夹[" + check_dir + "]建立成功");
 }

 // 拉取服务器资源 写入本地
 for (let i = 0; i < oss_arr.length; i++) {
   axios.get(oss_arr[i]).then((res) => {
    //  console.log(res);
     // console.log(  res.status    );
     // fs.writeFileSync(file, data[, options])
     if (res.data) {
       let file_name = compute_file_name(oss_arr[i]);
       let full_path = `${check_dir}${file_name}`;
      if(res.data){
        fs.writeFileSync(full_path, JSON.stringify(res.data));

       console.log("文件写入成功-------------输出信息 开始------------- ");
      //  console.log("源文件地址： " + oss_arr[i]);
      //  console.log("写入地址： " + full_path);
       console.log("文件写入成功-------------输出信息 结束------------- ");
      }else{
        console.log("源文件内容异常 --------- " );
        // console.log("源文件内容异常 --------- " +   oss_arr[i]);
      }

     }
   }) .catch(function (error) {
     console.error(error);
   })
 }

