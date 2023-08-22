import { Contract } from '@ethersproject/contracts';
import { ethers } from "ethers";

import TokenABI from '../contracts/Token.json';
import SingleNFTABI from '../contracts/SingleNFT.json';
import SingleFixedABI from '../contracts/SingleFixed.json';
import SingleAuctionABI from '../contracts/SingleAuction.json';

import MultipleNFTABI from '../contracts/MultipleNFT.json';
import MultipleFixedABI from '../contracts/MultipleFixed.json';
import NFTFactoryABI from '../contracts/NFTFactory.json';
import AddNFTCollectionABI from '../contracts/AddNFTCollection.json';
import DropERC1155ABI from '../contracts/DropERC1155.json';


import MysteryBoxABI from '../contracts/MysteryBox.json';
import MysteryBoxFactoryABI from '../contracts/MysteryBoxFactory.json';

import SingleNFTStakingFactoryABI from '../contracts/SingleNFTStakingFactory.json';
import MultiNFTStakingFactoryABI from '../contracts/MultiNFTStakingFactory.json';
import MultiNFTStakingABI from '../contracts/MultiNFTStaking.json';
import SingleNFTStakingABI from '../contracts/SingleNFTStaking.json';

export const NetworkParams = {
  defaultChainID : 369,
  chainList : [369],
  369: {
    chainId: '0x171',
    chainName: 'PulseChain',
    nativeCurrency: {
      name: 'PulseChain',
      symbol: 'PLS',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.pulsechain.com'],
    blockExplorerUrls: ['https://scan.pulsechain.com']       
  },
}

export const CONTRACTS_BY_NETWORK = {
  369: {
    DropERC1155: {
      address: "0x158e02127C02Dce2a9277bdc9F1815C91F08E812",
      abi: DropERC1155ABI,
      tokenId: 0
    },
    AddNFTCollection: {
      address: "0x0f2b74fc5968f980c43CCde186B67816105fe97f",
      abi: AddNFTCollectionABI,      
    },
    NFTFactory: {
      address: "0x66be310467ed183aa4a6f97cb29b133fb33e26a1",
      abi: NFTFactoryABI,
    },
    MultipleFixed: {
      address: "0x98d64044f3a3cd1689cbade58ca382197d920760",
      abi: MultipleFixedABI
    },
    SingleAuction: {
      address: "0x24d6c1ca1873c4b33a85364acb67925ef2be4aa5",
      abi: SingleAuctionABI
    },
    SingleFixed: {
      address: "0x76c19cc1063c434a902949a18cb8c8fa0c9a9dab",
      abi: SingleFixedABI,
    },
    MysteryBoxFactory: {
      address: "0xe83c66d2fb6cb889163108da0bf81be3b83184eb",
      abi: MysteryBoxFactoryABI,
    },
    SingleNFTStakingFactory: {
      address: "0x6da446675eaf70052296b2962a022e850a1864ce",
      abi: SingleNFTStakingFactoryABI,
    },
    MultiNFTStakingFactory: {
      address: "0x33252862bdca560566f2fcb0caa34c94b6b86888",
      abi: MultiNFTStakingFactoryABI,
    },
  }
}

export const Tokens = {  
  369 : [
    {
      name: "PulseChain",
      symbol: "PLS",
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      logoURI: "https://tokens.app.pulsex.com/images/tokens/0xA1077a294dDE1B09bB078844df40758a5D0f9a27.png"
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      address: "0x0cb6f5a34ad42ec934882a05265a7d5f59b51a2f",
      decimals: 6,
      logoURI: "https://tokens.app.pulsex.com/images/tokens/0x0Cb6F5a34ad42ec934882A05265A7d5F59b51A2f.png"
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0x15d38573d2feeb82e7ad5187ab8c1d52810b1f07",
      decimals: 6,
      logoURI: "https://tokens.app.pulsex.com/images/tokens/0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07.png"
    },
  ],
}

// get factory, single/multiple filxed, auction contract and info
export function getContractInfo(name, chainId) {
  const contracts = CONTRACTS_BY_NETWORK?.[chainId];  
  if(contracts) {
    return contracts?.[name];
  }else{
    return null;
  }
}
export function getContractObj(name, chainId, provider) {
  var newProvider; 
  if (!!provider) { 
    newProvider = provider;    
  } else {
    newProvider =  new ethers.providers.JsonRpcProvider(NetworkParams?.[chainId]?.rpcUrls[0]);;
  }  

  const info = getContractInfo(name, chainId);
  return !!info && new Contract(info.address, info.abi, newProvider);
}


// get token contract
export function getTokenContract(address, chainId, provider) {
  if (!!provider) {
    return new Contract(address, TokenABI, provider);
  } else {   
    const rpcProvider = new ethers.providers.JsonRpcProvider(NetworkParams?.[chainId]?.rpcUrls[0]);
    return new Contract(address, TokenABI, rpcProvider);
  }
}

// get single/multiple collection contract
export function getCollectionContract( type, address, chainId, provider) {
  var newProvider; 
  if (!!provider) { 
    newProvider = provider;    
  } else {
    newProvider =  new ethers.providers.JsonRpcProvider(NetworkParams?.[chainId]?.rpcUrls[0]);
  }  
  if (type === 'single') {
    return new Contract(address, SingleNFTABI, newProvider);
  } else if (type === 'multi') {
    return new Contract(address, MultipleNFTABI, newProvider);
  }
  return new Contract(address, SingleNFTABI, newProvider);
}

// get mysterybox contract
export function getMysteryBoxContract( address, chainId, provider) {  
  var newProvider; 
  if (!!provider) { 
    newProvider = provider;    
  } else {
    newProvider =  new ethers.providers.JsonRpcProvider(NetworkParams?.[chainId]?.rpcUrls[0]);
  } 
  return new Contract(address, MysteryBoxABI, newProvider);
} 

// get single/multiple staking contract
export function getStakingContract( type, address, chainId, provider) {
  var newProvider; 
  if (!!provider) { 
    newProvider = provider;    
  } else {
    newProvider =  new ethers.providers.JsonRpcProvider(NetworkParams?.[chainId]?.rpcUrls[0]);
  }  
  if (type === 'single') {
    return new Contract(address, SingleNFTStakingABI, newProvider);
  } else if (type === 'multi') {
    return new Contract(address, MultiNFTStakingABI, newProvider);
  }
  return new Contract(address, SingleNFTStakingABI, newProvider);
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
 export async function registerToken(tokenAddress, tokenSymbol, tokenDecimals) {
  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,        
      },
    },
  })  
  return tokenAdded
}


// get payment curreny information
export function getCurrencyInfoFromAddress(chainId, address){
  const currencies = Tokens?.[chainId]; 
  if (currencies) {
    for (let index = 0; index < currencies.length; index++) {
      const currencyInfo = currencies[index];
      if (currencyInfo.address.toLowerCase() === address.toLowerCase()) {
        return currencyInfo;
      }
    }
  } else {
    return null;
  }  
  return null;
}
export function getCurrencyInfoFromSymbol(chainId, symbol){
  const currencies = Tokens?.[chainId]; 
  if (currencies) {
    for (let index = 0; index < currencies.length; index++) {
      const currencyInfo = currencies[index];
      if (currencyInfo.symbol.toLowerCase() === symbol.toLowerCase()) {
        return currencyInfo;
      }
    }
    return null;
  } else {
    return null;
  } 
}


export const shorter = (str) =>
  str?.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str

export function formatNum(value) {
  let intValue = Math.floor(value);
  if (intValue < 10) {
    return ''+ parseFloat(value).toPrecision(2);
  } else if (intValue < 1000){
    return '' + intValue;
  } else if (intValue < 1000000) {
    return parseFloat(intValue/1000).toFixed(1) + 'K';
  } else if (intValue < 1000000000) {
    return parseFloat(intValue/1000000).toFixed(1) + 'M';
  } else {
    return parseFloat(intValue/1000000000).toFixed(1) + 'B';
  }
}

export const putCommas = (value) => {
  try {
    if (!value) return value
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } catch (err) {
    return value
  }
}