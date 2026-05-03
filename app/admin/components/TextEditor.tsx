"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { type ReactNode, useEffect } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

type ToolbarButtonProps = {
  ariaLabel: string;
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function ToolbarButton({
  ariaLabel,
  icon,
  active = false,
  disabled = false,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={ariaLabel}
      aria-label={ariaLabel}
      className={`rounded-md border p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
      }`}
    >
      <span className="block h-4 w-4">{icon}</span>
    </button>
  );
}

function BoldIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M7 5h6a4 4 0 0 1 0 8H7z" /><path d="M7 13h7a4 4 0 0 1 0 8H7z" /></svg>;
}

function ItalicIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 4h-4" /><path d="M10 20h4" /><path d="M14 4 10 20" /></svg>;
}

function StrikeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 12h16" /><path d="M7 6c1.5-1.5 3.2-2 5-2 2.8 0 5 1.7 5 4" /><path d="M17 18c-1.3 1.5-3 2-5 2-2.8 0-5-1.7-5-4" /></svg>;
}

function BulletListIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="5" cy="6" r="1.5" /><circle cx="5" cy="12" r="1.5" /><circle cx="5" cy="18" r="1.5" /><path d="M9 6h10" /><path d="M9 12h10" /><path d="M9 18h10" /></svg>;
}

function OrderedListIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 6h2v4" /><path d="M4 10h3" /><path d="M4 16h3l-3 4h3" /><path d="M10 6h10" /><path d="M10 12h10" /><path d="M10 18h10" /></svg>;
}

function AlignLeftIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 6h16" /><path d="M4 10h10" /><path d="M4 14h16" /><path d="M4 18h10" /></svg>;
}

function AlignCenterIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 6h16" /><path d="M7 10h10" /><path d="M4 14h16" /><path d="M7 18h10" /></svg>;
}

function AlignRightIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 6h16" /><path d="M10 10h10" /><path d="M4 14h16" /><path d="M10 18h10" /></svg>;
}

function AlignJustifyIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 6h16" /><path d="M4 10h16" /><path d="M4 14h16" /><path d="M4 18h16" /></svg>;
}

function ImageIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="m21 16-5-4-4 3-3-2-6 5" /></svg>;
}

function UndoIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 7H4v5" /><path d="M20 18a8 8 0 0 0-8-8H4" /></svg>;
}

function RedoIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 7h5v5" /><path d="M4 18a8 8 0 0 1 8-8h8" /></svg>;
}

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image,
      Placeholder.configure({ placeholder: "Write full product description..." }),
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const groupClass = "flex items-center gap-2";
  const textSize = editor.isActive("heading", { level: 2 })
    ? "large"
    : editor.isActive("heading", { level: 3 })
      ? "medium"
      : "normal";

  function setTextSize(next: "normal" | "medium" | "large") {
    const chain = editor.chain().focus();
    if (next === "large") {
      chain.setHeading({ level: 2 }).run();
      return;
    }
    if (next === "medium") {
      chain.setHeading({ level: 3 }).run();
      return;
    }
    chain.setParagraph().run();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_18px_45px_-28px_rgba(24,24,27,0.25)]">
      <div className="border-b border-zinc-200 bg-white px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className={groupClass}>
            <ToolbarButton
              ariaLabel="Bold"
              icon={<BoldIcon />}
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <ToolbarButton
              ariaLabel="Italic"
              icon={<ItalicIcon />}
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <ToolbarButton
              ariaLabel="Strikethrough"
              icon={<StrikeIcon />}
              active={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            />
          </div>

          <div className={groupClass}>
            <label className="pl-1 text-xs font-semibold text-zinc-500" htmlFor="text-size-control">
              Size
            </label>
            <select
              id="text-size-control"
              value={textSize}
              onChange={(e) => setTextSize(e.target.value as "normal" | "medium" | "large")}
              className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs font-semibold text-zinc-700 outline-none focus:border-zinc-400"
            >
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className={groupClass}>
            <ToolbarButton
              ariaLabel="Bullet list"
              icon={<BulletListIcon />}
              active={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <ToolbarButton
              ariaLabel="Numbered list"
              icon={<OrderedListIcon />}
              active={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
          </div>

          <div className={groupClass}>
            <ToolbarButton
              ariaLabel="Align left"
              icon={<AlignLeftIcon />}
              active={editor.isActive({ textAlign: "left" })}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            />
            <ToolbarButton
              ariaLabel="Align center"
              icon={<AlignCenterIcon />}
              active={editor.isActive({ textAlign: "center" })}
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
            />
            <ToolbarButton
              ariaLabel="Align right"
              icon={<AlignRightIcon />}
              active={editor.isActive({ textAlign: "right" })}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            />
            <ToolbarButton
              ariaLabel="Justify"
              icon={<AlignJustifyIcon />}
              active={editor.isActive({ textAlign: "justify" })}
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            />
          </div>

          <div className={groupClass}>
            <ToolbarButton
              ariaLabel="Insert image"
              icon={<ImageIcon />}
              onClick={() => {
                const url = window.prompt("Image URL");
                if (url?.trim()) {
                  editor.chain().focus().setImage({ src: url.trim() }).run();
                }
              }}
            />
            <ToolbarButton
              ariaLabel="Undo"
              icon={<UndoIcon />}
              disabled={!editor.can().chain().focus().undo().run()}
              onClick={() => editor.chain().focus().undo().run()}
            />
            <ToolbarButton
              ariaLabel="Redo"
              icon={<RedoIcon />}
              disabled={!editor.can().chain().focus().redo().run()}
              onClick={() => editor.chain().focus().redo().run()}
            />
          </div>
        </div>
      </div>

      <EditorContent
        editor={editor}
        className="min-h-[16rem] bg-white px-4 py-4 text-zinc-900 [&_.ProseMirror]:min-h-[14rem] [&_.ProseMirror]:outline-none [&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:text-zinc-900 [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:text-zinc-900 [&_.ProseMirror_p]:leading-7 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-emerald-300 [&_.ProseMirror_blockquote]:pl-3 [&_.ProseMirror_img]:my-4 [&_.ProseMirror_img]:max-h-80 [&_.ProseMirror_img]:rounded-md [&_.ProseMirror_img]:border [&_.ProseMirror_img]:border-zinc-200"
      />
    </div>
  );
}