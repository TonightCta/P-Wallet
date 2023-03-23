import { ReactElement, ReactNode, useEffect, useState, useContext } from "react";
import { Button, Table, Tooltip } from 'antd';
import { ColumnsType } from "antd/es/table";
import { TransactionsLog } from '../../../../request/api';
import { DateConvert, OutSide } from '../../../../utils/index'
import { useSwitchChain, useTransfer } from './../../../../utils/hooks';
import { PWallet } from './../../../../App';
import { Type } from "../../../../utils/type";


interface Data {
    chainId: string,
    decodeInput: {
        name: string,
    },
    fromAddress: string,
    gas: string,
    gasPrice: string,
    hash: string,
    timestamp: string,
    toAddress: string,
    value: string
}

interface DataType {
    key: number;
    inner: Data[]
}

const Transactions = (): ReactElement<ReactNode> => {
    const { state, dispatch } = useContext(PWallet)
    const columns: ColumnsType<DataType> = [
        {
            title: 'Txn Hash',
            dataIndex: 'hash',
            key: 'hash',
            width: 300,
            render: (_, record) => <Tooltip placement="top" title={record.inner[1] ? record.inner[1].hash : record.inner[0].hash}>
                <p className="clickable" onClick={() => {
                    OutSide(record.inner[1] ? record.inner[1].hash : record.inner[0].hash, Number(record.inner[1].chainId))
                }}>
                    {record.inner[1]
                        ? record.inner[1].hash.substring(0, 15)
                        : record.inner[0].hash.substring(0, 15)}
                    ...
                    {record.inner[1]
                        ? record.inner[1].hash.substring(record.inner[1].hash.length - 15, record.inner[1].hash.length)
                        : record.inner[0].hash.substring(record.inner[0].hash.length - 15, record.inner[0].hash.length)
                    }
                </p>
            </Tooltip>,
        },
        {
            title: 'Method',
            dataIndex: 'method',
            width: 120,
            key: 'method',
            render: (_, record) => <p>
                {record.inner[0].decodeInput.name === 'DepositInMainChain' ? 'Deposit' : 'Withdraw'}
            </p>
        },
        {
            title: 'TimeStamp',
            dataIndex: 'date',
            key: 'date',
            width:180,
            render: (_, record) => <p>
                {DateConvert(Number(record.inner[0].timestamp))}
            </p>
        },
        {
            title: 'From',
            key: 'from',
            dataIndex: 'from',
            width:250,
            render: (_, record) => <Tooltip placement="top" title={record.inner[0].fromAddress}>
                <p className="clickable" onClick={() => {
                    OutSide(record.inner[0].fromAddress, Number(record.inner[0].chainId))
                }}>
                    {record.inner[0].fromAddress.substring(0, 10)}
                    ...
                    {record.inner[0].fromAddress.substring(record.inner[0].fromAddress.length - 10, record.inner[0].fromAddress.length)}
                </p>
            </Tooltip>,
        },
        // {
        //     title: 'To',
        //     key: 'to',
        //     dataIndex: 'to',
        //     render: (_, record) => <Tooltip placement="top" title={record.inner[0].toAddress}>
        //         <p className="clickable" onClick={() => {
        //             alert('Outside')
        //         }}>
        //             {record.inner[0].toAddress.substring(0, 6)}
        //             ...
        //             {record.inner[0].toAddress.substring(record.inner[0].toAddress.length - 6, record.inner[0].toAddress.length)}
        //         </p>
        //     </Tooltip>,
        // },
        {
            title: 'Amount',
            key: 'amount',
            dataIndex: 'amount',
            render: (_, record) => <p className="amount-oper">
                {Number(record.inner[0].value) / 1e18}&nbsp;Pi
            </p>,
            width: 108
        },
        {
            title: 'State',
            key: 'state',
            dataIndex: 'state',
            width: 138,
            render: (_, record) => <div className={`state-box ${!record.inner[1] ? 'failed-state' : 'pass-state'}`}>
                <p className="state-point"></p>
                <p>{!record.inner[1] ? 'failure' : 'complete'}</p>
            </div>
        },
        {
            title: 'Action',
            width: 120,
            key: 'action',
            render: (_, record) => (
                !record.inner[1] ? <Button onClick={() => {
                    resendTransfer(record.inner[0].decodeInput.name, record.inner[0].hash, Number(record.inner[0].value) / 1e18)
                }} type="primary" size="small">RE&nbsp;SEND</Button> : <Button type="primary" size="small" style={{ opacity: 0 }}>TES</Button>
            ),
        },
    ];
    //数据列表
    const [data, setData] = useState<DataType[]>([]);
    const [waitResult, setWaitResult] = useState<boolean>(false);
    const queryList = async () => {
        setWaitResult(true)
        setTimeout(async () => {
            const params = {
                address: state.address,
                chainId: '-1',
                pageNo: 1,
                pageSize: 100
            }
            const result = await TransactionsLog(params);
            setWaitResult(false)
            const data = result.data.map((e: any, index: number) => {
                return e = {
                    key: index,
                    inner: e
                }
            });
            setData([...data]);
        }, 300)
    };
    const { takeDepositMain, takeWithdrawChild } = useTransfer();
    const { switchC } = useSwitchChain()
    const resendTransfer = async (_type: string, _hash: string, _amount: number) => {
        await switchC(_type === 'DepositInMainChain' ? 8007736 : 2099156);
        dispatch({
            type: Type.SET_LAST_TRANSFER_CHAIN,
            payload: {
                last_transfer_chain: _type === 'DepositInMainChain' ? 8007736 : 2099156
            }
        })
        _type === 'DepositInMainChain' ? takeDepositMain(_hash) : takeWithdrawChild(_amount, _hash)
    };
    useEffect(() => {
        if (state.address == 'null' || !state.address) {
            return
        };
        queryList();
    }, [state.address, state.reload_logs])
    return (
        <div className="transactions-content">
            <p className="table-name">Transactions</p>
            <div className="table-content table-mine">
                <Table columns={columns} scroll={{x:true}} loading={waitResult} pagination={{ pageSize: 10 }} dataSource={data} />
            </div>
        </div>
    )
};

export default Transactions;