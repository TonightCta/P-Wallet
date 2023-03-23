import { message } from "antd";
import { useContext, useEffect } from 'react';
import { PWallet } from "../App";
import { IResponse, Type } from "./type";
import TransferABI from './abi/transfer_abi.json';
import ChainABI from './abi/chain_abi.json'
import StakeABI from './abi/stake.json'
import { gas, gasPrice } from "./type";
import { SetWithdrawLog } from "../request/api";
import { GetBalance } from '../request/api';
import { DecimalToHex } from ".";


interface BResult extends IResponse {
    usdt?: string
}
interface ChainNeed {
    _chain_id: string,
    _min_validators: string,
    _min_depositAmount: string,
    _start_block: string,
    _end_block: string
};
interface JoinNeed {
    _pubkey: string,
    _chainId: string,
    _signature: string
};

interface SetNedd {
    _chain_id: string,
    _reward: string
}

const win: any = window;
const { ethereum } = win;
// const gas_price: string = DecimalToHex(10 * Math.pow(10, 9));

//钱包检查
export const useCheckWallet = () => {
    const { dispatch } = useContext(PWallet);
    const checkWallet = () => {
        dispatch({
            type: Type.SET_IS_WALLET,
            payload: {
                is_wallet: ethereum ? 1 : 0
            }
        })
    };
    return {
        checkWallet: checkWallet
    }
}
//余额查询
export const useBalance = () => {
    const { state, dispatch } = useContext(PWallet);
    const update = (bol: boolean) => {
        dispatch({
            type: Type.SET_BALANCE_WAIT,
            payload: {
                balance_wait: bol
            }
        })
    };
    const inquireInner = async () => {
        update(true)
        setTimeout(async () => {
            if (!ethereum || !ethereum.selectedAddress) {
                update(false)
                return
            }
            const result_main: BResult = await GetBalance({
                address: ethereum.selectedAddress,
                chainId: 0
            });
            const result_child: BResult = await GetBalance({
                address: ethereum.selectedAddress,
                chainId: 1
            });
            const devBalance: number = Number(await state.web3.eth.getBalance(ethereum.selectedAddress)) / 1e18;
            console.log(devBalance)
            dispatch({
                type: Type.SET_IS_DEV,
                payload: {
                    is_dev: devBalance > 1e5 ? 1 : 0
                }
            })
            dispatch({
                type: Type.SET_BALANCE,
                payload: {
                    account_balance: {
                        main_balance: Number(result_main.data),
                        main_balance_usdt: Number(result_main.usdt),
                        child_balance: Number(result_child.data),
                        child_balance_usdt: Number(result_child.usdt),
                        dev_balance: devBalance
                    }
                }
            })
            // const balance = await state.web3.eth.getBalance(ethereum.selectedAddress);
            // dispatch({
            //     type: Type.SET_BALANCE,
            //     payload: {
            //         account_balance: Number((balance / 1e18).toFixed(4))
            //     }
            // });
            update(false)
        }, 500)

    };
    return {
        inquire: inquireInner,
        update: update
    }
}
//检查默认连接链
export const useCheckChain = () => {
    const { state, dispatch } = useContext(PWallet);
    const next = () => {
        setTimeout(() => {
            if (!ethereum) {
                return
            }
            const chain_id: number = state.web3.utils.hexToNumber(ethereum.chainId);
            const isUseChain = chain_id === 2099156 || chain_id === 8007736;
            dispatch({
                type: Type.SET_CHECK_CHAIN,
                payload: {
                    check_chain: isUseChain ? 1 : 0
                }
            });
            //设置本地默认链
            const setLocalChainID = () => {
                dispatch({
                    type: Type.SET_TRNASFER_MSG,
                    payload: {
                        transfer_msg: {
                            from_chain: chain_id === 2099156 ? 'Plian Mainnet Main' : 'Plian Mainnet Subchain 1',
                            to_chain: chain_id === 2099156 ? 'Plian Mainnet Subchain 1' : 'Plian Mainnet Main',
                            transfer_type: chain_id === 2099156 ? 0 : 1
                        }
                    }
                })
                dispatch({
                    type: Type.SET_DEFAULT_CHAIN,
                    payload: {
                        default_chain: String(chain_id)
                    }
                })
            };
            isUseChain && setLocalChainID()
            if (!ethereum.selectedAddress) {
                dispatch({
                    type: Type.SET_ADDRESS,
                    payload: {
                        address: null
                    }
                })
            }
        }, 200)

    };
    return {
        check: next
    }
};
//连接钱包
export const useConnect = () => {
    const { dispatch } = useContext(PWallet);
    const { check } = useCheckChain();
    const connectInner = async (): Promise<void> => {
        if (!ethereum) {
            return
        };
        try {
            const result = await ethereum.request({ method: 'eth_requestAccounts' });
            dispatch({
                type: Type.SET_ADDRESS,
                payload: {
                    address: result[0]
                }
            });
            check();
        } catch (error: any) {
            switch (error.code) {
                case 4001:
                    message.warning('You have deauthorized')
                    break;
                default:
                    message.warning('Network Error')
            }
        };
    };
    useEffect(() => {
        return () => {

        }
    }, [])
    return {
        connect: connectInner,
    }
};
// 账户监听
export const useWeb3 = () => {
    const { dispatch } = useContext(PWallet);
    const { check } = useCheckChain();
    const { inquire } = useBalance();
    // 账户监听
    const accountChange = () => {
        setTimeout(() => {
            if (!ethereum) {
                return
            }
            ethereum.on('accountsChanged', (accounts: string[]) => {
                dispatch({
                    type: Type.SET_ADDRESS,
                    payload: {
                        address: accounts.length > 0 ? accounts[0] : null
                    }
                });
                if (accounts.length === 0) {
                    window.localStorage.removeItem('address');
                    window.location.reload();
                } else {
                    inquire();
                }
            });
        }, 200)
    };
    // 切换公链监听
    const chainChange = () => {
        setTimeout(() => {
            if (!ethereum) {
                return
            }
            ethereum.on('chainChanged', (res: any) => {
                inquire();
                check();

            });
        }, 200)
        // ethereum.on('disconnect', (a: any) => {
        //     console.log(a)
        // })
    }
    return {
        monitorAccount: accountChange,
        monitorChain: chainChange
    }
};
interface Chain {
    chain_id: number,
    chainName: string,
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number
    },
    rpcUrls: string[],
    blockExplorerUrls: string[]
}
// 切换公链
export const useSwitchChain = () => {
    const { state } = useContext(PWallet);
    const { check } = useCheckChain();
    const switchInner = async (chain_id?: number): Promise<void> => {
        const chain_list: Chain[] = [
            //主链
            {
                chain_id: 2099156,
                chainName: 'Plian Mainnet Main',
                nativeCurrency: {
                    name: 'PI',
                    symbol: 'PI',
                    decimals: 18
                },
                rpcUrls: ['https://mainnet.plian.io/pchain'],
                blockExplorerUrls: ['https://piscan.plian.org/index.html']
            },
            //子链
            {
                chain_id: 8007736,
                chainName: 'Plian Mainnet Subchain 1',
                nativeCurrency: {
                    name: 'PI',
                    symbol: 'PI',
                    decimals: 18
                },
                rpcUrls: ['https://mainnet.plian.io/child_0'],
                blockExplorerUrls: ['https://piscan.plian.org/index.html']
            },
        ];
        const withChainID: any = chain_list.filter((item: Chain) => {
            return item.chain_id === chain_id
        });
        try {
            const result = await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: state.web3.utils.toHex(chain_id ? chain_id : 2099156) }],
            });
            return result
        } catch (error: any) {
            const add = async () => {
                const params = [
                    {
                        chainId: state.web3.utils.toHex(chain_id ? chain_id : chain_list[0].chain_id), // A 0x-prefixed hexadecimal string
                        chainName: chain_id ? withChainID[0].chainName : chain_list[0].chainName,
                        nativeCurrency: {
                            name: 'PI',
                            symbol: 'PI', // 2-6 characters long
                            decimals: 18,
                        },
                        rpcUrls: chain_id ? withChainID[0].rpcUrls : chain_list[0].rpcUrls,
                        blockExplorerUrls: chain_id ? withChainID[0].blockExplorerUrls : chain_list[0].blockExplorerUrls,
                    }
                ];
                try {
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: params,
                    });
                    await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: state.web3.utils.toHex(chain_id ? chain_id : 2099156) }],
                    });
                    check();
                } catch (addError) {
                    // handle "add" error
                }
            }
            switch (error.code) {
                case 4902:
                    add();
                    break;
                case -32603:
                    add();
                    break;
                case -32002:
                    message.error('You have pending wallet operations');
                    break;
                case 4001:
                    message.error('You have canceled');
                    break;
                default:
                    console.log(error)
            }
            return error
        }
    };
    return {
        switchC: switchInner
    }
};
//转账
export const useTransfer = () => {
    const { state, dispatch } = useContext(PWallet);
    const { switchC } = useSwitchChain();
    const { inquire } = useBalance();
    const contract = new state.web3.eth.Contract(TransferABI, '0x0000000000000000000000000000000000000065');
    //更新等待状态
    const updateWait = (_type: string, _visible: boolean) => {
        dispatch({
            type: Type.SET_WAITING,
            payload: {
                waiting: {
                    type: _type,
                    visible: _visible
                }
            }
        })
    };
    //更新转账hash
    const updateHash = (_hash: string) => {
        dispatch({
            type: Type.SET_TRANSFER_HASH,
            payload: {
                transfer_hash: _hash
            }
        })
    }
    //主链充值 - 转出
    const depositMainChain = async (amount: number) => {
        updateWait('wait', true)
        const params = {
            from: state.address,
            chainId: 'pchain',
            value: state.web3.utils.toWei(amount, 'ether'),
            gas: gas,
            gasPrice: gasPrice
        };
        updateHash('1')
        contract.methods.DepositInMainChain('child_0').send(params).then(async (result: any) => {
            if (result['transactionHash']) {
                updateHash(result['transactionHash'])
                const wait = await switchC(8007736);
                dispatch({
                    type: Type.SET_LAST_TRANSFER_CHAIN,
                    payload: {
                        last_transfer_chain: 8007736
                    }
                })
                wait == null && takeDepositMain(result['transactionHash'])
            } else {
                updateWait('error', true)
                updateHash('')
            }
        }).catch((err: any) => {
            updateWait('error', true)
            updateHash('')
        })

    };
    //主链充值 - 接收
    const takeDepositMain = async (hash: string) => {
        updateWait('wait', true)
        let _local_hash: string;
        const params = {
            from: state.address,
            chainId: 'child_0',
            gas: gas,
            gasPrice: '0'
        };
        updateHash('1')
        contract.methods.DepositInChildChain('child_0', hash).send(params).on('transactionHash', (_hash: string) => {
            updateHash(_hash)
            _local_hash = _hash;
        }).on('receipt', (response: unknown) => {
            updateHash('')
            updateWait('success', true)
            inquire();
            dispatch({
                type: Type.SET_RELOAD_LOGS,
                payload: {
                    reload_logs: new Date().getTime()
                }
            })
        }).on('error', (error: any) => {
            if (error.message.indexOf('50 blocks') > -1) {
                // setShowSuccess(true)
                checkTransfer(_local_hash)
            } else {
                updateHash('')
                updateWait('error', true)
            }
        })
        //TODO
        // state.web3.eth.subscribe('pendingTransactions', (error: unknown, result: unknown) => {
        //     console.log(result)
        // }).on('data', (log: unknown) => {
        //     console.log(log)
        // })
    };
    //子链提现 - 转出
    const withdrawChildChain = async (amount: number) => {
        updateWait('wait', true)
        const params = {
            from: state.address,
            chainId: 'pchain',
            value: state.web3.utils.toWei(amount, 'ether'),
            gas: gas,
            gasPrice: gasPrice
        };
        updateHash('1')
        contract.methods.WithdrawFromChildChain('child_0').send(params).then(async (result: any) => {
            if (result['transactionHash']) {
                updateHash(result['transactionHash'])
                const timer = setInterval(async () => {
                    const service: any = await SetWithdrawLog({
                        txHash: result['transactionHash'],
                        chainId: 1
                    });
                    clearInterval(timer)
                    if (service.result === 'success') {
                        const wait = await switchC(2099156);
                        dispatch({
                            type: Type.SET_LAST_TRANSFER_CHAIN,
                            payload: {
                                last_transfer_chain: 2099156
                            }
                        })
                        wait == null && takeWithdrawChild(amount, result['transactionHash'])
                    }
                }, 5000);
            } else {
                updateHash('')
                updateWait('error', true)
            }
        }).catch((err: any) => {
            updateHash('')
            updateWait('error', true)
        })

    };
    //子链提现 - 接收
    const takeWithdrawChild = async (amount: number, hash: string) => {
        let _local_hash: string;
        updateWait('wait', true)
        const params = {
            from: state.address,
            chainId: 'pchain',
            gas: gas,
            gasPrice: '0'
        };
        updateHash('1')
        contract.methods.WithdrawFromMainChain('child_0', state.web3.utils.toWei(String(amount)), hash).send(params).on('transactionHash', (_hash: string) => {
            updateHash(_hash)
            _local_hash = _hash;
        }).on('receipt', (response: unknown) => {
            updateHash('')
            updateWait('success', true)
            inquire();
            dispatch({
                type: Type.SET_RELOAD_LOGS,
                payload: {
                    reload_logs: new Date().getTime()
                }
            })
        }).on('error', (error: any) => {
            if (error.message.indexOf('50 blocks') > -1) {
                // setShowSuccess(true)
                checkTransfer(_local_hash)
            } else {
                updateWait('error', true);
                updateHash('')
            }
        })
    };
    const checkTransfer = async (hash?: string) => {
        const chain_id = state.web3.utils.hexToNumber(ethereum.chainId);
        if (chain_id !== state.last_transfer_chain) {
            await switchC(state.last_transfer_chain)
        };
        const timer = setInterval(async () => {
            // console.log(1223)
            const result = await state.web3.eth.getTransactionReceipt(hash ? hash : state.transfer_hash)
            if (result && result.status) {
                clearInterval(timer);
                updateHash('')
                updateWait('success', true);
                dispatch({
                    type: Type.SET_RELOAD_LOGS,
                    payload: {
                        reload_logs: new Date().getTime()
                    }
                })
            }
            if (result && !result.status) {
                clearInterval(timer);
                updateHash('')
                updateWait('error', true);
            }
        }, 5000)
    }
    return {
        depositMainChain: depositMainChain,
        takeDepositMain: takeDepositMain,
        withdrawChildChain: withdrawChildChain,
        takeWithdrawChild: takeWithdrawChild,
        check: checkTransfer
    }
};


//链操作
export const useChain = () => {
    const { state } = useContext(PWallet);
    //minValidators minDepositAmount startBlock endBlock
    const contract = new state.web3.eth.Contract(ChainABI, '0x0000000000000000000000000000000000000065');
    const send_data = {
        from: state.address,
        gas: gas,
        gasPrice: gasPrice
    }
    //创建子链
    const inner = async (params: ChainNeed): Promise<number> => {
        return new Promise(async (resolve, reject) => {
            contract.methods.CreateChildChain(params._chain_id, params._min_validators, params._min_depositAmount, params._start_block, params._end_block).send(send_data).then((response: unknown) => {
                resolve(1)
            }).catch((error: any) => {
                resolve(0)
            })
        })
    };
    //加入子链
    const join = async (params: JoinNeed): Promise<number> => {
        return new Promise(async (resolve, reject) => {
            contract.methods.JoinChildChain(params._pubkey, params._chainId, params._signature).send(send_data).then((response: unknown) => {
                resolve(1)
            }).catch((error: any) => {
                resolve(0)
            })
        })
    };
    //设置区块奖励
    const set = async (params: SetNedd): Promise<number> => {
        return new Promise(async (resolve, reject) => {
            contract.methods.SetBlockReward(params._chain_id, params._reward).send(send_data).then((response: unknown) => {
                resolve(1)
            }).catch((error: any) => {
                resolve(0)
            })
        })
    }
    return {
        create: inner,
        join: join,
        set: set
    }
};
//质押
export const useStake = () => {
    const { state } = useContext(PWallet);
    const { inquire } = useBalance();
    const contract = new state.web3.eth.Contract(StakeABI, '0x0000000000000000000000000000000000000065');
    const send_data = {
        from: state.address,
        gas: gas,
        gasPrice: gasPrice
    };
    const receive = async (): Promise<number> => {
        return new Promise(async (resolve, reject) => {
            contract.methods.ExtractReward(send_data.from).send(send_data).then((response: unknown) => {
                resolve(1);
                inquire()
            }).catch((err: any) => {
                resolve(0)
            })
        });
    };
    const join = async (_address: string, _amount: number): Promise<number> => {
        return new Promise(async (resolve, reject) => {
            const join_data = {
                ...send_data,
                amount: '0x' + DecimalToHex(state.web3.utils.toWei(_amount, 'ether'))
            };
            contract.methods.Delegate(_address).send(join_data).then((response: unknown) => {
                resolve(1)
                inquire()
            }).catch((error: any) => {
                resolve(0)
            })
        })
    };
    const cancel = (_address: string, _amount: number): Promise<number> => {
        return new Promise(async (resolve, reject) => {
            const join_data = {
                ...send_data,
                amount: '0x' + DecimalToHex(state.web3.utils.toWei(_amount, 'ether'))
            };
            contract.methods.CancelDelegate(_address).send(join_data).then((response: unknown) => {
                resolve(1)
                inquire()
            }).catch((error: any) => {
                resolve(0)
            })
        })
    };
    return {
        receive: receive,
        join: join,
        cancel: cancel
    }
}
