'use client';

import toast from 'react-hot-toast';
import { UploadDropzone } from '@/lib/uploadthing';
import { ourFileRouter } from '@/app/api/uploadthing/core';

type FileUploadBaseProps = {
  endpoint: keyof typeof ourFileRouter;
};

type FileUploadWithName = FileUploadBaseProps & {
  withName: true;
  onChange: (value: { url: string; name: string }) => void;
};

type FileUploadWithoutName = FileUploadBaseProps & {
  withName?: false;
  onChange: (value: string) => void;
};

type FileUploadProps = FileUploadWithName | FileUploadWithoutName;

export const FileUpload = ({ onChange, endpoint, withName }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (!res) return;
        const file = res[0];
        if (!file) return;

        if (withName) {
          onChange({ url: file.url, name: file.name });
        } else {
          onChange(file.url);
        }
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
    />
  );
};
