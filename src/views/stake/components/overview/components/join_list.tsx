import { Button, Spin, Table, Tooltip } from "antd";
import { ReactElement, useEffect, useState } from "react";
import type { ColumnsType } from 'antd/es/table';
import { PointList } from '../../../../../request/api'
import { error, OutSide } from "../../../../../utils";
import ModalBox from "../../../../../components/modal";
import JoinModal from "./join_modal";
import { useConnect, useSwitchChain } from "../../../../../utils/hooks";

interface DataType {
    key: string;
    chainId: number;
    elected: number;
    username: string;
    address: string;
    commission: number,
    allProxiedBalance: number | string,
    introduction: string
}

const JoinList = (props: { address: string }): ReactElement => {
    const [wait, setWait] = useState<boolean>(false);
    const { switchC } = useSwitchChain();
    //DETAIL
    const [modalMsg, setModalMsg] = useState<{ visible: number, text: string }>({
        visible: 0,
        text: ''
    });
    //JOIN
    const [joinMsg, setJoinMsg] = useState<{ visible: number, address: string }>({
        visible: 0,
        address: ''
    });
    const { connect } = useConnect();
    const columns: ColumnsType<DataType> = [
        {
            title: 'Chain',
            dataIndex: 'chainId',
            key: 'chainId',
            render: (text) => <p>
                {text === 0 ? 'Main Chain' : 'Child Chain 1'}
            </p>,
            width: 146
        },
        {
            title: 'Elected',
            dataIndex: 'elected',
            key: 'elected',
            render: (text) => <p>
                {text === 0 ? 'N' : 'Y'}
            </p>,
            align: 'center'
        },
        {
            title: 'UserName',
            dataIndex: 'username',
            key: 'username',
            width: 160,
            render: (text) =>
                <Tooltip placement="top" title={text}>
                    <p className="text-overflow">
                        {text}
                    </p>
                </Tooltip>
        },
        {
            title: 'Candidate',
            dataIndex: 'address',
            key: 'address',
            width: 150,
            render: (_, record) => <Tooltip placement="top" title={record.address}>
                <p className="clickable" onClick={() => {
                    OutSide(record.address, record.chainId)
                }}>{record.address.substring(0, 6)}...{record.address.substring(record.address.length - 6, record.address.length)}</p>
            </Tooltip>
        },
        {
            title: 'Commission(0%-100%)',
            dataIndex: 'commission',
            key: 'commission',
            align: 'center'
        },
        {
            title: 'TotalProxiedBalance(PI)',
            dataIndex: 'allProxiedBalance',
            key: 'allProxiedBalance',
            width: 300
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <p>
                    <Button size="small" type="primary" onClick={async () => {
                        if (!props.address) {
                            await connect()
                        }
                        await switchC(record.chainId === 0 ? 2099156 : 8007736)
                        setJoinMsg({
                            address: record.address,
                            visible: 1
                        })
                    }}>JOIN</Button>
                    <Button size="small" type="primary" onClick={() => {
                        setModalMsg({
                            visible: 1,
                            text: record.introduction
                        })
                    }} className="need-left">DETAIL</Button>
                </p>
            ),
        },
    ];
    const [date, setDate] = useState<{ main: string, child: string }>({
        main: '',
        child: ''
    })
    const [data, setData] = useState<DataType[]>([]);
    const getList = async () => {
        setWait(true)
        const result: any = await PointList({
            address: props.address,
            pageNo: 1,
            pageSize: 100
        });
        setWait(false)
        if (result.result !== 'success') {
            error('Network error')
            return
        };
        setDate({
            main: result.estimatedtime[1].estimatedTime,
            child: result.estimatedtime[0].estimatedTime,
        });
        const arr = result.candidateList.map((item: any, index: number) => {
            return item = {
                key: index,
                ...item
            }
        })
        setData([...arr])
    };
    useEffect(() => {
        getList()
    }, [])
    return (
        <div className="list-data">
            <div className="data-title">Join Estimated Time(UTC):
                <div>
                    Main Chain({
                        date.main ? <span>{date.main}</span> : <Spin size="small" />
                    })
                </div>

                <div>
                    Child Chain 1({
                        date.child ? <span>{date.child}</span> : <Spin size="small" />
                    })
                </div>
            </div>
            <div className="table-mine">
                <Table scroll={{ x: true }} columns={columns} loading={wait} dataSource={data} pagination={{ pageSize: 10 }} />
            </div>
            <ModalBox title="Remark" onClose={(val: number) => {
                setModalMsg({
                    ...modalMsg,
                    visible: val
                })
            }} close visible={modalMsg.visible} text={modalMsg.text} />
            <JoinModal visible={joinMsg.visible} address={joinMsg.address} onClose={(val: number) => {
                setJoinMsg({
                    ...joinMsg,
                    visible: 0
                })
            }} />
        </div>
    )
};

export default JoinList;