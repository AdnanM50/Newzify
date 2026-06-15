import { useNavigate, useParams } from "@tanstack/react-router";
import { useFetch } from "../../../helpers/hooks";
import { getPodcastById, type TPodcast } from "../../../helpers/backend";
import PodcastForm from "../../../components/admin/podcast/PodcastForm";
import { Loader2 } from "lucide-react";

const PodcastEdit = () => {
  const navigate = useNavigate();
  const { podcastId } = useParams({ from: '/admin/podcasts/$podcastId/edit' });
  
  const { data: podcast, isLoading } = useFetch<TPodcast>(
    ["podcast", podcastId],
    getPodcastById,
    { id: podcastId }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PodcastForm 
        initialData={podcast}
        onSuccess={() => navigate({ to: "/admin/podcasts" })} 
        onCancel={() => navigate({ to: "/admin/podcasts" })}
      />
    </div>
  );
};

export default PodcastEdit;
