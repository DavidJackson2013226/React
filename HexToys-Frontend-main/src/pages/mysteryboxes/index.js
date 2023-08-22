import React, { useState, useEffect } from "react";
import { useWeb3React } from '@web3-react/core';
import axios from 'axios'
import * as Element from './styles';
import MysteryBoxCard from "../../components/Cards/MysteryBoxCard";
import SearchIcon from '../../assets/images/search-icon.svg';
import Header from '../header/header';
import { Footer } from '../footer/footer'

import ModalCreateMysteryBox from "../../components/modals/modal-create-mysterybox";

function MysteryBoxes(props) {
    const { account } = useWeb3React();
    const [mysteryBoxes, setMysteryBoxes] = useState([]);
    const [page, setPage] = useState(1);
    const [noMysteryBoxes, setNoMysteryBoxes] = useState(false);
    const [initialMysteryBoxesLoaded, setInitialMysteryBoxesLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    const [searchTxt, setSearchTxt] = useState("");

    useEffect(() => {
        setMysteryBoxes([])
        setNoMysteryBoxes(false)
        setInitialMysteryBoxesLoaded(false)
        setLoading(true)
        setPage(1)
        fetchMysteryBoxes(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, searchTxt])

    useEffect(() => {
        setLoading(true)
        if (initialMysteryBoxesLoaded) {
            fetchMysteryBoxes(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    function fetchMysteryBoxes(reset) {
        let queryUrl = `${process.env.REACT_APP_API}/mysteryboxes?page=${reset ? 1 : page}${searchTxt ? '&searchTxt=' + searchTxt : ''}`

        axios.get(queryUrl)
            .then(res => {
                setLoading(false)
                if (res.data.mysteryboxes.length === 0) setNoMysteryBoxes(true)
                if (reset) {
                    setMysteryBoxes(res.data.mysteryboxes)
                    setInitialMysteryBoxesLoaded(true)
                } else {
                    let prevArray = JSON.parse(JSON.stringify(mysteryBoxes))
                    prevArray.push(...res.data.mysteryboxes)
                    setMysteryBoxes(prevArray)
                }

            })
            .catch(err => {
                setLoading(false)
                if (err.response.data.message === 'No MysteryBoxes found') {
                    setNoMysteryBoxes(true)
                }
            })
    }

    function loadMore() {
        if (!loading) {
            setPage(page => { return (page + 1) })
        }
    }

    const [showCreateMysteryBox, setShowCreateMysteryBox] = useState(false);

    return (

        <div>
            <Header {...props}/>
            <Element.Container>
                <h1>Mystery Boxes
                    {
                        account && 
                        <span onClick={() => setShowCreateMysteryBox(true)}>+</span>
                    }
                </h1>

                <Element.BodyContainer>
                    <div className="filterBox">
                        <div className="mysterybox-box">
                            <input type="text" value={searchTxt} className="form-search" style={{ backgroundImage: `url(${SearchIcon})` }} placeholder="Search MysteryBoxes"
                                onChange={event => { setSearchTxt(event.target.value) }} />
                        </div>
                    </div>
                    <div className="all-mysteryboxes">
                        {mysteryBoxes.map((mysteryBox, index) => (
                            <MysteryBoxCard {...props} mysterybox={mysteryBox} key={index} />
                        ))}
                    </div>
                    <div className="load-more" style={{ display: noMysteryBoxes ? "none" : "" }}>
                        <button onClick={() => loadMore()} className="" type="primary" >
                            {loading ? "Loading..." : "Load more"}
                        </button>
                    </div>
                </Element.BodyContainer>                
            </Element.Container>
            <Footer />  
            <ModalCreateMysteryBox
                showCreateMysteryBox={showCreateMysteryBox}
                setShowCreateMysteryBox={setShowCreateMysteryBox}
            />            
        </div>
    );

}

export default MysteryBoxes
