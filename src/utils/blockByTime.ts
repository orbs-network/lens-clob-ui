import Web3 from 'web3';


export default async function getClosestBlock(
  timestamp: number,
  web3: Web3
) {

  let minBlockNumber = 0
  let maxBlockNumber = await web3.eth.getBlockNumber();
  let closestBlockNumber = Math.floor((maxBlockNumber + minBlockNumber) / 2)
  let closestBlock = await web3.eth.getBlock(closestBlockNumber);
  let foundExactBlock = false

  while (minBlockNumber <= maxBlockNumber) {
    console.log(`checking blockNumber=${closestBlockNumber}...`)
    if (closestBlock.timestamp === timestamp) {
      foundExactBlock = true
      break;
    } else if (Number(closestBlock.timestamp) > timestamp) {
      maxBlockNumber = closestBlockNumber - 1
    } else {
      minBlockNumber = closestBlockNumber + 1
    }

    closestBlockNumber = Math.floor((maxBlockNumber + minBlockNumber) / 2)
    closestBlock = await web3.eth.getBlock(closestBlockNumber);
  }

  const previousBlockNumber = closestBlockNumber - 1
  const previousBlock = await web3.eth.getBlock(previousBlockNumber);
  const nextBlockNumber = closestBlockNumber + 1
  const nextBlock = await web3.eth.getBlock(nextBlockNumber);

  if (foundExactBlock) {
    console.log(`found a block that exactly matches the timestamp=${timestamp}, closestBlockNumber=${closestBlockNumber}, blockTimestamp=${closestBlock.timestamp}`)
    console.log(`adjacent block timestamps: leftBlockTimestamp=${previousBlock.timestamp}, rightBlockTimestamp=${nextBlock.timestamp}`)
  } else {
    console.log(`did not find a block that exactly matches the timestamp=${timestamp}, potential closestBlockNumber=${closestBlockNumber}, blockTimestamp=${closestBlock.timestamp}`)
    console.log(`adjacent block timestamps: leftBlockTimestamp=${previousBlock.timestamp}, rightBlockTimestamp=${nextBlock.timestamp}`)
  }
  return closestBlockNumber;
}
