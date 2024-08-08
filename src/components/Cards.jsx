import React, { useState } from 'react'
import Fluid from "../assets/Fluid.png"
import Flower from "../assets/Flower.png"
import Ethereum from "../assets/Ethereum.svg"
import { ethers } from 'ethers'
import { Link } from 'react-router-dom'
import '../App.css';


function Cards({ item, buyMarketItem }) {

  const [apartmentCount, setApartmentCount] = useState(0); // Initial apartment count

  const handleApartmentChange = (event) => {
    const newCount = parseInt(event.target.value);
    if (newCount >= 0 && newCount <= item.apartmentsAvailable) { // Ensure positive value
      setApartmentCount(newCount);
    }
  };

  return (
    <div className='card-div'>
      <div className='card-inner p-2'>
        <img src={item.image} alt="" className='object-cover w-[280px] h-[230px] rounded overflow-hidden' />
        <div className='flex flex-col justify-center items-center'>
          <h3 className='text-white text-2xl font-thin mt-3'>{item.name}</h3>
          <div className='text-white text-2xl font-thin mt-3'>Apartments available : {item.apartmentsAvailable}</div>
          <div className='text-white text-2xl font-thin mt-3'>Price per Apartment:</div>
          {/* <div className='text-white text-2xl font-thin'>{item.price / 10**18} EMYC</div> */}
          <div className='text-white text-2xl font-thin'>{item.price / 10**18} KII</div>
          <hr />
          <div className='flex items-center mb-2 mt-3 flex-wrap justify-center'>
              <label htmlFor="apartmentCount" className='text-white mr-2'>Apartments to buy</label>
              <input
                type="number"
                id="apartmentCount"
                className='border border-gray-auto rounded px-2 py-1 outline-none focus:ring-2 focus:ring-purple-500 w-[inherit]'
                value={apartmentCount}
                onChange={handleApartmentChange}
              />
            </div>
          <div className='flex text-white justify-between items-center mb-3 gap-4 mt-3'>
            {/* {item.viewitem ? <Link as={Link} to="/info">
              <button type="button" class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded text-sm px-5 py-1.5 text-center me-2 ">View</button>
            </Link> :
              <button onClick={() => buyMarketItem(item)} type="button" class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded text-sm px-5 py-1.5 text-center me-2 ">Open</button>
            } */}
            <button onClick={() => buyMarketItem(item, apartmentCount)} type="button" class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded text-sm px-5 py-1.5 text-center me-2 ">Buy</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cards