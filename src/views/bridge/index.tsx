import { ReactElement, ReactNode } from 'react';
import Swap from './components/swap';
import './index.scss'
import Transactions from './components/transactions/index';
import KeepAlive from 'react-activation'


const BridgeView = (): ReactElement<ReactNode> => {
    return (
        <div className='wallet-view'>
            {/* 交易 */}
            <Swap />
            {/* 记录 */}
            <KeepAlive>
                <Transactions />
            </KeepAlive>
        </div>
    )
};

export default BridgeView;