import useIsMounted from "@/hooks/useIsMounted";
import React, { FC } from "react";
import { Button } from "./button";
import { ImagePlusIcon, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  isDisabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

export const ImageUpload: FC<ImageUploadProps> = ({ isDisabled, onChange, onRemove, value }) => {
  const isMounted = useIsMounted();

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) return null;

  return (
    <div>
      <div className='mb-4 flex items-center gap-4'>
        {value.map((url) => (
          <div key={url} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
            <div className='z-10 absolute top-2 right-2'>
              <Button type='button' onClick={() => onRemove(url)} variant='destructive' size='icon'>
                <Trash className='h-4 w-4' />
              </Button>
            </div>
            <Image fill className='object-cover' alt='Image' src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset='ahekhvai'>
        {({ open }) => (
          <Button type='button' disabled={isDisabled} variant='secondary' onClick={() => open()}>
            <ImagePlusIcon className='h-4 w-4 mr-2' /> Upload an image
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
};
