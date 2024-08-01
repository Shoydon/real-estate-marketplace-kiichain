import React, { useEffect, useState } from 'react'
import Cards from './Cards'
import { toast } from 'react-toastify';
import contractData from '../contract.json'
import { ethers } from 'ethers';

function NFTs({ marketplace, setNFTitem, setMarketplace }) {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [bal, setBal] = useState(0)
  useEffect(() => {
    document.title = "NFT Museum ETH"
    const getBal = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const acc = signer.getAddress();
      const balanceWei = await provider.getBalance(acc);
      // Convert the balance from wei to eth
      // const balanceEth = ethers.utils.formatEther(balanceWei);
      console.log("bal: " + Number(balanceWei));
      setBal(Number(balanceWei))
    }
    getBal();
  }, []);

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
      console.log(marketplace);
      setMarketplace(marketplacecontract);
      setLoading(false)
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

  const buyMarketItem = async (item, apartmentCount) => {
    // const tx = await (await marketplace.viewitem(item.itemId, { value: 0 }))
    if (apartmentCount < 1) {
      toast.info("Enter number of apartments to buy", {
        position: "top-center"
      })
      return
    }
    console.log("buying apartment");
    console.log(item, apartmentCount);
    console.log("price to pay: ", item.price * apartmentCount);
    console.log("price type : ", typeof (item.price * apartmentCount));
    console.log(bal > (item.price * apartmentCount) ? "bal is greater "+bal : "ap is greater " + (item.price * apartmentCount) );
    try {
      // const bigBuildingId = ethers.utils.bigNumberify(item.buildingId);
      // const bigApartmentCount = ethers.utils.bigNumberify(apartmentCount);
      // console.log("inside send trxn: ", item.price * apartmentCount);
      const tx = await marketplace.buyApartment(item.buildingId, apartmentCount, {
        value: (item.price * apartmentCount) // Assuming you have apartment price
      });      // Send the transaction (assuming signer has sufficient funds)
      const receipt = await tx.wait();

      await tx.wait();
      toast.success("Transaction successful!", { position: "top-center" })
      console.log("Transaction successful:", receipt);
      return receipt.transactionHash; // O
    } catch (e) {
      console.log("Error buying apartment: ", e);
    }

    // toast.info("Wait till transaction Confirms....", {
    //   position: "top-center"
    // })


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