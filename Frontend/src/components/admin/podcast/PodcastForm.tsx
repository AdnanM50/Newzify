import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { FileAudio, Loader2, Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import TiptapEditor from "../../common/TiptapEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  createPodcast,
  updatePodcast,
  uploadImage,
  deleteImage,
  uploadFile,
  type TPodcast,
} from "../../../helpers/backend";
import { useAction } from "../../../helpers/hooks";

interface PodcastFormProps {
  initialData?: TPodcast | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORY_OPTIONS = [
  { value: "in-focus", label: "In Focus" },
  { value: "the-rearview", label: "The Rearview" },
  { value: "daily-news", label: "Daily News" },
  { value: "interviews", label: "Interviews" },
  { value: "specials", label: "Specials" },
];

const PodcastForm = ({ initialData, onSuccess, onCancel }: PodcastFormProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<TPodcast>();

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title);
      setValue("slug", initialData.slug);
      setValue("description", initialData.description);
      setValue("embed_code", initialData.embed_code);
      setValue("audio_url", initialData.audio_url);
      setValue("category", initialData.category || "in-focus");
      setValue("status", initialData.status || "draft");
      setValue("is_featured", initialData.is_featured || false);
      setPreviewImage(initialData.image || null);
      setPreviewAudio(initialData.audio_url || null);
    }
  }, [initialData, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("audio/")) {
        toast.error("Please upload an audio file");
        e.target.value = "";
        return;
      }
      setSelectedAudio(file);
      setPreviewAudio(URL.createObjectURL(file));
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

  const uploadAudioFile = async (file: File): Promise<string | null> => {
    try {
      const uploadRes = await uploadFile({ file });
      const responseCtx = uploadRes as any;
      if (responseCtx.url) return responseCtx.url;
      if (responseCtx.data && responseCtx.data.url) return responseCtx.data.url;
      return null;
    } catch (e) {
      console.error("Audio upload failed", e);
      toast.error("Audio upload failed");
      return null;
    }
  };

  const { mutateAsync: create } = useAction(createPodcast, {
    successMessage: "Podcast created successfully",
    invalidateKeys: ["podcasts"],
  });

  const { mutateAsync: update } = useAction(updatePodcast, {
    successMessage: "Podcast updated successfully",
    invalidateKeys: ["podcasts"],
  });

  const onSubmit = async (data: TPodcast) => {
    try {
      let imageUrl = initialData?.image || "";
      let audioUrl = initialData?.audio_url || "";

      if (selectedImage) {
        setUploadingImage(true);
        const url = await uploadSingleFile(selectedImage);
        if (url) imageUrl = url;
        setUploadingImage(false);
      }

      if (selectedAudio) {
        setUploadingAudio(true);
        const url = await uploadAudioFile(selectedAudio);
        if (url) audioUrl = url;
        setUploadingAudio(false);
      }

      if (!imageUrl && !initialData) {
        toast.error("Please upload a cover image");
        return;
      }

      if (!audioUrl && !data.embed_code?.trim()) {
        toast.error("Please upload audio or add a Spotify embed code");
        return;
      }

      const payloadBody = {
        ...data,
        image: imageUrl,
        audio_url: audioUrl,
      };

      if (initialData) {
        const oldImage = initialData.image;
        await update({ ...payloadBody, _id: initialData._id });
        
        if (selectedImage && oldImage && oldImage !== imageUrl) {
            const publicId = getPublicIdFromUrl(oldImage);
            if (publicId) {
                deleteImage({ public_id: publicId }).catch(e => console.error("Failed to delete old image", e));
            }
        }
      } else {
        await create(payloadBody);
      }
      onSuccess();
    } catch (error) {
      console.error("Submission error", error);
      setUploadingImage(false);
      setUploadingAudio(false);
    }
  };

  const isUploading = uploadingImage || uploadingAudio;

  return (
    <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">{initialData ? "Edit Podcast" : "Create New Podcast"}</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="grid grid-cols-1 lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Cover Image (Required)</label>
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
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ImageIcon size={20} />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Upload Cover Image</p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="Podcast title"
              />
              {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Audio File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 bg-gray-50 hover:bg-gray-100 transition-colors relative">
                {previewAudio ? (
                  <div className="space-y-3">
                    <audio controls src={previewAudio} className="w-full" />
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-600 truncate">
                        {selectedAudio?.name || "Uploaded audio"}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewAudio(null);
                          setSelectedAudio(null);
                          setValue("audio_url", "");
                        }}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-full transition-colors"
                        aria-label="Remove audio"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileAudio size={20} />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Upload Audio File</p>
                    <p className="text-xs text-gray-400 mt-1">MP3, M4A, WAV, or OGG up to 50MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className={previewAudio ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Spotify Embed Code (Optional)</label>
              <textarea
                {...register("embed_code")}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                placeholder='<iframe src="https://open.spotify.com/embed/episode/..." width="100%" height="232" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>'
                rows={4}
              />
              {errors.embed_code && <span className="text-red-500 text-xs">{errors.embed_code.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description (Article Content)</label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <TiptapEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <Controller
                name="category"
                control={control}
                defaultValue={initialData?.category || "in-focus"}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full !h-[45px]">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-900">Featured Podcast</label>
                <p className="text-xs text-gray-500 mt-0.5">Show in "5 podcasts to listen to today"</p>
              </div>
              <Controller
                name="is_featured"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-5 h-5 rounded text-green-600 focus:ring-green-500 border-gray-300"
                  />
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
            disabled={isUploading}
            className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 shadow-lg shadow-green-600/20"
          >
            {isUploading && <Loader2 className="animate-spin" size={18} />}
            {isUploading ? 'Uploading Media...' : (initialData ? 'Update Podcast' : 'Publish Podcast')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PodcastForm;
