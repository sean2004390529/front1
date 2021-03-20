module.exports = {
  title: 'Sean System',//修改所有页面的名称

  /**
   * @type {boolean} true | false
   * @description 是否显示右侧悬浮配置按钮
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description 是否显示页面标签功能条
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description 是否将头部布局固定
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description 菜单栏中是否显示LOGO
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   * 没什么用
   */
  errorLog: 'production'
}
