import { useNavigate } from "@tanstack/react-router";
import PodcastForm from "../../../components/admin/podcast/PodcastForm";

const PodcastCreate = () => {
  const navigate = useNavigate();

  return (
    <div className="p-0 sm:p-2">
      <PodcastForm 
        onSuccess={() => navigate({ to: "/reporter-dashboard/podcasts" })} 
        onCancel={() => navigate({ to: "/reporter-dashboard/podcasts" })}
      />
    </div>
  );
};

export default PodcastCreate;
