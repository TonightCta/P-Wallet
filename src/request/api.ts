import { post } from './index';

type o = {};

//获取交易信息
export const TransferMsg = (p:o) => post('/sendTx',p);
//转账历史记录
export const TransactionsLog = (p: o) => post('/getCrossTransferHistoryList', p);
//子链列表
export const ChainList = (p: o) => post('/getCreateChainHistoryList', p);
//提现记录
export const SetWithdrawLog = (p:o) => post('/getChildTxInMainChain',p);
//获取余额
export const GetBalance = (p:o) => post('/getBalance',p);
//获取签名
export const SignAddress = (p:o) => post('/signAddress',p);

