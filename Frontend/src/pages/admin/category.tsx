import { useState, useMemo } from 'react';
import { useFetch, useAction, useDelete } from '../../helpers/hooks';
import { getCategories, createCategory, updateCategory, deleteCategory, type TCategory, type PaginatedResponse } from '../../helpers/backend';
import { useForm } from 'react-hook-form';
import { Trash, Eye, Loader2 } from 'lucide-react';
import { PrimaryTable } from '../../components/common/Primary-table';
import type { ColumnDef } from '@tanstack/react-table';

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(null);

  // 1. Fetch Categories
  const { data: categoriesData, refetch } = useFetch<PaginatedResponse<TCategory>>('categories', getCategories);
  const categories = categoriesData?.docs || [];

  // 2. Create Category Mutation
  const { mutate: create, isLoading: isCreating } = useAction(createCategory, {
    onSuccess: () => {
      setIsModalOpen(false);
      reset();
      refetch();
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
      remove({ body: { _id: id } });
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    reset();
    setIsModalOpen(true);
  };

  const columns = useMemo<ColumnDef<TCategory>[]>(() => [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.name}</span>
    },
  
    {
      header: () => <div className="text-right">ACTION</div>,
      id: 'actions',
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleEdit(category)}
              className="w-8 h-8 flex items-center justify-center text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
              title="View/Edit"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => handleDelete(category._id)}
              className="w-8 h-8 flex items-center justify-center text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash size={16} />
            </button>
          </div>
        );
      }
    }
  ], []);

  return (
    <div className="">
      <div className="mb-6">
        <PrimaryTable 
          columns={columns} 
          data={categories} 
          title="Categories"
          onAdd={openCreateModal}
          addButtonLabel="Add Category"
        />
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
