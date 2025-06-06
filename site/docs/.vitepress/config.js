export default {
    themeConfig: {
      siteTitle: "hl-fe-components",
      nav: [
        { text: "指南", link: "/guide/installation/" },
        { text: "组件", link: "/components/button/" },
      ],
      socialLinks: [{ icon: "github", link: "https://git.healthlink.cn/healthlink/common/framework/hl-frontend/hl-fe-components/-/blob/feature-basic-component/packages/utils/resolver.ts" }],
      sidebar: {
        "/guide/": [
          {
            text: "基础",
            items: [
              {
                text: "安装",
                link: "/guide/installation",
              },
            ],
          },
        ],
        "/components/": [
          {
            text: "基础组件",
            items: [
              {
                text: "Button",
                link: "/components/button",
              },
              {
                text: "HlCropping",
                link: "/components/hl-cropping",
              },
              {
                text: "pdf预览组件",
                link: "/components/pdf-viewer",
              },
            ],
          },
          
        ],
      },
    },
  }
  