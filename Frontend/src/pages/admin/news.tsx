
import { useState } from "react";
import { useFetch, useAction, useDelete } from "../../helpers/hooks";
import {
  getNewsList,
  createNews,
  updateNews,
  deleteNews,
  getCategories,
  uploadImage,
  deleteImage,
  type TNews,
  type TCategory,
  type PaginatedResponse,
} from "../../helpers/backend";
import { useForm, Controller } from "react-hook-form";
import { Trash, Edit, Loader2, Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import TiptapEditor from "../../components/common/TiptapEditor";

const News = () => {
  const [editingNews, setEditingNews] = useState<TNews | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: newsData, isLoading: isNewsLoading, refetch: refetchNews } = useFetch<PaginatedResponse<TNews>>(
    "news",
    getNewsList
  );
  const newsList = newsData?.docs || [];

  const { data: categoriesData } = useFetch<PaginatedResponse<TCategory>>("categories", getCategories);
  const categories = categoriesData?.docs || [];

  const { mutate: create, isLoading: isCreating } = useAction(createNews, {
    onSuccess: () => {
      resetForm();
      setActiveTab("list");
      refetchNews();
    },
    successMessage: "News created successfully",
  });

  const { mutateAsync: update, isLoading: isUpdating } = useAction(updateNews, {
    onSuccess: () => {
      resetForm();
      setActiveTab("list");
      refetchNews();
    },
    successMessage: "News updated successfully",
  });
  
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

  const { mutate: remove } = useDelete(deleteNews, {
    onSuccess: () => refetchNews(),
    successMessage: "News deleted successfully",
  });


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<TNews>();

  const resetForm = () => {
    setEditingNews(null);
    setSelectedImage(null);
    setPreviewImage(null);
    reset();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
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

  const onSubmit = async (data: TNews) => {
    try {
      let imageUrl = editingNews?.image || "";

      if (selectedImage) {
        setUploadingImage(true);
        
        const url = await uploadSingleFile(selectedImage);
        if (url) imageUrl = url;
         
        setUploadingImage(false);
      }

      if (!imageUrl && !editingNews) {
         toast.error("Please upload main image");
         return; 
      }
      const payloadBody = {
        ...data,
        image: imageUrl,
        types: data.types || [], 
      };

      const payload = { body: payloadBody };

      if (editingNews) {
        const oldImage = editingNews.image;

        await update({ body: { ...payloadBody, _id: editingNews._id } });
        
        if (selectedImage && oldImage && oldImage !== imageUrl) {
            const publicId = getPublicIdFromUrl(oldImage);
            if (publicId) {
                console.log("Deleting old image:", publicId);
                deleteImage({ public_id: publicId }).catch(e => console.error("Failed to delete old image", e));
            }
        }

      } else {
        create(payload);
      }
    } catch (error) {
      console.error("Submission error", error);
      setUploadingImage(false);
    }
  };

  const handleEdit = (news: TNews) => {
    setEditingNews(news);
    setValue("title", news.title);
    setValue("slug", news.slug);
    setValue("content", news.content);
    // Handle category: if populated object, use _id, else use string
    const catId = typeof news.category === 'object' && news.category ? (news.category as any)._id : news.category;
    setValue("category", catId);
    setValue("status", news.status || "draft");
    // Multi-select for types is a bit tricky with standard selects, handle simplified for now or rely on native multiple
    setValue("types", news.types);
    
    setPreviewImage(news.image || null);
    setActiveTab("create");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this news?")) {
      remove({ body: { _id: id } });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">News Management</h1>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button 
                onClick={() => { setActiveTab("list"); resetForm(); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                All News
            </button>
            <button 
                onClick={() => { setActiveTab("create"); resetForm(); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'create' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                {editingNews ? 'Edit News' : 'Create News'}
            </button>
        </div>
      </div>

      {activeTab === "list" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isNewsLoading ? (
            <div className="p-12 flex justify-center text-gray-400">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : newsList.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Image</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {newsList.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                            {item.image ? (
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="w-6 h-6 m-3 text-gray-400" />
                            )}
                        </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-md truncate" title={item.title}>{item.title}</td>
                    <td className="px-6 py-4 text-gray-600">
                        {typeof item.category === 'object' && item.category !== null ? (item.category as any).name : '-'}
                    </td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {item.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2 items-center h-full">
                      <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-gray-500">
              No news found.
            </div>
          )}
        </div>
      )}

      {activeTab === "create" && (
        <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">{editingNews ? "Edit News" : "Create New Article"}</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 ">
              <div className="grid grid-cols-3 gap-6">
                <div className="grid grid-cols-1 col-span-2 gap-6">
                    {/* Image Upload Area */}
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
              

                <div className="grid grid-cols-1 ">
                    

                    <div className="space-y-2">
                         <label className="block text-sm font-medium text-gray-700">Category</label>
                         <select
                            {...register("category", { required: "Category is required" })}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                         >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                         </select>
                         {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
                    </div>
                     {/* Types/Tags - Simplistic usage for now */}
                     <div className="space-y-2">
                         <label className="block text-sm font-medium text-gray-700">Type (Optional)</label>
                         <select
                            {...register("types")}
                            multiple
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white h-24"
                         >
                            <option value="latest">Latest</option>
                            <option value="trending">Trending</option>
                            <option value="popular">Popular</option>
                            <option value="fresh">Fresh</option>
                            <option value="top">Top</option>
                         </select>
                         <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                     </div>

                      <div className="space-y-2">
                         <label className="block text-sm font-medium text-gray-700">Status</label>
                         <select
                            {...register("status")}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                         >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                         </select>
                     </div>
                </div>

</div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => { setActiveTab("list"); resetForm(); }}
                        className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isCreating || isUpdating || uploadingImage}
                        className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        {(isCreating || isUpdating || uploadingImage) && <Loader2 className="animate-spin" size={18} />}
                        {uploadingImage ? 'Uploading Image...' : (editingNews ? 'Update Article' : 'Publish Article')}
                    </button>
                </div>

            </form>
        </div>
      )}
    </div>
  );
};

export default News;