import React from "react";
import { Button } from "../ui/button";

const TopstoriesCard: React.FC = () => {
  return (
    <div className="w-full bg-white flex items-center gap-4 mb-4">
      <div className="w-1/3 h-full">
        <img src="https://www.fda.gov/files/COVID%20testing%20policy%20drupal.jpg" alt="TopstoriesCard" className="w-full h-48 object-cover" />
      </div>
      <div className="w-full">
      <h2 className="text-3xl md:text-5xl font-bold  font-serif leading-11">
            Israel's aggression in Gaza continues
          </h2>
          <p className="text-gray-900 line-clamp-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Et modi eveniet temporibus officiis ex at id laudantium odio saepe quos eius quae porro laborum, eaque natus doloribus necessitatibus nisi nemo!</p>
      <Button className="bg-red-600 cursor-pointer hover:bg-red-700 mt-2 text-white px-6 py-3 font-semibold transition-colors">Read More</Button>
      </div>
    </div>
  );
};

export default TopstoriesCard;