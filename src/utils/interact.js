import {pinJSONToIPFS} from './pinata.js';
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractABI = require('../contract-abi.json')
const contractAddress = "0x009a1185B1188d1Fa2D8d14f89B466cAB4Ae75fc";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

//test

const contractAddressPolygon = "0x9FFC181dB161fa1451E174598F764BC280944dC5";
const contractAddressBsc = "0xAd44a3601E781f077934434Ca1c60e9Ae15B822C";

export const connectWallet = async () => {
    if (window.ethereum) { 
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "👆🏽 Write a message in the text-field above.",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "👆🏽 Write a message in the text-field above.",
          };
        } else {
          return {
            address: "",
            status: "🦊 Connect to Metamask using the top right button.",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  async function loadContract() {
    return new web3.eth.Contract(contractABI, contractAddress);
  }
  
  export const mintNFT = async(url, name, description) => {

    //error handling
    if (url.trim() == "") {
      return {
        success: false,
        status: "❗Please insert the hash of the url",
      }
    }

    if (name.trim() == "") {
      return {
        success: false,
        status: "❗Please insert the name of your NFT",
      }
    }

    if (description.trim() == "") {
      return {
        success: false,
        status: "❗Please insert the description field",
      }
    }

  // eslint-disable-next-line 
    //make metadata
    const metadata = new Object();
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;

    //pinata pin request
    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your tokenURI.",
        }
    }
    const tokenURI = pinataResponse.pinataUrl;

    //load smart contract
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();

    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI() //make call to NFT smart contract
    };

    //sign transaction via Metamask
    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}

export const mintNFTPolygon = async(url, name, description) => {

  //error handling
  if (url.trim() == "") {
    return {
      success: false,
      status: "❗Please insert the hash of the url",
    }
  }

  if (name.trim() == "") {
    return {
      success: false,
      status: "❗Please insert the name of your NFT",
    }
  }

  if (description.trim() == "") {
    return {
      success: false,
      status: "❗Please insert the description field",
    }
  }

  // eslint-disable-next-line 
  //make metadata
  const metadata = new Object();
  metadata.name = name;
  metadata.image = url;
  metadata.description = description;

  //pinata pin request
  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
      return {
          success: false,
          status: "😢 Something went wrong while uploading your tokenURI.",
      }
  }
  const tokenURI = pinataResponse.pinataUrl;

  //load smart contract
  window.contract = await new web3.eth.Contract(contractABI, contractAddressPolygon);//loadContract();

  //set up your Ethereum transaction
  const transactionParameters = {
      to: contractAddressPolygon, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI() //make call to NFT smart contract
  };

  //sign transaction via Metamask
  try {
      const txHash = await window.ethereum
          .request({
              method: 'eth_sendTransaction',
              params: [transactionParameters],
          });
      return {
          success: true,
          status: "✅ Check out your transaction on Polygonscan: https://mumbai.polygonscan.com/tx/" + txHash
      }
  } catch (error) {
      return {
          success: false,
          status: "😥 Something went wrong: " + error.message
      }
  }
}

export const mintNFTBsc = async(url, name, description) => {

  //error handling
  if (url.trim() == "") {
    return {
      success: false,
      status: "❗Please insert the hash of the url",
    }
  }

  if (name.trim() == "") {
    return {
      success: false,
      status: "❗Please insert the name of your NFT",
    }
  }

  if (description.trim() == "") {
    return {
      success: false,
      status: "❗Please insert the description field",
    }
  }
  // eslint-disable-next-line 
  //make metadata
  const metadata = new Object();
  metadata.name = name;
  metadata.image = url;
  metadata.description = description;

  //pinata pin request
  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
      return {
          success: false,
          status: "😢 Something went wrong while uploading your tokenURI.",
      }
  }
  const tokenURI = pinataResponse.pinataUrl;

  //load smart contract
  window.contract = await new web3.eth.Contract(contractABI, contractAddressBsc);//loadContract();

  //set up your Ethereum transaction
  const transactionParameters = {
      to: contractAddressBsc, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI() //make call to NFT smart contract
  };

  //sign transaction via Metamask
  try {
      const txHash = await window.ethereum
          .request({
              method: 'eth_sendTransaction',
              params: [transactionParameters],
          });
      return {
          success: true,
          status: "✅ Check out your transaction on Bscscan: https://testnet.bscscan.com/tx/" + txHash
      }
  } catch (error) {
      return {
          success: false,
          status: "😥 Something went wrong: " + error.message
      }
  }
}
