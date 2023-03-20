import { ReactElement, useContext, useEffect, useState } from "react";
import { Spin } from 'antd';
import { StakeInfo } from "../../../../../request/api";
import { PWallet } from "../../../../../App";
import { Type } from "../../../../../utils/type";

interface Info {
    balance: string,
    total: string,
    apy: string
}

const TotalStake = (props: { address: string }): ReactElement => {
    const { dispatch } = useContext(PWallet);
    const [info, setInfo] = useState<Info>({
        balance: '',
        total: '',
        apy: ''
    });
    const getInfo = async () => {
        const result: any = await StakeInfo({
            address: props.address
        });
        setInfo({
            balance: String(result.total_delegateBalance),
            total: result.total_rewardBalance,
            apy: result.dailyrate.replace('%', '')
        });
        dispatch({
            type: Type.SET_REWARD_TOTAL,
            payload: {
                reward_total: Number(result.total_rewardBalance.replace('≈',''))
            }
        })
    };
    useEffect(() => {
        getInfo()
    }, [])
    return (
        <div className="total-stake">
            <ul className="amount-msg">
                <li>
                    <p>Delegate Balance(PI)</p>
                    <div className="value">
                        {
                            info.balance ? <p>{info.balance}</p> : <Spin />
                        }
                    </div>
                </li>
                <li>
                    <p>Pos Mining Total Reward(PI)</p>
                    <div className="value">
                        {
                            info.balance ? <p>{info.total}</p> : <Spin />
                        }
                    </div>
                </li>
                <li>
                    <p>APY</p>
                    <div className="value">
                        {
                            info.apy ? <p>{info.apy}&nbsp;%</p> : <Spin />
                        }
                    </div>
                </li>
            </ul>
        </div>
    )
};

export default TotalStake;