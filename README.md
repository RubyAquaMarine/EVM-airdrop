# ERC20 token airdrop

With this app, you can transfer your token until to 150 **limitation removed and tested to output 2400 transfers**  addresses at once, simple UI, configurations and features. <br><br>

**aquamarine** more notes:
- need to make contract **airdrop.sol** universal, similar to vesting contracts (any token can be sent)
- ui needs button to deploy the contract similar to vesting ui
- ui needs to fetch the contract address and be displayed 

## How to run the project
**improved**
* Clone repo
* Open ./src/Airdrop.sol
* Change the token contract address with the token address that you want to airdrop **each deploy hardcoded to one token**
* Deploy the smart_contract npx hardhat compile (README2.md) **new** 
* Allow to airdrop contract address to spend the X your tokens %&$^#* notes: **built script** working, need to change the check allowance logic and approval method(missing)
* Go to ./src/script and edit the lines N 5,10,11,12 related to your addresses **deployedContractAddress&owner**

* Go to ./ and run "npm start"
* Open the browser and type localhost:3000

## new logic and approval
- 

# Skale v2 testnet
![img](https://raw.githubusercontent.com/RubyAquaMarine/Easy_Airdrop_dApp/master/img/limitAt5100.png)




