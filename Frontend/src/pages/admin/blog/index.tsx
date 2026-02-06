import { useState } from "react";
import { useFetch, useAction, useDelete } from "../../../helpers/hooks";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCategories,
  getBlogTags,
  uploadImage,
  deleteImage,
  type TBlog,
  type TBlogCategory,
  type TTag,
  type PaginatedResponse,
} from "../../../helpers/backend";
import { useForm } from "react-hook-form";
import { Trash, Edit, Loader2, Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";

const BlogManagement = () => {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [editingBlog, setEditingBlog] = useState<TBlog | null>(null);
  
  // Custom states for File Upload
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // 1. Fetch Blogs
  const { data: blogsData, isLoading: isBlogsLoading, refetch: refetchBlogs } = useFetch<PaginatedResponse<TBlog>>(
    "blogs",
    getBlogs
  );
  const blogsList = blogsData?.docs || [];

  // 1.1 Fetch Categories and Tags for dropdowns
  const { data: categoriesData } = useFetch<PaginatedResponse<TBlogCategory>>("blog-categories", getBlogCategories);
  const categories = categoriesData?.docs || [];

  const { data: tagsData } = useFetch<PaginatedResponse<TTag>>("blog-tags", getBlogTags);
  const tags = tagsData?.docs || [];

  // 2. Mutations
  const { mutate: create, isLoading: isCreating } = useAction(createBlog, {
    onSuccess: () => {
      resetForm();
      setActiveTab("list");
      refetchBlogs();
    },
    successMessage: "Blog post published successfully",
  });

  const { mutateAsync: update, isLoading: isUpdating } = useAction(updateBlog, {
    onSuccess: () => {
      resetForm();
      setActiveTab("list");
      refetchBlogs();
    },
    successMessage: "Blog post updated successfully",
  });

  const { mutate: remove } = useDelete(deleteBlog, {
    onSuccess: () => refetchBlogs(),
    successMessage: "Blog post deleted successfully",
  });

  // Form Setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>();

  const resetForm = () => {
    setEditingBlog(null);
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
        toast.error("Image upload failed");
        return null;
     }
  };

  const onSubmit = async (data: any) => {
    try {
      let imageUrl = editingBlog?.image || "";

      if (selectedImage) {
        setUploadingImage(true);
        const url = await uploadSingleFile(selectedImage);
        if (url) imageUrl = url;
        setUploadingImage(false);
      }

      const payloadBody = {
        ...data,
        image: imageUrl,
      };

      if (editingBlog) {
        const oldImage = editingBlog.image;
        await update({ body: { ...payloadBody, _id: editingBlog._id } });
        
        if (selectedImage && oldImage && oldImage !== imageUrl) {
            const publicId = getPublicIdFromUrl(oldImage);
            if (publicId) {
                deleteImage({ public_id: publicId }).catch(() => {});
            }
        }
      } else {
        create({ body: payloadBody });
      }
    } catch (error) {
      setUploadingImage(false);
    }
  };

  const handleEdit = (blog: TBlog) => {
    setEditingBlog(blog);
    setValue("title", blog.title);
    setValue("description", blog.description);
    setValue("category", typeof blog.category === 'object' ? (blog.category as any)._id : blog.category);
    setValue("tags", blog.tags.map((t: any) => typeof t === 'object' ? t._id : t));
    
    setPreviewImage(blog.image || null);
    setActiveTab("create");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      remove({ body: { _id: id } });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
           <p className="text-gray-500 text-sm">Write and manage your blog articles</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            <button 
                onClick={() => { setActiveTab("list"); resetForm(); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                All Posts
            </button>
            <button 
                onClick={() => { setActiveTab("create"); resetForm(); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'create' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                {editingBlog ? 'Edit Post' : 'New Post'}
            </button>
        </div>
      </div>

      {activeTab === "list" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isBlogsLoading ? (
            <div className="p-12 flex flex-col items-center justify-center text-gray-400">
               <Loader2 className="animate-spin mb-4" size={40} />
               <p>Loading blogs...</p>
            </div>
          ) : blogsList.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Image</th>
                      <th className="px-6 py-4 font-medium">Title</th>
                      <th className="px-6 py-4 font-medium">Category</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {blogsList.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="w-16 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                {item.image ? (
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-6 m-auto text-gray-300 h-full" />
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900 max-w-sm truncate" title={item.title}>{item.title}</td>
                        <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
                                {typeof item.category === 'object' && item.category !== null ? (item.category as any).name : '-'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2">
                              <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Edit size={18} />
                              </button>
                              <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash size={18} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          ) : (
            <div className="p-16 text-center text-gray-500">
              <div className="mb-4 flex justify-center text-gray-200">
                <ImageIcon size={64} />
              </div>
              <p className="text-lg font-medium text-gray-600">No blog posts found</p>
              <p className="text-sm">Start by creating your first article.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "create" && (
        <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Article Title</label>
                                <input
                                    {...register("title", { required: "Title is required" })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg font-medium"
                                    placeholder="Enter a catchy title..."
                                />
                                 {errors.title && <span className="text-red-500 text-xs">{(errors.title.message as string)}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Content / Description</label>
                                <textarea
                                    {...register("description", { required: "Content is required" })}
                                    rows={15}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none font-sans"
                                    placeholder="Write your blog content here. You can use markdown or plain text..."
                                />
                                 {errors.description && <span className="text-red-500 text-xs">{(errors.description.message as string)}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Image Upload */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">Featured Image</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative min-h-[200px]">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {previewImage ? (
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setPreviewImage(null); setSelectedImage(null); }}
                                            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white text-gray-700 z-10 shadow-sm"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center p-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <ImageIcon size={24} />
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category & Tags */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Category</label>
                                <select
                                    {...register("category", { required: "Category is required" })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category && <span className="text-red-500 text-xs">{(errors.category.message as string)}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Tags</label>
                                <select
                                    {...register("tags")}
                                    multiple
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white min-h-[120px]"
                                >
                                    {tags.map(tag => (
                                        <option key={tag._id} value={tag._id}>{tag.name}</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-gray-400">Hold Ctrl (Cmd) to select multiple tags</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => { setActiveTab("list"); resetForm(); }}
                                className="flex-1 px-6 py-3 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isCreating || isUpdating || uploadingImage}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
                            >
                                {(isCreating || isUpdating || uploadingImage) && <Loader2 className="animate-spin" size={20} />}
                                {editingBlog ? 'Update' : 'Publish'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
