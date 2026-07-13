import React from "react";
import { useNavigate } from "@tanstack/react-router";
import CommonNewscard from "../Cards/commonNewscard";
import { useFetch } from "../../helpers/hooks";
import { getBlogs, getPublicPodcastsList, getPublicEditorialsList, type TBlog, type TPodcast, type TEditorial, type PaginatedResponse } from "../../helpers/backend";

const NewsSection: React.FC = () => {
  const navigate = useNavigate();
  
  const { data, isLoading } = useFetch<PaginatedResponse<TBlog>>("latest-blogs", getBlogs, {
    page: 1,
    limit: 3,
  });
  const blogs = data?.docs || [];

  const { data: podcastsData, isLoading: podcastsLoading } = useFetch<PaginatedResponse<TPodcast>>("latest-podcasts", getPublicPodcastsList, {
    page: 1,
    limit: 3,
  });
  const podcasts = podcastsData?.docs || [];

  const { data: editorialsData, isLoading: editorialsLoading } = useFetch<PaginatedResponse<TEditorial>>("latest-editorials", getPublicEditorialsList, {
    page: 1,
    limit: 3,
  });
  const editorials = editorialsData?.docs || [];

  return (
    <section className="bg-white p-6 md:p-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Podcasts */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Podcasts</h2>
          {podcastsLoading ? (
            <div className="flex min-h-[260px] items-center justify-center text-gray-500">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
            </div>
          ) : podcasts.length > 0 ? (
            <div className="space-y-4">
              {podcasts.map((podcast) => (
                <CommonNewscard
                  key={podcast._id}
                  data={{
                    title: podcast.title,
                    category: podcast.category || "Podcast",
                    image: podcast.image,
                  }}
                  onReadMore={() => 
                    navigate({
                      to: "/podcast/$podcastId",
                      params: { podcastId: podcast._id },
                    })
                  }
                />
              ))}
            </div>
          ) : (
             <p className="text-gray-500">No podcasts available.</p>
          )}
        </div>

        {/* Editorials */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Editorials</h2>
          {editorialsLoading ? (
            <div className="flex min-h-[260px] items-center justify-center text-gray-500">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
            </div>
          ) : editorials.length > 0 ? (
            <div className="space-y-4">
              {editorials.map((editorial) => (
                <CommonNewscard
                  key={editorial._id}
                  data={{
                    title: editorial.title,
                    category: editorial.category || "Editorial",
                    image: editorial.image,
                  }}
                  onReadMore={() => 
                    navigate({
                      to: "/editorial/$editorialId",
                      params: { editorialId: editorial._id },
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No editorials available.</p>
          )}
        </div>

        {/* Blogs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Blogs</h2>
            {/* <Link
              from="/"
              to="/blog"
              params={{}}
              className="text-sm font-semibold text-red-600 hover:text-red-700"
            >
              View all
            </Link> */}
          </div>

          {isLoading ? (
            <div className="flex min-h-[260px] items-center justify-center text-gray-500">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
            </div>
          ) : blogs.length > 0 ? (
            <div className="space-y-4">
              {blogs.map((blog) => {
                const category =
                  typeof blog.category === "object"
                    ? blog.category?.name
                    : typeof blog.category === "string"
                    ? blog.category
                    : "Blog";

                return (
                  <CommonNewscard
                    key={blog._id}
                    data={{
                      title: blog.title,
                      category,
                      image: blog.image ,
                    }}
                    onReadMore={() =>
                      navigate({
                        to: "/blog/$blogId",
                        params: { blogId: blog._id },
                      })
                    }
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No blogs available at the moment.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
