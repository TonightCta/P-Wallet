import { ArrowLeftOutlined, CheckOutlined, CopyOutlined, DownOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Drawer, MessagePlugin } from 'tdesign-react';
import { com, Community } from "../../footer";
import { PWallet } from './../../../App';
import copy from 'copy-to-clipboard';
import { useConnect, useSwitchChain } from "../../../utils/hooks";
import Jazzicon from "react-jazzicon";

interface Props {
    visible: boolean,
    onClose: (val: boolean) => void
}

const MobileMenu = (props: Props): ReactElement<ReactNode> => {
    const { state } = useContext(PWallet)
    const [visible, setVisilble] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(999);
    const location = useLocation();
    const { connect } = useConnect();
    const [chainDrawer, setChainDrawer] = useState<boolean>(false);
    const { switchC } = useSwitchChain();
    useEffect(() => {
        setVisilble(props.visible)
    }, [props.visible]);
    const closeDrawer = () => {
        setVisilble(false)
        props.onClose(false)
    };
    const navigate = useNavigate();
    useEffect(() => {
        switch (location.pathname) {
            case '/':
                setActiveTab(0);
                break;
            case '/stake':
                setActiveTab(1);
                break;
            case '/l2':
                setActiveTab(2);
                break;
            default:
                setActiveTab(0)
        }
    }, [location.pathname])
    return (
        <>
            <Drawer size="100%" className="mine-drawer" footer={null} header={false} closeBtn={null} cancelBtn={null} destroyOnClose placement="left" visible={visible} onClose={closeDrawer}>
                <div className="menu-inner-mobile">
                    <div className="account-msg">
                        <div className="left-msg">
                            <div className="avatar-box">
                                {state.address != null && state.address != 'null' ? <div className='avatar'>
                                    <Jazzicon diameter={30} seed={parseInt(state.address.slice(2, 10), 16)} />
                                </div> : <img src={require('../../../assets/images/logo.png')} />}
                            </div>
                            <div className="address-msg">
                                <p>
                                    {state.address == null || state.address == 'null'
                                        ? 'Wallet not connected'
                                        : `${state.address.substring(0, 6)}...${state.address.substring(state.address.length - 6, state.address.length)}`
                                    }
                                    {state.address && <span onClick={() => {
                                        copy(state.address as string);
                                        MessagePlugin.info('Copy successfully')
                                    }}><CopyOutlined /></span>}
                                </p>
                                <p>Balance:&nbsp;{state.account_balance?.main_balance.toFixed(2)}&nbsp;Pi&nbsp;($&nbsp;{state.account_balance?.main_balance_usdt.toFixed(2)})</p>
                            </div>
                        </div>
                        <div className="right-tools">
                            <div className="select-chain" onClick={() => {
                                setChainDrawer(true)
                            }}>
                                <p className="text-overflow">{state.default_chain === '2099156' ? 'Plian Mainnet Main' : 'Plian Subchain 1'}</p>
                                <p className="down-arrow">
                                    <DownOutlined />
                                </p>
                            </div>
                            <p className="close-btn">
                                <ArrowLeftOutlined onClick={closeDrawer} />
                            </p>
                        </div>
                    </div>
                    <div className="menu-list">
                        <ul>
                            {
                                ['Bridge', 'Stake', 'L2'].map((item: string, index: number) => {
                                    return (
                                        <li key={index} className={`${activeTab === index ? 'active-tab' : ''}`} onClick={() => {
                                            switch (item) {
                                                case 'Bridge':
                                                    navigate('/');
                                                    break;
                                                case 'Stake':
                                                    navigate('/stake');
                                                    break;
                                                case 'L2':
                                                    navigate('/l2');
                                                    break;
                                                default:
                                                    navigate('/');
                                            };
                                            closeDrawer()
                                        }}>{item}</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="other-oper">
                        <Button type="primary" size="large" onClick={async () => {
                            const reload = async () => {
                                window.localStorage.clear();
                                window.sessionStorage.clear();
                                window.location.reload();
                            }
                            state.address == null || state.address == 'null' ? await connect() : reload();
                            closeDrawer()
                        }}>{state.address == null || state.address == 'null' ? 'Connect Wallet' : 'Disconnect'}</Button>
                        <ul>
                            {
                                com.map((item: Community, index: number) => {
                                    return (
                                        <li key={index} onClick={() => {
                                            window.open(item.url)
                                        }}>
                                            <img style={{ width: `${item.width / 16 / 1.5}rem`, height: `${item.height / 16 / 1.5}rem` }} src={item.img} alt="" />
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </Drawer>
            {/* 选择主网 */}
            <Drawer className="select-chain" size="32%" footer={null} header={false} onClose={() => {
                setChainDrawer(false)
            }} visible={chainDrawer} placement='bottom'>
                <ul>
                    {
                        [
                            { name: 'Plian Mainnet Main', id: '2099156' },
                            { name: 'Plian Mainnet Subchain 1', id: '8007736' }
                        ].map((item: { name: string, id: string }, index: number) => {
                            return (
                                <li key={index} className={`${state.default_chain === item.id ? 'active-chain' : ''}`} onClick={async () => {
                                    await switchC(Number(item.id));
                                    setChainDrawer(false)
                                }}>
                                    <p>{item.name}</p>
                                    <p><CheckOutlined /></p>
                                </li>
                            )
                        })
                    }
                </ul>
            </Drawer>
        </>
    )
};

export default MobileMenu;