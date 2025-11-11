import { extractStaticStyle } from 'antd-style'
import { useConfig } from 'vike-react/useConfig'
import type { PageContext } from 'vike/types'

export default (pageContext: PageContext) => {
  const config = useConfig()

  const pageHtml = pageContext.pageHtmlString
  const styles = extractStaticStyle(pageHtml).map((item) => item.style)

  config({ Head: styles })
}
