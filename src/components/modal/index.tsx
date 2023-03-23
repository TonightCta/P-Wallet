import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button,Modal } from "antd";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { error } from "../../utils";
import './index.scss'

interface Props {
    title: string,
    visible: number,
    type?: string,
    text: string,
    install?: boolean,
    close?: boolean,
    icon?: boolean,
    onClose: (val: number) => void
}

const BoxModal = (props: Props): ReactElement<ReactNode> => {
    const [visible, setVisible] = useState<boolean>(false);
    useEffect(() => {
        props.visible === 1 && setVisible(true)
    }, [props.visible])
    return (
        <Modal title={null} footer={null} width={400} centered={true} closable={false} open={visible}>
            <div className="public-modal">
                <p className="modal-title">{props.title}</p>
                {props.icon && <p className="modal-icon">
                    {
                        props.type === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />
                    }
                </p>}
                <p className="modal-text">{props.text}</p>
                <p>
                    {
                        props.close && <Button type="primary" size="large" onClick={() => {
                            props.onClose(0)
                            setVisible(false)
                        }}>CLOSE</Button> ||
                        props.install && <Button type="primary" size="large" onClick={() => {
                            const u = navigator.userAgent;
                            const browser = {
                                webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
                                gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
                            };
                            if (browser.webKit) {
                                window.open(
                                    "https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn"
                                );
                            } else if (browser.gecko) {
                                window.open(
                                    "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
                                );
                            } else {
                                error('The current browser does not support the use of MetaMask.');
                            }
                        }}>INSTALL NOW</Button>
                    }
                </p>
            </div>
        </Modal>
    )
};

export default BoxModal;
