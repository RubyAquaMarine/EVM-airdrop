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
- When user connects the App deploys a new smartcontact will be deployed after metamask approval (works with any l2: rinkeby failed from slow pending tx(error handling))
- The app with now prompt metamask to approve the totalAmount 
- Approval is confirmed and user can then call the Airdrop smartcontact for token transfer (metaMask prompt)
## what changed
- smart contracts are now deployed automatically. The ./src/smart_contract hardhat was used to create the ```abi``` and ```bytecode``` (upgraded to AirDropV2.sol). extra notes in ```README2```
## Skale v2 testnet
- 2500 transfers within 1 block: https://fancy-rasalhague.testnet-explorer.skalenodes.com/tx/0x45c814773331bd66638c514be4765f154b9431602e7ff696e151b9dc35a0ce1c/token-transfers
- increase gasLimit and try more txs ^^
![img](https://raw.githubusercontent.com/RubyAquaMarine/Easy_Airdrop_dApp/master/img/limitAt5100.png)


## Europa 
- RPC: 
- BlockExplorer: 
- ChainID: 
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


# Skale Schain Owners
The schain owners will need to adjust setting within the ```configController```
## FreeContractDeployment Off
- if schain owner doesn't allow ```FreeContractDeployment``` , then deploy ```smart_contract``` and hardwire contract address within file ```src/scripts/app.js``` and edit line #106 : ```App.airdropAddress = App.sc_address``` to ```App.airdropAddress = 'deployedAirDropAddress'``` and remove the previous deployment logic at line #52-104

## FreeContractDeployment On
- the metamask user can switch to any schain network and refresh the webpage to redeploy a new airdrop contract
- requirements: only if schain owner allows ```enableFreeContractDeployment`` and ```isFCDEnabled()```  within the ```configController``` contract

## s2s
[docs]https://deploy-preview-11--devportal-v2.netlify.app/ima/1.2.x/s2s-transferring-erc20#setup  

- ```default settings``` are: whitelisting enabled, automatic deployment disabled
- enable automatic deploy on the origin chain (chain owner) with ```tokenManagerContract.enableAutomaticDeploy()```
- connect the target schain to the origin chain with ```tokenManagerLinkerContract.connectSchain('schain-name')```
- enableMTM() - enables MTM on SKALE Chain? [link](https://github.com/skalenetwork/docs.skale.network/blob/1b80628012e8612fe15096e0aaf5b26d0ba5bcf4/components/develop/modules/ROOT/pages/skale-chain-access-control.adoc)
## ima permissions
whitelisting only controls the tokens from are allowed from l1 to l2. I'm not sure if the whitelisting controls 2s2  
- [link](https://deploy-preview-11--devportal-v2.netlify.app/ima/1.2.x/access-control#_owner_ima_mainnet_permissions)
- ```addERC20TokenByOwner``` (manual mapping. when to use this, how does it work)
- ```allowInterchainConnections``` connect several chains to the same IMA bridge contracts (same owner) , how is this useful? possible scenario

# aquamarine
- ui needs improvements: need ```styling guide```
- Europa ```prod``` will need to be hardcoded to 1 ```airdropv2.sol``` make another branch ```europa```




