/*
const CHAIN_EUROPA = 476158412;
const CHAIN_RPC = 'https://staging-v3.skalenodes.com/v1/staging-legal-crazy-castor';
const CHAIN_EXPLORER = "https://staging-legal-crazy-castor.explorer.staging-v3.skalenodes.com/"
const CONTRACT_ADDRESS = '0xDcD7E0d844D2a2e6bB1949A90d00867452ADBF44';
*/

const CHAIN_EUROPA = 2046399126;// PROD
const CHAIN_RPC = 'https://mainnet.skalenodes.com/v1/elated-tan-skat';// PROD
const CONTRACT_ADDRESS = '0x1f27e93d6bc67f7b033a17a1c4f01e03bba24bb9';

App = {
    init: async () => {
        localStorage.clear();
        return await App.initWeb3()
    },

    initWeb3: async () => {
        try {
            const provider = await App.getProviderInstance()
            let chainId;
            if (provider) {
                App.web3 = new Web3(provider)
                chainId = await App.web3.eth.net.getId()
                if (chainId != CHAIN_EUROPA) {
                    await App.switchNetwork(CHAIN_EUROPA)
                }
                chainId = await App.web3.eth.net.getId()
                console.error("(provider) MetaMask Found: connected to chainID: ", chainId)
            } else {
                App.web3 = new Web3(new Web3.providers.HttpProvider(CHAIN_RPC))
                chainId = await App.web3.eth.net.getId()
                if (chainId != CHAIN_EUROPA) {
                    await App.switchNetwork(CHAIN_EUROPA)
                }
                chainId = await App.web3.eth.net.getId()
                console.error("MetaMask Found: connected to chainID: ", chainId)
            }
            return App.initContracts()
        } catch (error) {
            alert("Unable to access to Metamask")
            console.log(error)
        }
    },

    showTransactions: () => {
        const data = JSON.parse(localStorage.getItem("transactions"))
        // object to array 
        const newArray = Object.entries(data);
        const length = newArray.length;
        let rows = document.createDocumentFragment()

        if (length !== 0) {
            $("#txTable tbody").empty()
            const { url } = App.detectNetwork()
            for (let i = 0; i < length; i++) {

                const getData = newArray[i];
                const txData = getData[1];

                if (!txData?.hash) {
                    continue;
                }

                const row = document.createElement("tr")
                row.setAttribute("scope", "row")

                const index = document.createElement("th")
                index.appendChild(document.createTextNode(`${i}`))
                row.appendChild(index)

                const hash = document.createElement("td")
                const hyperlink = document.createElement("a")
                const linkText = document.createTextNode(`${txData.hash}`)
                hyperlink.appendChild(linkText)
                hyperlink.href = `${url}/tx/${txData.hash}`
                hash.appendChild(hyperlink)
                row.appendChild(hash)

                const status = document.createElement("td")
                status.appendChild(document.createTextNode(`${txData.status}`))
                row.appendChild(status)

                const users = document.createElement("td")
                users.appendChild(document.createTextNode(`${txData.users}`))
                row.appendChild(users)

                const amount = document.createElement("td")
                amount.appendChild(document.createTextNode(`${txData.amount}`))
                row.appendChild(amount)

                rows.appendChild(row)
            }
            $("#txTable tbody").append(rows)
        }
    },

    getProviderInstance: async () => {
        // 1. Try getting modern provider
        const { ethereum } = window
        if (ethereum) {
            try {
                console.log("Try getting modern provider")
                await ethereum.enable()
                return ethereum
            } catch (error) {
                throw new Error("User denied Metamask access")
            }
        }

        // 2. Try getting legacy provider
        const { web3 } = window
        if (web3 && web3.currentProvider) {
            console.log("Try getting legacy provider")
            return web3.currentProvider
        }

        return null
    },

    initContracts: async () => {
        App.networkId = await App.web3.eth.net.getId()
        App.ownerAddressB = await App.web3.eth.getAccounts()
        App.gas_price = await App.web3.eth.getGasPrice()

        App.sc_abi = [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "address[]",
                        "name": "addresses",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "values",
                        "type": "uint256[]"
                    }
                ],
                "name": "doAirdrop",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
        /*
        * PROD | Hardcode Airdrop contract address here: App.airdropAddress
        */
        App.airdropAddress = CONTRACT_ADDRESS;
        console.log('Airdrop Smart Contract Address:', App.airdropAddress)
        App.airdropInstance = new App.web3.eth.Contract(App.sc_abi, App.airdropAddress)
        return App.initVariables()
    },

    initVariables: async () => {
        App.ownerAddress = App.ownerAddressB[0]
        App.isTokenApproved = 'Not Approved'
        console.log('Connected Wallet Address:', App.ownerAddress)
        App.account = await App.web3.eth.getAccounts().then(accounts => accounts[0])
        if (localStorage.getItem("transactions") === null) {
            localStorage.setItem("transactions", JSON.stringify([]))
            console.log('No txs exist within localStorage:cache')
        } else {
            console.log('render ShowTransactions:')
        }
        return App.render()
    },

    showAllowance: () => {
        // token address from ui
        //userTokenSelect
        //$('#receivers').val()
        $('#token-symbol').text(App.tokenSymbol)
        $('#token-approval').text(App.isTokenApproved)
        $('#owner-wallet').text(App.ownerAddress)
        $('#contract-address').text(App.airdropAddress)
    },

    // only used for showing previous airdrops
    detectNetwork: () => {

        $('#networkStatus').text(App.networkId)

        return {
            network: "Europa",
            url: CHAIN_RPC,
            id: CHAIN_EUROPA
        }
    },

    reloadListener: e => {
        e.returnValue = ''
    },

    alertInReload: enable => {
        if (enable) {
            window.addEventListener('beforeunload', App.reloadListener)
        } else {
            window.removeEventListener('beforeunload', App.reloadListener)
        }
    },

    render: () => {
        App.showAllowance()
        App.showTransactions()
    },

    saveTokenAddress: async () => {
        App.tokenAddress = $('#userTokenSelect').val()
        App.token_abi = [
            {
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "name": "balance",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "name": "_spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "payable": true,
                "stateMutability": "payable",
                "type": "fallback"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            }
        ]
        App.tokenInstance = new App.web3.eth.Contract(App.token_abi, App.tokenAddress)
        App.tokenSymbol = await App.tokenInstance.methods.symbol().call()
        console.log('saved TokenAddress + Symbol  : ', App.tokenAddress, App.tokenSymbol.toString());
        App.render()
    },

    // Define a function to save a new transaction to local storage
    saveTransactionToLocalStorage: transaction => {
      
        try {
            // Get the current list of transactions from local storage
            let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

            // Add the new transaction to the list
            transactions.push(transaction);

            // Update the transactions in local storage
            localStorage.setItem('transactions', JSON.stringify(transactions));
        } catch (error) {
            console.error(`Error saving transaction to local storage: ${error.message}`);
        }
    },

    startAirdrop: () => {
        let amounts = []
        let receivers = []
        let totalAmount = 0

        try {
            // Replacing and creating 'receivers' array
            $('#receivers').val().split(',').forEach((address, i) => {
                if (/\S/.test(address)) {

                    address = address.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '')

                    // Checksuming the addresses
                    address = App.web3.utils.toChecksumAddress(address)

                    // Checking if address is valid
                    if (App.web3.utils.isAddress(address)) {
                        receivers.push(address)
                    } else {
                        throw ('Founded wrong ETH address, please check it \n\n' + address)
                    }
                }
            })

            // Replacing and creating 'amounts' array
            amounts = $('#amounts').val().split(',').map(value => {//amounts =
                if (Number(value) !== 0) {
                    // amounts.push(value);
                    return Number(value)
                } else {
                    throw ('Found number 0 in amounts, please remove it');
                }
            })


            // Checking arrays length and validities
            if (receivers.length == 0 || amounts.length == 0 || receivers.length != amounts.length) {
                throw ('Issue with receivers/amount values')
            }

            // Calculating total sum of 'amounts' array items for approval amount
            totalAmount = parseFloat(amounts.reduce((a, b) => a + b).toFixed(2))

            // do approval (force each time)
            if (App.allowance < totalAmount || App.allowance == undefined) {

                App.approvalAmount = App.web3.utils.toWei(totalAmount.toString(), 'ether')// WEI AMOUNT

                console.error("Approval Amount", App.approvalAmount)
                console.error("Total Amount (ether) ", totalAmount.toString())

                App.tokenInstance.methods.approve(App.airdropAddress, App.approvalAmount).send({ from: App.account })
                    .on("transactionHash", hash => {
                        console.log("approval: txHash:", hash)
                    })
                    .on("receipt", receipt => {
                        App.alertInReload(false)
                        App.allowance = totalAmount;// continue using the human Readable values (ether)
                        App.isTokenApproved = "Tokens Approved"
                        App.render() // is this needed?  it is working, but I should try without too and see if the ux changes
                    })
                    .on("error", error => {
                        App.alertInReload(false)
                        throw ("Tx failed on token approval")
                    })
            }

            // change all input amounts from csv to wei
            amounts.forEach(myFunction)
            function myFunction(item, index, arr) {
                arr[index] = App.web3.utils.toWei(item.toString(), 'ether')
                console.error(arr[index])
            }

            // If allowance tokens more than amounts sum then continue
            if (App.allowance >= totalAmount) {

                // Calling the method from airdrop smart contract

                // added : App.tokenAddress
                App.airdropInstance.methods.doAirdrop(App.tokenAddress, receivers, amounts).send({ from: App.account })
                    .on("transactionHash", hash => {
                        App.alertInReload(true)
                        const newTx = {
                            hash,
                            status: "Pending",
                            users: receivers.length,
                            amount: totalAmount
                        }

                        App.saveTransactionToLocalStorage(newTx);

                        App.showTransactions()
                    })
                    .on("receipt", receipt => {
                        App.alertInReload(false)

                        // update variables
                        App.allowance = 0;
                        App.isTokenApproved = 'Not Approved'

                        const hash = receipt.transactionHash
                        const transactions = JSON.parse(localStorage.getItem("transactions"))
                        const txIndex = transactions.findIndex(tx => tx.hash === hash);
                        transactions[txIndex].status = "Done"

                        localStorage.setItem("transactions", JSON.stringify(transactions))
                        App.render()
                    })
                    .on("error", error => {
                        App.alertInReload(false)
                        throw ("Tx failed: ", error)
                    })
            }
        } catch (error) {
            alert(error)
        }
    },

    switchNetwork: async (chainId) => {
        try {
            await App.web3.currentProvider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: App.web3.utils.toHex(chainId) }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                await App.addNewNetworkInfo()
                console.error("adding new network to metamask")
            }
        }
    },


    addNewNetworkInfo: async () => {
        // then use this:
        await App.web3.currentProvider.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: App.web3.utils.toHex(CHAIN_EUROPA),
                chainName: 'Europa Chain',
                nativeCurrency: {
                    name: 'sFuel',
                    symbol: 'sFuel',
                    decimals: 18
                },
                rpcUrls: [CHAIN_RPC],
                blockExplorerUrls: [CHAIN_EXPLORER]
            }]
        })
            .catch((error) => {
                console.log(error)
            })
    }
}


$(window).on("load", () => {
    $.ready.then(() => {
        App.init()
    })
})
