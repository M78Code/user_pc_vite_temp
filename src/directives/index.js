import check_img_installer from "./module/check-img.js"
import icon_installer from "./module/icon.js"
import img_installer from "./module/img.js"
import imgdef_installer from "./module/imgdef.js"
import tooltip_installer from "./module/tooltip.js"


  

const installer=(app)=>{
    check_img_installer(app);
    icon_installer(app);
    img_installer(app);
    imgdef_installer(app);
    tooltip_installer(app);

}

export default installer