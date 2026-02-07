import { useState } from 'react';
import { useFetch, useAction, useDelete } from '../../helpers/hooks';
import { getCategories, createCategory, updateCategory, deleteCategory, type TCategory, type PaginatedResponse } from '../../helpers/backend';
import { useForm } from 'react-hook-form';
import { Trash, Edit, Plus, Loader2 } from 'lucide-react';

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(null);

  // 1. Fetch Categories
  const { data: categoriesData, isLoading, refetch } = useFetch<PaginatedResponse<TCategory>>('categories', getCategories);
  const categories = categoriesData?.docs || [];

  // 2. Create Category Mutation
  const { mutate: create, isLoading: isCreating } = useAction(createCategory, {
    onSuccess: () => {
      setIsModalOpen(false);
      reset();
      refetch(); // explicit refetch to be safe, though invalidate should handle it if key matches
    },
    invalidateKeys: ['categories'],
    successMessage: "Category created successfully"
  });

  // 3. Update Category Mutation
  const { mutate: update, isLoading: isUpdating } = useAction(updateCategory, {
    onSuccess: () => {
      setIsModalOpen(false);
      setEditingCategory(null);
      reset();
      refetch();
    },
    invalidateKeys: ['categories'],
    successMessage: "Category updated successfully"
  });

  // 4. Delete Category Mutation
  const { mutate: remove } = useDelete(deleteCategory, {
    invalidateKeys: ['categories'],
    successMessage: "Category deleted successfully"
  });

  // Form Setup
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<{ name: string }>();

  const onSubmit = (data: { name: string }) => {
    // Backend expects data wrapped in "body" sometimes, but our api.ts handles sending the object.
    // However, the controller expects `req.body` to have the fields. 
    // The backend service expected `createCategory(payload)` where payload is the body.
    // Let's look at controller: `const { body } = payload`. 
    // Wait, `req.body` IS the payload. So if I send `{ name: "..." }`, then `payload` is `{ name: "..." }`.
    // Then `const { body } = payload` means it looks for `payload.body`. 
    // SO I NEED TO WRAP IT IN `body`.
    
    const payload = { body: data };

    if (editingCategory) {
      update({ body: { ...data, _id: editingCategory._id } }); 
    } else {
      create(payload);
    }
  };

  const handleEdit = (category: TCategory) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      remove({ body: { _id: id } }); // Backend expects { body: { _id: ... } } based on controller
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    reset();
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center text-gray-400">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : categories && categories.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{category.slug}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete"
                    >
                      {/* We could use isDeleting state here but it's global for the hook, ideally we track per ID */}
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No categories found. Create one to get started.
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Technology"
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
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                >
                  {(isCreating || isUpdating) && <Loader2 className="animate-spin" size={16} />}
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Category;