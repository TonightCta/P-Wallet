import { ReactElement,ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const WalletView = () : ReactElement<ReactNode> => {
    const { t } = useTranslation();
    return (
        <div className='wallet-view'>
            {/* 钱包 */}
            {t('public.wallet')}
        </div>
    )
};

export default WalletView;