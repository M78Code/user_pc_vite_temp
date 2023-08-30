// entries/self-use-version/self-use-version.vite.config.js
import { defineConfig } from "file:///C:/Users/admin/Documents/user-pc-vite/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/admin/Documents/user-pc-vite/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { quasar, transformAssetUrls } from "file:///C:/Users/admin/Documents/user-pc-vite/node_modules/@quasar/vite-plugin/src/index.js";
import path from "path";

// job/output/merchant/config.json
var config_default = { TestComponent: { use_component: "TestComponent_2", params: { tableClass: "bg-deep-purple-14" } }, server_resource: {}, pack_up_info: { version: "0b1d5ec0284611eea47c132df8d8e15d", full_version: "0b1d5ec0284611eea47c132df8d8e15d-1691927205605-shiwan", day: "20230813", module_sdk_version: "20230813_0b1d5ec0284611eea47c132df8d8e15d-1691927205605-shiwan", client_version: "yazhou" }, css: {}, assets: { image01: { day: "http://api-doc-server-new.sportxxxw1box.com/public/upload/image/20230807/0d3576a034fa11ee9787bf07d9315309.png", night: "http://api-doc-server-new.sportxxxw1box.com/public/upload/image/20230807/09adaf7034fa11ee8ca5438c8f0192b1.png" }, "bet-menu-icon": { day: "http://api-doc-server-new.sportxxxw1box.com/public/upload/image/20230812/633a3cc038d311ee88d349760ccc2e11.png" } }, js: {}, MERCHANT_CONFIG_VERSION: "0b1d5ec0284611eea47c132df8d8e15d", project: "yazhou-pc", write_file_date: 1693403953783 };

// entries/self-use-version/self-use-version.vite.config.js
var __vite_injected_original_dirname = "C:\\Users\\admin\\Documents\\user-pc-vite\\entries\\self-use-version";
console.log("-------------__dirname---------", __vite_injected_original_dirname);
var { project } = config_default;
if (!project) {
  console.error("\u76EE\u6807\u9879\u76EE\u5FC5\u987B\u8BBE\u5B9A ----------");
  console.error("\u8FDB\u7A0B\u7ED3\u675F");
  process.exit(1);
} else {
  console.log("-------------project---------", project);
  console.log("");
  console.log("");
  console.log("");
  console.log("\u672C\u5730\u5F00\u53D1\u9700\u8981\u6253\u5F00\u5168\u8DEF\u5F84\uFF1A");
  console.log(`http://localhost:28300/project/${project}/index.html`);
  console.log("");
  console.log("");
  console.log("");
}
var self_use_version_vite_config_default = defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: `app/project/${project}/src/css/quasar-variables.scss`
    })
  ],
  // root: path.resolve(__dirname, `../../project/${project}/`),
  build: {
    outDir: "dist/self-use-version",
    rollupOptions: {
      // external: ["vue"],
      input: {
        index: path.resolve(__vite_injected_original_dirname, `../../project/${project}/index.html`)
      },
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          // vue: "Vue",
        }
      }
    }
  },
  resolve: {
    alias: {
      src: path.resolve(process.cwd(), "./src"),
      app: path.resolve(process.cwd(), "./"),
      dist: path.resolve(process.cwd(), "./dist"),
      node_modules: path.resolve(process.cwd(), "./node_modules"),
      public: path.resolve(process.cwd(), `./public/${project}`),
      project_path: path.resolve(process.cwd(), `./project/${project}`)
    }
  },
  server: {
    port: 28300,
    open: `../../project/${project}/index.html`,
    // open:    "../../project/yazhou-pc/index.html" ,
    hmr: true
  }
});
export {
  self_use_version_vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZW50cmllcy9zZWxmLXVzZS12ZXJzaW9uL3NlbGYtdXNlLXZlcnNpb24udml0ZS5jb25maWcuanMiLCAiam9iL291dHB1dC9tZXJjaGFudC9jb25maWcuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFkbWluXFxcXERvY3VtZW50c1xcXFx1c2VyLXBjLXZpdGVcXFxcZW50cmllc1xcXFxzZWxmLXVzZS12ZXJzaW9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhZG1pblxcXFxEb2N1bWVudHNcXFxcdXNlci1wYy12aXRlXFxcXGVudHJpZXNcXFxcc2VsZi11c2UtdmVyc2lvblxcXFxzZWxmLXVzZS12ZXJzaW9uLnZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hZG1pbi9Eb2N1bWVudHMvdXNlci1wYy12aXRlL2VudHJpZXMvc2VsZi11c2UtdmVyc2lvbi9zZWxmLXVzZS12ZXJzaW9uLnZpdGUuY29uZmlnLmpzXCI7Ly8gRklMRTogdml0ZS5jb25maWcuanNcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCB7IHF1YXNhciwgdHJhbnNmb3JtQXNzZXRVcmxzIH0gZnJvbSBcIkBxdWFzYXIvdml0ZS1wbHVnaW5cIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuXHJcbmNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLV9fZGlybmFtZS0tLS0tLS0tLVwiLCBfX2Rpcm5hbWUpO1xyXG5cclxuaW1wb3J0IEZJTkFMX01FUkNIQU5UX0NPTkZJRyBmcm9tIFwiLi4vLi4vam9iL291dHB1dC9tZXJjaGFudC9jb25maWcuanNvblwiO1xyXG5cclxubGV0IHsgcHJvamVjdCB9ID0gRklOQUxfTUVSQ0hBTlRfQ09ORklHO1xyXG5cclxuaWYgKCFwcm9qZWN0KSB7XHJcbiAgY29uc29sZS5lcnJvcihcIlx1NzZFRVx1NjgwN1x1OTg3OVx1NzZFRVx1NUZDNVx1OTg3Qlx1OEJCRVx1NUI5QSAtLS0tLS0tLS0tXCIpO1xyXG4gIGNvbnNvbGUuZXJyb3IoXCJcdThGREJcdTdBMEJcdTdFRDNcdTY3NUZcIik7XHJcbiAgcHJvY2Vzcy5leGl0KDEpXHJcbn0gZWxzZSB7XHJcbiAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tcHJvamVjdC0tLS0tLS0tLVwiLCBwcm9qZWN0KTtcclxuICBjb25zb2xlLmxvZygnJyk7XHJcbiAgY29uc29sZS5sb2coJycpO1xyXG4gIGNvbnNvbGUubG9nKCcnKTtcclxuICBjb25zb2xlLmxvZygnXHU2NzJDXHU1NzMwXHU1RjAwXHU1M0QxXHU5NzAwXHU4OTgxXHU2MjUzXHU1RjAwXHU1MTY4XHU4REVGXHU1Rjg0XHVGRjFBJyk7XHJcbiAgY29uc29sZS5sb2coYGh0dHA6Ly9sb2NhbGhvc3Q6MjgzMDAvcHJvamVjdC8ke3Byb2plY3R9L2luZGV4Lmh0bWxgKTtcclxuICBjb25zb2xlLmxvZygnJyk7XHJcbiAgY29uc29sZS5sb2coJycpO1xyXG4gIGNvbnNvbGUubG9nKCcnKTtcclxufVxyXG5cclxuIFxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSh7XHJcbiAgICAgIHRlbXBsYXRlOiB7IHRyYW5zZm9ybUFzc2V0VXJscyB9LFxyXG4gICAgfSksXHJcblxyXG4gICAgcXVhc2FyKHtcclxuICAgICAgc2Fzc1ZhcmlhYmxlczogYGFwcC9wcm9qZWN0LyR7cHJvamVjdH0vc3JjL2Nzcy9xdWFzYXItdmFyaWFibGVzLnNjc3NgLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICAgIC8vIHJvb3Q6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGAuLi8uLi9wcm9qZWN0LyR7cHJvamVjdH0vYCksXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogXCJkaXN0L3NlbGYtdXNlLXZlcnNpb25cIixcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgLy8gZXh0ZXJuYWw6IFtcInZ1ZVwiXSxcclxuICAgICAgaW5wdXQ6IHtcclxuXHJcbiAgICAgIGluZGV4OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBgLi4vLi4vcHJvamVjdC8ke3Byb2plY3R9L2luZGV4Lmh0bWxgKSxcclxuICAgICBcclxuICAgICAgfSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgLy8gUHJvdmlkZSBnbG9iYWwgdmFyaWFibGVzIHRvIHVzZSBpbiB0aGUgVU1EIGJ1aWxkXHJcbiAgICAgICAgLy8gQWRkIGV4dGVybmFsIGRlcHMgaGVyZVxyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIC8vIHZ1ZTogXCJWdWVcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIHNyYzogcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwiLi9zcmNcIiksXHJcbiAgICAgIGFwcDogcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwiLi9cIiksXHJcbiAgICAgIGRpc3Q6IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcIi4vZGlzdFwiKSxcclxuICAgICAgbm9kZV9tb2R1bGVzOiBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCIuL25vZGVfbW9kdWxlc1wiKSxcclxuICAgICAgcHVibGljOiBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgYC4vcHVibGljLyR7cHJvamVjdH1gKSxcclxuICAgICAgcHJvamVjdF9wYXRoOiBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgYC4vcHJvamVjdC8ke3Byb2plY3R9YCksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiAyODMwMCxcclxuICAgICBvcGVuOiBgLi4vLi4vcHJvamVjdC8ke3Byb2plY3R9L2luZGV4Lmh0bWxgLFxyXG4gICAgLy8gb3BlbjogICAgXCIuLi8uLi9wcm9qZWN0L3lhemhvdS1wYy9pbmRleC5odG1sXCIgLFxyXG4gICAgaG1yOiB0cnVlLFxyXG4gIH0sXHJcbn0pO1xyXG4iLCAie1wiVGVzdENvbXBvbmVudFwiOntcInVzZV9jb21wb25lbnRcIjpcIlRlc3RDb21wb25lbnRfMlwiLFwicGFyYW1zXCI6e1widGFibGVDbGFzc1wiOlwiYmctZGVlcC1wdXJwbGUtMTRcIn19LFwic2VydmVyX3Jlc291cmNlXCI6e30sXCJwYWNrX3VwX2luZm9cIjp7XCJ2ZXJzaW9uXCI6XCIwYjFkNWVjMDI4NDYxMWVlYTQ3YzEzMmRmOGQ4ZTE1ZFwiLFwiZnVsbF92ZXJzaW9uXCI6XCIwYjFkNWVjMDI4NDYxMWVlYTQ3YzEzMmRmOGQ4ZTE1ZC0xNjkxOTI3MjA1NjA1LXNoaXdhblwiLFwiZGF5XCI6XCIyMDIzMDgxM1wiLFwibW9kdWxlX3Nka192ZXJzaW9uXCI6XCIyMDIzMDgxM18wYjFkNWVjMDI4NDYxMWVlYTQ3YzEzMmRmOGQ4ZTE1ZC0xNjkxOTI3MjA1NjA1LXNoaXdhblwiLFwiY2xpZW50X3ZlcnNpb25cIjpcInlhemhvdVwifSxcImNzc1wiOnt9LFwiYXNzZXRzXCI6e1wiaW1hZ2UwMVwiOntcImRheVwiOlwiaHR0cDovL2FwaS1kb2Mtc2VydmVyLW5ldy5zcG9ydHh4eHcxYm94LmNvbS9wdWJsaWMvdXBsb2FkL2ltYWdlLzIwMjMwODA3LzBkMzU3NmEwMzRmYTExZWU5Nzg3YmYwN2Q5MzE1MzA5LnBuZ1wiLFwibmlnaHRcIjpcImh0dHA6Ly9hcGktZG9jLXNlcnZlci1uZXcuc3BvcnR4eHh3MWJveC5jb20vcHVibGljL3VwbG9hZC9pbWFnZS8yMDIzMDgwNy8wOWFkYWY3MDM0ZmExMWVlOGNhNTQzOGM4ZjAxOTJiMS5wbmdcIn0sXCJiZXQtbWVudS1pY29uXCI6e1wiZGF5XCI6XCJodHRwOi8vYXBpLWRvYy1zZXJ2ZXItbmV3LnNwb3J0eHh4dzFib3guY29tL3B1YmxpYy91cGxvYWQvaW1hZ2UvMjAyMzA4MTIvNjMzYTNjYzAzOGQzMTFlZTg4ZDM0OTc2MGNjYzJlMTEucG5nXCJ9fSxcImpzXCI6e30sXCJNRVJDSEFOVF9DT05GSUdfVkVSU0lPTlwiOlwiMGIxZDVlYzAyODQ2MTFlZWE0N2MxMzJkZjhkOGUxNWRcIixcInByb2plY3RcIjpcInlhemhvdS1wY1wiLFwid3JpdGVfZmlsZV9kYXRlXCI6MTY5MzQwMzk1Mzc4M30iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsUUFBUSwwQkFBMEI7QUFDM0MsT0FBTyxVQUFVOzs7QUNKakIsdUJBQUMsZUFBZ0IsRUFBQyxlQUFnQixtQkFBa0IsUUFBUyxFQUFDLFlBQWEsb0JBQW1CLEVBQUMsR0FBRSxpQkFBa0IsQ0FBQyxHQUFFLGNBQWUsRUFBQyxTQUFVLG9DQUFtQyxjQUFlLHlEQUF3RCxLQUFNLFlBQVcsb0JBQXFCLGtFQUFpRSxnQkFBaUIsU0FBUSxHQUFFLEtBQU0sQ0FBQyxHQUFFLFFBQVMsRUFBQyxTQUFVLEVBQUMsS0FBTSxpSEFBZ0gsT0FBUSxnSEFBK0csR0FBRSxpQkFBZ0IsRUFBQyxLQUFNLGdIQUErRyxFQUFDLEdBQUUsSUFBSyxDQUFDLEdBQUUseUJBQTBCLG9DQUFtQyxTQUFVLGFBQVksaUJBQWtCLGNBQWE7OztBREE1NEIsSUFBTSxtQ0FBbUM7QUFNekMsUUFBUSxJQUFJLG1DQUFtQyxnQ0FBUztBQUl4RCxJQUFJLEVBQUUsUUFBUSxJQUFJO0FBRWxCLElBQUksQ0FBQyxTQUFTO0FBQ1osVUFBUSxNQUFNLDZEQUFxQjtBQUNuQyxVQUFRLE1BQU0sMEJBQU07QUFDcEIsVUFBUSxLQUFLLENBQUM7QUFDaEIsT0FBTztBQUNMLFVBQVEsSUFBSSxpQ0FBaUMsT0FBTztBQUNwRCxVQUFRLElBQUksRUFBRTtBQUNkLFVBQVEsSUFBSSxFQUFFO0FBQ2QsVUFBUSxJQUFJLEVBQUU7QUFDZCxVQUFRLElBQUksMEVBQWM7QUFDMUIsVUFBUSxJQUFJLGtDQUFrQyxPQUFPLGFBQWE7QUFDbEUsVUFBUSxJQUFJLEVBQUU7QUFDZCxVQUFRLElBQUksRUFBRTtBQUNkLFVBQVEsSUFBSSxFQUFFO0FBQ2hCO0FBSUEsSUFBTyx1Q0FBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLE1BQ0YsVUFBVSxFQUFFLG1CQUFtQjtBQUFBLElBQ2pDLENBQUM7QUFBQSxJQUVELE9BQU87QUFBQSxNQUNMLGVBQWUsZUFBZSxPQUFPO0FBQUEsSUFDdkMsQ0FBQztBQUFBLEVBQ0g7QUFBQTtBQUFBLEVBRUEsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBO0FBQUEsTUFFYixPQUFPO0FBQUEsUUFFUCxPQUFPLEtBQUssUUFBUSxrQ0FBVyxpQkFBaUIsT0FBTyxhQUFhO0FBQUEsTUFFcEU7QUFBQSxNQUNBLFFBQVE7QUFBQTtBQUFBO0FBQUEsUUFHTixTQUFTO0FBQUE7QUFBQSxRQUVUO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxRQUFRLElBQUksR0FBRyxPQUFPO0FBQUEsTUFDeEMsS0FBSyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsSUFBSTtBQUFBLE1BQ3JDLE1BQU0sS0FBSyxRQUFRLFFBQVEsSUFBSSxHQUFHLFFBQVE7QUFBQSxNQUMxQyxjQUFjLEtBQUssUUFBUSxRQUFRLElBQUksR0FBRyxnQkFBZ0I7QUFBQSxNQUMxRCxRQUFRLEtBQUssUUFBUSxRQUFRLElBQUksR0FBRyxZQUFZLE9BQU8sRUFBRTtBQUFBLE1BQ3pELGNBQWMsS0FBSyxRQUFRLFFBQVEsSUFBSSxHQUFHLGFBQWEsT0FBTyxFQUFFO0FBQUEsSUFDbEU7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTCxNQUFNLGlCQUFpQixPQUFPO0FBQUE7QUFBQSxJQUUvQixLQUFLO0FBQUEsRUFDUDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
