import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Modal from '../components/Modal';
import Navbar from '../components/Navbar';
import ContactUs from '../components/ContactUs'
import DeleteVin from '../components/DeleteVin';
import SolutionDelCar from '../components/SolutionDelCar';
import Summary from '../components/Summary';

import { Buffer } from 'buffer';
import { CarContext } from '../App';
import SayAboutUs from '../components/SayAboutUs';
import LiveChat from '../components/LiveChat';

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [vin, setVin] = useState('');
    const carContext = useContext(CarContext);
    const navigate = useNavigate();
    // const vin = "WBS43AZ06PCM17173";

    const onclick = (paraVin) => {
        setShowModal(true);
        fetch('https://api.serphouse.com/serp/live', {
            method: 'POST',
            body: JSON.stringify({
                data:{
                    "q": `${paraVin}`,
                    "domain": "google.com",
                    "loc": "Abernathy,Texas,United States",
                    "lang": "en",
                    "device": "desktop",
                    "serp_type": "web",
                    "page": "1",
                    "verbatim": "0"
                }
             }),
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "authorization": "Bearer Q6T4jm4azC4VLJmJeMCbqJM6xLXu34EPaqR8mLakdlKGiMxMjdon0kkZsDOO"
            },
        })
        .then(async (response) => {
            const reader = response.body.getReader();
            let chunks = [];
            while (true) {
              const {value, done} = await reader.read();
              if (done) break;
              chunks.push(value);
            }     
            const body = Buffer.concat(chunks).toString();
            const data = JSON.parse(body);
            console.log(data);
            setShowModal(false);
            carContext.setCarInfo(data);
            if (data.results.results.organic && data.results.results.inline_images) {
                const organics = data.results.results.organic;
                const vinValid = organics.some(organic => {
                    return organic.title.includes(vin)
                });
                if (vinValid) {
                    navigate('/detail', {reaplce: true});
                }else {
                    alert("Your VIN is invalid.");
                }
            } else {
                alert("Your VIN is invalid.")
            }

        })
        .catch((err) => {
            setShowModal(false);
             console.log(err.message);
        });
        //
        // navigate('/about', {reaplce: true});
    };

    return (
        <div id="home">
            <Navbar/>
            <SolutionDelCar onclick={onclick} setVin={setVin}/>
            <DeleteVin/>
            <Summary/>
            <SayAboutUs />
            <ContactUs/>
            <LiveChat />
            {showModal ? <Modal vin={vin} />: null}

        </div>
    )
};

export default Home;