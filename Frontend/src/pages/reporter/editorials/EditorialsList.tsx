import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useFetch, useDelete } from "../../../helpers/hooks";
import {
  getEditorialsList,
  deleteEditorial,
  type TEditorial,
  type PaginatedResponse,
} from "../../../helpers/backend";
import { Trash, Edit, Loader2, Image as ImageIcon, Eye, Plus, Star } from "lucide-react";
import EditorialPreviewModal from "../../../components/admin/editorial/EditorialPreviewModal";


const EditorialsList = () => {
  const [selectedEditorial, setSelectedEditorial] = useState<TEditorial | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: editorialData, isLoading: isEditorialLoading, refetch: refetchEditorial } = useFetch<PaginatedResponse<TEditorial>>(
    "editorials",
    getEditorialsList
  );
  
  const editorialList = editorialData?.docs || [];

  const { mutate: remove } = useDelete(deleteEditorial, {
    onSuccess: () => refetchEditorial(),
    successMessage: "Editorial deleted successfully",
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this editorial?")) {
      remove({ _id: id });
    }
  };

  const openPreview = (editorial: TEditorial) => {
    setSelectedEditorial(editorial);
    setIsPreviewOpen(true);
  };

  return (
    <div className="p-0 sm:p-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">My Editorials</h1>
           <p className="text-gray-500 text-sm">Manage the editorials you've created.</p>
        </div>
        <Link 
          to="/reporter-dashboard/editorials/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Create Editorial
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isEditorialLoading ? (
          <div className="p-12 flex justify-center text-gray-400">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : editorialList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <tr>
                    <th className="px-6 py-4 font-semibold uppercase">Image</th>
                    <th className="px-6 py-4 font-semibold uppercase">Title</th>
                    <th className="px-6 py-4 font-semibold uppercase">Status</th>
                    <th className="px-6 py-4 font-semibold uppercase text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {editorialList.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                            {item.image ? (
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="w-6 h-6 m-3 text-gray-300" />
                            )}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 max-w-xs truncate" title={item.title}>
                        {item.title}
                        </div>
                        {item.is_editors_pick && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold mt-1 uppercase">
                            <Star size={10} className="fill-current" /> Editor's Pick
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-0.5">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {item.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 items-center">
                        <button 
                            onClick={() => openPreview(item)} 
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Preview"
                        >
                            <Eye size={18} />
                        </button>
                        <Link 
                            to={"/reporter-dashboard/editorials/$editorialId/edit" as any}
                            params={{ editorialId: item._id } as any}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                        >
                            <Edit size={18} />
                        </Link>
                        <button 
                            onClick={() => handleDelete(item._id)} 
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
          <div className="p-20 text-center text-gray-500">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <ImageIcon size={32} className="text-indigo-300" />
            </div>
            <p className="text-lg font-medium text-gray-600">No editorials found</p>
            <p className="text-sm text-gray-400 mt-1">Start by creating your first editorial.</p>
          </div>
        )}
      </div>

      <EditorialPreviewModal 
        editorial={selectedEditorial} 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </div>
  );
};

export default EditorialsList;
