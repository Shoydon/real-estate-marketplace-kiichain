import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import Home from './components/Home';
import NFTs from './components/NFTs';
import {marketplace_abi} from "./Abi.js"
import Create from './components/Create';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import 'react-toastify/dist/ReactToastify.css';
import Info from './components/Info.jsx';
import contractData from './contract.json'
import ChangeNetwork from './components/ChangeNetwork.jsx';

function App() {

  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [marketplace, setMarketplace]= useState({});
  const [nftitem, setNFTitem] = useState({})
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [chainId, setChainId] = useState(null)  
  const correctId = 123454321;

  useEffect(() => {
    if(chainId !== correctId) {
      setCorrectNetwork(false);
    } else if (chainId === correctId) {
      setCorrectNetwork(true);
    }
  }, [chainId])

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", (newChain) => {
          setChainId(newChain); 
          console.log(newChain);
          console.log(chainId);
          window.location.reload()
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.href = "/"; // Redirect using window.location
          window.location.reload();
        });
        // window.onbeforeunload = function() {
        //   // Your custom function to run when the page is reloaded
        //   console.log("Page is being reloaded!");
        //   window.location.href = "/";
        //   // Add any other actions you want to perform here
        // };
        
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setLoading(false)
        let marketplaceAddress = contractData.address;
       

        const marketplacecontract = new ethers.Contract(
          marketplaceAddress,
          contractData.abi,
          signer
        );
        setMarketplace(marketplacecontract); 
        console.log(marketplace);
        const chain = await provider.getNetwork();
        setChainId(Number(chain.chainId))
        console.log(chainId);
        setLoading(false);
        if(chainId === correctId) {
          setCorrectNetwork(true);
        }
      } else {
        console.error("Metamask is not installed");
      }
    };

    provider && loadProvider();
  }, []);

  return (
    <BrowserRouter>
    <ToastContainer/>
    <div className="App min-h-screen">
      <div className='gradient-bg-welcome h-screen w-screen'>
      {!correctNetwork && <ChangeNetwork/>}
      <Nav account={account}/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/all-nft" element={<NFTs marketplace={marketplace} setNFTitem={setNFTitem} />}></Route>
        <Route path="/create" element={<Create marketplace={marketplace}  />}></Route>
        <Route path="/info" element={<Info nftitem={nftitem} />}></Route>
      </Routes>
      </div>
    </div>
  
    </BrowserRouter>
  );
}

export default App;
