import { useRef } from 'react'
import ReactQuill, { Quill } from 'react-quill'

import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import '#assets/css/EditorStyles.scss' // Nơi đặt CSS tùy chỉnh

// Tạo custom blot
const Embed = Quill.import('blots/embed')

class VariableBlot extends Embed {
  static create(value: string) {
    const node = super.create()
    node.setAttribute('data-name', value)
    node.innerHTML = `
      <span class="variable-badge">
        <i class="variable-icon">&lt;/&gt;</i>
        <span class="variable-value">{{${value}}}</span>
        <button class="remove-variable">x</button>
      </span>`

    setTimeout(() => {
      const removeButton = node.querySelector('.remove-variable')
      if (removeButton) {
        removeButton.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation()
          node.remove()
        })
      }
    }, 0)
    return node
  }

  static value(node: HTMLElement) {
    return node.getAttribute('data-name')
  }
}

VariableBlot.blotName = 'variable'
VariableBlot.tagName = 'span'
VariableBlot.className = 'custom-variable'

Quill.register(VariableBlot)

class ClusterVariableBlot extends Embed {
  static create(value: string) {
    const node = super.create()
    node.setAttribute('data-name', value)
    node.innerHTML = `
      <span class="cluster-variable-badge">
        <span class="cluster-variable-value">[[${value}]]</span>
        <button class="remove-cluster-variable">x</button>
      </span>`

    setTimeout(() => {
      const removeButton = node.querySelector('.remove-cluster-variable')
      if (removeButton) {
        removeButton.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation()
          node.remove()
        })
      }
    }, 0)
    return node
  }

  static value(node: HTMLElement) {
    return node.getAttribute('data-name')
  }
}

ClusterVariableBlot.blotName = 'cluster-variable'
ClusterVariableBlot.tagName = 'span'
ClusterVariableBlot.className = 'custom-cluster-variable'

Quill.register(ClusterVariableBlot)

export const useReactQuill = () => {
  const quillRef = useRef<ReactQuill | null>(null)

  const insertVariable = (variable: string) => {
    const quill = quillRef.current ? quillRef.current.getEditor() : null
    if (!quill) return

    const cursorPosition = quill.getSelection()?.index ?? 0
    quill.insertEmbed(cursorPosition, 'variable', variable)
    quill.setSelection({ index: cursorPosition + 1, length: 0 }) // Đặt lại con trỏ sau biến
  }

  const insertClusterVariable = (variable: string) => {
    const quill = quillRef.current ? quillRef.current.getEditor() : null
    if (!quill) return

    const cursorPosition = quill.getSelection()?.index ?? 0
    quill.insertEmbed(cursorPosition, 'cluster-variable', variable)
    quill.setSelection({ index: cursorPosition + 1, length: 0 }) // Đặt lại con trỏ sau biến
  }

  return { quillRef, insertVariable, insertClusterVariable }
}

//Convert HTML to Param
export const convertToParam = (quill: string) => {
  if (!quill) return ''

  // Parse HTML bằng DOMParser
  const parser = new DOMParser()
  const doc = parser.parseFromString(quill, 'text/html')
  // Tìm tất cả các thẻ <span class="custom-variable">
  const customVariables = doc.querySelectorAll('span.custom-variable')

  // Duyệt qua từng thẻ và thay thế bằng {{variable}}
  customVariables.forEach((span) => {
    const variableValueElement = span.querySelector('.variable-value')
    if (variableValueElement) {
      const variableName = variableValueElement.textContent?.trim() // Lấy giá trị {{Variable}}
      if (variableName) {
        // Thay thế thẻ <span> bằng {{variable}}
        const replacement = document.createTextNode(`${variableName}`)
        span.replaceWith(replacement)
      }
    }
  })
  // Trả lại HTML sau khi thay đổi
  let htmlContent = doc.body.innerHTML
  //Regex tìm \t
  htmlContent = htmlContent.replace(/\t/g, '<span>&emsp;</span>')
  //Regex tìm 2 khoảng trắng
  htmlContent = htmlContent.replace(/ {2}/g, '<span>&ensp;</span>')
  return htmlContent
}

export const convertToHtml = (param: string, isDisplay: boolean) => {
  if (!param) return ''

  // Regex tìm {{variable}}
  const replacedHtml = param.replace(/{{(.*?)}}/g, (_: string, variableName: string) => {
    return `
      <span class="custom-variable" data-name="${variableName}">
        <span contenteditable="false">
          <span class="variable-badge">
            <i class="variable-icon">&lt;/&gt;</i>
            <span class="variable-value">{{${variableName}}}</span>
            ${isDisplay ? '' : '<button class="remove-variable">x</button>'}
          </span>
        </span>
      </span>
    `
  })

  return replacedHtml
}

export const convertToHtmlCluster = (param: string, isDisplay: boolean) => {
  if (!param) return ''

  // Regex tìm [[variable]]
  const replacedHtml = param.replace(/\[\[(.*?)]]/g, (_: string, variableName: string) => {
    return `
      <span class="custom-cluster-variable" data-name="${variableName}">
        <span contenteditable="false">
          <span class="cluster-variable-badge">
            <span class="cluster-variable-value">[[${variableName}]]</span>
            ${isDisplay ? '' : '<button class="remove-cluster-variable">x</button>'}
          </span>
        </span>
      </span>
    `
  })

  return replacedHtml
}

export const convertToParamCluster = (quill: string) => {
  if (!quill) return ''

  // Parse HTML bằng DOMParser
  const parser = new DOMParser()
  const doc = parser.parseFromString(quill, 'text/html')
  // Tìm tất cả các thẻ <span class="custom-variable">
  const customVariables = doc.querySelectorAll('span.custom-cluster-variable')

  // Duyệt qua từng thẻ và thay thế bằng [[variable]]
  customVariables.forEach((span) => {
    const variableValueElement = span.querySelector('.cluster-variable-value')
    if (variableValueElement) {
      const variableName = variableValueElement.textContent?.trim() // Lấy giá trị [[Variable]]
      if (variableName) {
        // Thay thế thẻ <span> bằng [[variable]]
        const replacement = document.createTextNode(`${variableName}`)
        span.replaceWith(replacement)
      }
    }
  })
  // Trả lại HTML sau khi thay đổi
  let htmlContent = doc.body.innerHTML
  //Regex tìm \t
  htmlContent = htmlContent.replace(/\t/g, '<span>&emsp;</span>')
  //Regex tìm 2 khoảng trắng
  htmlContent = htmlContent.replace(/ {2}/g, '<span>&ensp;</span>')
  return htmlContent
}
