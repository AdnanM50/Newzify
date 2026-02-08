import { useState, useMemo } from 'react';
import { useFetch, useAction, useDelete } from '../../helpers/hooks';
import { getCategories, createCategory, updateCategory, deleteCategory, type TCategory, type PaginatedResponse } from '../../helpers/backend';
import { useForm } from 'react-hook-form';
import { PrimaryButton } from '../../components/common/primary-button';
import { PrimaryModal } from '../../components/common/modal';
import { PrimaryTable } from '../../components/common/Primary-table';
import type { ColumnDef } from '@tanstack/react-table';
const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(null);

  const { data: categoriesData, refetch } = useFetch<PaginatedResponse<TCategory>>('categories', getCategories);

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
      header: 'NAME',
      accessorKey: 'name',
      cell: ({ row }: { row: { original: TCategory } }) => <span className="font-medium text-gray-900">{row.original.name}</span>
    },
  ], []);

  return (
    <div className="">
      <div className="mb-6">
        <PrimaryTable 
          columns={columns} 
          data={categoriesData?.docs || []} 
          title="Category"
          indexed
          loading={!categoriesData}
          onReload={refetch}
          onEdit={handleEdit}
          onDelete={(data) => handleDelete(data._id)}
          action={
            <PrimaryButton onClick={openCreateModal}>
              Add Category
            </PrimaryButton>
          }
        />
      </div>

      <PrimaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'New Category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {/* {(isCreating || isUpdating) && <Loader2 className="animate-spin" size={16} />} */}
              {editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </PrimaryModal>
    </div>
  )
}

export default Category;
