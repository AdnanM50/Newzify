import { useState } from "react";
import { useFetch } from "../../helpers/hooks";
import { getBlogs, type TBlog, type PaginatedResponse } from "../../helpers/backend";
import BlogCard from "../../components/Cards/BlogCard";

const BlogList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [queryParams, setQueryParams] = useState({ page: 1, limit: 10, search: "" });

  const { data, isLoading, isFetching } = useFetch<PaginatedResponse<TBlog>>(
    ["blog-list", queryParams],
    getBlogs,
    queryParams,
    { keepPreviousData: true }
  );

  const blogs = data?.docs || [];

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQueryParams((prev) => ({ ...prev, page: 1, search: searchTerm }));
  };

  const handlePageChange = (nextPage: number) => {
    setQueryParams((prev) => ({ ...prev, page: nextPage }));
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Blogs</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Discover the latest blogs from our authors. Search by title and browse through the latest posts.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex w-full max-w-xl gap-3">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search blogs by title..."
            className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
          />
          <button
            type="submit"
            className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <>
          {blogs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center text-gray-500">
              <p className="text-lg font-semibold">No blogs found</p>
              <p className="mt-2 text-sm">Try another search term or come back later.</p>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Showing page {data?.page ?? 1} of {data?.totalPages ?? 1}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePageChange((data?.page || 1) - 1)}
                disabled={!data?.hasPrevPage}
                className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange((data?.page || 1) + 1)}
                disabled={!data?.hasNextPage}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {isFetching && !isLoading && (
        <div className="mt-3 text-sm text-gray-500">Loading more blogs...</div>
      )}
    </main>
  );
};

export default BlogList;
