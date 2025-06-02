import React from "react";
import "../output.css"

const needItemCard = ({
  incrementCount,
  icon_File,
  name,
  count,
  decrementCount,
  removeProduct,
}) => {

  return (

    <div className='flex flex-row h-20 bg-blue-100 w-fit rounded-xl mx-1 my-1 
      justify-between shadow-black shadow-sm hover:shadow-lg 
      hover:shadow-blue-900 group font-sans font-bold'>

      <button className='rounded-xl m-1 hover:bg-green-100 
        bg-green-200 border-green-500 border-2 active:bg-green-50'
        onClick={incrementCount}>

        <img className='size-16 self-center z-20 m-auto rounded-lg'
          src={icon_File} alt={name} />

      </button>

      <div className='flex-col m-1 rounded-lg text-center w-20 flex'>

        <div className="my-auto border-red-600 rounded-lg">
          {count < 1 && (
            <div className='flex my-auto opacity-100 justify-center rounded-lg 
              text-center text-sm'>{name}</div>
          )}
          {count > 0 && (
            <div className='flex my-auto justify-center rounded-lg text-center 
              text-lg font-semibold'>{count}</div>
          )}
        </div>

        <div className="flex-row w-20 flex justify-between">
          <button onClick={decrementCount} className='font-extrabold border-2 my-auto
            border-red-600 rounded-lg z-10 bg-red-200 text-center text-red-600 
            hover:bg-red-100 active:bg-red-50 w-8'>
            ⊖
          </button>

          <button onClick={removeProduct} className='font-extrabold border-2 my-auto
            border-red-600 rounded-lg z-10 bg-red-200 text-center text-red-600 
            hover:bg-red-100 active:bg-red-50 w-8'>
            x
          </button>
        </div>

      </div>
    </div>
  );
}

export default needItemCard;
