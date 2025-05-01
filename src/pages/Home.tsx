import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ImageUploader from "../components/image/ImageUploader";
import ImageGallery from "../components/image/ImageGallery";
import UserDropdown from "@/components/header/DropDown";
import ChangePasswordModal from "@/components/auth/ChangePasswordModal";
import { authService } from "@/api/auth";
import AlertDialog from "@/components/shared/AlertDialog";
import { useDispatch } from "react-redux";
import { removeUserToken } from "@/redux/slice/UserTokenSlice";
import { ErrorToast, SuccessToast } from "@/components/shared/Toast";
import { AxiosError } from "axios";
import { imageService } from "@/api/image";

interface Image {
  _id: string;
  title: string;
  imageURL: string;
  order: number;
}



const Home = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await imageService.getImages();

        if (response.data.success) {
          SuccessToast(response.data.message);
          setImages(response.data.images);
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
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(()=>{
     async function fetchUserData() {
    try {
      const response = await authService.getUser();
      if (response.data.success) {
        setUserEmail(response.data.user.email);
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
      setLoading(false);
    }
  }
    fetchUserData();
      
  },[])

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };
  const confirmLogout = async () => {
    try {
      await authService.logout();
      dispatch(removeUserToken());
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLogoutDialogOpen(false);
    }
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="w-full py-4 px-4 bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Visual Asset Ranger
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage and organize your visual assets with ease
            </p>
          </div>
          <div>
            <UserDropdown
              email={userEmail}
              onLogout={handleLogout}
              onChangePassword={handleChangePassword}
            />
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4">
        <Tabs defaultValue="gallery" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="gallery" className="text-lg py-3">
              Gallery
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-lg py-3">
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="focus:outline-none">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
              </div>
            ) : (
              <ImageGallery images={images} onImagesChange={setImages} />
            )}
          </TabsContent>

          <TabsContent value="upload" className="focus:outline-none">
            <ImageUploader onUploadSuccess={setImages} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="w-full py-4 px-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Visual Asset Ranger - Organize your image collection
          </p>
        </div>
      </footer>
      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
      <AlertDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      />
    </div>
  );
};

export default Home;
