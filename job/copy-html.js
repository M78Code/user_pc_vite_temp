/**
 * 复制打包后的 html 文件到外层目录
 */

const fs = require("fs");
const path =  require("path")

const BUILD_VERSION = require('./version.js').BUILD_VERSION;



// 递归创建文件夹
const mkdir = function(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdir(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

// 复制文件
const copyFile = function(src,copy){
  mkdir(path.dirname(copy));//创建目录
  fs.copyFile(src,copy,function(err){
    if(err) console.log('error')
  })
}

// 复制文件夹
const copyDir = function(src,dist){
  var paths = fs.readdirSync(src)
  paths.forEach( p => {
    var _src = src + '/' +p;
    var _dist = dist + '/' +p;
    var stat = fs.statSync(_src)
    if(stat.isFile()) {// 判断是文件还是目录
      copyFile(_src,_dist)
    } else if(stat.isDirectory()) {
      copyDir(_src, _dist)// 当是目录是，递归复制
    }
  })
}


let html_file= fs.readFileSync('./dist/spa/'+BUILD_VERSION+'/index.html');

// fs.writeFileSync(file, data[, options])
  // html_file

  console.log('html_file--',html_file);
fs.writeFileSync('./dist/spa/index.html',html_file)







// 复制page目录 和idnex.html同级
// copyDir('./public/page','./dist/spa/page')

// process.exit(1)
