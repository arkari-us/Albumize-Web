import './App.css';
import React, { useEffect, useState } from 'react';
import DataInterface from './DataInterface';

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    DataInterface.getAlbums()
      .then((res) => {
        setData(res);
      })
      .catch((res) => {
        setData({ err: 'Error encountered when attempting to fetch data: ' + res });
      });
  }, []);

  return (
    <div>
      <ul>
        <li>Err: {data.err}</li>
        <li>Data: {data ? JSON.stringify(data) : 'No album data'}</li>
      </ul>
    </div>
  );
}

export default App;
