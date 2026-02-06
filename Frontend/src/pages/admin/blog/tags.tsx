import { useState } from 'react';
import { useFetch, useAction, useDelete } from '../../../helpers/hooks';
import { getBlogTags, createBlogTag, updateBlogTag, deleteBlogTag, type TTag, type PaginatedResponse } from '../../../helpers/backend';
import { useForm } from 'react-hook-form';
import { Trash, Edit, Plus, Loader2 } from 'lucide-react';

const BlogTags = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TTag | null>(null);

  // 1. Fetch Tags
  const { data: tagsData, isLoading, refetch } = useFetch<PaginatedResponse<TTag>>('blog-tags', getBlogTags);
  const tags = tagsData?.docs || [];

  // 2. Create Tag Mutation
  const { mutate: create, isLoading: isCreating } = useAction(createBlogTag, {
    onSuccess: () => {
      setIsModalOpen(false);
      reset();
      refetch();
    },
    invalidateKeys: ['blog-tags'],
    successMessage: "Tag created successfully"
  });

  // 3. Update Tag Mutation
  const { mutate: update, isLoading: isUpdating } = useAction(updateBlogTag, {
    onSuccess: () => {
      setIsModalOpen(false);
      setEditingTag(null);
      reset();
      refetch();
    },
    invalidateKeys: ['blog-tags'],
    successMessage: "Tag updated successfully"
  });

  // 4. Delete Tag Mutation
  const { mutate: remove } = useDelete(deleteBlogTag, {
    invalidateKeys: ['blog-tags'],
    successMessage: "Tag deleted successfully"
  });

  // Form Setup
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<{ name: string }>();

  const onSubmit = (data: { name: string }) => {
    const payload = { body: data };

    if (editingTag) {
      update({ body: { ...data, _id: editingTag._id } }); 
    } else {
      create(payload);
    }
  };

  const handleEdit = (tag: TTag) => {
    setEditingTag(tag);
    setValue('name', tag.name);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      remove({ body: { _id: id } });
    }
  };

  const openCreateModal = () => {
    setEditingTag(null);
    reset();
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Blog Tags</h1>
           <p className="text-gray-500 text-sm">Manage tags for your blog posts</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Tag
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p>Loading tags...</p>
          </div>
        ) : tags && tags.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tags.map((tag) => (
                  <tr key={tag._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{tag.name}</span>
                    </td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">
                            {tag.slug}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(tag)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(tag._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
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
          <div className="p-12 text-center text-gray-500">
            <div className="mb-4 flex justify-center text-gray-300">
                <Plus size={48} />
            </div>
            <p className="text-lg font-medium text-gray-600">No tags found</p>
            <p className="text-sm">Create your first blog tag to get started.</p>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingTag ? 'Edit Tag' : 'New Tag'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
                <input
                  {...register('name', { required: 'Tag name is required' })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                  placeholder="e.g. React"
                  autoFocus
                />
                {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 transform transition-all"
                >
                  {(isCreating || isUpdating) && <Loader2 className="animate-spin" size={16} />}
                  {editingTag ? 'Update Tag' : 'Create Tag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogTags;
