
App = {
    init: async () => {
        return await App.initWeb3()
    },

    initWeb3: async () => {
        try {
            const provider = await App.getProviderInstance()
            if (provider) {
                console.log("MetaMask Found")
                App.web3 = new Web3(provider)
            } else {
                App.web3 = new Web3(new Web3.providers.HttpProvider("https://testnet-proxy.skalenodes.com/v1/fancy-rasalhague"))
            }
            return App.initContracts()
        } catch (error) {
            alert("Enable to access to Metamask")
            console.log(error)
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
        console.log('User Address:', App.ownerAddressB[0])
        App.gas_price = await App.web3.eth.getGasPrice()
        console.log('Gas Price:', App.gas_price.toString())

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
        App.airdropAddress = "0x1b00f26d2492b101bd5440c6472155bd48412fd0"
        console.log('App.airdropAddress:', App.airdropAddress)
        App.airdropInstance = new App.web3.eth.Contract(App.sc_abi, App.airdropAddress)
        return App.initVariables()
    },

    initVariables: async () => {
        App.ownerAddress = App.ownerAddressB[0]
        App.isTokenApproved = 'Not Approved'
        console.log('App.ownerAddress:', App.ownerAddress)
        App.account = await App.web3.eth.getAccounts().then(accounts => accounts[0])
        if (localStorage.getItem("transactions") === null) {
            localStorage.setItem("transactions", JSON.stringify([]))
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

    showTransactions: () => {
        const data = JSON.parse(localStorage.getItem("transactions"))
        let rows = document.createDocumentFragment()
        if (data.length !== 0) {
            $("#txTable tbody").empty()
            const { url } = App.detectNetwork()
            for (let i = 0; i < data.length; i++) {
                const txData = data[i]

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

    detectNetwork: () => {
        switch (App.networkId) {
            case 1:
                return {
                    network: "Mainnet",
                    url: "https://etherscan.io/",
                    id: 1
                }
                break
            case 2:
                return {
                    network: "Morden",
                    url: "https://mordenexplorer.ethernode.io/",
                    id: 2
                }
                break
            case 3:
                return {
                    network: "Ropsten",
                    url: "https://ropsten.etherscan.io/",
                    id: 3
                }
                break
            case 4:
                return {
                    network: "Rinkeby",
                    url: "https://rinkeby.etherscan.io/",
                    id: 4
                }
                break
            case 42:
                return {
                    network: "Kovan",
                    url: "https://kovan.etherscan.io/",
                    id: 42
                }
                break
            case 2255010950618556:
                return {
                    network: "Europa",
                    url: "https://testnet-proxy.skalenodes.com/v1/fancy-rasalhague",
                    id: 2255010950618556
                }
                break
            case 132333505628089:
                return {
                    network: "Whisper",
                    url: "https://testnet-proxy.skalenodes.com/v1/whispering-turais",
                    id: 132333505628089
                }
                break
            default:
                console.log('This is an unknown networkID: ', App.networkId)
            //setup default
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
        console.log('saveTokenAddress : ', App.tokenAddress);
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
        // hardcoded address within
        App.tokenInstance = new App.web3.eth.Contract(App.token_abi, App.tokenAddress)
        App.tokenSymbol = await App.tokenInstance.methods.symbol().call()
        console.log('saveTokenAddress Symbol  : ', App.tokenSymbol);
        App.render()
    },

    startAirdrop: () => {
        let amounts = []
        let receivers = []
        let totalAmount = 0

        try {
            // Replacing and creating 'receivers' array
            $('#receivers').val().split(',').forEach((address, i) => {
                if (/\S/.test(address)) {
                    console.log("address:", address)
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
            amounts = $('#amounts').val().split(',').map(value => {
                if (Number(value) !== 0) {
                    return Number(value)
                } else {
                    throw ('Founded  number 0 in amounts, please remove it');
                }
            })
            console.log("amounts:", amounts)

            // Checking arrays length and validities
            if (receivers.length == 0 || amounts.length == 0 || receivers.length != amounts.length) {
                throw ('Issue with receivers/amount values')
            }

            // Calculating total sum of 'amounts' array items for approval amount
            totalAmount = parseFloat(amounts.reduce((a, b) => a + b).toFixed(2))
            console.log("Total Amount to Airdrop: ", totalAmount)

            // do approval now (force each time)
            if (App.allowance < totalAmount || App.allowance == undefined || App.allowance != totalAmount) {
                console.log("Approving Token Amount: ", totalAmount)
                // approve
                // string input : totalamoount (humanReadable)
                // output : Number in wei
                App.approvalAmount = Number(App.web3.utils.toWei(totalAmount.toString(), 'ether'))
                console.log("do approval now: App.approvalAmount:", App.approvalAmount)
                App.tokenInstance.methods.approve(App.airdropAddress, App.approvalAmount).send({ from: App.account })
                    .on("transactionHash", hash => {
                        console.log("txHash:", hash)
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

            // to wei
            amounts.forEach(myFunction)
            function myFunction(item, index, arr) {
                arr[index] = Number(App.web3.utils.toWei(item.toString(), 'ether'))
            }

            //debug: these values should match for the airdrop to function properly
            console.log("ALLOW: " + App.allowance + " <=?airdrop?=> AMOUNT: " + totalAmount + " || Final Amounts:", amounts)

            // If allowance tokens more than amounts sum then continue
            if (App.allowance >= totalAmount) {
                console.log("READY")

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
                        let transactions = JSON.parse(localStorage.getItem("transactions"))
                        transactions.unshift(newTx)
                        localStorage.setItem("transactions", JSON.stringify(transactions))
                        App.showTransactions()
                    })
                    .on("receipt", receipt => {
                        App.alertInReload(false)

                        // update variables
                        App.allowance -= totalAmount
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
                        throw ("Tx was failed")
                    })
            }

            //   else {
            //       throw ('Click ok and then Confirm within Metamask. This will give the smart contract access to transfer the token on your behalf')
            //   }

        } catch (error) {
            alert(error)
        }
    }
}

$(window).on("load", () => {
    $.ready.then(() => {
        App.init()
    })
})