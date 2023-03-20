import { Button, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { ChainList } from '../../../../request/api'
import { DateConvert, OutSide } from "../../../../utils";
import { Type } from "../../../../utils/type";
import { PWallet } from './../../../../App';

interface DataType {
    key: number,
    chainId:string,
    hash: string,
    decodeInput: {
        name: string,
        params: any[]
    },
    method: string,
    timestamp: string,
    fromAddress: string
}

interface Props {
    switchTab: (val: number) => void,
    address: string
}

const HistoryView = (props: Props): ReactElement<ReactNode> => {
    const [waitResult, setWaitResult] = useState<boolean>(false);
    const { dispatch } = useContext(PWallet);
    const columns: ColumnsType<DataType> = [
        {
            key: 'hash',
            title: 'Txn Hash',
            dataIndex: 'hash',
            width: 250,
            render: (_,record) => <Tooltip placement="top" title={record.hash}>
                <p className="clickable" onClick={() => {
                    OutSide(record.hash,Number(record.chainId))
                }}>{record.hash.substring(0, 10)}...{record.hash.substring(record.hash.length - 10, record.hash.length)}</p>
            </Tooltip>
        },
        {
            key: 'method',
            title: 'Method',
            dataIndex: 'method',
            render: (_, record) => <p>
                {record.decodeInput.name === 'JoinChildChain' ? 'Join' : 'Creat'}
            </p>
        },
        {
            key: 'timestamp',
            title: 'Date',
            dataIndex: 'timestamp',
            render: (text) => <p>
                {DateConvert(Number(text))}
            </p>
        },
        {
            key: 'fromAddress',
            title: 'From',
            dataIndex: 'fromAddress',
            render: (text) => <Tooltip placement="top" title={text}>
                <p className="clickable">{text.substring(0, 10)}...{text.substring(text.length - 10, text.length)}</p>
            </Tooltip>
        },
        {
            key: 'action',
            title: 'Actions',
            render: (_, record) => (
                <p>
                    <Button size="small" type="primary" onClick={() => {
                        record.decodeInput.params.forEach(e => {
                            if (e.name === 'chainId') {
                                dispatch({
                                    type: Type.SET_LAST_CREAT,
                                    payload: {
                                        last_creat: e.value
                                    }
                                })
                                props.switchTab(2);
                            }
                        })

                    }}>JOIN</Button>
                    <Button size="small" type="primary">DETAIL</Button>
                </p>
            )
        }
    ];
    const [data, setData] = useState<DataType[]>([]);
    const initList = async () => {
        setWaitResult(true)
        const result = await ChainList({
            address: props.address,
            pageNo: 1,
            pageSize: 100
        });
        setWaitResult(false)
        const arr = result.data.map((item: any, index: number) => {
            return item = {
                key: index,
                ...item
            }
        })
        setData([...arr])
    };
    useEffect(() => {
        initList()
    }, [props.address])
    return (
        <div className="history-view">
            <div className="oper-btn">
                <p className="oper-name">Child Chain</p>
                <p>
                    <Button type="primary" onClick={() => {
                        props.switchTab(1)
                    }}>Creat</Button>
                    <Button type="primary" onClick={() => {
                        props.switchTab(2)
                    }}>Join</Button>
                </p>
            </div>
            <div className="history-content">
                <p className="table-name">Chain</p>
                <div className="table-content">
                    <Table columns={columns} loading={waitResult} pagination={{ pageSize: 10 }} dataSource={data} />
                </div>
            </div>
        </div>
    )
};

export default HistoryView;