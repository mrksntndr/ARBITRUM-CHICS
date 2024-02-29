import { Contract, ContractRunner } from "ethers";
import abi from "./abi.json";

export function getContract(signer: ContractRunner) {
    return new Contract(
        "0xb9020A9302F5F298D60e5a9C65D399343BF4eAAc",
        abi as any,
        signer
    );
}