"use client";
import { BrowserProvider } from "ethers";
import { JsonRpcProvider } from "ethers/providers";
import { useEffect, useState } from "react";
import { getContract } from "../../config";
import Background from "../public/images/bg4.png";
import Image from "next/image";

export default function Home() {
  const [mintingAmount, setMintingAmount] = useState<number>(0);
  const [submittedMint, setSubmittedMint] = useState(false);
  const [transactionHashMint, setTransactionHashMint] = useState("");

  const [balance, setBalance] = useState<number>(0);
  const [walletKey, setwalletKey] = useState("");
  const [stakingAmount, setStakingAmount] = useState<number>(0);
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [submittedStake, setSubmittedStake] = useState(false);
  const [transactionHashStake, setTransactionHashStake] = useState("");

  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [elapsedStakeTime, setElapsedStakeTime] = useState<number>(0);
  const [submittedWithdraw, setSubmittedWithdraw] = useState(false);
  const [transactionHashWithdraw, setTransactionHashWithdraw] = useState("");

  const balanceString = balance?.toString();
  const stakedAmountString = stakedAmount?.toString();
  const withdrawAmountString = withdrawAmount?.toString();

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
      const tx = await contract.mint(signer, mintingAmount);
      await tx.wait();
      setSubmittedMint(true);
      setTransactionHashMint(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
    }
  };

  const amountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setMintingAmount(Number(inputValue));
      console.log(inputValue);
    } else {
      setMintingAmount(0);
    }
  };

  const getStake = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const stakedInEth = await contract.getStake(signer);
      setStakedAmount(stakedInEth);
    } catch (e: any) {
      console.log("Error data:", e.data);
      if (e.data) {
        const decodedError = contract.interface.parseError(e.data);
        console.log(`Fetching stake failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown error occurred.");
      }
    }
  };

  const stakeCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.stake(stakingAmount);
      await tx.wait();
      setSubmittedStake(true);
      setTransactionHashStake(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
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
      setSubmittedWithdraw(true);
      setTransactionHashWithdraw(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
    }
  };

  const getWithdrawAmount = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const stakedAmount = await contract.getStake(signer);
      if (stakedAmount > 0) {
        const withdrawAmount = await contract.getWithdraw(signer);
        setWithdrawAmount(withdrawAmount);
      } else {
        setWithdrawAmount(0);
      }
    } catch (e: any) {
      console.log("Error data:", e.data);
      if (e.data) {
        const decodedError = contract.interface.parseError(e.data);
        console.log(`Fetching stake failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown error occurred.");
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
        console.log(`Fetching stake failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown error occurred.");
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
        console.log(`Fetching stake failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown error occurred.");
      }
    }
  };

  return (
    <main className="min-h-screen text-white flex flex-col items-center justify-center space-y-6"
      style={{
        backgroundImage: `url(${Background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundPositionY: "80%",
        overflow: "hidden",
      }}>
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
              value={mintingAmount}
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
          {submittedMint && (
            <div className="text-center">
              <p className="text-green-500 mt-2">
                Minting Successful!{" "}
                <a
                  href={`https://etherscan.io/tx/${transactionHashMint}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-500"
                >
                  Click to view Transaction
                </a>
              </p>
            </div>
          )}
        </div>
  
        <div className="bg-gray-800 bg-opacity-80 p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Stake CHICS</h2>
          <div className="mb-4">
            <label htmlFor="stakingAmount" className="text-gray-400 block">
              Enter Staking Amount:
            </label>
            <input
              type="number"
              id="stakingAmount"
              value={stakingAmount}
              onChange={(e) => setStakingAmount(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full text-white bg-gray-700 focus:bg-gray-900"
            />
          </div>
          <button
            onClick={stakeCoin}
            className="bg-yellow-500 hover:bg-yellow-700 transition text-white px-4 py-2 rounded w-full"
          >
            Stake
          </button>
          {submittedStake && (
            <p className="text-green-500 mt-2">
              Staking successful! Transaction Hash:{" "}
              <a
                href={`https://etherscan.io/tx/${transactionHashStake}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-500"
              >
                Click to view Transaction
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
          <span className="text-gray-300">
            {balanceString}
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
          <span className="text-gray-300">
            {stakedAmountString}
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
          <span style={{ color: elapsedStakeTime > 60 ? "LightGreen" : "Yellow" }}>
              {elapsedStakeTime > 60
                ? "You can now get CHICS"
                : "Still Hatching"}
          </span>
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
          <span className="text-gray-300">
            {withdrawAmountString}
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
              getWithdrawAmount();
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
        {submittedWithdraw && (
          <p className="text-green-500 mt-2">
            Withdrawal successful! Transaction Hash:{" "}
            <a
              href={`https://etherscan.io/tx/${transactionHashWithdraw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-500"
            >
              Click to view Transaction
            </a>
          </p>
        )}
      </div>
    </main>
  );
}