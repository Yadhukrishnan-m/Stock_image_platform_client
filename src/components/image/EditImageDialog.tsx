import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileImage, X } from "lucide-react";
import { imageService } from "@/api/image";
import { ErrorToast, SuccessToast } from "../shared/Toast";
import { AxiosError } from "axios";
interface Image {
  _id: string;
  title: string;
  imageURL: string;
  order: number;
}

interface EditImageDialogProps {
  image: {
    _id: string;
    title: string;
    imageURL: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (images: Image[]) => void;
}

const EditImageDialog: React.FC<EditImageDialogProps> = ({
  image,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState(image.title);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const clearSelectedFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("_id", image._id);
      formData.append("title", title);
      if (file) {
        formData.append("image", file);
      }

      const response = await imageService.editImage(formData);

      if (response.data.success) {
        SuccessToast(response.data.message);
           onSuccess(response.data.images)
           onClose()
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ?? "Something went wrong";
        ErrorToast(errorMessage);
      } else {
        ErrorToast("An unexpected error occurred");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Image
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-slate-700 dark:text-slate-300"
            >
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter image title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300">
              Current Image
            </Label>
            <div className="border rounded-md overflow-hidden bg-slate-50 dark:bg-slate-800 aspect-video">
              <img
                src={preview || image.imageURL}
                alt={title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="new-image"
              className="text-slate-700 dark:text-slate-300"
            >
              Replace Image (optional)
            </Label>

            {!file ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 border-slate-200 hover:border-blue-200 dark:border-slate-700 dark:hover:border-blue-900"
                  onClick={() => document.getElementById("new-image")?.click()}
                >
                  <FileImage className="h-4 w-4" />
                  Choose File
                </Button>
                <span className="text-sm text-slate-500">No file chosen</span>
                <Input
                  id="new-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="px-3 py-2 border rounded-md flex items-center justify-between w-full bg-slate-50 dark:bg-slate-800">
                  <span className="text-sm truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-red-500"
                    onClick={clearSelectedFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditImageDialog;
