import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

const EXTENSIONS = [
  StarterKit.configure({ heading: false }),
  Link.configure({ openOnClick: false }),
];

// Renders Tiptap JSON via Tiptap/ProseMirror's own DOM construction (an
// editor in read-only mode), not by parsing an HTML string — so there's
// nothing here that needs sanitizing to stay safe from injected markup.
export function RichTextContent({
  content,
  className,
}: {
  content: JSONContent;
  className?: string;
}) {
  const editor = useEditor({
    extensions: EXTENSIONS,
    content,
    editable: false,
    editorProps: {
      attributes: { class: className ?? "" },
    },
  });

  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
