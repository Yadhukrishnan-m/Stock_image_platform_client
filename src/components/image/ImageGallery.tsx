import React, { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Move, Image as ImageIcon, Save } from "lucide-react";
import EditImageDialog from "./EditImageDialog";
import { ErrorToast, SuccessToast } from "../shared/Toast";
import { imageService } from "@/api/image";
import { AxiosError } from "axios";
import AlertDialog from "../shared/AlertDialog";

interface Image {
  _id: string;
  title: string;
  imageURL: string;
  order: number;
}

interface ImageGalleryProps {
  images: Image[];
  onImagesChange: (images: Image[]) => void;
}

// Define the drag item type
const ItemTypes = {
  IMAGE: "image",
};

// Individual image card component with drag functionality
const DraggableImageCard = ({
  image,
  index,
  moveImage,
  onEdit,
  onDelete,
}: {
  image: Image;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (image: Image) => void;
  onDelete: (id: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    hover: (item: { index: number }, ) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      moveImage(dragIndex, hoverIndex);

      // Update the index for the dragged item
      item.index = hoverIndex;
    },
  });

  // Combine drag and drop refs
  drag(drop(ref));

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div
      ref={ref}
      style={{ opacity }}
      className={`transition-all ${
        isDragging ? "scale-105 shadow-xl z-50" : ""
      }`}
    >
      <Card className="overflow-hidden group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
        <div className="aspect-square relative bg-slate-100 dark:bg-slate-800">
          <img
            src={image.imageURL}
            alt={image.title}
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div
            className="absolute top-3 right-3 bg-black/50 dark:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full cursor-grab hover:bg-black/70 dark:hover:bg-white/30 transition-colors"
            title="Drag to reorder"
          >
            <Move className="h-4 w-4" />
          </div>
        </div>
        <div className="p-4">
          <h3
            className="font-medium text-slate-800 dark:text-slate-200 mb-2 truncate"
            title={image.title}
          >
            {image.title}
          </h3>
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              className="text-slate-600 hover:text-blue-600 border-slate-200 hover:border-blue-200 dark:border-slate-700 dark:hover:border-blue-900"
              onClick={() => onEdit(image)}
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-slate-600 hover:text-red-600 border-slate-200 hover:border-red-200 dark:border-slate-700 dark:hover:border-red-900"
              onClick={() => onDelete(image._id)}
            >
              <Trash className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImagesChange,
}) => {
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reordered, setReordered] = useState(false);
  const [saving, setSaving] = useState(false);
 
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [imageToDeleteId, setImageToDeleteId] = useState<string | null>(null);


  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const draggedImage = images[dragIndex];
    const updatedImages = [...images];

    // Remove the dragged item
    updatedImages.splice(dragIndex, 1);
    // Insert at the new position
    updatedImages.splice(hoverIndex, 0, draggedImage);

    // Update the order property
    const reorderedImages = updatedImages.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    onImagesChange(reorderedImages);
    setReordered(true);
  };

  const saveOrder = async () => {
    setSaving(true);

    const reorderedImages = images.map((item, index) => ({
      _id: item._id,
      order: index + 1, // Set the order based on the new index
    }));


     try {
       // API call to save the new order in the database
       const response = await imageService.updateImageOrder(reorderedImages);

       if (response.data.success) {
         SuccessToast("Image order updated successfully");
       } else {
         ErrorToast("Failed to update image order");
       }
       setSaving(false);
       setReordered(false);
     } catch (error) {
        if (error instanceof AxiosError) {
          const errorMessage =
            error.response?.data?.message ?? "Something went wrong";
          ErrorToast(errorMessage);
        } else {
          ErrorToast("An unexpected error occurred");
        }
     }

  };

  const deleteImage = async (id: string) => {
               try {
             const response = await imageService.deleteImage(id);
    
             if (response.data.success) {
              SuccessToast(response.data.message);
             onImagesChange(images.filter((img) => img._id !== id));
             }
           } catch (error: unknown) {
             if (error instanceof AxiosError) {
               const errorMessage =
                 error.response?.data?.message ?? "Something went wrong";
               ErrorToast(errorMessage);
             } else {
               ErrorToast("An unexpected error occurred");
             }
           }
  };


  const handleConfirmDelete = async () => {
    if (!imageToDeleteId) return;

    await deleteImage(imageToDeleteId);
    setImageToDeleteId(null);
    setConfirmDialogOpen(false);
  };

  

  return (
    <div className="space-y-6">
      {editingImage && (
        <EditImageDialog
          image={editingImage}
          isOpen={isEditing}
          onClose={() => {
            setIsEditing(false);
            setEditingImage(null);
          }}
          onSuccess={onImagesChange}
        />
      )}

      {reordered && (
        <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full mr-3">
              <Save className="h-5 w-5 text-blue-500 dark:text-blue-300" />
            </div>
            <p className="text-blue-700 dark:text-blue-300 font-medium">
              You've changed the order of images
            </p>
          </div>
          <Button
            onClick={saveOrder}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                Saving...
              </>
            ) : (
              "Save New Order"
            )}
          </Button>
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-700/50 rounded-full mb-4">
            <ImageIcon className="h-12 w-12 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-800 dark:text-slate-200">
            No images yet
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Get started by uploading some images in the Upload tab
          </p>
        </div>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <DraggableImageCard
                key={image._id}
                image={image}
                index={index}
                moveImage={moveImage}
                onEdit={(image) => {
                  setEditingImage(image);
                  setIsEditing(true);
                }}
                onDelete={(id) => {
                  setImageToDeleteId(id);
                  setConfirmDialogOpen(true);
                }}
              />
            ))}
          </div>
        </DndProvider>
      )}

      <AlertDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this image? This action cannot be undone."
      />
    </div>
  );
};

export default ImageGallery;
