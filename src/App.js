import './App.css';
import React, { useEffect, useState } from 'react';
import DataInterface from './DataInterface';

const AuthButton = () => (
  <a href='https://www.arkari.us/albumize/api/user/auth'>
    Provide Spotify API authorization
  </a>
)

const AlbumList = (props) => (
  <div class='albumListGrid'>
    {props.albums.map(album => {return(
      <a href={'https://open.spotify.com/album/' + album.id}>
      <div class='albumListItem'>
        <div><img src={album.images[1].url} alt={album.name + 'album cover'} width="100%" /></div>
        <div class="albumInfo">
          <div class="albumTitle">
            {album.name}</div>
          <div class="artistList">
            {album.artists.map((artist, index) => {return(
            <>
              {(index ? ', ' : '')}
              {artist.name}
            </>
            )})}
          </div>
          <div class="albumType">{album.album_type} -- {album.total_tracks + ' track' + ((album.total_tracks > 1) ? 's' : '')} </div>
        </div>
      </div>
      </a>
    )})}
  </div>
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

  if (data.status == 401) return (<AuthButton />);
  else if (data.err) return (<>{JSON.stringify(data.err)}</>);
  else if (data.albums) return (<AlbumList albums={data.albums} />);
  else return (<>loading</>);
}

export default App;
