import userAxiosInstance from "../config/UserAxiosInstence";

export const imageService = {
  uploadImage: async (formData: FormData) => {
    return await userAxiosInstance.post("/upload-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getImages: async () => {
    return await userAxiosInstance.get("/get-images");
  },

  deleteImage: async (id: string) => {
    return await userAxiosInstance.delete("/delete-image/" + id);
  },

  editImage: async (formData: FormData) => {
    return await userAxiosInstance.post("/edit-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateImageOrder: async(reorderedImages: { _id: string; order: number }[]) => {   
    return await userAxiosInstance.post("/update-image-order", reorderedImages, )
  }
};

