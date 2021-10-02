import './App.css';
import React, { useEffect, useState } from 'react';
import DataInterface from './DataInterface';

const AuthButton = () => (
  <a href='https://www.arkari.us/albumize/api/user/auth'>
    Provide Spotify API authorization
  </a>
)

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    DataInterface.getAlbums()
      .then((res) => {
        setData(res);
      })
      .catch((res) => {
        setData({ err: res });
      });
  }, []);

  return (
    <>
      <ul>
        <li>Data: {data ? JSON.stringify(data) : 'No album data'}</li>
      </ul>
      {(data.status==401) ? <AuthButton />  : null }
    </>
  );
}

export default App;
