import './App.css';
import React, { useEffect, useState } from 'react';
import DataInterface from './DataInterface';
import PersonIcon from '@mui/icons-material/Person';
import ViewListIcon from '@mui/icons-material/ViewList';
import Badge from '@mui/material/Badge';
import Checkbox from '@mui/material/Checkbox';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';

function AppBody(props) {
  const [hideAlreadyExported, setHideAlreadyExported] = useState(false);

  const albums = hideAlreadyExported ? props.albums.filter(album => {
    return !album.alreadyExported;
  }) : props.albums;

  const updateSelectAll = (checked) => {
    props.setAlbumsToSend(checked ? albums : []);
  }

  const updateHideAlreadyExported = (checked) => {
    setHideAlreadyExported(checked);
    if (checked) {
      props.setAlbumsToSend(props.albumsToSend.filter(album => {
        return !album.alreadyExported;
      }));
    }
  }

  if (props.loading) return (<Loading />);
  else if (!props.username) return (<AuthRequest />);
  else if (props.err) return (<>{JSON.stringify(props.err)}</>);
  else {
    return (
      <div class='appBody'>
        <PlaylistSelect
          selectPlaylist={props.selectPlaylist}
          updateSelectAll={updateSelectAll}
          selectedAll={albums.length == props.albumsToSend.length}
          loadedAlbums={props.loadedAlbums}
          hideAlreadyExported={hideAlreadyExported}
          updateHideAlreadyExported={updateHideAlreadyExported}
        />
        {props.loadingAlbums ?
          <Loading /> :
          (props.albums ?
            <AlbumList
              albums={albums}
              albumsToSend={props.albumsToSend}
              update={props.update}
              hideAlreadyExported={hideAlreadyExported}
            /> :
            '')
        }
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

function Header(props) {
  const userPopoverOpen = Boolean(props.userAnchor);
  const userPopoverId = userPopoverOpen ? 'userPopover' : undefined;

  return (
    <div id="header">
      <div id="title">
        <h1>Albumize</h1>
      </div>
      <div class="menuIcon" onClick={props.openExportList}>
        <Badge badgeContent={props.numAlbums} sx={{
          width: "100%", height: "100%",
          "& .MuiBadge-badge": {
            color: "black",
            backgroundColor: "#A6D257",
            right: 5,
            top: 8
          }
        }}>
          <ViewListIcon sx={{ width: "100%", height: "100%", backgroundColor: '#121212' }} />
        </Badge>
      </div>
      <Dialog
        open={props.exportListOpen}
        onClose={props.closeExportList}
        sx={{
          maxHeight: { xs: '95%', sm: '95%', md: '80%', lg: '80%', xl: '80%' }
        }}
      >
        <ExportDiv albumsToSend={props.albumsToSend} createNewPlaylist={props.createNewPlaylist} />
      </Dialog>
      <div class="menuIcon" onClick={props.setUserAnchor} >
        <PersonIcon sx={{ width: "100%", height: "100%" }} />
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
          {
            props.username ?
              <>
                Logged in as: {props.username}<br />
                <Button onClick={DataInterface.logout}>Log out</Button><br />
                <Button onClick={DataInterface.purge}>Remove account</Button>
              </>
              :
              <>You are not logged in</>
          }
        </Typography>
      </Popover>
    </div>
  )
}

function ExportDiv(props) {
  return (
    <div id="exportDiv">
      <div id="exportList">
        {props.albumsToSend.map(album => (
          <div class="exportListItem" key={album.id}>
            <div><img src={album.images[1].url} alt={album.name + ' album cover'} width="100%" height="100%" /></div>
            <div class="exportAlbumInfo">{album.name}</div>
          </div>
        ))}
      </div>
      <div id="exportButton">
        <Button variant="contained" onClick={props.createNewPlaylist}>
          Export to Spotify
        </Button>
      </div>
    </div>
  )
}

function PlaylistSelect(props) {

  return (
    <div id="playlistSelect">
      <select id="playlistDropdown" onChange={(e) => props.selectPlaylist(e.target.value)}>
        <option hidden disabled selected={props.currentPlaylist !== 'releaseradar' && props.currentPlaylist !== 'discoverweekly'} value="">--Select a playlist--</option>
        <option value="releaseradar" selected={props.currentPlaylist == 'releaseradar'}>Release Radar</option>
        <option value="discoverweekly" selected={props.currentPlaylist == 'discoverweekly'}>Discover Weekly</option>
      </select>
      &nbsp;
      {props.loadedAlbums ?
        <>
          <label for="selectedAll">
            <Button
              variant={props.selectedAll ? 'contained' : 'outlined'}
              style={{ border: '2px solid #2E7D32' }}
              color="success"
              onClick={() => props.updateSelectAll(!props.selectedAll)}
              sx={{
                padding: '2px 5px'
              }}
            >
              <Checkbox
                id="selectedAll"
                sx={{ padding: 0, margin: 0 }}
                style={props.selectedAll ? { color: 'white' } : { color: '#2E7D32' }}
                checked={props.selectedAll}
              />&nbsp;SELECT ALL/NONE
            </Button>
          </label>
          &nbsp;
          <label for="hideAlreadyExported">
            <Button
              variant={props.hideAlreadyExported ? 'contained' : 'outlined'}
              style={{ border: '2px solid #2E7D32' }}
              color="success"
              onClick={() => props.updateHideAlreadyExported(!props.hideAlreadyExported)}
              sx={{
                padding: '2px 5px'
              }}
            >
              <Checkbox
                id="hideAlreadyExported"
                sx={{ padding: 0, margin: 0 }}
                style={props.hideAlreadyExported ? { color: 'white' } : { color: '#2E7D32' }}
                checked={ props.hideAlreadyExported }
              />&nbsp;Hide previously exported
            </Button>
          </label>
        </>
        : ''
      }
    </div>
  )
}

function AlbumList(props) {
  const albums = props.hideAlreadyExported ? props.albums.filter(album => !album.alreadyExported) : props.albums;

  return (
    <div class='albumListGrid'>
      {albums.map((album, index) => (
        <label for={'album' + index}>
          <div
            class="albumListItem"
            style={props.albumsToSend.includes(album) ? { backgroundColor: '#2d772D' } : {}}
          >
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
              {album.alreadyExported && <div class="alreadyExported">Previously exported</div>}
              <input
                type="checkbox"
                id={'album' + index}
                checked={props.albumsToSend.includes(album)}
                hidden
                onChange={(e) => props.update(album, e.target.checked)} />
            </div>
          </div>
        </label>
      ))}
    </div>
  );
}

function App() {
  const [albums, setAlbums] = useState([]);
  const [err, setErr] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [albumsToSend, setAlbumsToSend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [userAnchor, setUserAnchor] = useState(null);
  const [exportListOpen, setExportListOpen] = useState(false);
  const [loadedAlbums, setLoadedAlbums] = useState(false);

  useEffect(() => {
    setLoading(true);
    DataInterface.pageLoadCheckUser()
      .then((res) => {
        setUsername(res.username);
        setUserId(res.userid);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally((res) => {
        setLoading(false);
      });
  }, []);

  const getAlbums = (playlistName) => {
    setAlbumsToSend([]);
    setLoadingAlbums(true);
    setLoadedAlbums(false);
    var promise;
    switch (playlistName) {
      case '':
        setAlbums([]);
        setLoadingAlbums(false);
        break;
      case 'releaseradar':
        promise = DataInterface.getReleaseRadarAlbums();
        break;
      case 'discoverweekly':
        promise = DataInterface.getDiscoverWeeklyAlbums();
        break;
      default:
        setLoadingAlbums(false);
    }

    Promise.resolve(promise)
      .then((res) => {
        setLoadedAlbums(true);
        setAlbums(res.albums);
        setErr(res.err);
      })
      .catch((res) => {
        setErr(res);
      })
      .finally(() => {
        setLoadingAlbums(false);
      });
  }

  const updateAlbumsToSend = (id, checked) => {
    console.log(checked);
    var albums = albumsToSend;
    if (checked) {
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
    else {
      var albums = [];
      albumsToSend.forEach(album => {
        albums.push(album.id);
      });

      DataInterface.createNewPlaylist(albums)
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

  const openExportList = () => {
    setExportListOpen(true);
  }

  const closeExportList = () => {
    setExportListOpen(false);
  }

  return (
    <>
      <Header
        numAlbums={albumsToSend.length}
        createNewPlaylist={newPlaylist}
        userAnchor={userAnchor}
        setUserAnchor={userIconClick}
        closeUserPopover={closeUserPopover}
        username={username}
        exportListOpen={exportListOpen}
        closeExportList={closeExportList}
        openExportList={openExportList}
        albumsToSend={albumsToSend}
        userId={userId}
      />
      <AppBody
        albums={albums}
        err={err}
        update={updateAlbumsToSend}
        setAlbumsToSend={setAlbumsToSend}
        username={username}
        selectPlaylist={getAlbums}
        albumsToSend={albumsToSend}
        loading={loading}
        loadingAlbums={loadingAlbums}
        loadedAlbums={loadedAlbums}
      />
    </>
  )
}

export default App;
