import { useNavigate, useParams } from "@tanstack/react-router";
import { useFetch } from "../../../helpers/hooks";
import { getEditorialById, type TEditorial } from "../../../helpers/backend";
import EditorialForm from "../../../components/admin/editorial/EditorialForm";
import { Loader2 } from "lucide-react";

const EditorialEdit = () => {
  const navigate = useNavigate();
  const { editorialId } = useParams({ from: '/admin/editorials/$editorialId/edit' });
  
  const { data: editorial, isLoading: isEditorialLoading } = useFetch<TEditorial>(
    ["editorial", editorialId],
    getEditorialById,
    { id: editorialId }
  );

  if (isEditorialLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <EditorialForm 
        initialData={editorial}
        onSuccess={() => navigate({ to: "/admin/editorials" })} 
        onCancel={() => navigate({ to: "/admin/editorials" })}
      />
    </div>
  );
};

export default EditorialEdit;
