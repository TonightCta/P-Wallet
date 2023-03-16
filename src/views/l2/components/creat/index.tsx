import { ReactElement, ReactNode, useState, useContext } from "react";
import { Button, message, Modal, Tooltip } from 'antd'
import { PWallet } from './../../../../App';
import { useChain } from './../../../../utils/hooks';
import { DecimalToHex } from "../../../../utils";
import { CheckCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";

interface StepOne {
    from: string,
    chain_id: string | number,
    min_v: string | number,
    min_d: string | number,
    start_b: string | number,
    end_b: string | number
};

interface StepTwo {
    from: string,
    chain_id: string,
    startup: string,
    fee: number | string,
    nonce: number | string,
    input: string
}

interface Prop {
    switchTab: (val: number) => void
}

const InputSource: StepOne = {
    from: '',
    chain_id: '',
    min_v: '',
    min_d: '',
    start_b: '',
    end_b: ''
}

const CreatView = (props: Prop): ReactElement<ReactNode> => {
    // const [step, setStep] = useState<number>(0);
    const { state } = useContext(PWallet);
    const [joinBox, setJoinbox] = useState<boolean>(false);
    const { create } = useChain();
    const error = (_text: string) => {
        message.error(_text)
    };
    //创建子链
    const CreateStepOne = (): ReactElement => {
        const [input, setInput] = useState<StepOne>({
            ...InputSource,
            from: state.address ? state.address as string : 'Wallet not connected',
        });
        const submitCreate = async () => {
            if (state.default_chain != '2099156') {
                error('Transaction not allowed in child chain');
                return
            };
            if (!input.from) {
                error('Please enter address')
                return
            };
            if (!input.chain_id) {
                error('Please enter chain id');
                return
            }
            if (!input.min_v) {
                error('Please enter min validators');
                return
            };
            if (!input.min_d) {
                error('Please enter min deposit amount');
                return
            };
            if (!input.start_b) {
                error('Please enter start block');
                return
            };
            if (!input.end_b) {
                error('Please enter end block');
                return
            };
            if (state.account_balance?.main_balance as number < 1e5) {
                error('Startup cost is not meet the required amount (100000 PI)');
                return
            };
            const params = {
                _chain_id: String(input.chain_id),
                _min_validators: "0x" + DecimalToHex(input.min_v as number),
                _min_depositAmount: "0x" + DecimalToHex(state.web3.utils.toWei(input.min_d, 'ether')),
                _start_block: "0x" + DecimalToHex(input.start_b as number),
                _end_block: "0x" + DecimalToHex(input.end_b as number)
            }
            await create(params);
            setInput({
                ...InputSource,
                from: state.address as string,
            });
            // setStep(1)
            setJoinbox(true)
        }
        return (
            <div className="create-step-one public-input">
                <ul>
                    <li>
                        <p className="lable">From</p>
                        <p>
                            <input type="text" readOnly value={input.from} onChange={(e) => {
                                setInput({
                                    ...input,
                                    from: e.target.value
                                })
                            }} placeholder="Address" />
                        </p>
                    </li>
                    <li>
                        <p className="lable">Create Chain ID
                            <span>
                                <Tooltip placement="top" title='Must start with a letter (a-z) and contain alphanumerics (lowercase) or underscores.'>
                                    <QuestionCircleOutlined />
                                </Tooltip>
                            </span>
                        </p>
                        <p>
                            <input type="text" onWheel={event => event.currentTarget.blur()} value={input.chain_id} onChange={(e) => {
                                setInput({
                                    ...input,
                                    chain_id: e.target.value
                                })
                            }} placeholder="Chain ID" />
                        </p>
                    </li>
                    <li>
                        <p className="lable">Min Validators</p>
                        <p>
                            <input type="number" onWheel={event => event.currentTarget.blur()} value={input.min_v} onChange={(e) => {
                                setInput({
                                    ...input,
                                    min_v: e.target.value
                                })
                            }} placeholder="Min Validators" />
                        </p>
                    </li>
                    <li>
                        <p className="lable">Min Deposit Amount&nbsp;(PI)</p>
                        <p>
                            <input type="number" onWheel={event => event.currentTarget.blur()} value={input.min_d} onChange={(e) => {
                                setInput({
                                    ...input,
                                    min_d: e.target.value
                                })
                            }} placeholder="Min:100000 Pi" />
                            <span className="right-lable">Pi</span>
                        </p>
                    </li>
                    <li>
                        <p className="lable">Start Block</p>
                        <p>
                            <input type="text" onWheel={event => event.currentTarget.blur()} value={input.start_b} onChange={(e) => {
                                setInput({
                                    ...input,
                                    start_b: e.target.value
                                })
                            }} placeholder="Start Block" />
                        </p>
                    </li>
                    <li>
                        <p className="lable">End Block</p>
                        <p>
                            <input type="text" value={input.end_b} onChange={(e) => {
                                setInput({
                                    ...input,
                                    end_b: e.target.value
                                })
                            }} placeholder="End Block" />
                        </p>
                    </li>
                    <li>
                        <Button block type="primary" onClick={() => {
                            submitCreate()
                        }}>{'Create'.toUpperCase()}</Button>
                    </li>
                </ul>
            </div>
        )
    };
    //Next - Join
    const ConfirmJoin = (): ReactElement => {
        return (
            <Modal title={null} footer={null} width={400} centered={true} closable={false} open={joinBox}>
                <div className="confirm-join">
                    <p>Created successfully</p>
                    <p><CheckCircleOutlined /></p>
                    <p>Whether to jump to Join Child Chain</p>
                    <p>
                        <Button type="default" onClick={() => {
                            setJoinbox(false)
                        }} size="large">Later</Button>
                        <Button type="primary" onClick={() => {
                            props.switchTab(2)
                        }} size="large">Confirm</Button>
                    </p>
                </div>
            </Modal>
        )
    }
    return (
        <div className="creat-content public-content">
            <p className="package-title">Create Child Chain</p>
            <CreateStepOne />
            {/* {
                step === 0 ?  : <CreateStepTwo />
            } */}
            <ConfirmJoin />
        </div>
    )
};


export default CreatView;