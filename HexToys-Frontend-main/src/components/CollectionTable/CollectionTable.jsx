import './style.scss'

import moment from 'moment';
import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
// import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { formatNum, putCommas } from "../../utils";


// import coin1 from '../../assets/images/icon_eth.svg';
// import coin2 from '../../assets/images/icon_polygon.svg';
// import coin3 from '../../assets/images/icon_immutable.svg';
// import coin4 from '../../assets/images/icon_tezos.svg';

import verified from "../../assets/images/verified-icon_01.svg";
import VideoImageContentCard from '../Cards/VideoImageContentCard';


const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: '#',
  },
  {
    id: 'collection',
    numeric: false,
    disablePadding: false,
    label: 'COLLECTION',
  },
  {
    id: 'floor_price',
    numeric: true,
    disablePadding: false,
    label: 'FLOOR PRICE',
  },
  {
    id: 'floor_change',
    numeric: true,
    disablePadding: false,
    label: 'FLOOR CHANGE',
  },
  {
    id: 'volume',
    numeric: true,
    disablePadding: false,
    label: 'VOLUME',
  },
  {
    id: 'volume_change',
    numeric: true,
    disablePadding: false,
    label: 'VOLUME CHANGE',
  },
  {
    id: 'items',
    numeric: true,
    disablePadding: false,
    label: 'ITEMS',
  },
  {
    id: 'owners',
    numeric: true,
    disablePadding: false,
    label: 'OWNERS',
  },
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            <TableSortLabel>
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


export default function CollectionTable() {

  const [timeFilter, setTimeFilter] = useState('1d')
  //  const [coinFilter, setCoinFilter] = useState('eth')
  const [floorMin, setFloorMin] = useState(0)
  const [floorMax, setFloorMax] = useState(0)

  const changeFloorMin = (e) => {
    setFloorMin(parseFloat(e.target.value));
  };

  const changeFloorMax = (e) => {
    setFloorMax(parseFloat(e.target.value));
  };


  const [collections, setCollections] = useState([]);
  const [stat, setStat] = useState(null);
  const [collectionCount, setCollectionCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCollections([]);
    setLoading(true);
    setPage(0);
    fetchCollections(true);
  }, [timeFilter, floorMin, floorMax, rowsPerPage])

  useEffect(() => {
    setLoading(true);
    fetchCollections(false);
  }, [page])

  function fetchCollections(reset) {
    let paramData = { limit: rowsPerPage }

    switch (timeFilter) {
      case '1h':
        paramData.timestamp = 3600;
        break;

      case '1d':
        paramData.timestamp = 86400;
        break;

      case '7d':
        paramData.timestamp = 604800;
        break;

      case '30d':
        paramData.timestamp = 2592000;
        break;

      default:
        break;
    }

    if (floorMin > 0) {
      paramData.floorMin = floorMin;
    }

    if (floorMax > 0) {
      paramData.floorMax = floorMax;
    }

    if (reset) {
      paramData.page = 1;
    } else {
      paramData.page = page + 1;
    }

    axios.get(`${process.env.REACT_APP_API}/top_collections`, {
      params: paramData
    })
      .then(res => {
        setCollectionCount(res.data.count);
        setLoading(false);
        setCollections(res.data.collections);
      })
      .catch(err => {
        setLoading(false);
        setCollections([]);
        console.log(err);
      })

    axios.get(`https://backapi.hex.toys/admin-routes/api/overview`)
      .then(res => {
        if (res?.data?.overview) setStat(res.data.overview)
      })
      .catch(err => {
        setStat(null)
      })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const [emptyRows, setEmptyRows] = useState(0);
  useEffect(() => {
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - collectionCount) : 0);
  }, [page, rowsPerPage, collectionCount])

  return (
    <div className='table_div'>
      <div className="filter_div">
        <div className='info_div'>
          <div className="btn_div">
            <button className={timeFilter === '1h' ? 'active' : ''} onClick={() => setTimeFilter('1h')}>1H</button>
            <button className={timeFilter === '1d' ? 'active' : ''} onClick={() => setTimeFilter('1d')}>1D</button>
            <button className={timeFilter === '7d' ? 'active' : ''} onClick={() => setTimeFilter('7d')}>7D</button>
            <button className={timeFilter === '30d' ? 'active' : ''} onClick={() => setTimeFilter('30d')}>30D</button>
          </div>

          {/* <div className="btn_div">
          <button className={coinFilter === 'eth' ? 'active' : ''} onClick={() => setCoinFilter('eth')}>
            <img src={coin1} alt="" />
          </button>
          <button className={coinFilter === 'polygon' ? 'active' : ''} onClick={() => setCoinFilter('polygon')}>
            <img src={coin2} alt="" />
          </button>
          <button className={coinFilter === 'immubale' ? 'active' : ''} onClick={() => setCoinFilter('immubale')}>
            <img src={coin3} alt="" />
          </button>
          <button className={coinFilter === 'tezos' ? 'active' : ''} onClick={() => setCoinFilter('tezos')}>
            <img src={coin4} alt="" />
          </button>
        </div> */}
          <div className="btn_div">
            <p>Floor price</p>
            <input type="number" placeholder='Min' onChange={changeFloorMin} />
            <p>-</p>
            <input type="number" placeholder='Max' onChange={changeFloorMax} />
            <button className='btn'>PLS</button>
          </div>
          <div className="stat_div">
            <p>Total Volume</p>
            <p className='stat_attr'>{formatNum(stat?.tradingVolume / stat?.coinPrice || 0)} PLS({formatNum(stat?.tradingVolume || 0)} USD)</p>
          </div>
          <div className="stat_div">
            <p>Collections</p>
            <p className='stat_attr'>{putCommas(stat?.collectionCount || 0)}</p>
          </div>
          <div className="stat_div">
            <p>Total Items</p>
            <p className='stat_attr'>{putCommas(stat?.itemCount || 0)}</p>
          </div>
          <div className="stat_div">
            <p>Total Users </p>
            <p className='stat_attr'>{putCommas(stat?.userCount || 0)}</p>
          </div>
        </div>

        <div className="page_div">
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50]}
            component="div"
            count={collectionCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
      <div className="mytable">
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>

            <TableContainer>
              <Table
                sx={{ minWidth: 750, margin: 'auto', width: '96%' }}
                aria-labelledby="tableTitle"
              >
                <EnhancedTableHead />
                {
                  loading ?
                    <TableBody>
                      <TableRow>
                        <TableCell
                          component="th"
                          scope="row"
                          padding="none"
                          colSpan={10}
                        >
                          <div className="loadingCell" style={{ height: `${rowsPerPage * 77}px` }}>
                            <span>Loading...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                    :
                    collections.length > 0 ?
                      <TableBody>
                        {
                          collections.map((collection, index) => {
                            return (
                              <TableRow
                                hover
                                tabIndex={-1}
                                key={index}
                              >
                                <TableCell align="right">
                                  <div className="myCell left" >
                                    <p>{index + page * rowsPerPage}</p>
                                  </div>
                                </TableCell>
                                <TableCell align="left" onClick={() => window.open(`/collection/${collection.chainId}/${collection.address}`)}>
                                  <div className="myCell" >
                                    <div className="img_div">
                                      <VideoImageContentCard url={collection.image} type='image' />
                                      {/* <img src={verified} alt="" className='verify' /> */}
                                    </div>
                                    <p style={{ cursor: 'pointer' }}>{collection.name}</p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p>{formatNum(Number(collection.floorPrice) / Number(collection.coinPrice))} PLS(${formatNum(Number(collection.floorPrice))})</p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p style={{
                                      color: `${collection.prevTradingCount > 0 ?
                                        collection.floorPrice < (collection.prevTradingVolume / collection.prevTradingCount)
                                          ? 'red'
                                          : 'green'
                                        : 'black'}`
                                    }}>
                                      {
                                        Number(collection.prevTradingCount) > 0 ?
                                          formatNum((Number(collection.floorPrice) - Number(collection.prevTradingVolume) / Number(collection.prevTradingCount)) * 100.0 / (Number(collection.prevTradingVolume) / Number(collection.prevTradingCount))) + "%"
                                          :
                                          "--"
                                      }
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p>{formatNum(collection.tradingVolume / collection.coinPrice)} PLS(${formatNum(collection.tradingVolume)})</p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p style={{
                                      color: `${collection.prevTradingVolume > 0 ?
                                        collection.tradingVolume < collection.prevTradingVolume
                                          ? 'red'
                                          : 'green'
                                        : 'black'}`
                                    }}>
                                      {
                                        collection.prevTradingVolume > 0 ?
                                          formatNum((collection.tradingVolume - collection.prevTradingVolume) * 100.0 / collection.prevTradingVolume) + "%"
                                          :
                                          "--"
                                      }
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p>{collection.totalItemCount}</p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p>{collection.totalOwners}</p>
                                  </div>
                                </TableCell>

                              </TableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow>
                            <TableCell
                              component="th"
                              scope="row"
                              padding="none"
                              colSpan={10}
                            >
                              <div className="loadingCell" style={{ height: `${emptyRows * 77}px` }}>

                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody> :
                      <TableBody>
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            colSpan={10}
                          >
                            <div className="loadingCell" style={{ height: `${rowsPerPage * 77}px` }}>
                              <span>No Data</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>

                }
              </Table>
            </TableContainer>
            {/* <div className="bottom">
            </div> */}
          </Paper>
        </Box>
      </div>
    </div>
  )
}