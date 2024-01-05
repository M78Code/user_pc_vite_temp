

// import DetailPlayTemplate1Class from  "./play-template/play-template-1.js"



const modules = import.meta.globEager("./module/*.js");
let all_template_classes = {};
Object.keys(modules).forEach((key) => {
   let  file_name = key.replace("./module/", "").replace(".js", "");
  //  play-template-1
  let arr = file_name.split("-")
  let num = arr[arr.length-1]

  let module_name =  `DetailPlayTemplate${num}Class`
  all_template_classes[module_name] =  modules[key].default
});



export   {
  all_template_classes
}
