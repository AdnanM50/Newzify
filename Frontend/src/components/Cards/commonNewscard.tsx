import React from 'react'

interface DataType {
  image: string;
  title: string;
  category: string;
  index?: number;
}

interface CommonNewscardProps {
  data: DataType;
  onReadMore?: () => void;
}

const CommonNewscard: React.FC<CommonNewscardProps> = ({ data, onReadMore }) => {
  return (
   <div key={data?.index} className="mb-6 flex gap-4">
   <img
     src='https://www.uni-hamburg.de/15322293/corona-virus-733x414-81999777e59f34709412f48a94465338233a1803.jpg'
     alt={data?.title}
     className="w-1/2 h-32 object-cover rounded-md mb-2"
   />
 <div className="">
 <p className="text-sm text-red-700 font-semibold">{data?.category}</p>
   <p className="text-base font-medium line-clamp-3">{data?.title}</p>
   <button 
     className="mt-1 bg-red-600 text-white text-sm px-4 py-1  hover:bg-red-700"
     onClick={onReadMore}
   >
     Read more
   </button>
 </div>
 </div>
  )
}

export default CommonNewscard
