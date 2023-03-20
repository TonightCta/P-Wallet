import { ReactElement, useEffect, useState } from "react";
import { Button, Table, Tooltip } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { RewardList } from "../../../../../request/api";
import { useStake } from "../../../../../utils/hooks";
import { error, OutSide } from "../../../../../utils";
import ModalBox from './../../../../../components/modal/index';


interface DataType {
    key: number;
    chainId: number;
    number: number;
    tx_status: string;
    address: string;
    amount: number,
    totalRewardBalance: number
}

interface Modal {
    visible: number,
    title: string,
    text: string,
}
const NoticeList = (props: { address: string, total: number}): ReactElement => {
    const [modal, setModal] = useState<Modal>({
        visible: 0,
        title: '',
        text: ''
    })
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
            title: 'Candidate',
            dataIndex: 'address',
            key: 'address',
            render: (_, record) => <Tooltip placement="top" title={record.address}>
                <p className="clickable" onClick={() => {
                    OutSide(record.address, record.chainId)
                }}>{record.address.substring(0, 6)}...{record.address.substring(record.address.length - 6, record.address.length)}</p>
            </Tooltip>
        },
        {
            title: 'Amount(PI)',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Tx Status',
            dataIndex: 'tx_status',
            key: 'tx_status',
            render: (text) => <p>
                {
                    text === 2 && 'Processing' ||
                    text === 1 && 'Success' ||
                    text === -1 && 'Exited'
                }
            </p>
        },
        {
            title: 'TotalRewardBalance(PI)',
            dataIndex: 'totalRewardBalance',
            key: 'totalRewardBalance',
        },
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (_, record) => <p>
        //         <Button size="small" type="primary">CLAIM</Button>
        //     </p>
        // }
    ];
    const [wait, setWait] = useState<boolean>(false);
    const { receive } = useStake();
    const [data, setData] = useState<DataType[]>([]);
    const getNotice = async () => {
        setWait(true)
        const result = await RewardList({
            address: props.address
        });
        console.log(result);
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
        getNotice();
    }, []);
    //领取奖励
    const receiveReward = async () => {
        if (props.total === 0) {
            setModal({
                visible: 1,
                title: 'Failure',
                text: 'The current reward balance that can be claimed is 0.'
            })
            return
        }
        const result = await receive();
        result && setModal({
            visible: 1,
            title: 'Already Submitted',
            text: 'Your application has been submitted, please wait for block confirmation.'
        });
    };
    return (
        <div className="total-list">
            <p className="list-name">
                <span>Notice:Awards are subject to actual income. The final interpretation is owned by PLIAN</span>
                <Button type="primary" size="small" onClick={() => {
                    receiveReward()
                }}>Extract Reward</Button>
            </p>
            <div className="table-mine">
                <Table columns={columns} loading={wait} dataSource={data} pagination={{ pageSize: 1 }} />
            </div>
            <ModalBox title={modal.title} visible={modal.visible} close icon text={modal.text} onClose={(val: number) => {
                setModal({
                    ...modal,
                    visible: val
                })
            }} />
        </div>
    )
};

export default NoticeList;