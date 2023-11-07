export const guardians = {
  NEOPLY: "0xF8cd99A88707C4FC64aC91F237AF8570A83cC018",
  "오뽀가디언 - WhaleCoreStake - ORBS KOREA -":
    "0x8cd2a24f0c3f50bce2f12c846277491433b47ae0",
  "japan-guardian-altive-orbs-v2": "0xe00e13219734eec6e1e95b9a06bd881143d52bc9",
  "ZZANG-ORBS (짱)": "0xCfB0A1637e9af76a544B3066A9aD24D935fcbE0e",
  "Wings Stiftung": "0x067a8aFdC6d7BAfA0cCaA5Bb2da867F454a34dFa",
  "AngelSong-of-Orbs": "0x255c1f6c4da768dfd31f27057d38b84de41bcd4d",
  FREEMAN: "0x21Ff8c5D4fCE6912272dC424241811dAec5FdBf3",
  "Mind Heart Soul": "0x63e42A840cBdD950C138D4C20d70F049574dAe24",
  "(1++흑우) BlackBull Guardian Cooperative":
    "0x28cC6746Bf774ab7BAB70F703fd857C86eFc7835",
  "JAPAN（Dクル）": "0xDA961133e213C0B3EEab6Fb1a033c017846Ae627",
  "Orbs Guardians": "0x34Ae49c15e66982B7789f84f5aA2ad7556ce2",
  DELIGHT: "0x79F088400728c380412B3C351Ff65D1e06e40D68",
  "Guardians of Blockchain (가.오.블)":
    "0x0838b80529fF7A785e1bd644c3BAFc32F6D7811D",
  OKX: "0xB2d1B4db987D0F49E43A90dF8614143c7a6f8B65",
  MollBBang: "0xb226f469841d193829fa54661eAC4bA5CE91a41e",
  "KOLB & Beehive": "0xC16a9F64Abf45D84aa337457247ca09E9cDaa7A0",
  "My Smart Crypto": "0x17D717402bdEA6CDc1de443ccEc64679207F0E69",
  "ORBS-POS": "0x10736878dfc96d37ee24016d33e03a0ea88a3bd4",
  Orbsian: "0xa61a0e026b5699cd9d0c1dd37f2fc8cc813e4c7f",
  Moonstake: "0x2333b7587558c48110ffbc821c2ea5eefed76d88",
  "Good relation-Guardian(굿가)": "0x90e544Fa6F0029e516ee433E736F1CbCdefC2630",
  "Guardians-of-Orbs": "0x5bcf21c33a7dfc6e5ed26f7439ef065075ea61cf",
  "Orbs Gaurdians": "0x34ae49c15e66982b7789f84f5aa2ad7556ce20eb",
  "Taker#1": "0xc225419D61899b6409265f6d50220B9437b5916E",
  "Taker#2": "0x54447B419e5957C25d2cd54eC5252C83EA6D9d30",
  "Taker#3": "0x6F41cA53293e46b84C9531bd9036156dd5422aAe",
  "Taker#4": "0x154C7D38B10d8Ec1Bf9b4e8E671b557dA6F9E52B",
  "Taker#5": "0x61012d81EF857A10698bF003e3769d1c22b2b12F",
  "Taker#6": "0xCec082E944102e234469b2F72C3c303DF2A1c12A",
  "Taker#7": "0x35b78535f6d5Da0D250B08dd540fEE5137faaD37",
  "Taker#8": "0x25942b1a17615D91a7ccd2E8e3f9aE9810Fcd6d2",
  "Taker#9": "0xd76910C423Fa54467F88814aE50b7BA190c7F25f",
  "Taker#10": "0x01584cEC3546e73116F75B6Ca0075E38696a5710",
  "Wallet Pool#1": "0x526cE5bD8563069B96524e8e0496f35bbbA561bD",
  "Wallet Pool#2": "0x4df7f99782E4223F53b2b5232D34b02a2568540D",
  "Wallet Pool#3": "0x79A7d5Af4829F30fcd4704adE006A4608D7EF569",
  "Wallet Pool#4": "0x3AB2102b833D1B97BAE643cc46e6bd3d65DdE65d",
  "Wallet Pool#5": "0x854F1d5DbAC0a8c9C27359FD0Ad2637aBE8bf689",
  "Wallet Pool#6": "0xf8eaA5F0f547384a2382441043D36C78340BD03d",
  "Wallet Pool#7": "0xfa140914c0956Ff530d652dC2DA1B4FBfdb8C98F",
  "Wallet Pool#8": "0x18336f52a5e4CE6E918b43F7722a182195653eBB",
  "Wallet Pool#9": "0xCb85dB8b4a70b944B484AD0CB0B07e81567c65a5",
  "Wallet Pool#10": "0x83bb40d8E38A7CE8c61CB3E594238c152B07227a",
};

export function addressToName(address: string) {
  for (const name in guardians) {
    if (
      guardians[name as keyof typeof guardians].toLowerCase() ===
      address.toLowerCase()
    ) {
      return name;
    }
  }
  return (
    address.substring(0, 6) +
    "..." +
    address.substring(address.length - 4, address.length)
  );
}

export function addressToLogo(address: string) {
  let found = "";
  for (const name in guardians) {
    if (
      guardians[name as keyof typeof guardians].toLowerCase() ===
      address.toLowerCase()
    ) {
      found = name;
    }
  }

  return found.indexOf("aker") > -1 ? "⚡️" : "🌐";
}
