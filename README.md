# ERC20 token airdrop
1. Confirm AirDrop Contact deployment within metamask
2. Enter token Address that will be used for the transfer
3. Click ```Save Token Address```
4. Smile, this is easy
5. Paste the addresses and then amounts
6. Separate the items with a comma, as in the example
7. Length of receivers and amounts must be equal
8. Click ```Proceed``` and ```Confirm``` within Metamask
9. Approval Status will update to ```Tokens Approved```
10. Click ```Proceed``` again and ```Confirm``` within Metamask to airdrop tokens
11. Wait for tx Status to change from ```Pending``` to ```Done```

## new logic and approval
- When user connects the App deploys a new smartcontact : requires metamask ```approval``` and ```sFuel``` for tx gas
- The app with now prompt metamask to approve the totalAmount 
- Approval is confirmed and user can then call the Airdrop smartcontact for token transfer (metaMask prompt)
## what changed
- smart contracts are now deployed automatically. The ./src/smart_contract hardhat was used to create the ```abi``` and ```bytecode``` (upgraded to AirDropV2.sol). extra notes in ```README2```
## Skale v2 testnet
- 2500 transfers within 1 block: https://fancy-rasalhague.testnet-explorer.skalenodes.com/tx/0x45c814773331bd66638c514be4765f154b9431602e7ff696e151b9dc35a0ce1c/token-transfers
- increase gasLimit and try more txs ^^
![img](https://raw.githubusercontent.com/RubyAquaMarine/Easy_Airdrop_dApp/master/img/limitAt5100.png)


## Europa 
- RPC: https://testnet-proxy.skalenodes.com/v1/fancy-rasalhague
- BlockExplorer: https://fancy-rasalhague.testnet-explorer.skalenodes.com
- ChainID: 2255010950618556
- token: ```sFUEL```
- token DAI 
- - 0x4C45A6F9bB79977eF655b4147C14F9f40424ef00
- token RUBY
- - 0x83B38f79cFFB47CF74f7eC8a5F8D7DD69349fBf7

# Instructions: latest
- git clone, cd airdropper
- npm install , npm run 
- requires no .env , no private keys, no rpc hardcode, no contract addresses. contracts are deployed after  metmask connection and Confirm (deploy airdrop.sol to the connected rpc network).
- Universal: Any evm network and any erc20 token can be used.
- limitation for airdrop receiver list is subject to gasCosts on other networks.

## Add new network
app.js line 186
- add another network by using the ```case``` number matching the  ```chainID```
```
case 1:
                return {
                    network: "Mainnet",
                    url: "https://etherscan.io/",
                    id: 1
                }
                break
```
such as 
```
case 132333505628089:
                return {
                    network: "Schain Whispering-turails",
                    url: "https://testnet-proxy.skalenodes.com/v1/whispering-turais",
                    id: 132333505628089
                }
                break
```

# schain v2
► Block Explorer:
https://whispering-turais.testnet-explorer.skalenodes.com


# aquamarine: deployment
- ui needs improvements: need ```styling guide```
- ISSUE: deploy ```smart_contract``` and hardwire contract address within file ```src/scripts/app.js``` and edit line #106 : ```App.airdropAddress = App.sc_address``` to ```App.airdropAddress = 'deployedAirDropAddress'``` and remove the previous deployment logic at line #52-104
- make another branch ```europa```
- Europa ```prod``` will be hardcoded to 1 ```airdropv2.sol``` deployed contract(static address). No need to mint additional contracts(per user)
- grant ```deployer factory contract``` permission




