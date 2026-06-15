import { useNavigate, useParams } from "@tanstack/react-router";
import { useFetch } from "../../../helpers/hooks";
import { getEditorialById, type TEditorial } from "../../../helpers/backend";
import EditorialForm from "../../../components/admin/editorial/EditorialForm";
import { Loader2 } from "lucide-react";

const EditorialEdit = () => {
  const navigate = useNavigate();
  const { editorialId } = useParams({ from: '/reporter-dashboard/editorials/$editorialId/edit' });
  
  const { data: editorial, isLoading: isEditorialLoading } = useFetch<TEditorial>(
    ["editorial", editorialId],
    getEditorialById,
    { id: editorialId }
  );

  if (isEditorialLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="p-0 sm:p-2">
      <EditorialForm 
        initialData={editorial}
        onSuccess={() => navigate({ to: "/reporter-dashboard/editorials" })} 
        onCancel={() => navigate({ to: "/reporter-dashboard/editorials" })}
      />
    </div>
  );
};

export default EditorialEdit;
