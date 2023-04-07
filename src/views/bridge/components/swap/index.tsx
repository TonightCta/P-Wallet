import { Button, message } from "antd";
import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { useConnect, useSwitchChain } from "../../../../utils/hooks";
import { Type } from "../../../../utils/type";
import { PWallet } from './../../../../App';
import { useTransfer } from "../../../../utils/hooks";
import WaitModal from "../waiting";

const Swap = (): ReactElement<ReactNode> => {
    const { state, dispatch } = useContext(PWallet);
    const { switchC } = useSwitchChain();
    const [amount, setAmount] = useState<number | string>('');
    const { connect } = useConnect();
    const [selectedChain, setSelectedChain] = useState<number>(Number(state.default_chain));
    const { depositMainChain, withdrawChildChain, check } = useTransfer();
    //发送交易 - 充值
    const makeTransfer = async () => {
        if (!state.address) {
            await connect()
        };
        if (!amount) {
            message.error('Please enter the amount');
            return
        };
        if (selectedChain === 2099156 && amount > Number(state.account_balance?.main_balance)) {
            message.error(`Your available balance is ${state.account_balance?.main_balance} PI`);
            return
        }
        if (selectedChain === 8007736 && amount > Number(state.account_balance?.child_balance)) {
            message.error(`Your available balance is ${state.account_balance?.child_balance} PI`);
            return
        }
        state.transfer_msg?.transfer_type === 0
            ? depositMainChain(amount as number)
            : withdrawChildChain(amount as number)
    };
    useEffect(() => {
        if (state.transfer_hash) {
            // dispatch({
            //     type: Type.SET_WAITING,
            //     payload: {
            //         waiting: {
            //             type: 'wait',
            //             visible: true
            //         }
            //     }
            // });
            state.transfer_hash !== '1' && check()
        }
    }, [])
    useEffect(() => {
        setAmount('')
    }, [state.reload_logs])
    return (
        <div className="swap-content">
            <div className="tab-box">
                <ul>
                    {
                        ['Deposit', 'Withdraw'].map((item: string, index: number) => {
                            return (
                                <li key={index} className={`${state.transfer_msg!.transfer_type === index ? 'active-tab' : ''}`} onClick={async () => {
                                    const chain_id: number = item === 'Deposit' ? 2099156 : 8007736
                                    const result = await switchC(chain_id)
                                    if (result != null) {
                                        return
                                    }
                                    dispatch({
                                        type: Type.SET_TRNASFER_MSG,
                                        payload: {
                                            transfer_msg: {
                                                from_chain: item === 'Deposit' ? 'Plian Mainnet Main' : 'Plian Mainnet Subchain 1',
                                                to_chain: item === 'Deposit' ? 'Plian Mainnet Subchain 1' : 'Plian Mainnet Main',
                                                transfer_type: index
                                            }
                                        }
                                    });
                                    setSelectedChain(chain_id)
                                }}>
                                    {item}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="from-box transfer-msg">
                <p>From<span>{state.transfer_msg!.from_chain ? state.transfer_msg!.from_chain : 'Wallet not connected'}</span></p>
                <p className="inp-amount">
                    <input type="number" value={amount} onChange={(e) => {
                        setAmount(e.target.value)
                    }} placeholder="0.0" onWheel={event => event.currentTarget.blur()} />
                </p>
                <p>Balance:&nbsp;{state.default_chain == '2099156' ? state.account_balance?.main_balance?.toFixed(4) : state.account_balance?.child_balance?.toFixed(4)}&nbsp;PI</p>
            </div>
            <div className="arrow-box">
                <img src={require('../../../../assets/images/down-arrow.png')} alt="" />
            </div>
            <div className="to-box transfer-msg">
                <p>To<span>{state.transfer_msg!.to_chain ? state.transfer_msg!.to_chain : 'Wallet not connected'}</span></p>
                <p>You will receive:&nbsp;{Number(amount).toFixed(4)}&nbsp;PI</p>
                <p>Balance:&nbsp;{state.default_chain == '2099156' ? state.account_balance?.child_balance?.toFixed(4) : state.account_balance?.main_balance?.toFixed(4)}&nbsp;PI</p>
            </div>
            <div className="make-transfer">
                <Button onClick={() => {
                    makeTransfer()
                }} type="primary">{('Enter an amount').toUpperCase()}</Button>
            </div>
            <WaitModal />
        </div>
    )
};

export default Swap;