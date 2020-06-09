import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Element Admin'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

//获取当前页面的标题
