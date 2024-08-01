import React, { useEffect, useState } from 'react'
import { ethers } from "ethers"
import axios from 'axios'
import { toast } from 'react-toastify'
import contractData from '../contract.json'


function Create({ marketplace, address, correctNetwork }) {

  // const [loading, setLoading] = useState(true)
  const [nftimage, setNFTImage] = useState();
  const [forminfo, setFormInfo] = useState({
    title: "",
    description: "",
    owner: address,
    apartments: 0,
    price: 0
  });

  useEffect(() => {
    document.title = "Create"
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const changeHandler = (event) => {
    setNFTImage(event.target.files[0]);
  };

  const handleEvent = async (e) => {
    e.preventDefault();
    if(forminfo.apartments < 1) {
      toast.info("Building must have atleast 1 apartment", {
        position: "top-center"
      })
      return
    }
    if(forminfo.price < 1) {
      toast.info("Enter a valid price for the apartments", {
        position: "top-center"
      })
      return
    }
    console.log(nftimage);
    console.log(forminfo);

    const formData = new FormData();
    const jsonformData = new FormData();

    formData.append('file', nftimage);

    const metadata = JSON.stringify({
        name: forminfo.title,
        description: forminfo.description
    });
    jsonformData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
        cidVersion: 0,
    })
    jsonformData.append('pinataOptions', options);

    try{

        const resFile = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data: formData,
            headers: {
              pinata_api_key: `0a13ef76fb9e01561e05`,
              pinata_secret_api_key: `f0a2d096004e4f0483a64d06236ddc252b8d8acf612cde6465bc78f013a08ab0`,
              "Content-Type": "multipart/form-data",
            },
          });

        console.log(resFile.data);

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;

        const info ={
            name: forminfo.title,
            description: forminfo.description,
            image: ImgHash,
            price: forminfo.price * 10**10,
            // price: ethers.utils.parseEther(forminfo.price),
            owner:address,
            apartments: forminfo.apartments
        }

        async function pinJSONToPinata(info) {
            const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
            const headers = {
                'Content-Type': 'application/json',
                'pinata_api_key': `0a13ef76fb9e01561e05`,
                'pinata_secret_api_key': `f0a2d096004e4f0483a64d06236ddc252b8d8acf612cde6465bc78f013a08ab0`
            };

            try {
                const res = await axios.post(url, info, { headers });
                const meta = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
                console.log(meta);
                mintThenList(meta);
            } catch (error) {
                console.error(error);
            }

        }
    
     pinJSONToPinata(info)
    
      } catch (error) {
        console.log(error);
      }
    
  };


  const mintThenList = async (uri) => { 
    toast.info("Confirm to Mint the Building", {
      position: "top-center"
    })

  // const listingPrice = ethers.utils.parseEther(forminfo.price.toString())
  try {
    const tx1=  await(await marketplace.listBuilding(forminfo.apartments, forminfo.price *10**10, uri))
    // const tx1=  await(await marketplace.listBuilding(forminfo.apartments, ethers.utils.parseEther(forminfo.price), uri))
  
    toast.info("Wait till transaction Confirms....", {
      position: "top-center"
    })
  
    await tx1.wait()
    toast.success("Building added to marketplace successfully", {position:"top-center"})
  } catch (error) {
    toast.error("Error adding NFT to Marketplace")
    console.log(error);
  }

  }


  return (
    <div className='h-screen pt-24'>
      <div className="container-fluid mt-5 text-left">
        <div className="content mx-auto">

          <form class="max-w-sm mx-auto">

            <div className='max-w-lg mx-auto'>
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Upload Image</label>
              <input onChange={changeHandler} name="file" class="block w-full mb-4 h-8 text-m  text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" />
            </div>


            <div class="mb-4">
              <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Building Name</label>
              <input onChange={handleChange} type="text" id="title" name='title' class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter Building name" required />
            </div>

            <div class="mb-4">
              <label for="apartments" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Number of Apartments <span className='text-sx'></span></label>
              <input onChange={handleChange} type="number" min={1} id="apartments" name='apartments' class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="10" />
            </div>

            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
            <textarea onChange={handleChange} name="description" id="description" rows="4" class="block p-2.5 w-full text-sm  mb-4 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Describe the building"></textarea>
            <div class="mb-4">
              <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price (in 10¹⁰ KII)</label>
              <input onChange={handleChange} type="number" name='price' id="price" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder=' × 10¹⁰ KII' required />
            </div>
            <div className='text-center'>


              {/* <button onClick={(e) => {e.preventDefault();console.log(forminfo)}} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" >
                  Mint SBT
                </button> */}
              {correctNetwork && <button onClick={handleEvent} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" >
                Mint Building
              </button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Create