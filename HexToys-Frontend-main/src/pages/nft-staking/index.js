import React, { useState, useEffect } from "react";
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { PlusCircleOutlined } from "@ant-design/icons";
import * as Element from './styles';

import Header from '../header/header';
import { Footer } from '../footer/footer'

import StakingItem from "../../components/StakingItem";
import ModalCreateStaking from '../../components/modals/modal-create-staking';
import Checkbox from "antd/lib/checkbox/Checkbox";

function NftStaking(props) {
    const [stakedOnly, setStakedOnly] = useState(false);
    const [finishStatus, setFinishStatus] = useState(false);
    const [sortText, setSortText] = useState('Hot');
    const [searchTxt, setSearchTxt] = useState('');

    const networkOptions = [
        // { value: 0, label: 'All Networks' },
        { value: 369, label: 'PulseChain' },
    ];
    const [selectedChainId, setSelectedChainId] = useState(369);

    const { account, chainId } = useWeb3React();

    const [stakings, setStakings] = useState([]);
    const [page, setPage] = useState(1);
    const [noStakings, setNoStakings] = useState(false);
    const [initialItemsLoaded, setInitialItemsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    const [showCreateStaking, setShowCreateStaking] = useState(false);

    useEffect(() => {
        setStakings([]);
        setNoStakings(false)
        setInitialItemsLoaded(false);
        setLoading(true);
        setPage(1);
        fetchStakings(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stakedOnly, finishStatus, sortText, searchTxt, account, selectedChainId])

    useEffect(() => {
        setLoading(true)
        if (initialItemsLoaded) {
            fetchStakings(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    function fetchStakings(reset) {
        let paramData = {
            finishStatus: finishStatus
        }
        if (selectedChainId > 0) {
            paramData.chainId = selectedChainId;
        }
        if (account) {
            paramData.account = account;
        }
        
        if (stakedOnly) {
            paramData.stakedOnly = stakedOnly;                       
        }
        if (searchTxt) {
            paramData.search = searchTxt;
        }

        switch (sortText) {
            case 'Hot':
                paramData.sortBy = 'hot';
                break;
            case 'APR':
                paramData.sortBy = 'apr';
                break;
            case 'Total Staked':
                paramData.sortBy = 'total_staked';
                break;
            case 'Name':
                paramData.sortBy = 'name';
                break;
            default:
                break;
        }

        if (reset) {
            paramData.page = 1;
        } else {
            paramData.page = page;
        }

        axios.get(`${process.env.REACT_APP_API}/stakings`, {
            params: paramData
        })
            .then(res => {
                setLoading(false)
                if (res.data.stakings.length === 0) setNoStakings(true)
                if (reset) {
                    setStakings(res.data.stakings)
                    setInitialItemsLoaded(true)
                } else {
                    let prevArray = JSON.parse(JSON.stringify(stakings))
                    prevArray.push(...res.data.stakings)
                    setStakings(prevArray)
                }
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
                setNoStakings(true)
            })
    }

    function loadMore() {
        if (!loading) {
            setPage(page => { return (page + 1) })
        }
    }

    return (

        <div>
            <Header {...props} />
            <Element.Container>
                <h1>NFT Staking
                    {
                        account &&
                        <PlusCircleOutlined onClick={() => setShowCreateStaking(true)} />
                    }
                </h1>

                <Element.BodyContainer>
                    <Element.FilterBox>
                        <Element.FilterContainer>
                            <Element.Searchbar>
                                <input type='text' placeholder="Search"
                                    onChange={e => setSearchTxt(e.target.value)} value={searchTxt} />

                            </Element.Searchbar>
                            <Element.Searchbar>
                                <div className="totalcard">
                                    <select
                                        value={selectedChainId} onChange={event => setSelectedChainId(event.target.value)}>
                                        {
                                            networkOptions.map((networkOption, index) =>
                                                <option key={index} value={networkOption.value}>{networkOption.label}</option>
                                            )
                                        }
                                    </select>
                                </div>
                                <div className="totalcard">
                                    <select
                                        defaultValue={sortText} onChange={event => setSortText(event.target.value)}>
                                        <option value="Hot">Hot</option>
                                        <option value="APR">APR</option>
                                        <option value="Total Staked">Total Staked</option>
                                        <option value="Name">Name</option>
                                    </select>
                                </div>
                            </Element.Searchbar>
                        </Element.FilterContainer>
                        <Element.RowContainer>
                            {
                                account && chainId &&
                                <Element.CheckBoxContainer>
                                    <Checkbox
                                        checked={stakedOnly}
                                        onChange={(event) => setStakedOnly(event.target.checked)}
                                    />
                                    <p>
                                        Staked Only
                                    </p>
                                </Element.CheckBoxContainer>
                            }

                            <Element.TabingWrap>
                                <li className={finishStatus ? '' : 'active'}
                                    onClick={() => setFinishStatus(false)}>
                                    Live
                                </li>
                                <li className={finishStatus ? 'active' : ''}
                                    onClick={() => setFinishStatus(true)}>
                                    Finished
                                </li>
                            </Element.TabingWrap>
                        </Element.RowContainer>

                    </Element.FilterBox>
                    <Element.AllStaking>
                        {stakings.map((staking, index) =>
                            <StakingItem staking={staking} key={index} />
                        )}
                    </Element.AllStaking>
                    <Element.LoadMore style={{ display: noStakings ? "none" : "" }}>
                        <button onClick={() => loadMore()} className="" type="primary" >
                            {loading ? "Loading..." : "Load More"}
                        </button>
                    </Element.LoadMore>
                </Element.BodyContainer>
            </Element.Container>
            <Footer />
            <ModalCreateStaking
                showCreateStaking={showCreateStaking}
                setShowCreateStaking={setShowCreateStaking}
            />
        </div>
    );

}

export default NftStaking
