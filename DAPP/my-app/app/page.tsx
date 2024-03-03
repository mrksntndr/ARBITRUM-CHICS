"use client";
import { BrowserProvider } from "ethers";
import { JsonRpcProvider } from "ethers/providers";
import { useEffect, useState } from "react";
import { getContract } from "../../config";
import Background from "../public/images/bg4.png";
import Image from "next/image";

export default function Home() {
  const [mintInput, setMintInput] = useState<number>(0);
  const [mintOut, setMintOut] = useState(false);
  const [mintHash, setMintHash] = useState("");

  const [balance, setBalance] = useState<number>(0);
  const [walletKey, setwalletKey] = useState("");
  const balanceString = balance?.toString();

  const [stakeInput, setStakeInput] = useState<number>(0);
  const [stakeOut, setStakeOut] = useState(false);
  const [stakeTotal, setStakeTotal] = useState<number>(0);
  const [stakeHash, setStakeHash] = useState("");
  const stakeTotalString = stakeTotal?.toString();

  const [withdrawInput, setWithdrawInput] = useState<number>(0);
  const [withdrawOut, setWithdrawOut] = useState(false);
  const [elapsedStakeTime, setElapsedStakeTime] = useState<number>(0);
  const [withdrawHash, setWithdrawHash] = useState("");
  const withdrawInputString = withdrawInput?.toString();

  const connectWallet = async () => {
    const { ethereum } = window as any;
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: [
            "https://sepolia-rollup.arbitrum.io/rpc",
            "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
          ],
          chainId: "0x66eee",
          chainName: "Arbitrum Sepolia",
        },
      ],
    });

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setwalletKey(accounts[0]);

    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0x66eee",
        },
      ],
    });
  };

  const mintCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.mint(signer, mintInput);
      await tx.wait();
      setMintOut(true);
      setMintHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Mint Unsucessful: ${decodedError?.args}`);
    }
  };

  const amountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setMintInput(Number(inputValue));
      console.log(inputValue);
    } else {
      setMintInput(0);
    }
  };

  const getStake = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const stakedInEth = await contract.getStake(signer);
      setStakeTotal(stakedInEth);
    } catch (e: any) {
      console.log("Error data:", e.data);
      if (e.data) {
        const decodedError = contract.interface.parseError(e.data);
        console.log(`Stakie Failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown has error occurred.");
      }
    }
  };

  const stakeCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.stake(stakeInput);
      await tx.wait();
      setStakeOut(true);
      setStakeHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Mint failed: ${decodedError?.args}`);
    }
  };

  const withdrawCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.withdraw();
      await tx.wait();
      setWithdrawOut(true);
      setWithdrawHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Mint failed: ${decodedError?.args}`);
    }
  };

  const getWithdrawInput = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const stakeTotal = await contract.getStake(signer);
      if (stakeTotal > 0) {
        const withdrawInput = await contract.getWithdraw(signer);
        setWithdrawInput(withdrawInput);
      } else {
        setWithdrawInput(0);
      }
    } catch (e: any) {
      console.log("Error data:", e.data);
      if (e.data) {
        const decodedError = contract.interface.parseError(e.data);
        console.log(`Failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown have error occurred.");
      }
    }
  };

  const getElapsedStakeTime = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const elapsedStakeTime = await contract.getElapsedStakeTime(signer);

      setElapsedStakeTime(elapsedStakeTime);
    } catch (e: any) {
      console.log("Error data:", e.data);
      if (e.data) {
        const decodedError = contract.interface.parseError(e.data);
        console.log(`Failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown have error occurred.");
      }
    }
  };

  const getBalance = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const balance = await contract.balanceOf(signer);
      const adjustedBalance = Number(balance) / 1000000000000000000;
      setBalance(adjustedBalance);
    } catch (e: any) {
      console.log("Error data:", e.data);
      if (e.data) {
        const decodedError = contract.interface.parseError(e.data);
        console.log(`Failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown have error occurred.");
      }
    }
  };

  return (
    <main
      className="min-h-screen text-white flex flex-col items-center justify-center space-y-6"
      style={{
        backgroundImage: `url(${Background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundPositionY: "80%",
        overflow: "hidden",
      }}
    >
      <div className="flex items-center justify-center mb-6">
        <Image
          src="/images/chikipibg.png"
          alt="Image"
          width={200}
          height={200}
          className="rounded-full object-cover opacity-95"
        />
      </div>
      <div className="flex flex-col items-center mb-6">
        {walletKey ? (
          <>
            <span>Wallet Connected:</span>
            <p className="text-gray-500 mt-2 text-center">
              Address: {walletKey}
            </p>
          </>
        ) : (
          <button
            className="bg-gray-500 hover:bg-gray-700 transition text-white px-8 py-5 rounded"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>

      <div className="flex space-x-4">
        <div className="bg-gray-800 bg-opacity-80 p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Mint CHICS</h2>
          <div className="mb-4">
            <label htmlFor="mintAmount" className="text-gray-400 block">
              Enter Minting Amount:
            </label>
            <input
              type="number"
              id="mintAmount"
              value={mintInput}
              onChange={amountChange}
              className="border rounded px-3 py-2 w-full text-white bg-gray-700 focus:bg-gray-900"
            />
          </div>
          <button
            onClick={mintCoin}
            className="bg-green-500 hover:bg-green-700 transition text-white px-4 py-2 rounded w-full"
          >
            Mint
          </button>
          {mintOut && (
            <div className="text-center">
              <p className="text-green-500 mt-2">
                Minting Successful!{" "}
                <a
                  href={`https://etherscan.io/tx/${mintHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-500"
                >
                  Click to view your Transaction
                </a>
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 bg-opacity-80 p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Stake CHICS</h2>
          <div className="mb-4">
            <label htmlFor="stakeInput" className="text-gray-400 block">
              Enter Staking Amount:
            </label>
            <input
              type="number"
              id="stakeInput"
              value={stakeInput}
              onChange={(e) => setStakeInput(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full text-white bg-gray-700 focus:bg-gray-900"
            />
          </div>
          <button
            onClick={stakeCoin}
            className="bg-yellow-500 hover:bg-yellow-700 transition text-white px-4 py-2 rounded w-full"
          >
            Stake
          </button>
          {stakeOut && (
            <p className="text-green-500 mt-2">
              Staking successful! Transaction Hash:{" "}
              <a
                href={`https://etherscan.io/tx/${stakeHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-500"
              >
                Click to view your Transaction
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="bg-gray-800 bg-opacity-80 p-6 rounded shadow-md w-full max-w-md w-90">
        <div>
          <p className="text-xl font-bold mb-4">Owned CHICS</p>
        </div>
        <p className="flex items-center mb-4">
          <span className="text-gray-400">Current CHICS: &nbsp;</span>
          <span className="text-gray-300">{balanceString}</span>
          <Image
            src="/images/manok.webp"
            alt="Additional Image"
            width={20}
            height={20}
            className="ml-2"
          />
          <button
            onClick={() => {
              getBalance();
            }}
            className="ml-2"
          >
            <Image
              src="/images/rfrsh.svg"
              alt="Left Image"
              width={13}
              height={13}
              style={{ filter: "invert(1)", transition: "transform 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </button>
        </p>
        <p className="flex items-center mb-4">
          <span className="text-gray-400">Staked CHICS: &nbsp;</span>
          <span className="text-gray-300">{stakeTotalString}</span>
          <Image
            src="/images/manok.webp"
            alt="Additional Image"
            width={20}
            height={20}
            className="ml-2"
          />
          <button
            onClick={() => {
              getStake();
            }}
            className="ml-2"
          >
            <Image
              src="/images/rfrsh.svg"
              alt="Left Image"
              width={13}
              height={13}
              style={{ filter: "invert(1)", transition: "transform 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </button>
        </p>

        <p className="flex items-center mb-4">
          <span className="text-gray-400">Incubating CHICS: &nbsp;</span>
          <span className="text-gray-300">
            {stakeTotal > 0 ? (
              <span
                style={{
                  color: elapsedStakeTime > 60 ? "LightGreen" : "Yellow",
                }}
              >
                {elapsedStakeTime > 60
                  ? "You can now get CHICS"
                  : "Still Hatching"}
              </span>
            ) : (
              <span style={{ color: "pink" }}>No CHICS staked</span>
            )}
          </span>
          <Image
            src="/images/manok.webp"
            alt="Additional Image"
            width={20}
            height={20}
            className="ml-2"
          />
          <button
            onClick={() => {
              getElapsedStakeTime();
            }}
            className="ml-2"
          >
            <Image
              src="/images/rfrsh.svg"
              alt="Left Image"
              width={13}
              height={13}
              style={{ filter: "invert(1)", transition: "transform 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </button>
        </p>

        <p className="flex items-center mb-4">
          <span className="text-gray-400">Withdrawable CHICS: &nbsp;</span>
          <span className="text-gray-300">{withdrawInputString}</span>
          <Image
            src="/images/manok.webp"
            alt="Additional Image"
            width={20}
            height={20}
            className="ml-2"
          />
          <button
            onClick={() => {
              getWithdrawInput();
            }}
            className="ml-2"
          >
            <Image
              src="/images/rfrsh.svg"
              alt="Left Image"
              width={13}
              height={13}
              style={{ filter: "invert(1)", transition: "transform 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </button>
        </p>
        <button
          onClick={withdrawCoin}
          className="bg-blue-500 hover:bg-blue-700 transition text-white px-4 py-2 rounded w-full mt-4"
        >
          Withdraw
        </button>
        {withdrawOut && (
          <p className="text-green-500 mt-2">
            Withdrawal successful! Transaction Hash:{" "}
            <a
              href={`https://etherscan.io/tx/${withdrawHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-500"
            >
              Click to view your Transaction
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
