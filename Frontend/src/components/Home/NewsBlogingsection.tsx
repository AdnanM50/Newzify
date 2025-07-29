import React from "react";
import CommonNewscard from "../Cards/commonNewscard";

const NewsSection:React.FC = () => {
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
              image: "/podcast1.jpg",
            },
            {
              title: "Weekly Podcast Episode 36: Best headphone to buy",
              category: "Tech talk",
              image: "/podcast2.jpg",
            },
            {
              title: "Weekly Podcast Episode 37: Retro games are back",
              category: "Tech talk",
              image: "/podcast3.jpg",
            },
          ].map((podcast) => (
            <CommonNewscard data={podcast}  />
          ))}
        </div>

        {/* Editorials */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Editorials</h2>
          {[
            {
              title: "How to protest in the age of digital surveillance",
              category: "Politics",
              image: "/editorial1.jpg",
            },
            {
              title: "Crisis intensifies in Gaza, are Arab nations doing their part?",
              category: "Politics",
              image: "/editorial2.jpg",
            },
            {
              title: "How Ukraine is using their food stock in diplomacy",
              category: "Politics",
              image: "/editorial3.jpg",
            },
          ].map((editorial) => (
           <CommonNewscard data={editorial}  />
          ))}
        </div>

        {/* Blogs */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Blogs</h2>
          {[
            {
              title: "How to take up new hobbies in the 2024-a noobs guide",
              category: "Blog #120",
              image: "/blog1.jpg",
            },
            {
              title: "Is digital marketing still worth learning, or is it in decline?",
              category: "Blog #121",
              image: "/blog2.jpg",
            },
            {
              title: "MS Excel: a tool that everyone needs to learn ASAP",
              category: "Blog #122",
              image: "/blog3.jpg",
            },
          ].map((blog) => (
            <CommonNewscard data={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
