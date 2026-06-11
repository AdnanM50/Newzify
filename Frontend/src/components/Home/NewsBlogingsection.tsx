import React from "react";
import { useNavigate } from "@tanstack/react-router";
import CommonNewscard from "../Cards/commonNewscard";
import { useFetch } from "../../helpers/hooks";
import { getBlogs, type TBlog, type PaginatedResponse } from "../../helpers/backend";

const NewsSection: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useFetch<PaginatedResponse<TBlog>>("latest-blogs", getBlogs, {
    page: 1,
    limit: 3,
  });
  const blogs = data?.docs || [];

  return (
    <section className="bg-white p-6 md:p-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Podcasts */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Podcasts</h2>
          {[
            {
              title: "Weekly Podcast Episode 35: How to declutter your life",
              category: "Tech talk",
              image: "https://www.uni-hamburg.de/15322293/corona-virus-733x414-81999777e59f34709412f48a94465338233a1803.jpg",
            },
            {
              title: "Weekly Podcast Episode 36: Best headphone to buy",
              category: "Tech talk",
              image: "https://www.uni-hamburg.de/15322293/corona-virus-733x414-81999777e59f34709412f48a94465338233a1803.jpg",
            },
            {
              title: "Weekly Podcast Episode 37: Retro games are back",
              category: "Tech talk",
              image: "https://www.uni-hamburg.de/15322293/corona-virus-733x414-81999777e59f34709412f48a94465338233a1803.jpg",
            },
          ].map((podcast, index) => (
            <CommonNewscard
              key={`podcast-${index}`}
              data={{
                title: podcast.title,
                category: podcast.category,
                image: podcast.image,
              }}
              onReadMore={() => null}
            />
          ))}
        </div>

        {/* Editorials */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Editorials</h2>
          {[
            {
              title: "How to protest in the age of digital surveillance",
              category: "Politics",
              image: "https://www.uni-hamburg.de/15322293/corona-virus-733x414-81999777e59f34709412f48a94465338233a1803.jpg",
            },
            {
              title: "Crisis intensifies in Gaza, are Arab nations doing their part?",
              category: "Politics",
              image: "https://www.uni-hamburg.de/15322293/corona-virus-733x414-81999777e59f34709412f48a94465338233a1803.jpg",
            },
            {
              title: "How Ukraine is using their food stock in diplomacy",
              category: "Politics",
              image: "https://www.uni-hamburg.de/15322293/corona-virus-733x414-81999777e59f34709412f48a94465338233a1803.jpg",
            },
          ].map((editorial, index) => (
            <CommonNewscard
              key={`editorial-${index}`}
              data={{
                title: editorial.title,
                category: editorial.category,
                image: editorial.image,
              }}
              onReadMore={() => null}
            />
          ))}
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
