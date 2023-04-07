import { post } from './index';

type o = {};

//Get transaction information
export const TransferMsg = (p: o) => post('/sendTx', p);
//Transfer History
export const TransactionsLog = (p: o) => post('/getCrossTransferHistoryList', p);
//child chain list
export const ChainList = (p: o) => post('/getCreateChainHistoryList', p);
//Withdrawals record
export const SetWithdrawLog = (p: o) => post('/getChildTxInMainChain', p);
//Get balance
export const GetBalance = (p: o) => post('/getBalance', p);
//Get signature
export const SignAddress = (p: o) => post('', p);
//Pledge node list
export const PointList = (p: o) => post('/queryCandidateList', p); //address
//Staking history list
export const StakeHistory = (p: o) => post('/getDelegateHistoryList', p);
//Staking Reward Information
export const StakeInfo = (p: o) => post('/getDelegateRewardInfo', p);
//Reward list
export const RewardList = (p: o) => post('/getDelegateRewardList', p);
//Block information
export const BlockInfo = (p: o) => post('/getMonitorLastBlock', p);
//Epoch information
export const EpochInfo = (p: o) => post('/getMonitorEpochInfo', p);
//Record transfer information
export const RecordHash = (p:o) => post('/addCrossTransferHistory',p);