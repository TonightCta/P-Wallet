import { ReactElement, ReactNode, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Select } from 'antd';
import { PieChartOutlined, SettingOutlined } from '@ant-design/icons'
import { useConnect, useSwitchChain } from '../../utils/hooks'
import './menu.scss'
import { PWallet } from '../../App';
import Jazzicon from 'react-jazzicon'

const MenuTab = (): ReactElement<ReactNode> => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { connect } = useConnect();
    //当前连接地址
    const { state } = useContext(PWallet);
    //当前选择主网
    const { switchC } = useSwitchChain();
    const handleChange = (value: string) => {
        switchC(Number(value))
    };
    return (
        <div className='menu-box'>
            <div className='menu-inside'>
                <div className='logo-menu'>
                    <div className='logo-box'>LOGO</div>
                    <ul>
                        <li onClick={() => {
                            navigate('/')
                        }}>
                            {/* Wallet */}
                            {t('public.wallet')}
                        </li>
                        <li onClick={() => {
                            navigate('/test')
                        }}>
                            {/* 测试 */}
                            {t('public.test')}
                        </li>
                    </ul>
                </div>
                <div className='connect-wallet-msg'>
                    <div className='tools-box'>
                        {/* 切换语言 */}
                        <p className='select-language icon-oper'>
                            <PieChartOutlined style={{ color: 'white', fontSize: 20 }} />
                        </p>
                        {/* 设置 */}
                        <p className='setting-icon icon-oper'>
                            <SettingOutlined style={{ color: 'white', fontSize: 20 }} />
                        </p>
                        <p className='balance-text'>Balance:0.0000</p>
                    </div>

                    {/* 选择主网 */}
                    <div className='select-chain'>
                        <Select
                            size='small'
                            className='mine-select'
                            value={state.default_chain}
                            style={{ width: 200, height: 30 }}
                            onChange={handleChange}
                            options={[
                                { value: '2099156', label: 'Plian Mainnet Main' },
                                { value: '8007736', label: 'Plian Mainnet Subchain 1' },
                            ]}
                        />
                    </div>
                    {/* 连接钱包 */}
                    <div className='connect-btn'>

                        <Button type='primary' onClick={() => {
                            !state.address && connect()
                        }}>
                            {state.address && <div className='avatar'>
                                <Jazzicon diameter={18} seed={parseInt(state.address.slice(2, 10), 16)} />
                            </div>}{!state.address
                                ? 'Connect Wallet'
                                : `${state.address.substring(0, 6)}...${state.address.substring(state.address.length - 6, state.address.length)}`}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default MenuTab;
