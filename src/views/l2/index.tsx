import { ReactElement, ReactNode, useState, useContext, useEffect } from "react";
import './index.scss'
import HistoryView from "./components/history";
import CreatView from "./components/creat";
import EditView from './components/edit/index';
import { PWallet } from './../../App';
import { Type } from "../../utils/type";
import JoinIndex from './components/join/index';
import KeepAlive from 'react-activation'


interface Tab {
    name: string,
    url: string
}

const L2View = (): ReactElement<ReactNode> => {
    const [active, setActive] = useState<number>(9999);
    const { state, dispatch } = useContext(PWallet);
    const tab: Tab[] = [
        {
            name: 'Chain',
            url: '/l2'
        },
        {
            name: 'Create',
            url: '/l2/create'
        },
        {
            name: 'Join',
            url: '/l2/join'
        },
        {
            name: 'Set Block',
            url: '/l2/edit'
        },
    ];
    useEffect(() => {
        if (state.l2_active !== 999) {
            setActive(state.l2_active as number)
        } else {
            setActive(0)
        }
        return () => {
            dispatch({
                type: Type.SET_L2_ACTIVE,
                payload: {
                    l2_active: 999
                }
            })
        }
    }, [])
    return (
        <div className="l2-view">
            <div style={{ position: 'relative' }}>
                <div className="tab-list">
                    <ul>
                        {
                            tab.map((item: Tab, index: number) => {
                                return (
                                    <li key={index} onClick={() => {
                                        setActive(index);
                                        dispatch({
                                            type: Type.SET_L2_ACTIVE,
                                            payload: {
                                                l2_active: index
                                            }
                                        })
                                    }} className={`${active === index ? 'active-tab' : ''}`}>{item.name}</li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="inner-view">
                    {
                        active === 0 && <KeepAlive>
                            <HistoryView switchTab={(val: number) => {
                                setActive(val)
                            }} address={state.address as string} />
                        </KeepAlive> ||
                        active === 1 && <CreatView switchTab={(val: number) => {
                            setActive(val)
                        }} /> ||
                        active === 2 && <JoinIndex /> ||
                        active === 3 && <EditView />
                    }
                </div>
            </div>
        </div>
    )
};

export default L2View;