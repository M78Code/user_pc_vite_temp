





let  data= require('./menu-list.json')


let obj={}

function  digui(arr=[]   ){


  if(arr.length){
    arr.map(x=>{

      if(!x.mi.startsWith('50')){
        if(!obj[`mi_${x.mi}`]){
          obj[`mi_${x.mi}`]={}
         }
         obj[`mi_${x.mi}`]['tpl']=''


        if(   x['sl'] ) {
          digui(  x['sl'] )
        }


      }





    })
  }


}


digui(data)

console.log('obj');
console.log(obj);
