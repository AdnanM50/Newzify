import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useUser } from "../../../context/user";
import { useFetch, useDelete } from "../../../helpers/hooks";
import {
  getPodcastsList,
  deletePodcast,
  fetchUserList,
  type TPodcast,
  type PaginatedResponse,
} from "../../../helpers/backend";
import { Trash, Edit, Loader2, Image as ImageIcon, Eye, Plus, Filter, Star, Headphones } from "lucide-react";
import PodcastPreviewModal from "../../../components/admin/podcast/PodcastPreviewModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const PodcastsList = () => {
  const { user: currentUser } = useUser();
  const [selectedPodcast, setSelectedPodcast] = useState<TPodcast | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [authorFilter, setAuthorFilter] = useState('');

  // Fetch only reporters for the filter dropdown
  const { data: reportersData } = useFetch("reporters", () => fetchUserList({ role: "reporter" }));
  const reportersList = reportersData?.docs || reportersData || [];

  const queryParams: Record<string, string> = {};
  if (authorFilter === 'admin') {
    queryParams.author_role = 'admin';
  } else if (authorFilter !== '' && authorFilter !== 'all') {
    queryParams.author = authorFilter;
  }

  const { data: podcastData, isLoading: isPodcastLoading, refetch: refetchPodcast } = useFetch<PaginatedResponse<TPodcast>>(
    ["podcasts", authorFilter],
    () => getPodcastsList(queryParams),
  );
  const podcastList = podcastData?.docs || [];

  const { mutate: remove } = useDelete(deletePodcast, {
    onSuccess: () => refetchPodcast(),
    successMessage: "Podcast deleted successfully",
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this podcast?")) {
      remove({ _id: id });
    }
  };

  const openPreview = (podcast: TPodcast) => {
    setSelectedPodcast(podcast);
    setIsPreviewOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Headphones className="text-green-600" /> Podcasts Management</h1>
           <p className="text-gray-500 mt-1">View and manage all podcasts.</p>
        </div>
        <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
               <Select value={authorFilter || 'all'} onValueChange={(val) => setAuthorFilter(val === 'all' ? '' : val)}>
                  <SelectTrigger className="w-[200px] border-none shadow-none focus:ring-0 bg-transparent h-9">
                    <div className="flex items-center gap-2">
                      <Filter size={14} className="text-gray-400" />
                      <SelectValue placeholder="Filter by Author" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Authors</SelectItem>
                    <SelectItem value="admin">Admins Only</SelectItem>
                    {Array.isArray(reportersList) && reportersList.map((reporter: any) => (
                      <SelectItem key={reporter._id} value={reporter._id}>
                        {reporter.first_name} {reporter.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <Link 
              to="/admin/podcasts/create"
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-600/20"
            >
              <Plus size={20} />
              Add Podcast
            </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isPodcastLoading ? (
          <div className="p-12 flex justify-center text-gray-400">
            <Loader2 className="animate-spin text-green-600" size={32} />
          </div>
        ) : podcastList.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Image</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Author</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {podcastList.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                          {item.image ? (
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                              <ImageIcon className="w-8 h-8 m-4 text-gray-300" />
                          )}
                      </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 max-w-sm truncate" title={item.title}>
                      {item.title}
                    </div>
                    {item.is_featured && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold mt-1 uppercase">
                        <Star size={10} className="fill-current" /> Featured Podcast
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium capitalize border border-gray-200">
                        {item.category?.replace('-', ' ')}
                      </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.author ? `${item.author.first_name} ${item.author.last_name || ''}` : 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 capitalize">
                      {item.author?.role || '-'}
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
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="Preview"
                      >
                        <Eye size={18} />
                      </button>
                      {!(currentUser?.role === 'admin' && item.author?.role === 'reporter') && (
                        <Link 
                          to="/admin/podcasts/$podcastId/edit"
                          params={{ podcastId: item._id }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                      )}
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
        ) : (
          <div className="p-20 text-center text-gray-500">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Headphones size={32} className="text-green-300" />
            </div>
            <p className="text-lg font-medium text-gray-600">No podcasts found</p>
            <p className="text-sm text-gray-400 mt-1">Start by creating your first podcast.</p>
          </div>
        )}
      </div>

      <PodcastPreviewModal 
        podcast={selectedPodcast} 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </div>
  );
};

export default PodcastsList;
