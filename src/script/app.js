
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

        App.sc_bytecode = "0x608060405234801561001057600080fd5b5061054a806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80632f1afbac14610030575b600080fd5b61004a600480360381019061004591906102f7565b610060565b60405161005791906103fe565b60405180910390f35b60008060009050866000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b858590508110156102035760008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd33888885818110610129577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b905060200201602081019061013e91906102ce565b878786818110610177577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b905060200201356040518463ffffffff1660e01b815260040161019c939291906103c7565b602060405180830381600087803b1580156101b657600080fd5b505af11580156101ca573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101ee9190610380565b506001816101fc9190610419565b90506100a8565b8091505095945050505050565b60008135905061021f816104e6565b92915050565b60008083601f84011261023757600080fd5b8235905067ffffffffffffffff81111561025057600080fd5b60208301915083602082028301111561026857600080fd5b9250929050565b60008083601f84011261028157600080fd5b8235905067ffffffffffffffff81111561029a57600080fd5b6020830191508360208202830111156102b257600080fd5b9250929050565b6000815190506102c8816104fd565b92915050565b6000602082840312156102e057600080fd5b60006102ee84828501610210565b91505092915050565b60008060008060006060868803121561030f57600080fd5b600061031d88828901610210565b955050602086013567ffffffffffffffff81111561033a57600080fd5b61034688828901610225565b9450945050604086013567ffffffffffffffff81111561036557600080fd5b6103718882890161026f565b92509250509295509295909350565b60006020828403121561039257600080fd5b60006103a0848285016102b9565b91505092915050565b6103b28161046f565b82525050565b6103c1816104ad565b82525050565b60006060820190506103dc60008301866103a9565b6103e960208301856103a9565b6103f660408301846103b8565b949350505050565b600060208201905061041360008301846103b8565b92915050565b6000610424826104ad565b915061042f836104ad565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610464576104636104b7565b5b828201905092915050565b600061047a8261048d565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6104ef8161046f565b81146104fa57600080fd5b50565b61050681610481565b811461051157600080fd5b5056fea2646970667358221220e779ac8fa2598950e1a7c7cb2c03848890960275aaeb6e9501cb61f919d7c54664736f6c63430008040033"
        App.sc_deploy = new App.web3.eth.Contract(App.sc_abi);// JSON.parse(abi)
        
        App.sc_payload = {
            data: App.sc_bytecode
        }

        App.sc_parameter = {
            from: App.ownerAddressB[0],
            gasPrice: App.gas_price.toString(),
            gaLimit: '3141592000000'
        }

        await App.sc_deploy.deploy(App.sc_payload).send(App.sc_parameter, (err, transactionHash) => {
            console.log('Transaction Hash :', transactionHash);
            console.log('Transaction Hash Err:', err);
        }).on('confirmation', () => { }).then((newContractInstance) => {
            console.log('Deployed Contract Address : ', newContractInstance.options.address);
            App.sc_address = newContractInstance.options.address
        })

        App.airdropAddress = App.sc_address
        console.log('App.airdropAddress:', App.airdropAddress)
       // App.airdropABI = [{ "constant": false, "inputs": [{ "name": "addresses", "type": "address[]" }, { "name": "values", "type": "uint256[]" }], "name": "doAirdrop", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "token", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }]
        App.airdropInstance = new App.web3.eth.Contract(App.sc_abi , App.airdropAddress)


      

        return App.initVariables()
    },

        // Checks for the Token Address here , but user can't edit init, so ....
            // remove from this function and make a button to set the variable
    initVariables: async () => {
        App.ownerAddress = App.ownerAddressB[0]
        App.isTokenApproved = 'Not Approved'
        console.log('App.ownerAddress:', App.ownerAddress)
        App.account = await App.web3.eth.getAccounts().then(accounts => accounts[0])
        //checks the allowance on the TokenAddress within the contract wtf 
        // App.allowance = App.web3.utils.fromWei(await App.tokenInstance.methods.allowance(App.ownerAddress, App.airdropAddress).call(), 'ether')
        if (localStorage.getItem("transactions") === null) {
            localStorage.setItem("transactions", JSON.stringify([]))
        }
        return App.render()
    },
    // RENDERS showAllowance and showTransactions using the data from the initVariables
    showAllowance: () => {
        // token address from ui
        //userTokenSelect
        //$('#receivers').val()
        $('#token-symbol').text(App.tokenSymbol)
        $('#token-approval').text(App.isTokenApproved)
        $('#owner-wallet').text(App.ownerAddress)
        $('#contract-address').text(App.airdropAddress)
       // const amount = App.allowance
       // $('#allowance').text(amount > 0 ? amount + " RUBY" : '0. (Please allow more tokens for ' + App.airdropAddress + ' contract.)')
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

    // For Button : removed 
    /*
        approveTokens: async (amount) => {
    
            if (amount == undefined) {
                App.approvalAmount = Number(App.web3.utils.toWei(App.approvalThisAmount.toString(), 'ether'))
            } else {
                App.approvalAmount = Number(App.web3.utils.toWei(amount.toString(), 'ether'))
            }
    
            console.log("approveTokens() App.approvalAmount:", App.approvalAmount)
            console.log("approveTokens() App.airdropAddress:", App.airdropAddress)
    
            // not coded correctly and throwing this error, i think no signer
            //function _transfer(address sender, address recipient, uint256 amount) private {
            //require(sender != address(0), "ERC20: transfer from the zero address");
    
            await App.tokenInstance.methods.approve(App.airdropAddress, App.approvalAmount).send({ from: App.account })
            App.allowance = App.approvalAmount
            console.log("App.allowance Updated to:", App.allowance)
        },
    */
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
            if (App.allowance < totalAmount || App.allowance == undefined|| App.allowance != totalAmount  ) {
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
                App.airdropInstance.methods.doAirdrop(App.tokenAddress,receivers, amounts).send({ from: App.account })
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