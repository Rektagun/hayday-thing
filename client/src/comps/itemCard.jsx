import React from "react";
import "../output.css"

const ItemCard = ({
  incrementCount,
  icon_File,
  name,
  count,
  decrementCount,
  removeProduct,
}) => {

  return (

    <div className='flex flex-row h-20 bg-blue-200 w-fit rounded-xl m-1 
      justify-between shadow-black shadow-sm hover:shadow-lg 
      hover:shadow-blue-900 group font-sans font-bold'>

      <button className='rounded-xl m-1 border-0 bg-blue-100'
        onClick={incrementCount}>

        <img className='size-16 self-center z-20 m-auto rounded-lg'
          src={icon_File} alt={name} />
      </button>

      <div className='flex-col m-1 rounded-lg text-center w-20 flex'>

        <button onClick={incrementCount} className="my-auto size-full rounded-lg border-0 bg-blue-200">
          {count < 1 && (
            <div className='flex my-auto opacity-100 justify-center rounded-lg text-center text-sm font-semibold'>{name}</div>
          )}
          {count > 0 && (
            <div className='flex my-auto justify-center rounded-lg text-center text-lg font-semibold'>{count}</div>
          )}
        </button>

        <div className="flex-row w-20 flex justify-between">
          {count > 0 && (
            <button onClick={decrementCount} className='font-extrabold border-2 my-auto
              border-red-600 rounded-lg z-10 bg-red-200 text-center text-red-600 
              hover:bg-red-100 active:bg-red-50 w-8'>
              ⊖
            </button>
          )}

          {count > 0 && (
            <button onClick={removeProduct} className='font-extrabold border-2 my-auto
              border-red-600 rounded-lg z-10 bg-red-200 text-center text-red-600 
              hover:bg-red-100 active:bg-red-50 w-8'>
              x
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default ItemCard;
