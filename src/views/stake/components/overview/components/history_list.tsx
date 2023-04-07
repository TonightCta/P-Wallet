import { Button, Table, Tooltip } from "antd";
import { ReactElement, useEffect, useState } from "react";
import type { ColumnsType } from 'antd/es/table';
import { StakeHistory } from "../../../../../request/api";
import { OutSide } from "../../../../../utils";

interface DataType {
    key: string;
    chainId: string;
    number: number;
    address:string,
    updatetime: string;
    candidate: string;
    amount: number,
    status: number
}

const HistoryList = (props: { address: string }): ReactElement => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Chain',
            dataIndex: 'chainId',
            key: 'chainId',
            render: (text) => <p>
                {text === 0 ? 'Main Chain' : 'Child Chain 1'}
            </p>
        },
        {
            title: 'Epoch Number',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Time',
            dataIndex: 'updatetime',
            key: 'updatetime',
            width: 200
        },
        {
            title: 'Candidate',
            dataIndex: 'candidate',
            key: 'candidate',
            render: (_, record) => <Tooltip placement="top" title={record.candidate}>
                <p className="clickable" onClick={() => {
                    OutSide(record.candidate, Number(record.chainId))
                }}>{record.candidate.substring(0, 6)}...{record.candidate.substring(record.candidate.length - 6, record.candidate.length)}</p>
            </Tooltip>
        },

        {
            title: 'Amount(PI)',
            dataIndex: 'amount',
            key: 'amount',
            render:(text) => <p>
                {Number(text).toFixed(4)}
            </p>
        },
        {
            title: 'Operation Type',
            dataIndex: 'type',
            key: 'type',
            render: (text) => <p>
                {text === 1 ? 'Join' : 'Cancel'}
            </p>
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => <p>
                <Button type="primary" size="small" onClick={() => {
                    OutSide(record.address ? record.address : record.candidate,Number(record.chainId))
                }}>DETAIL</Button>
            </p>
        }
    ];
    const [wait, setWait] = useState<boolean>(false);
    const [data, setData] = useState<DataType[]>([]);
    const getHistory = async () => {
        setWait(true)
        const result = await StakeHistory({ address: props.address });
        setWait(false)
        const arr = result.data.map((item: any, index: number) => {
            return item = {
                key: index,
                ...item
            }
        });
        setData([...arr])
    };
    useEffect(() => {
        getHistory()
    }, [props.address])
    return (
        <div className="list-data">
            <p className="data-title">Delegation history</p>
            <div className="table-mine">
                <Table scroll={{x:true}} columns={columns} loading={wait} dataSource={data} pagination={{ pageSize: 10 }} />
            </div>
        </div>
    )
};

export default HistoryList;