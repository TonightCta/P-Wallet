import { message } from "antd";
import { useContext, useEffect } from 'react';
import { PWallet } from "../App";
import { Type } from "./type";


const win: any = window;
const { ethereum } = win;
//余额查询
const useBalance = () => {
    const { state, dispatch } = useContext(PWallet);
    const inquireInner = async () => {
        // TODO
        const balance = await ethereum.request({
            method: 'eth_call',
            params: [{
                "from": state.address,
                "to": '',
                "data": "0x70a08231000000000000000000000000" + ethereum.selectedAddress.replace('0x', '')
            }, 'latest']
        });
    };
    return {
        inquire: inquireInner
    }
}
//检查默认连接链
export const useCheckChain = () => {
    const { state, dispatch } = useContext(PWallet);
    const { inquire } = useBalance();
    const next = () => {
        if (ethereum.selectedAddress) {
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
                inquire();
                dispatch({
                    type: Type.SET_DEFAULT_CHAIN,
                    payload: {
                        default_chain: String(chain_id)
                    }
                })
            };
            isUseChain && setLocalChainID()
        }
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
            message.warning('Your browser has not installed the wallet');
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
        ethereum.on('accountsChanged', (accounts: string[]) => {
            dispatch({
                type: Type.SET_ADDRESS,
                payload: {
                    address: accounts.length > 0 ? accounts[0] : ''
                }
            });
            if (accounts.length === 0) {
                window.localStorage.removeItem('address');
                window.location.reload();
            } else {
                inquire();
            }
        });
    };
    // 切换公链监听
    const chainChange = () => {
        ethereum.on('chainChanged', () => {
            check();
        })
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
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: state.web3.utils.toHex(chain_id ? chain_id : 2099156) }],
            });
        } catch (error: any) {
            if (error.code === 4902) {
                const params = [
                    {
                        chainId: state.web3.utils.toHex(chain_id ? chain_id : chain_list[0].chain_id), // A 0x-prefixed hexadecimal string
                        chainName: chain_id ? withChainID.chain : chain_list[0].chainName,
                        nativeCurrency: {
                            name: 'PI',
                            symbol: 'PI', // 2-6 characters long
                            decimals: 18,
                        },
                        rpcUrls: chain_id ? withChainID.rpcUrls : chain_list[0].rpcUrls,
                        blockExplorerUrls: chain_id ? withChainID.blockExplorerUrls : chain_list[0].blockExplorerUrls,
                    }
                ]
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
        }
    };
    return {
        switchC: switchInner
    }
}
