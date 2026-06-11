import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Loader2, Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import MultiSelect from "../../common/MultiSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  createBlog,
  updateBlog,
  uploadImage,
  type TBlog,
  type TBlogCategory,
  type TTag,
} from "../../../helpers/backend";
import { useAction } from "../../../helpers/hooks";

interface BlogFormProps {
  initialData?: TBlog | null;
  categories: TBlogCategory[];
  tags: TTag[];
  onSuccess: () => void;
  onCancel: () => void;
}

const BlogForm = ({
  initialData,
  categories,
  tags,
  onSuccess,
  onCancel,
}: BlogFormProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Partial<TBlog>>({
    defaultValues: {
      tags: [],
      category: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title);
      setValue("description", initialData.description);
      setValue(
        "category",
        typeof initialData.category === "object"
          ? (initialData.category as any)._id
          : (initialData.category as string)
      );
      setValue(
        "tags",
        initialData.tags?.map((item) =>
          typeof item === "object" ? (item as any)._id : item
        ) || []
      );
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

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    try {
      const uploadRes = await uploadImage({ image: file });
      const responseCtx = uploadRes as any;
      if (responseCtx.url) return responseCtx.url;
      if (responseCtx.data && responseCtx.data.url) return responseCtx.data.url;
      return null;
    } catch (error) {
      toast.error("Image upload failed");
      return null;
    }
  };

  const { mutateAsync: create } = useAction(createBlog, {
    successMessage: "Blog created successfully",
    invalidateKeys: ["blogs"],
  });

  const { mutateAsync: update } = useAction(updateBlog, {
    successMessage: "Blog updated successfully",
    invalidateKeys: ["blogs"],
  });

  const onSubmit = async (data: Partial<TBlog>) => {
    try {
      let imageUrl = initialData?.image || "";

      if (selectedImage) {
        setUploadingImage(true);
        const url = await uploadSingleFile(selectedImage);
        if (url) imageUrl = url;
        setUploadingImage(false);
      }

      if (!imageUrl) {
        toast.error("Please upload a blog image");
        return;
      }

      const payload = {
        ...data,
        category: data.category,
        tags: data.tags || [],
        image: imageUrl,
      };

      if (initialData?._id) {
        await update({ ...payload, _id: initialData._id });
      } else {
        await create(payload);
      }

      onSuccess();
    } catch (error) {
      setUploadingImage(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900">
          {initialData ? "Edit Blog Post" : "Create Blog Post"}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Use this form to publish a new blog article.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Blog Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                placeholder="Enter blog title"
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                rows={8}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                placeholder="Write your blog description..."
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Featured Image</label>
              <div className="relative rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                />
                {previewImage ? (
                  <div className="relative mx-auto h-64 w-full overflow-hidden rounded-3xl">
                    <img
                      src={previewImage}
                      alt="Blog preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedImage(null);
                        setPreviewImage(null);
                      }}
                      className="absolute right-4 top-4 rounded-full bg-white p-2 text-gray-700 shadow-sm"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <ImageIcon size={24} />
                    </div>
                    <p className="text-sm font-medium">Click to upload a blog image</p>
                    <p className="text-xs text-gray-400">PNG, JPG, or WEBP up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => {
                  const categoryValue =
                    typeof field.value === "string"
                      ? field.value
                      : typeof field.value === "object" && field.value !== null
                      ? (field.value as TBlogCategory)._id
                      : "";

                  return (
                    <Select onValueChange={field.onChange} value={categoryValue}>
                      <SelectTrigger className="w-full !h-[45px]">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.category && (
                <p className="text-xs text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <Controller
                name="tags"
                control={control}
                defaultValue={[]}
                render={({ field }) => {
                  const tagsValue = Array.isArray(field.value)
                    ? field.value.map((tag) =>
                        typeof tag === "string" ? tag : (tag as TTag)._id
                      )
                    : [];

                  return (
                    <MultiSelect
                      options={tags.map((tag) => ({ label: tag.name, value: tag._id }))}
                      value={tagsValue}
                      onChange={field.onChange}
                      placeholder="Select tags"
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploadingImage}
            className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploadingImage ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Publishing...
              </span>
            ) : initialData ? (
              "Update Blog"
            ) : (
              "Publish Blog"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
