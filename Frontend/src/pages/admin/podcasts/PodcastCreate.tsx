import { useNavigate } from "@tanstack/react-router";
import PodcastForm from "../../../components/admin/podcast/PodcastForm";

const PodcastCreate = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <PodcastForm 
        onSuccess={() => navigate({ to: "/admin/podcasts" })} 
        onCancel={() => navigate({ to: "/admin/podcasts" })}
      />
    </div>
  );
};

export default PodcastCreate;
