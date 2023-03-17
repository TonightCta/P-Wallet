import { Button, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { ReactElement, ReactNode, useState } from "react";

interface DataType {
    key:number,
    hash:string,
    method:string,
    date:string,
    from:string
}

const HistoryView = (): ReactElement<ReactNode> => {
    const [waitResult, setWaitResult] = useState<boolean>(false);
    const columns: ColumnsType<DataType> = [
        {
            key: 'hash',
            title: 'Txn Hash',
            dataIndex: 'hash',
            width: 250,
            render:(text) => <Tooltip placement="top" title={text}>
                <p className="clickable">{text.substring(0,10)}...{text.substring(text.length - 10,text.length)}</p>
            </Tooltip>
        },
        {
            key:'method',
            title:'Method',
            dataIndex:'method'
        },
        {
            key:'date',
            title:'Date',
            dataIndex:'date'
        },
        {
            key: 'from',
            title: 'From',
            dataIndex: 'from',
            render:(text) => <Tooltip placement="top" title={text}>
                <p className="clickable">{text.substring(0,10)}...{text.substring(text.length - 10,text.length)}</p>
            </Tooltip>
        },
        {
            key:'action',
            title:'Actions',
            render:(_,record) => (
                <p>
                    <Button size="small" type="primary">JOIN</Button>
                    <Button size="small" type="primary">DETAIL</Button>
                </p>
            )
        }
    ];
    const data: DataType[] = [
        {
            key:0,
            hash:'0x4c82b31759d1a48beba596db4185375d64f820d3106b631f17e5cabbfc3c2ac4',
            method:'Creat',
            date:'02/13/2023 11:40',
            from:'0xb735872bD3A8e193D022A2F908030Afb51C66254'
        },
        {
            key:1,
            hash:'0x4c82b31759d1a48beba596db4185375d64f820d3106b631f17e5cabbfc3c2ac4',
            method:'Creat',
            date:'02/13/2023 11:40',
            from:'0xb735872bD3A8e193D022A2F908030Afb51C66254'
        },
        {
            key:3,
            hash:'0x4c82b31759d1a48beba596db4185375d64f820d3106b631f17e5cabbfc3c2ac4',
            method:'Creat',
            date:'02/13/2023 11:40',
            from:'0xb735872bD3A8e193D022A2F908030Afb51C66254'
        },
    ]
    return (
        <div className="history-view">
            <div className="history-content">
                <p className="table-name">Transactions</p>
                <div className="table-content">
                    <Table columns={columns} loading={waitResult} pagination={{ pageSize: 1 }} dataSource={data} />
                </div>
            </div>
        </div>
    )
};

export default HistoryView;