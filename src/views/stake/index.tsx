
import { ReactElement, ReactNode, useState } from "react";
import './index.scss';
import Overview from './components/overview/index';
import Stake from './components/stake/index';

const StakeView = (): ReactElement<ReactNode> => {
    const [active, setActive] = useState<number>(0);
    return (
        <div className="stake-view">
            <div style={{ position: 'relative' }}>
                <div className="tab-list">
                    <ul>
                        {
                            ['Overview', 'Stake'].map((item: string, index: number) => {
                                return (
                                    <li className={`${active === index ? 'active-tab' : ''}`} key={index} onClick={() => {
                                        setActive(index)
                                    }}>{item}</li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            <div className="stake-content">
                {
                    active === 0 ? <Overview /> : <Stake />
                }
            </div>
        </div>
    )
};

export default StakeView;