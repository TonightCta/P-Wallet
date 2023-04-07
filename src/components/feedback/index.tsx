import { ReactElement, ReactNode, useEffect, useState } from "react";
import { Button, Modal } from 'antd';
import './index.scss'
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

interface Props {
    visible: boolean,
    title: string,
    pass: boolean,
    retry: () => void,
    text?: string
}

const FeedBackModal = (props: Props): ReactElement<ReactNode> => {
    const [visible, setVisible] = useState<boolean>(false);
    useEffect(() => {
        setVisible(props.visible)
    }, [props.visible])
    return (
        <Modal title={null} footer={null} width={400} centered={true} closable={false} open={visible}>
            <div className="feedback-modal">
                <p>{props.title}</p>
                <p>
                    {
                        props.pass ? <CheckCircleOutlined /> : <CloseCircleOutlined />
                    }
                </p>
                <p>{props.text}</p>
                <p>
                    <Button type="default" size="large" onClick={() => {
                        setVisible(false)
                    }}>CLOSE</Button>
                    {
                        !props.pass && <Button type="primary" size="large" onClick={() => {
                            props.retry();
                            setVisible(false);
                        }}>RETRY</Button>
                    }
                </p>
            </div>
        </Modal>
    )
};

export default FeedBackModal;