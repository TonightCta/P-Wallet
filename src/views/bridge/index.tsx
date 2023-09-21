import { ReactElement, ReactNode } from 'react';
import Swap from './components/swap';
import './index.scss'
import Transactions from './components/transactions/index';


const BridgeView = (): ReactElement<ReactNode> => {
    return (
        <div className='wallet-view'>
            {/* Trade */}
            <Swap />
            {/* Record */}
            {/* <KeepAlive> */}
            {/* <Transactions /> */}
            {/* </KeepAlive> */}
        </div>
    )
};

export default BridgeView;