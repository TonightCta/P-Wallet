import { Button } from "antd";
import { ReactElement, ReactNode, useContext, useState } from "react";
import { DecimalToHex, error } from "../../../../utils";
import { PWallet } from './../../../../App';
import { useChain } from './../../../../utils/hooks';
import FeedBackModal from "../../../../components/feedback";

interface Input {
    from: string,
    chain_id: string,
    amount: number | string
}

const InputSource: Input = {
    from: '',
    chain_id: '',
    amount: ''
}

const EditView = (): ReactElement<ReactNode> => {
    const { state } = useContext(PWallet);
    const { set } = useChain();
    const [visible, setVisible] = useState<boolean>(false);
    const [pass,setPass] = useState<boolean>(false);
    const [input, setInput] = useState<Input>({
        ...InputSource,
        from: state.address ? state.address as string : 'Wallet not connected',
        chain_id:state.last_creat as string
    });
    const submitSet = async () => {
        if (!input.chain_id) {
            error('Please enter chain id');
            return
        };
        if (!input.amount) {
            error('Please enter reward amount');
            return
        };
        const params = {
            _chain_id: input.chain_id,
            _reward: DecimalToHex(input.amount as number)
        }
        const result = await set(params);
        setVisible(true)
        setPass(result ? true : false);
        result && setInput({
            ...InputSource,
            from: state.address as string
        })
    }
    return (
        <div className="edit-content public-content">
            <p className="package-title">Set Block Reward</p>
            <div className="public-input">
                <ul>
                    <li>
                        <p className="lable">From</p>
                        <p>
                            <input type="text" value={input.from} readOnly placeholder="Address" />
                        </p>
                    </li>
                    <li>
                        <p className="lable">Chain ID</p>
                        <p>
                            <input type="text" value={input.chain_id} onChange={(e) => {
                                setInput({
                                    ...input,
                                    chain_id: e.target.value
                                })
                            }} placeholder="Chain ID" />
                        </p>
                    </li>
                    <li>
                        <p className="lable">Reward Amount(PI)</p>
                        <p>
                            <input type="number" value={input.amount} onChange={(e) => {
                                setInput({
                                    ...input,
                                    amount: e.target.value
                                })
                            }} onWheel={event => event.currentTarget.blur()} placeholder="Reward Amoun" />
                            <span className="right-lable">Pi</span>
                        </p>
                    </li>
                    <li>
                        <Button block onClick={() => {
                            submitSet()
                        }} type="primary">{'Confirm'.toUpperCase()}</Button>
                    </li>
                </ul>
            </div>
            <FeedBackModal title={`Set ${pass ? 'Success' : 'Failed'}`} visible={visible} pass={pass} retry={() => {
                submitSet()
            }} />
        </div>
    )
};

export default EditView;