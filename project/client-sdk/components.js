const H5_modules = import.meta.glob("./src/components-h5/*/index.js",{ eager: true });
const PC_modules = import.meta.glob("./src/components-pc/*/index.js",{ eager: true });
const all_components = {};
console.log("H5_modules-------", H5_modules);
console.log("PC_modules-------", PC_modules);
for (let key in H5_modules) {
  console.log(`H5_modules[${key}]--`);
  let components = H5_modules[key].default;
  for (let i in components) {
    all_components[i] = components[i];
  }
}
for (let key in PC_modules) {
  console.log(`PC_modules[${key}]--`);
  let components = PC_modules[key].default;
  for (let i in components) {
    all_components[i] = components[i];
  }
}
console.log("all_components-------", all_components);
export default all_components;
