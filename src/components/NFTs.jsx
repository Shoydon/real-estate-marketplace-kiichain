import React, { useEffect, useState } from 'react'
import Cards from './Cards'
import { toast } from 'react-toastify';
import contractData from '../contract.json'
import { ethers } from 'ethers';

function NFTs({ marketplace, setNFTitem, setMarketplace }) {
  useEffect(() => {
    document.title = "NFT Museum ETH"
  }, []);

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const loadMarketplaceItems = async () => {
    // console.log("contract in nfts", marketplace);
    if (marketplace === null) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      let marketplaceAddress = contractData.address;
      const marketplacecontract = new ethers.Contract(
        marketplaceAddress,
        contractData.abi,
        signer
      );
      setMarketplace(marketplacecontract);
    }
    const itemCount = Number(await marketplace.buildingsCount.call())
    // console.log("item count", itemCount);

    let displayItems = [];
    let items = await marketplace.allBuildings()
    // console.log("items: ", items);
    // console.log(itemCount);
    for (let i = 0; i < itemCount; i++) {
      const item = items[i]
      // console.log("item: ", item);
      const apartmentsOwned = Number(item.apartmentsOwned)
      if (!item.soldOut) {
        // console.log();
        const uri = await item.ipfsHash

        const response = await fetch(uri)
        const metadata = await response.json()
        metadata.apartmentsOwned = apartmentsOwned;
        metadata.apartmentsAvailable = metadata.apartments - apartmentsOwned;
        metadata.buildingId = i
        console.log("metadata: ", metadata);
        // const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // items.push({
        //   // price: metadata.price,
        //   // itemId: item.itemId,
        //   // owner: metadata.owner,
        //   // seller: item.seller,
        //   // name: metadata.name,
        //   // description: metadata.description,
        //   // image: metadata.image,
        //   // viewitem: false,
        // })
        displayItems.push(metadata)
      }
    }
    setLoading(false)
    setItems(displayItems)
    console.log("type: ", typeof (items));
  }

  const buyMarketItem = async (item) => {
    const tx = await (await marketplace.viewitem(item.itemId, { value: 0 }))

    toast.info("Wait till transaction Confirms....", {
      position: "top-center"
    })

    await tx.wait();

    setNFTitem(item)
    item.viewitem = true;
  }



  useEffect(() => {
    loadMarketplaceItems()
  }, [])

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2 className='text-white font-bold pt-24 text-2xl text-center'>Loading...</h2>
    </main>
  )

  return (
    <div className='flex flex-wrap gradient-bg-welcome   gap-10 justify-center pt-24 pb-5 px-16'>
      {
        (items.length > 0 ?

          items.map((item, idx) => (

            <Cards item={item} buyMarketItem={buyMarketItem} marketplace={marketplace} />


          ))

          : (
            <main style={{ padding: "1rem 0" }}>
              <h2 className='text-white'>No listed assets</h2>
            </main>
          ))}
    </div>
  )
}

export default NFTs