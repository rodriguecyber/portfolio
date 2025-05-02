"use client"

import { useEffect, useRef } from "react"
import { Editor } from "@tinymce/tinymce-react"

interface BlogEditorProps {
  initialContent: string
  onChange: (content: string) => void
}

export default function BlogEditor({ initialContent, onChange }: BlogEditorProps) {
  const editorRef = useRef<any>(null)

  useEffect(() => {
    // Initialize TinyMCE with the initial content when the component mounts
    if (editorRef.current && initialContent) {
      editorRef.current.setContent(initialContent)
    }
  }, [initialContent])

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(evt, editor) => {
        editorRef.current = editor
      }}
      initialValue={initialContent}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style:
          "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px }",
      }}
      onEditorChange={(content) => onChange(content)}
    />
  )
}
