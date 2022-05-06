# ERC20 token airdrop
1. Connect to metamask
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
- The app with now prompt metamask to approve the totalAmount after the user adds the ```addresses``` and ```ammounts```
- Approval is confirmed and user can then call the Airdrop smartcontact for token transfer (metaMask prompt)
## what changed
- PROD: notes in ```README2``` for SC deployment
## Skale v2 testnet
- 2500 transfers within 1 block: https://fancy-rasalhague.testnet-explorer.skalenodes.com/tx/0x45c814773331bd66638c514be4765f154b9431602e7ff696e151b9dc35a0ce1c/token-transfers
- increase gasLimit and try more txs ^^
![img](https://raw.githubusercontent.com/RubyAquaMarine/Easy_Airdrop_dApp/master/img/limitAt5100.png)


## Europa TestNet
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
- ```npm install```
- npm install in ```src/smart_contract```
- [ ] requires SC deployment, hardcode Airdrop address at line #87 on ```src/script/app.js```
- *Universal*: Any evm network and any erc20 token can be used.
- *limitation* 2500 receivers
- ```npm run start``` to start app

## PROD | Add new network
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

# deployment
- ui needs improvements: need ```styling guide```
- Europa ```prod``` will be hardcoded to 1 ```airdropv2.sol``` deployed contract(static address). No need to mint additional contracts(per user). 
- cd/ into ```./src/smart_contract``` and ```npx hardhat run scripts/deploy.js``` , copy address from terminal and paste into ./scr/script/app.js
- add new network id
- grant ```deployer factory contract``` permission. or deploy along with backend ```PKEY```




