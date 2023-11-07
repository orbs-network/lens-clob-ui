import { ethers } from 'ethers';

interface ABIInput {
    name: string;
    type: string;
}

interface ABIData {
    name: string;
    inputs: ABIInput[];
}

// Function to decode call data
export function decodeCallData(contractABI: ABIData[], callData: string): ethers.utils.Result | undefined {
   //@ts-ignore
    const i = new ethers.utils.Interface(contractABI);
    const decoded = i.decodeFunctionData(i.getFunction(callData.slice(0, 10)), callData);
   return decoded;
}

export function decodeCallData2(contractABI: ABIData[], callData: string): any | undefined {
    //@ts-ignore
     const i = new ethers.utils.Interface(contractABI);
     const decoded = i.parseTransaction({ data: callData, value: 0 });
    return { ...decoded, callData };
 }
 
