# ERC20 token airdrop

Supports `ERC20` Tokens

1. Connect to metamask
2. Enter token Address that will be used for the transfer
3. Click ```Save Token Address```
4. Paste the addresses and then amounts
5. Separate the items with a comma, as in the example
6. Length of receivers and amounts must be equal
7. Click ```Proceed``` and ```Confirm``` within Metamask
8. Approval Status will update to ```Tokens Approved```
9. Click ```Proceed``` again and ```Confirm``` within Metamask to airdrop tokens
10. Wait for tx Status to change from ```Pending``` to ```Done```

# Instructions:
- git clone, cd /evm-airdrop
- ```npm install```
- npm install in ```src/smart_contract```
- [ ] requires SC deployment, hardcode Airdrop address at line #87 on ```src/script/app.js```
- cd/ into ```./src/smart_contract``` and ```npx hardhat run scripts/deploy.js``` , copy address from terminal and paste into ./scr/script/app.js
- cd/ into ```src/scripts/app.js``` and adjust ```CHAIN``` constants.
- ```npm run start``` to start app

## PROD | Add new network
app.js line 186
- add another network by using the ```case``` number matching the  ```chainID```
- add Europa [x] rpc

## Deployments
- stagingv3: Europa - `0xDcD7E0d844D2a2e6bB1949A90d00867452ADBF44`
- mainnet : Europa - `0x1f27e93d6bc67f7b033a17a1c4f01e03bba24bb9`

## GasLimit 160 million

csv with 800 wallet addresses 
`Gas Limit
159,999,999
 Gas Used by Transaction
21,415,757 | 13.38%
`

Skale can handle 8x more `erc20` transfers ^^ [tx](https://elated-tan-skat.explorer.mainnet.skalenodes.com/tx/0x9208a0ea52bef9aafe255a134758dc0645651595286043c72f204de6e5971079/token-transfers)





