import React, { useEffect, useState } from 'react'

function MyBuildings({ marketplace, address, setMarketplace }) {

  // console.log(marketplace);
  const [loading, setLoading] = useState(true)
  const [buildings, setBuildings] = useState([])

  window.onbeforeunload = function() {
    // Your custom function to run when the page is reloaded
    console.log("Page is being reloaded!");
    window.location.href = "/";
    // Add any other actions you want to perform here
  };

  const getMyBuildings = async () => {
    console.log("loading my buildings");
    let myBuildings = await marketplace.myListedBuildings()
    // console.log(myBuildings[0]);
    // console.log(myBuildings[1]);
    // console.log(myBuildings[2]);
    let displayItems = []
    for (let i = 0; i < myBuildings.length; i++) {
      const building = myBuildings[i]
      let theBuilding = await marketplace.buildings(building.buildingId)
      // console.log("the building: ", theBuilding);
      // console.log(theBuilding.apartmentsCount - theBuilding.apartmentsOwned);
      // console.log("building: ", Number(building.apartmentsCount));
      // console.log("building: ", Number(building.apartmentOwners));
      const res = await fetch(building.ipfsHash)
      const metadata = await res.json()
      let apartmentsAvailable = theBuilding.apartmentsCount - theBuilding.apartmentsOwned
      metadata.apartmentsAvailable = apartmentsAvailable
      console.log("metadata listed: ", metadata)
      displayItems.push(metadata)
    }
    setLoading(false)
    setBuildings(displayItems)
    setBuildings(displayItems)
  }

  useEffect(() => {
    getMyBuildings();
  }, [])

  // useEffect(() => {
  //   console.log("type: ", typeof (buildings));
  //   console.log(buildings);
  // }, [buildings])


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
                  <div className='text-white text-2xl font-thin mt-3'>Apartments available : {item.apartmentsAvailable}</div>
                  <div className='text-white text-2xl font-thin mt-3'>Price per Apartment:</div>
                  <div className='text-white text-2xl font-thin'>{item.price} KII </div>
                </div>
              </div>
            </div>
          ))
          : (
            <main style={{ padding: "1rem 0" }}>
              <h2 className='text-white'>No listed Buildings</h2>
            </main>
          ))}
    </div>
  )
}

export default MyBuildings
