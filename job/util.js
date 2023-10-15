


import { readFile } from 'fs/promises';

// const json = JSON.parse(await readFile(new URL('../../package.json', import.meta.url)));



export const  import_json_data= async(json_data_path)=>{

    // const json_data_module = await import( json_data_path, { assert: { type: "json" }, } );
    // const json_data = json_data_module.default;
    //  return json_data



     const json_data = JSON.parse(await readFile(new URL(json_data_path, import.meta.url)));

     return json_data

}

 




