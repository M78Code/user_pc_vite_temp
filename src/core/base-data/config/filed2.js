



let  old_menu= require('./menu-old.json')


let obj={}

function  digui(arr=[]   ){


  if(arr.length){
    arr.map(x=>{

     if(!obj[`euid_${x.menuId}`]){
      obj[`euid_${x.menuId}`]={}
     }
     obj[`euid_${x.menuId}`]['field2'] = x['field2']
     obj[`euid_${x.menuId}`]['menuType'] = x['menuType']

     digui(  x['topMenuList'] )
     digui(  x['subList'] )


    })
  }


}


digui(old_menu)

console.log('obj');
console.log(obj);
