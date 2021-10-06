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

  if (data.status == 401)
    return (<AuthButton />);
  else if (data.err) return (<>{JSON.stringify(data.err)}</>);
  else if (data.albums) return (
    <>
      <ul>
        {data.albums.map(album => {return(
          <li key={album.id}>
            <a href={'https://open.spotify.com/album/' + album.id}>
              {album.name}
            </a>
            &nbsp;--&nbsp;
            {album.artists.map((artist, index) => {return(
              <>
                {(index ? ', ' : '')}
                <a href={artist.external_urls.spotify}>
                  {artist.name}
                </a>
              </>
            )})}
            <br />
            {album.album_type} -- {album.total_tracks + ' track' + ((album.total_tracks > 1) ? 's' : '')} 
          </li>
        )})}
      </ul>
    </>
  );
  else
    return (<>loading</>);
}

export default App;
