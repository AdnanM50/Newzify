import { useNavigate } from "@tanstack/react-router";
import EditorialForm from "../../../components/admin/editorial/EditorialForm";

const EditorialCreate = () => {
  const navigate = useNavigate();

  return (
    <div className="p-0 sm:p-2">
      <EditorialForm 
        onSuccess={() => navigate({ to: "/reporter-dashboard/editorials" })} 
        onCancel={() => navigate({ to: "/reporter-dashboard/editorials" })}
      />
    </div>
  );
};

export default EditorialCreate;
