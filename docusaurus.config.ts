import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// 该配置文件在 Node.js 环境下运行，不要在此使用浏览器 API 或 JSX

const config: Config = {
  // 网站标题，会显示在浏览器标签页和首页等位置
  title: 'Chains',
  // 网站副标题，显示在首页等位置
  tagline: 'Dinosaurs are cool',
  // 网站 favicon 图标，显示在浏览器标签页左侧
  favicon: 'img/photo.jpg',

  // Docusaurus 未来版本相关的兼容性标志
  // v4: true 表示启用与 Docusaurus v4 的兼容性特性
  future: {
    v4: true, // 提前适配 Docusaurus v4
  },

  // 网站的生产环境 URL，影响 sitemap、SEO、RSS 等
  url: 'https://your-docusaurus-site.example.com',
  // 网站的基础路径，所有页面的 URL 都会以此为前缀
  // 部署到 GitHub Pages 时通常为 '/<项目名>/'
  baseUrl: '/',

  // GitHub Pages 部署相关配置
  // organizationName: GitHub 组织或用户名，用于生成 edit 链接等
  // organizationName: 'facebook',
  // projectName: GitHub 仓库名，用于生成 edit 链接等
  // projectName: 'docusaurus',

  // 发现断链时的处理方式，'throw' 表示构建时报错
  onBrokenLinks: 'throw',
  // 发现 Markdown 文件中的断链时的处理方式，'warn' 表示警告
  onBrokenMarkdownLinks: 'warn',

  // 国际化配置
  // defaultLocale: 默认语言
  // locales: 支持的语言列表
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // 预设配置，决定文档、博客、主题等功能
  presets: [
    [
      'classic', // 使用官方经典预设
      {
        docs: {
          // 侧边栏配置文件路径，影响文档页面的导航
          sidebarPath: './sidebars.ts',
          // 编辑此页面的链接，显示在文档页面底部
          editUrl: undefined,
        },
        blog: {
          // 是否显示阅读时间，影响博客页面
          showReadingTime: true,
          // 博客 RSS/Atom 订阅相关配置
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // 编辑此页面的链接，显示在博客页面底部
          editUrl: undefined,
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // 博客最佳实践相关警告
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          // 自定义 CSS 文件路径，影响全站样式
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // 主题相关配置，影响网站外观和导航
  themeConfig: {
    // 社交分享卡片图片，影响 SEO 和社交媒体分享
    // image: 'img/docusaurus-social-card.jpg',
    navbar: {
      // 顶部导航栏标题
      title: 'Chains Docs',
      // 顶部导航栏 logo 配置
      logo: {
        alt: 'My Site Logo', // logo 的替代文本
        src: 'img/photo.jpg', // logo 图片路径
      },
      // 顶部导航栏菜单项配置
      items: [
        {
          type: 'docSidebar', // 文档侧边栏入口
          sidebarId: 'noteSidebar', // 关联 sidebars.ts 中的 sidebarId
          position: 'left', // 显示在导航栏左侧
          label: '笔记', // 菜单项名称
        }, 
        // {
        //   href: 'https://github.com/facebook/docusaurus', // 外部链接
        //   label: 'GitHub', // 菜单项名称
        //   position: 'right', // 显示在导航栏右侧
        // },
      ],
    },

    prism: {
      // 代码高亮主题，影响代码块样式
      theme: prismThemes.github, // 浅色主题
      darkTheme: prismThemes.dracula, // 深色主题
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
