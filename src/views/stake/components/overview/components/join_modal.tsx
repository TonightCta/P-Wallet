import { Button, Modal } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { PWallet } from './../../../../../App';
import { error } from './../../../../../utils/index';
import { useStake } from './../../../../../utils/hooks';
import ModalBox from './../../../../../components/modal/index';

interface Props {
    address: string,
    visible: number,
    cancel?: boolean,
    onClose: (val: number) => void,
    max?: number
}

interface Input {
    address: string,
    amount: number | string,
}

interface Result {
    visible: number,
    title: string,
    text: string,
    type: string
}

const JoinModal = (props: Props) => {
    const { state } = useContext(PWallet);
    const [visible, setVisible] = useState<boolean>(false);
    const [result, setResult] = useState<Result>({
        visible: 0,
        title: '',
        text: '',
        type: ''
    })
    const { join, cancel } = useStake();
    const [input, setInput] = useState<Input>({
        address: props.address,
        amount: '',
    });
    useEffect(() => {
        props.visible === 1 && setVisible(true)
    }, [props.visible]);
    //加入质押
    const submitJoin = async () => {
        if (!input.amount) {
            error('Please enter amount');
            return
        };
        if (input.amount < 1000) {
            error('Delegation amount must be greater or equal to 1000 PI');
            return
        }
        if (state.default_chain === '2099156' && state.account_balance?.main_balance as number < 1000) {
            error('Your PI balance is insufficient.');
            return
        }
        if (state.default_chain === '8007736' && state.account_balance?.child_balance as number < 1000) {
            error('Your PI balance is insufficient.');
            return
        };
        const result = await join(props.address, input.amount as number);
        setResult({
            visible: 1,
            title: result ? 'Already Submitted' : 'Failed To Join',
            type: result ? 'success' : 'error',
            text: result ? 'Your application has been submitted, please wait for block confirmation' : 'Block exception, please try again later'
        });
        setVisible(false);
    };
    // 取消质押
    const submitCancel = async () => {
        if (!input.amount) {
            error('Please enter amount');
            return
        }
        if (input.amount > (props.max as number)) {
            error(`The maximum amount that can be canceled is ${props.max} PI`)
            return
        };
        const result = await cancel(props.address, input.amount as number);
        setResult({
            visible: 1,
            title: result ? 'Already Submitted' : 'Failed To Cancel',
            type: result ? 'success' : 'error',
            text: result ? 'Your application has been submitted, please wait for block confirmation' : 'Block exception, please try again later'
        });
        setVisible(false);
    }
    useEffect(() => {
        !visible && setInput({
            ...input,
            amount: ''
        })
    }, [visible])
    return (
        <div>
            <Modal title={null} footer={null} width={500} centered={true} closable={false} open={visible}>
                <div className="join-modal">
                    <p className="modal-title">{props.cancel ? 'Confirm To Cancel' : 'Confirm To Join'}</p>
                    <ul>
                        <li>
                            <p className="input-lable">Address</p>
                            <input type="text" readOnly value={props.address} />
                        </li>
                        <li>
                            <p className="input-lable">Amount</p>
                            <input type="number" placeholder={`${props.cancel ? `max:${props.max}` : 'min:1000'}`} value={input.amount} onChange={(e) => {
                                setInput({
                                    ...input,
                                    amount: e.target.value
                                })
                            }} />
                        </li>
                        <li>
                            <Button type="default" size="large" onClick={() => {
                                setVisible(false);
                                props.onClose(0)
                            }}>CLOSE</Button>
                            <Button type="primary" size="large" onClick={() => {
                                props.cancel ? submitCancel() : submitJoin()
                            }}>CONFIRM</Button>
                        </li>
                    </ul>
                </div>
            </Modal>
            <ModalBox visible={result.visible} icon close title={result.title} text={result.text} type={result.type} onClose={(val: number) => {
                setResult({
                    ...result,
                    visible: val
                })
            }} />
        </div>
    )
};

export default JoinModal;