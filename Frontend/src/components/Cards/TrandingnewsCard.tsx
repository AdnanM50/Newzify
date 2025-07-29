import React from "react";
import { Button } from "../ui/button";

const TrandingNewsCard: React.FC = () => {
  return <div className="mt-6">
    <h3 className="text-lg font-semibold font-serif text-gray-900 leading-tight mb-1 group-hover:text-red-600 transition-colors line-clamp-2">
        DNA is a molecule that carries the genetic instructions for all known living organisms and many viruses
      </h3>
      <p className="line-clamp-4">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Et modi eveniet temporibus officiis ex at id laudantium odio saepe quos eius quae
      </p>
      <Button className="bg-red-600 cursor-pointer hover:bg-red-700 mt-2 text-white px-6 py-3 font-semibold transition-colors">Read More</Button>
  </div>;
};
export default TrandingNewsCard;
