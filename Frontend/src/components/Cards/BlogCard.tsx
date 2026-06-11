import React from "react";
import { Link } from "@tanstack/react-router";
import type { TBlog } from "../../helpers/backend";

interface BlogCardProps {
  blog: TBlog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const category =
    typeof blog.category === "object"
      ? blog.category?.name
      : typeof blog.category === "string"
      ? blog.category
      : "Blog";

  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={blog.image || "/blog1.jpg"}
          alt={blog.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
            {category}
          </span>
          {blog.tags?.length ? (
            <span className="text-xs text-gray-500">{blog.tags.length} tags</span>
          ) : null}
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{blog.title}</h2>
        <p className="text-sm leading-6 text-gray-600 line-clamp-3 mb-5 whitespace-pre-line">
          {blog.description || "Read this blog for more insights."}
        </p>

        <Link
          from="/"
          to="/blog/$blogId"
          params={{ blogId: blog._id as string }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
        >
          Read more
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
