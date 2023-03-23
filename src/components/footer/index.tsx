import { ReactElement, ReactNode } from "react";
import './index.scss'

export interface Community {
    img: string,
    url: string,
    width: number,
    height: number
}

export const com: Community[] = [
    {
        img: require('../../assets/images/github.png'),
        url: 'https://www.baidu.com',
        width: 24,
        height: 24
    },
    {
        img: require('../../assets/images/telegram.png'),
        url: 'https://www.baidu.com',
        width: 24,
        height: 20,
    },
    {
        img: require('../../assets/images/twitter.png'),
        url: 'https://www.baidu.com',
        width: 30,
        height: 24
    },
    {
        img: require('../../assets/images/medium.png'),
        url: 'https://www.baidu.com',
        width: 24,
        height: 24,
    },
    {
        img: require('../../assets/images/reddit.png'),
        url: 'https://www.baidu.com',
        width: 28,
        height: 24
    },
]

const Footer = (): ReactElement<ReactNode> => {

    return (
        <div className="footer-wapper">
            <div className="left-msg">
                <img src={require('../../assets/images/logo.png')} alt="" />
                <p>
                    <span>2023 PLIAN Project</span>
                    <br />
                    <span>© All rights reserved</span>
                </p>
            </div>
            <div className="right-com">
                <ul>
                    {
                        com.map((item: Community, index: number) => {
                            return (
                                <li key={index} onClick={() => {
                                    window.open(item.url)
                                }}>
                                    <img style={{ width: `${item.width}px`, height: `${item.height}px` }} src={item.img} alt="" />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
};

export default Footer;