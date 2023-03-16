

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Spin } from "antd";
import { ReactElement, ReactNode, useContext } from "react";
import { Type } from "../../../../utils/type";
import { PWallet } from './../../../../App';

const WaitModal = (): ReactElement<ReactNode> => {
    const { state, dispatch } = useContext(PWallet);
    return (
        <div>
            <Modal title={null} footer={null} width={400} centered={true} closable={false} open={state.waiting?.visible}>
                <div className="wait-modal">
                    <p className="modal-title">
                        Confirm Swap
                    </p>
                    <div className="icon-oper">
                        {
                            state.waiting?.type === 'wait' && <Spin size="large" /> ||
                            state.waiting?.type === 'success' && <CheckCircleOutlined size={30} color="green" /> ||
                            state.waiting?.type === 'error' && <CloseCircleOutlined size={30} color="red" />
                        }

                    </div>
                    <p className="transfer-status">
                        {
                            state.waiting?.type === 'wait' && 'Waiting For Confirmation' ||
                            state.waiting?.type === 'success' && 'Transaction Submitted' ||
                            state.waiting?.type === 'error' && 'Transaction rejected.'
                        }
                    </p>
                    <div className="oper-btn">
                        {
                            state.waiting?.type === 'wait'
                                ? <p className="wait-text">
                                    Confirm this transaction in your wallet.
                                    <br />
                                    <span>Please note Metamask's signature!</span>
                                </p>
                                : <Button type="primary" onClick={() => {
                                    dispatch({
                                        type: Type.SET_WAITING,
                                        payload: {
                                            waiting: {
                                                type: '',
                                                visible: false
                                            }
                                        }
                                    })
                                }}>
                                    {
                                        state.waiting?.type === 'error'
                                            ? 'Dismiss'
                                            : 'Close'
                                    }
                                </Button>
                        }
                    </div>
                </div>
            </Modal>
        </div>
    )
};

export default WaitModal;