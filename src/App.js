import './App.css';
import React, { useEffect, useState } from 'react';
import DataInterface from './DataInterface';
import Cookies from 'js-cookie';

const AppBody = (props) => (
  <>
    <div class='appBody'>
      <Header username={props.username} submit={props.submit} />
      <AlbumList albums={props.albums} update={props.update} />
    </div>
  </>
)

const AuthButton = () => (
  <a href='https://www.arkari.us/albumize/api/user/auth'>
    Provide Spotify API authorization
  </a>
)

const Header = (props) => (
  <div>
    <p>Albumize list for user: {props.username} | <button onClick={props.submit}>Create playlist</button></p>
  </div>
)

function AlbumList (props) {

  return(
  <div class='albumListGrid'>
    {props.albums.map(album => {return(
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
          <input type='checkbox' onChange={(e) => props.update(album.id,e.target.checked) } />
        </div>
      </div>
    )})}
  </div>
  );
}

function App() {
  const [data, setData] = useState({});
  const [username] = useState(Cookies.get('username'));
  const [albumsToSend, setAlbumsToSend] = useState([]);

  useEffect(() => {
    DataInterface.getAlbums()
      .then((res) => {
        setData(res);
      })
      .catch((res) => {
        setData({ err: res });
      });
  }, []);

  const updateAlbumsToSend = (id, isChecked) => {
    var albums = albumsToSend;
    if (isChecked) {
      if (!albums.includes(id)) {
        albums.push(id);
      }
    }
    else {
      albums = albums.filter(e => e !== id);
    }

    setAlbumsToSend(albums);
  }

  const newPlaylist = () => {
    if (albumsToSend.length == 0) {
      alert('Please select at least one album to export.');
    }
    else{
      DataInterface.createNewPlaylist(albumsToSend)
        .then((id) => {
          alert(`Playlist created with id ${id}`);
        })
        .catch((err) => {
          alert(`Error creating album: ${err}`)
        });
    }
  }

  if (data.status == 401) return (<AuthButton />);
  else if (data.err) return (<>{JSON.stringify(data.err)}</>);
  else if (data.albums) return (<AppBody albums={data.albums} update={updateAlbumsToSend} submit={newPlaylist} username={username} />);
  else return (<>loading</>);
}

export default App;
