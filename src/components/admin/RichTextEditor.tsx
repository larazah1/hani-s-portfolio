import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Italic, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Minimal toolbar by design (bold/italic/link/paragraphs only) — matches
// what was actually asked for, not a full WYSIWYG suite. Content is stored
// as Tiptap's structured JSON (see `value`/`onChange`), never as a raw HTML
// string, so there's nothing to sanitize or risk injecting on render.
const EXTENSIONS = [
  StarterKit.configure({ heading: false }),
  Link.configure({ openOnClick: false, autolink: true }),
];

export function RichTextEditor({
  value,
  onChange,
}: {
  value: JSONContent;
  onChange: (json: JSONContent) => void;
}) {
  const editor = useEditor({
    extensions: EXTENSIONS,
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-32 rounded-b-md border border-t-0 border-input bg-transparent px-3 py-2 text-sm focus:outline-none [&_a]:text-accent-foreground [&_a]:underline",
      },
    },
  });

  if (!editor) return null;

  function setLink() {
    const previousUrl = editor?.getAttributes("link")["href"] as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "");
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div>
      <div className="flex items-center gap-1 rounded-t-md border border-input bg-secondary/40 p-1">
        <Button
          type="button"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          size="sm"
          className="h-7 w-7 p-0"
          onClick={setLink}
          aria-label="Link"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

export const EMPTY_RICH_TEXT: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

export function paragraphsToRichText(paragraphs: string[]): JSONContent {
  return {
    type: "doc",
    content:
      paragraphs.length > 0
        ? paragraphs.map((text) => ({ type: "paragraph", content: [{ type: "text", text }] }))
        : [{ type: "paragraph" }],
  };
}
