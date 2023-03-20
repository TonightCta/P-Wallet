import { ReactElement, ReactNode, useContext } from "react";
import './index.scss'
import OverviewData from './components/data';
import JoinList from './components/join_list';
import HistoryList from './components/history_list';
import { PWallet } from './../../../../App';
import KeepAlive from 'react-activation'


const Overview = (): ReactElement<ReactNode> => {
    const { state } = useContext(PWallet)
    return (
        <div className="stake-overview">
            <OverviewData default_chain={state.default_chain as string} web3={state.web3}/>
            <KeepAlive><JoinList address={state.address as string} /></KeepAlive>
            <HistoryList address={state.address as string} />
        </div>
    )
};

export default Overview;