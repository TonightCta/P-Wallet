import { ReactElement, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './menu.scss'

const MenuTab = (): ReactElement<ReactNode> => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
        <div className='menu-box'>
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
    )
};

export default MenuTab;
