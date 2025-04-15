'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FC, useEffect } from 'react';

interface PreviewProps {
  value: string;
}

const Preview: FC<PreviewProps> = ({ value }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) {
    return <div dangerouslySetInnerHTML={{ __html: value }} />;
  }

  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  );
};

export { Preview };