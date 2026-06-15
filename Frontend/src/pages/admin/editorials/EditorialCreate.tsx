import { useNavigate } from "@tanstack/react-router";
import EditorialForm from "../../../components/admin/editorial/EditorialForm";

const EditorialCreate = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <EditorialForm 
        onSuccess={() => navigate({ to: "/admin/editorials" })} 
        onCancel={() => navigate({ to: "/admin/editorials" })}
      />
    </div>
  );
};

export default EditorialCreate;
