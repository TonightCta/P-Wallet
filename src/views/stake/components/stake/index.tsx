import { ReactElement, ReactNode, useContext } from "react";
import './index.scss'
import TotalStake from './components/total_stake';
import NoticeList from './components/notice_list';
import { PWallet } from './../../../../App';
import KeepAlive from 'react-activation'



const Stake = (): ReactElement<ReactNode> => {
    const { state } = useContext(PWallet);
    return (
        <div className="stake-inner">
            <TotalStake address={state.address as string}/>
            {/* <KeepAlive> */}
                <NoticeList total={state.reward_total as number} address={state.address as string}/>
            {/* </KeepAlive> */}
        </div>
    )
};

export default Stake;