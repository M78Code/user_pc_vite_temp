const fs = require('fs');
const path = require('path');
const images = require('images');
class Sprite {
  constructor() {
    // 设置参数
    this.params = this.get_params()
    // 设置图片列表
    this.files_arr = this.get_files_arr()
    if(this.files_arr.length == 0){
      console.log('没有图片')
      return
    }
    // 生成雪碧图
    this.create_sprite()
  }
  /**
   * @Description 获取运行参数 
   * @param {undefined} undefined
  */
  get_params(){
    let params = {
      dir:'images',
      type:1
    }
    process.argv.forEach( item => {
      let arr = item.split('=')
      if(arr[0] && arr[1]){
        params[arr[0]] = arr[1]
      }
    })
    params.file_dir = `${path.resolve()}/${params.dir}`
    return params
  }
  /**
   * @Description 获取图片文件列表 
   * @param {Array} 
  */
  get_files_arr(){
    let files_arr = []
    fs.existsSync(this.params.file_dir) && fs.readdirSync(this.params.file_dir).forEach( filename => {
      let suffix = filename.substring(filename.indexOf('.')).toLowerCase();
      if(!['.bmp','.png','.gif','.jpg','.jpeg'].includes(suffix) || filename.indexOf('sprite') > -1){
        return false
      }
      
      let file_path = path.join(this.params.file_dir, filename)
      if(!fs.statSync(file_path).isFile()){
        return false
      }
      
      files_arr.push({
        filename,
        file_path,
        sort: parseInt(filename.replace(/[^\d]/g,''))
      })

    })
    // 图片排序
    files_arr.sort((a,b) => a.sort - b.sort )
    return files_arr
  }
  /**
   * @Description 生成雪碧图 
   * @param {undefined} undefined
  */
  create_sprite(){
    // 单张图片大小
    let image_size = images(this.files_arr[0].file_path).size()
    // 雪碧图宽度
    let sprint_width = this.params.type == 1 ? image_size.width : image_size.width * this.files_arr.length
    // 雪碧图高度
    let sprint_height = this.params.type == 1 ? image_size.height * this.files_arr.length : image_size.height
    // 创建一个雪碧图
    let sprintImage = images(sprint_width,sprint_height); 
    let sprite_filename = `${path.resolve()}/${this.params.dir}/sprite.png`
    this.files_arr.forEach( (item,index) => {
      let x = this.params.type == 1 ? 0 : image_size.width * index
      let y = this.params.type == 1 ? image_size.height * index : 0
      let img = images(item.file_path)
      let size = img.size()
      // 判断每张图片大小是否一致
      if(size.width != image_size.width || size.height != image_size.height){
        console.log(`错误：${item.filename}和其他图片大小不一致`)
        // 删除图片
        if(fs.existsSync(sprite_filename)){
          fs.unlinkSync(sprite_filename);
        }
        process.exit()
      }
      // 绘制雪碧图
      sprintImage.draw(images(item.file_path), x, y);
    });
    sprintImage.save(sprite_filename);
    console.log('制作完成')
  }
}
new Sprite()
