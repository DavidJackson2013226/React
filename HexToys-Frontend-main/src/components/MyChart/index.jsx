/* eslint-disable no-loop-func */
import { useEffect, useState } from 'react';
import axios from 'axios'
import moment from 'moment';
import React from 'react';
import { formatNum } from '../../utils';
import './myChart.scss';

import { useParams } from "react-router-dom";

import {
  ComposedChart,
  Bar,
  Brush,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    tradingVolume: 0.92,
    tradingCount: 2,
    time: 1684627200
  },
  {
    tradingVolume: 4.5,
    tradingCount: 5,
    time: 1684713600
  },
  {
    tradingVolume: 6.3,
    tradingCount: 3,
    time: 1684972800
  },
  {
    tradingVolume: 1.2,
    tradingCount: 1,
    time: 1685404800
  },
  {
    tradingVolume: 12.6,
    tradingCount: 10,
    time: 1685577600
  },
  {
    tradingVolume: 15.9,
    tradingCount: 20,
    time: 1686355200
  },
];


function MyChart(props) {
  let { collection, tokenId } = useParams();

  const [minTime, setMinTime] = useState(999999999999999);
  const [maxTime, setMaxTime] = useState(0);
  const [myData, setMyData] = useState([]);

  const [tradings, setTradings] = useState([]);
  const [coinPrice, setCoinPrice] = useState(0.0001);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/trading_history`, {
      params: {
        itemCollection: collection,
        tokenId: tokenId
      }
    })
      .then(res => {
        setTradings(res.data.tradings);
        setCoinPrice(res.data.coinPrice)
      })
      .catch(err => {
        setTradings([])
      })
  }, [collection, tokenId])


  useEffect(() => {
    if (tradings && tradings.length > 0) {
      let tempMinTime = minTime;
      let tempMaxTime = maxTime;
      for (var i = 0; i < tradings?.length; i++) {
        let trading = tradings[i];
        let timestamp = Math.floor((new Date(trading.time).getTime()) / 1000);             
        if (tempMinTime > Number(timestamp)) {  
          tempMinTime = Number(timestamp); 
        }
        if (tempMaxTime < timestamp) {
          tempMaxTime = Number(timestamp);                 
        }
      } 
      console.log('min time:', tempMinTime);
      console.log('max time:', tempMaxTime);
      setMinTime(tempMinTime);
      setMaxTime(tempMaxTime);
    }
  }, [tradings])

  const rows = [
  ];

  useEffect(() => {
    if (tradings && tradings.length > 0) {
      for (var i = minTime; i <= maxTime; i = i + 86400) {
        // let user_wallet = '';
        let row = tradings.filter(trading => Math.floor((new Date(trading.time).getTime()) / 1000) === i)

        let name = '';
        let tradingVolume = 0;
        let tradingCount = 0;
        let avgPrice = 0;


        if (row.length !== 0) {
          name = row[0]?.time;
          tradingVolume = Number(row[0]?.tradingVolume);
          tradingCount = Number(row[0]?.tradingCount);
          avgPrice = tradingCount > 0 ? tradingVolume/tradingCount : 0;          

        } else {
          name = moment(i * 1000).format("YYYY-MM-DD");
          tradingVolume = undefined;
          tradingCount = undefined;
          avgPrice = undefined;
        }
        rows.push({
          name: name,
          tradingVolume: tradingVolume,
          tradingCount: tradingCount,
          avgPrice: avgPrice
        });
        console.log(name, tradingVolume, tradingCount)
      }
      console.log('rows:', rows);
      setMyData(rows)
    }
  }, [minTime, maxTime, tradings])
  const getCount = (label) => {
    return myData.filter(item => item?.name === label)[0]?.tradingCount;
  };


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="vol">{`${formatNum(Number(payload[0].value)/coinPrice)} PLS($${formatNum(Number(payload[0].value))})`}</p>
          <p className="data">{`Avg. price: ${formatNum(Number(payload[0].value)/(Number(getCount(label))*coinPrice))} PLS($${formatNum(Number(payload[0].value)/Number(getCount(label)))})`}</p>
          <p className="count">{`Num. sales: ${getCount(label)}`}</p>
          <p className="data">{label}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className='myChart'>
      {myData && myData.length !== 0 &&
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            width={500}
            height={300}
            data={myData}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"></XAxis>
            <YAxis label={{ value: 'Trading Volume', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#000" />
            <Brush dataKey="name" height={30} stroke="#8884d8" />
            <Bar dataKey="tradingVolume" barSize={20} fill="#f0f" />
            <Line connectNulls /*type="monotone"*/ dataKey="avgPrice" stroke="#ff00ff88" strokeDasharray="3 3" />
          </ComposedChart>
        </ResponsiveContainer>
      }
    </div>
  );
}

export default MyChart;

