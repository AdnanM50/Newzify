import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Loader2, Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import TiptapEditor from "../../common/TiptapEditor";
import MultiSelect from "../../common/MultiSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  createNews,
  updateNews,
  uploadImage,
  deleteImage,
  type TNews,
  type TCategory,
} from "../../../helpers/backend";
import { useAction } from "../../../helpers/hooks";

const TYPE_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Trending", value: "trending" },
  { label: "Popular", value: "popular" },
  { label: "Fresh", value: "fresh" },
  { label: "Top", value: "top" },
];

interface NewsFormProps {
  initialData?: TNews | null;
  categories: TCategory[];
  onSuccess: () => void;
  onCancel: () => void;
}

const NewsForm = ({ initialData, categories, onSuccess, onCancel }: NewsFormProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<TNews>();

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title);
      setValue("slug", initialData.slug);
      setValue("content", initialData.content);
      const catId = typeof initialData.category === 'object' && initialData.category ? (initialData.category as any)._id : initialData.category;
      setValue("category", catId);
      setValue("status", initialData.status || "draft");
      setValue("types", initialData.types || []);
      setPreviewImage(initialData.image || null);
    }
  }, [initialData, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const getPublicIdFromUrl = (url: string) => {
    try {
      if (!url) return null;
      const parts = url.split('/upload/');
      if (parts.length < 2) return null;
      let path = parts[1];
      path = path.replace(/^v\d+\//, '');
      path = path.replace(/\.[^/.]+$/, "");
      return path;
    } catch (e) {
      console.error("Error extracting public_id", e);
      return null;
    }
  };

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    try {
      const uploadRes = await uploadImage({ image: file });
      const responseCtx = uploadRes as any;
      if (responseCtx.url) return responseCtx.url;
      if (responseCtx.data && responseCtx.data.url) return responseCtx.data.url;
      return null;
    } catch (e) {
      console.error("Upload failed", e);
      toast.error("Image upload failed");
      return null;
    }
  };

  const { mutateAsync: create } = useAction(createNews, {
    successMessage: "News created successfully",
  });

  const { mutateAsync: update } = useAction(updateNews, {
    successMessage: "News updated successfully",
  });

  const onSubmit = async (data: TNews) => {
    try {
      let imageUrl = initialData?.image || "";

      if (selectedImage) {
        setUploadingImage(true);
        const url = await uploadSingleFile(selectedImage);
        if (url) imageUrl = url;
        setUploadingImage(false);
      }

      if (!imageUrl && !initialData) {
        toast.error("Please upload main image");
        return;
      }

      const payloadBody = {
        ...data,
        image: imageUrl,
        types: data.types || [],
      };

      if (initialData) {
        const oldImage = initialData.image;
        await update({ body: { ...payloadBody, _id: initialData._id } });
        
        if (selectedImage && oldImage && oldImage !== imageUrl) {
            const publicId = getPublicIdFromUrl(oldImage);
            if (publicId) {
                deleteImage({ public_id: publicId }).catch(e => console.error("Failed to delete old image", e));
            }
        }
      } else {
        await create({ body: payloadBody });
      }
      onSuccess();
    } catch (error) {
      console.error("Submission error", error);
      setUploadingImage(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">{initialData ? "Edit News" : "Create New Article"}</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="grid grid-cols-1 lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Main Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative h-64">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {previewImage ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <img src={previewImage} alt="Main Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setPreviewImage(null); setSelectedImage(null); }}
                      className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white text-gray-700 z-10"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ImageIcon size={20} />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Upload Main Image</p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Article title"
              />
              {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <Controller
                name="content"
                control={control}
                rules={{ required: "Content is required" }}
                render={({ field }) => (
                  <TiptapEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.content && <span className="text-red-500 text-xs">{errors.content.message}</span>}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                defaultValue={initialData?.category as string || ""}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                  >
                    <SelectTrigger className="w-full !h-[45px]">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Section Type (Optional)</label>
              <Controller
                name="types"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={TYPE_OPTIONS}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select news types..."
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <Controller
                name="status"
                control={control}
                defaultValue={initialData?.status || "draft"}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full !h-[45px]">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploadingImage}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            {uploadingImage && <Loader2 className="animate-spin" size={18} />}
            {uploadingImage ? 'Uploading Image...' : (initialData ? 'Update Article' : 'Publish Article')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
