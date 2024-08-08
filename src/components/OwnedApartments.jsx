import React, { useEffect, useState } from 'react'

function OwnedApartments({ marketplace, setMarketplace }) {

  const [loading, setLoading] = useState(true)
  const [buildings, setBuildings] = useState([])

  window.onbeforeunload = function() {
    // Your custom function to run when the page is reloaded
    console.log("Page is being reloaded!");
    window.location.href = "/";
    // Add any other actions you want to perform here
  };

  const getMyApartments = async() => {
    console.log("loading my apartments");
    let myApartments = await marketplace.myApartments()
    let displayItems = []
    for (let i = 0; i < myApartments.length; i++) {
      const apartment = myApartments[i]
      let theBuilding = await marketplace.buildings(apartment.buildingId)
      console.log(apartment);
      // let theBuilding = await marketplace.buildings(building.buildingId)
      // console.log("the building: ", theBuilding);
      // console.log(theBuilding.apartmentsCount - theBuilding.apartmentsOwned);
      // console.log("building: ", Number(building.apartmentsCount));
      // console.log("building: ", Number(building.apartmentOwners));
      const res = await fetch(theBuilding.ipfsHash)
      const metadata = await res.json()
      metadata.apartmentId = Number(apartment.apartmentId)
      console.log("metadata listed: ", metadata)
      displayItems.push(metadata)
    }
    setLoading(false)
    setBuildings(displayItems)
    setBuildings(displayItems)
  }

  useEffect(() => {
    getMyApartments();
  },[])

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2 className='text-white font-bold pt-24 text-2xl text-center'>Loading...</h2>
    </main>
  )

  return (
    <div className='flex flex-wrap gradient-bg-welcome   gap-10 justify-center pt-24 pb-5 px-16'>
      {
        (buildings.length > 0 ?
          buildings.map((item) => (
            <div className='card-div'>
              <div className='card-inner p-2'>
                <img src={item.image} alt="" className='object-cover w-[280px] h-[230px] rounded overflow-hidden' />
                <div className='flex flex-col justify-center items-center'>
                  <h3 className='text-white text-2xl font-thin mt-3'>{item.name}</h3>
                  <div className='text-white text-2xl font-thin mt-3'> {item.description}</div>
                  <div className='text-white text-2xl font-thin mt-3'>Apartment No: {item.apartmentId + 1}</div>
                  <div className='text-white text-2xl font-thin mt-3'>Price per Apartment:</div>
                  <div className='text-white text-2xl font-thin'>{item.price / 10**18} KII</div>
                </div>
              </div>
            </div>
          ))
          : (
            <main style={{ padding: "1rem 0" }}>
              <h2 className='text-white'>No apartments bought</h2>
            </main>
          ))}
    </div>
  )
}

export default OwnedApartments
