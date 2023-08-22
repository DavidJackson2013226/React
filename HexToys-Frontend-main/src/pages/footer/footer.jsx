import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import socialImg1 from "../../assets/images/social-icon-1.svg";
import socialImg2 from "../../assets/images/social-icon-2.svg";
import socialImg3 from "../../assets/images/social-icon-3.svg";
import socialImg4 from "../../assets/images/social-icon-4.svg";
import socialImg5 from "../../assets/images/social-icon-5.png";
import socialImg6 from "../../assets/images/social-icon-6.svg";
import githubSvg from "../../assets/images/github-icon.svg";
import logo from "../../assets/images/logo.png";
import './footer.scss';

export class Footer extends Component {
    render() {
        return (
            <div className='footer'>
                <div className='container'>
                    
                    <div className='footer_links'>
                        <div className='logo'>
                            <Link  to="/" ><img src={logo} alt=''/></Link>
                        </div>
                        <ul>
                            <li className='link-title'><Link  to="/">Community</Link></li>
                            <li><a href="https://discord.gg/GewKYcJJ" target="_blank" rel="noreferrer">Discord</a></li>
                            <li><a href="https://twitter.com/HEXTOYSOFFICIAL" target="_blank" rel="noreferrer">Twitter</a></li>
                            <li><a href="https://www.instagram.com/hextoysofficial/" target="_blank" rel="noreferrer">Instagram </a></li>
                            <li><a href="https://t.me/hextoys" target="_blank" rel="noreferrer">Telegram</a></li>                            
                        </ul>
                        <ul>
                            <li className='link-title'><Link  to="/">Info</Link></li>                            
                            <li><a href="https://blog.hex.toys/" target="_blank" rel="noreferrer">Blog </a></li>
                        </ul>
                        <ul>
                            <li className='link-title'><Link  to="/">Support </Link></li>
                            <li><a href="https://support.hex.toys/" target="_blank" rel="noreferrer">Help </a></li>                            
                            <li><a href="https://github.com/orgs/Hex-Toys/discussions" target="_blank" rel="noreferrer">Discussion </a></li>                            
                        </ul>
                    </div>
                    <div className='line'></div>
                    <div className='bottom'>
                        <p>Copyright © 2023 HEX TOYS</p>
                        <ul className='social-icons'>
                            <li>
                                <a  href="https://www.instagram.com/hextoysofficial" target="_blank" rel="noreferrer">
                                    <img src={socialImg1} alt=''/>
                                </a>
                            </li>
                            <li>
                                <a  href="https://twitter.com/HEXTOYSOFFICIAL" target="_blank" rel="noreferrer">
                                    <img src={socialImg2} alt=''/>
                                </a>
                            </li>
                            <li>
                                <a  href="https://t.me/hextoys" target="_blank" rel="noreferrer">
                                    <img src={socialImg3} alt=''/>
                                </a>
                            </li>
                            <li>
                                <a  href="https://scan.pulsechain.com/token/0x158e02127C02Dce2a9277bdc9F1815C91F08E812/token-transfers" target="_blank" rel="noreferrer">
                                    <img src={socialImg4} alt=''/>
                                </a>
                            </li>
                            <li>
                                <a  href="https://uk.trustpilot.com/review/hex.toys" target="_blank" rel="noreferrer">
                                    <img src={socialImg5} alt=''/>
                                </a>
                            </li>
                            <li>
                                <a  href="https://github.com/orgs/Hex-Toys/discussions" target="_blank" rel="noreferrer">
                                    <img src={githubSvg} alt=''/>
                                </a>
                            </li>                            
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}


