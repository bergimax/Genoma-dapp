import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT, mintNFTBsc, mintNFTPolygon } from "./utils/interact.js";

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  useEffect(async () => {
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);

    addWalletListener();
  }, []);
 
  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { status } = await mintNFT(url, name, description);
    setStatus(status);
};

const onPolygonMintPressed = async () => {
  const { status } = await mintNFTPolygon(url, name, description);
  setStatus(status);
};

const onBscMintPressed = async () => {
  const { status } = await mintNFTBsc(url, name, description);
  setStatus(status);
};

function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">Genoma on blockchain</h1>
      <p>
        Simply add your genoma's address, name, and description, then press "Mint."
      </p>
      <form>
        <h2>🤔 Name: </h2>
        <input
          type="text"
          placeholder="e.g. My genoma as NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>🖼 Pinata hash address: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. this is my genoma stored on pinata cloud service"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT on ETH
      </button> 
      <br></br>
      <button id="mintButtonBSC" onClick={onBscMintPressed}>
        Mint NFT on BSC
      </button>
      <br></br>
      <button id="mintButtonMATIC" onClick={onPolygonMintPressed}>
        Mint NFT on MATIC
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;
