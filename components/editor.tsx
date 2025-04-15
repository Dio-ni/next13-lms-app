'use client';

import { FC, useState, useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

const WordLikeEditor: FC<EditorProps> = ({ onChange, value }) => {
  const [isReady, setIsReady] = useState(false);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    // Load ReactQuill only on client side
    if (typeof window !== 'undefined') {
      import('react-quill').then((Quill) => {
        // Register custom fonts
        const Font = Quill.default.import('formats/font');
        Font.whitelist = ['arial', 'times-new-roman', 'courier-new', 'georgia', 'verdana'];
        Quill.default.register(Font, true);

        setIsReady(true);
      });
    }
  }, []);

  if (!isReady) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[300px] p-4 border rounded"
      />
    );
  }

  const ReactQuill = require('react-quill').default;

  return (
    <div className="bg-white border rounded">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={{
          toolbar: {
            container: [
              [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'header': 1 }, { 'header': 2 }, 'blockquote', 'code-block'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }, { 'align': [] }],
              ['link', 'image', 'video', 'formula'],
              ['clean']
            ],
            handlers: {
              'image': imageHandler
            }
          },
          clipboard: {
            matchVisual: false,
          }
        }}
        formats={[
          'header', 'font', 'size',
          'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
          'list', 'bullet', 'indent',
          'link', 'image', 'video', 'formula',
          'color', 'background',
          'script', 'align', 'direction'
        ]}
        style={{ height: '500px' }}
      />
    </div>
  );
};

// Custom image handler function
function imageHandler() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (file) {
      // Handle image upload here
      const reader = new FileReader();
      reader.onload = (e) => {
        const range = this.quill.getSelection();
        this.quill.insertEmbed(range.index, 'image', e.target?.result, 'user');
      };
      reader.readAsDataURL(file);
    }
  };
}

export default WordLikeEditor;