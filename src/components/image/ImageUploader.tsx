import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {  Upload, X,  FileImage } from "lucide-react";
import { imageService } from "@/api/image";
import { SuccessToast } from "../shared/Toast";

interface Image {
  _id: string;
  title: string;
  imageURL: string;
  order: number;
}

interface ImageUploaderProps {
  onUploadSuccess: (images: Image[]) => void; 
}


interface ImagePreview {
  file: File;
  preview: string;
  title: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess }) => {
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [uploading, setUploading] = useState(false);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newPreviews: ImagePreview[] = [];

    Array.from(e.target.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newPreviews.push({
            file,
            preview: event.target.result as string,
            title: file.name.split(".")[0],
          });

          if (newPreviews.length === e.target.files!.length) {
            setImagePreviews((prev) => [...prev, ...newPreviews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleTitleChange = (index: number, title: string) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews[index].title = title;
    setImagePreviews(updatedPreviews);
  };

  const removePreview = (index: number) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  const handleUpload = async () => {
    if (imagePreviews.length === 0) {
      return;
    }

    setUploading(true);

    
   const formData = new FormData();

   imagePreviews.forEach((image) => {
     formData.append("images", image.file); 
     formData.append("titles", image.title); 
   });

      try {
        const response = await imageService.uploadImage(formData);
      if(response.data.success) {
        SuccessToast(response.data.message);
      }
        onUploadSuccess(response.data.images);
        setImagePreviews([]);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setUploading(false);
      }

     
      setImagePreviews([]);
      setUploading(false);
    
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-dashed border-2 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full">
              <Upload className="h-12 w-12 text-blue-500" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                Upload Your Images
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                Drag and drop your images here, or click to browse. Supports
                JPG, PNG, GIF (max 10MB per image)
              </p>
            </div>
            <div className="relative">
              <Button
                variant="default"
                className="relative z-10 bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <FileImage className="h-4 w-4" />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  Select Files
                </Label>
              </Button>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {imagePreviews.length > 0 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Images to upload ({imagePreviews.length})
            </h3>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {uploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-1" />
                  Upload All Images
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
            {imagePreviews.map((preview, index) => (
              <Card
                key={index}
                className="overflow-hidden group hover:shadow-md transition-shadow"
              >
                <div className="aspect-square relative bg-slate-100 dark:bg-slate-800">
                  <img
                    src={preview.preview}
                    alt={`Preview ${index}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors opacity-70 hover:opacity-100"
                    onClick={() => removePreview(index)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <CardContent className="p-3">
                  <Label
                    htmlFor={`title-${index}`}
                    className="text-xs text-slate-500 mb-1 block"
                  >
                    Image Title
                  </Label>
                  <Input
                    id={`title-${index}`}
                    value={preview.title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    placeholder="Enter image title"
                    className="text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
