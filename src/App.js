import './App.css';
import React, { useEffect, useState } from 'react';
import DataInterface from './DataInterface';
import Cookies from 'js-cookie';
import PersonIcon from '@mui/icons-material/Person';
import ViewListIcon from '@mui/icons-material/ViewList';
import Badge from '@mui/material/Badge';
import Checkbox from '@mui/material/Checkbox';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

function AppBody (props) {
  if (!props.username) return (<AuthRequest />);
  else if (props.data.err) return (<>{JSON.stringify(props.data.err)}</>);
  else {
    return (
      <div class='appBody'>
        <PlaylistSelect selectPlaylist={props.selectPlaylist} />
        {props.loading ? <Loading /> : (props.data.albums ? <AlbumList albums={props.data.albums} update={props.update} /> : '')}
      </div>
    )
  }
}

function Loading() {
  return (<div>loading...</div>)
}

const AuthRequest = () => (
  <a href='https://www.arkari.us/albumize/api/user/auth'>
    Provide Spotify API authorization
  </a>
)

function Header (props) {
  const userPopoverOpen = Boolean(props.userAnchor);
  const userPopoverId = userPopoverOpen ? 'userPopover' : undefined;

  return (
    <div id="header">
      <div id="title">
        <h1>Albumize</h1> 
      </div>
      <div class="menuIcon">
        <Badge badgeContent={props.numAlbums} onClick={props.createNewPlaylist} sx={{width: "100%", height: "100%",
          "& .MuiBadge-badge": {
            color: "black",
            backgroundColor: "#A6D257",
            right: 5,
            top: 8
          }
        }}>
          <ViewListIcon sx={{width:"100%", height:"100%", backgroundColor: '#121212'}} />
        </Badge>
      </div>
      <div class="menuIcon" onClick={props.setUserAnchor} >
        <PersonIcon sx={{width: "100%", height: "100%"}}  />
      </div>
      <Popover 
        id={userPopoverId}
        open={userPopoverOpen}
        anchorEl={props.userAnchor}
        onClose={props.closeUserPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Typography sx={{ p: 2, backgroundColor: '#191919', color: '#F5F5F5' }}>
          You are logged in with Spotify username: {props.username}
        </Typography>
      </Popover>
    </div>
  )
}

function PlaylistSelect (props) {
  return (
    <div id="playlistSelect">
      <select id="playlistDropdown" onChange={(e) => props.selectPlaylist(e.target.value)}>
        <option hidden disabled selected value="">--Select a playlist--</option>
        <option value="releaseradar">Release Radar</option>
        <option value="discoverweekly">Discover Weekly</option>
      </select>
    </div>
  )
}

function AlbumList (props) {
  return(
    <div class='albumListGrid'>
      {props.albums.map(album => (
        <label>
          <div class='albumListItem'>
              <div><img src={album.images[1].url} alt={album.name + ' album cover'} width="100%" height="100%" /></div>
              <div class="albumInfo">
                <div class="albumTitle">
                  {album.name} 
                </div>
                <div class="artistList">{album.artists.map((artist, index) => (
                  <>
                    {(index ? ', ' : '')}
                    {artist.name}
                  </>
                ))}
                </div>
                <div class="albumType">
                  {album.album_type} -- {album.total_tracks + ' track' + ((album.total_tracks > 1) ? 's' : '')}
                </div>
                <div class="albumCheckbox">
                  <Checkbox sx={{color: '#3D473D', '&.Mui-checked': {
                    color: "#A6D257"
                  }}} 
                  onChange={(e) => props.update(album.id,e.target.checked) } />
                </div>
              </div>
          </div>
        </label>
      ))}
    </div>
  );
}

function App() {
  const [data, setData] = useState({});
  const [username] = useState(Cookies.get('username'));
  const [albumsToSend, setAlbumsToSend] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAnchor, setUserAnchor] = useState(null);

  // useEffect(() => {
  //   DataInterface.getReleaseRadarAlbums()
  //     .then((res) => {
  //       setData(res);
  //     })
  //     .catch((res) => {
  //       setData({ err: res });
  //     });
  // }, []);

  const getAlbums = (playlistName) => {
    setLoading(true);
    switch(playlistName) {
      case '':
        setData({});
        setLoading(false);
        break;
      case 'releaseradar':
        DataInterface.getReleaseRadarAlbums()
          .then((res) => {
            setData(res);
          })
          .catch((res) => {
            setData({ err: res });
          })
          .finally((res) => {
            setLoading(false);
          });
          break;
      case 'discoverweekly':
        DataInterface.getDiscoverWeeklyAlbums()
          .then((res) => {
            setData(res);
          })
          .catch((res) => {
            setData({ err: res });
          })
          .finally((res) => {
            setLoading(false);
          });
          break;
      default:
        setLoading(false);
    }
  }

  const updateAlbumsToSend = (id, isChecked) => {
    var albums = albumsToSend;
    if (isChecked) {
      if (!albums.includes(id)) {
        albums = [...albums, id];
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

  const userIconClick = (e) => {
    setUserAnchor(e.currentTarget);
  }

  const closeUserPopover = () => {
    setUserAnchor(null);
  }
  
  return(
    <>
      <Header numAlbums={albumsToSend.length} createNewPlaylist={newPlaylist} userAnchor={userAnchor} setUserAnchor={userIconClick} closeUserPopover={closeUserPopover} username={username} />
       {/*username={username} selectPlaylist={getAlbums} submit={newPlaylist} */} 
      <AppBody data={data} update={updateAlbumsToSend} username={username} selectPlaylist={getAlbums} loading={loading} />
    </>
  )
}

export default App;
