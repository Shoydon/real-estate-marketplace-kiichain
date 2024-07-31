import React from 'react'
import Flower from "../assets/Flower.png"
import Ethereum from "../assets/Ethereum.svg"
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'

function Info({nftitem}) {
  console.log(nftitem)
  return (
    <div className='flex items-center px-48 gap-4 pt-32'>
        <div className='h-full'>
            <img src={nftitem.image} alt="" srcset="" className='h-[450px] rounded'/>
        </div>
        <div className='card-inner card-info p-5'>
           <h1 className='text-white font-semibold text-3xl'>{nftitem.name}</h1>
           <div className='border border-zinc-700 mt-2 mb-4'></div>
            {/* {nftitem.owner.length>0 ? (<div className='flex my-4 items-center gap-2'>
                <h2 className='text-xl font-samll text-zinc-300 '>Owner: </h2>
                
                <p className='text-white font-semibold text-2xl'>{nftitem.owner}</p>
            </div>) : "No Hello"} */}
           <div className='flex flex-col items-start border border-zinc-700 h-[250px] rounded'>
           <h3 className='text-xl font-samll text-zinc-300 w-full border p-2 border-zinc-700 '>Description</h3>
           <p className='p-2 text-zinc-400'>{nftitem.description}</p>
           </div>
           <Link as={Link} to="/all-nft">
           
           <button className=" mt-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded text-sm px-5 py-2 text-center me-2 mb-2" >
                 Exit
                </button>
                </Link>
        </div>
    </div>
  )
}

export default Info