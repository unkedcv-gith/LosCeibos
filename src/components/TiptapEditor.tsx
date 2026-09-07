import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link as LinkIcon, Heading1, Heading2 } from 'lucide-react'
import { useEffect } from 'react'

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  const addLink = () => {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-green-700' : 'text-gray-600'}`}
        title="Negrita"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-green-700' : 'text-gray-600'}`}
        title="Cursiva"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('underline') ? 'bg-gray-200 text-green-700' : 'text-gray-600'}`}
        title="Subrayado"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-gray-300 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded hover:bg-gray-200 transition-colors font-bold text-sm ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-green-700' : 'text-gray-600'}`}
        title="Título 1"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded hover:bg-gray-200 transition-colors font-bold text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-green-700' : 'text-gray-600'}`}
        title="Título 2"
      >
        H2
      </button>

      <div className="w-px h-5 bg-gray-300 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-green-700' : 'text-gray-600'}`}
        title="Alinear izquierda"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-green-700' : 'text-gray-600'}`}
        title="Alinear centro"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-green-700' : 'text-gray-600'}`}
        title="Alinear derecha"
      >
        <AlignRight className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-gray-300 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 text-green-700' : 'text-gray-600'}`}
        title="Lista de viñetas"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 text-green-700' : 'text-gray-600'}`}
        title="Lista numerada"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-gray-300 mx-1"></div>

      <button
        type="button"
        onClick={addLink}
        className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('link') ? 'bg-gray-200 text-green-700' : 'text-gray-600'}`}
        title="Enlace"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const TiptapEditor = ({ value, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[150px] max-h-[300px] overflow-y-auto',
      },
    },
  })

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden flex flex-col bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="quill-content tiptap-content flex-1" />
    </div>
  )
}
