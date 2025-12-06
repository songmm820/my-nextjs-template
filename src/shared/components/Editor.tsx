'use client'

import clsx from 'clsx'
import { forwardRef, useEffect, useImperativeHandle, useRef, type Ref } from 'react'
import Quill, { type Delta, type EmitterSource, type Range } from 'quill'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { type GetFunctionParameterType } from '~/types'

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'] // remove formatting button
]

type EditorProps = {
  className?: string
  readOnly?: boolean
  value?: GetFunctionParameterType<Quill['setContents'], 0>
  theme?: 'snow' | 'bubble'
  onTextChange?: (delta: Delta, oldContent: Delta, source: EmitterSource) => void
  onSelectionChange?: (range: Range, oldRange: Range, source: EmitterSource) => void
}

export type EditorRef = {
  [K in keyof Quill]: Quill[K]
}

const EditorComp = (props: EditorProps, ref: Ref<EditorRef>) => {
  const { className, readOnly, value, theme = 'bubble', onTextChange, onSelectionChange } = props
  const containerRef = useRef<HTMLDivElement | null>(null)
  const quillRef = useRef<Quill | null>(null)
  const valueRef = useRef<EditorProps['value']>(value)
  const onTextChangeRef = useRef<EditorProps['onTextChange']>(onTextChange)
  const onSelectionChangeRef = useRef<EditorProps['onSelectionChange']>(onSelectionChange)

  useEffect(() => {
    quillRef.current?.enable(!readOnly)
  }, [readOnly])

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const editorContainer = container.appendChild(container.ownerDocument.createElement('div'))
    editorContainer.setAttribute('id', 'my-editor')
    editorContainer.setAttribute('style', 'height: 100%; width: 100%;')
    const quill = new Quill(editorContainer, {
      theme: theme,
      modules: { toolbar: toolbarOptions }
    })
    quillRef.current = quill
    // 使用初始值
    if (valueRef.current) {
      quill.setContents(valueRef.current)
    }
    quill.on(Quill.events.TEXT_CHANGE, (...args) => {
      onTextChangeRef.current?.(...args)
    })
    quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
      onSelectionChangeRef.current?.(...args)
    })

    return () => {
      quillRef.current = null
      container.innerHTML = ''
    }
  }, [theme])

  useImperativeHandle(ref, () => {
    return new Proxy({} as EditorRef, {
      get(_target, prop) {
        const quill = quillRef.current
        if (!quill) return undefined
        const value = quill[prop as keyof Quill]
        if (typeof value === 'function') {
          return value.bind(quill)
        }
        return value
      }
    })
  }, [])

  return <div className={clsx('my-editor-container w-full h-full flex flex-col', className)} ref={containerRef} />
}

const Editor = forwardRef<EditorRef, EditorProps>(EditorComp)

Editor.displayName = 'Editor'

export default Editor
