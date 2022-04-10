## Ruby Address
- 0x83B38f79cFFB47CF74f7eC8a5F8D7DD69349fBf7

## DAI address
- 0x4C45A6F9bB79977eF655b4147C14F9f40424ef00

# ERC20 token airdrop

With this app, you can transfer your token until to 150 **limitation removed and tested to output 2400 transfers**  addresses at once, simple UI, configurations and features. <br><br>

**aquamarine** more notes:
- need to make contract **airdrop.sol** universal, similar to vesting contracts (any token can be sent)
- ui needs button to deploy the contract similar to vesting ui **done:automatically**
- ui needs to fetch the contract address and be displayed **done:automatically**

## How to run the project
**out of date**
* Clone repo
* Open ./src/Airdrop.sol
* Change the token contract address with the token address that you want to airdrop **each deploy hardcoded to one token**
* Deploy the smart_contract npx hardhat compile (README2.md) **only for SC mods** 
* Allow to airdrop contract address to spend the X your tokens %&$^#* notes: **built script** working, need to change the check allowance logic and approval method(missing)**done**
* Go to ./src/script and edit the lines N 5,10,11,12 related to your addresses **deployedContractAddress&owner:recoded:done**
* Go to ./ and run "npm start"
* Open the browser and type localhost:3000

# aquamarine
- ui needs improvements but first => **styling guide**
- need to make contract **airdrop.sol** universal, similar to vesting contracts (any token can be sent) - ```done```
* ISSUE: Change the token contract address with the token address that you want to airdrop **each airdrop.sol deploy is hardcoded to one token** - ```fixed```
- Europa ```prod``` will need to be hardcoded to 1 ```airdropv2.sol``` make another branch ```europa```
## new logic and approval
- When user connects the App deploys a new smartcontact will be deployed after metamask approval (works with any l2: rinkeby failed from slow pending tx(error handling))
- The app with now prompt metamask to approve the totalAmount 
- Approval is confirmed and user can then call the Airdrop smartcontact for token transfer (metaMask prompt)
## what changed
- smart contracts are now deployed automatically. The ./src/smart_contract hardhat was used to create the abi and bytecode. Also for easy SC mods (upgraded to AirDropV2.sol). extra notes in ```README2```
## Skale v2 testnet
- 2500 transfers within 1 block: https://fancy-rasalhague.testnet-explorer.skalenodes.com/tx/0x45c814773331bd66638c514be4765f154b9431602e7ff696e151b9dc35a0ce1c/token-transfers
- increase gasLimit and try more txs ^^
![img](https://raw.githubusercontent.com/RubyAquaMarine/Easy_Airdrop_dApp/master/img/limitAt5100.png)




## Europa 
- RPC: 
- BlockExplorer: 
- ChainID: 
- token: ```sFUEL```

# Instructions: latest
- git clone, cd airdropper
- npm install , npm run 
- requires no .env , no private keys, no rpc hardcode, no contract addresses. contracts are deployed after  metmask connection and Confirm (deploy airdrop.sol to the connected rpc network).
- Universal: Any evm network and any erc20 token can be used.
- limitation for airdrop receiver list is subject to gasCosts on other networks.

## app.js line 186
- update network with case == chainID
```
case 1:
                return {
                    network: "Mainnet",
                    url: "https://etherscan.io/",
                    id: 1
                }
                break
```

# schain v2
► RPC Endpoints
https://testnet-proxy.skalenodes.com/v1/whispering-turais
wss://testnet-proxy.skalenodes.com/v1/ws/whispering-turais

► Filestorage: https://testnet-proxy.skalenodes.com/fs/whispering-turais

► Chain ID: 132333505628089 | 0x785b4b9847b9

► Block Explorer:
https://whispering-turais.testnet-explorer.skalenodes.com


# Skale Schain Owners
## FreeContractDeployment Off
- if schain owner doesn't allow ```FreeContractDeployment``` , then deploy ```smart_contract``` and hardwire contract address #106 at ```src/scripts/app.js``` and code example that needs mod: ```App.airdropAddress = App.sc_address``` to ```App.airdropAddress = 'deployedAirDropAddress'``` and remove the previous deployment logic #52-104  at ```src/scripts/app.js```

## FreeContractDeployment On
- the metamask user can switch to any schain network and refresh the webpage to redeploy a new airdrop contract
- requirements: only if schain owner allows **enableFreeContractDeployment** and **isFCDEnabled()**  within the **configController** contract

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

## run some tests
- make 2 erc20 tokens on whispering with different decimals and send them to the europa hub. wait, i can't send gametoken to europa because because i don't know the origin tokenaddress.
then that makes every token MUST go from L1 to Europa (token must exist on europa then its transfered to gameDapp, and then gameSchain can send gameToken to Europa)




