import { useNavigate, useParams } from "@tanstack/react-router";
import { useFetch } from "../../../helpers/hooks";
import { getPodcastById, type TPodcast } from "../../../helpers/backend";
import PodcastForm from "../../../components/admin/podcast/PodcastForm";
import { Loader2 } from "lucide-react";

const PodcastEdit = () => {
  const navigate = useNavigate();
  const { podcastId } = useParams({ from: '/reporter-dashboard/podcasts/$podcastId/edit' });
  
  const { data: podcast, isLoading } = useFetch<TPodcast>(
    ["podcast", podcastId],
    getPodcastById,
    { id: podcastId }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="p-0 sm:p-2">
      <PodcastForm 
        initialData={podcast}
        onSuccess={() => navigate({ to: "/reporter-dashboard/podcasts" })} 
        onCancel={() => navigate({ to: "/reporter-dashboard/podcasts" })}
      />
    </div>
  );
};

export default PodcastEdit;
