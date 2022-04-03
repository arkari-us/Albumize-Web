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
import { CircularProgress, DialogTitle, List, ListItem, ToggleButtonGroup } from '@mui/material';
import Image from 'material-ui-image';
import { ToggleButton } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SettingsIcon from '@mui/icons-material/Settings';
import { SelectAll } from '@mui/icons-material';

function AppBody(props) {
  const [hideAlreadyExported, setHideAlreadyExported] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState('');

  const albums = hideAlreadyExported ? props.albums.filter(album => {
    return !album.alreadyExported;
  }) : props.albums;

  const updateCurrentPlaylist = (value) => {
    setCurrentPlaylist(value);
    props.selectPlaylist(value);
  }

  const selectAll = () => {
    props.setAlbumsToSend(albums);
  }

  const updateHideAlreadyExported = (checked) => {
    setHideAlreadyExported(checked);
    if (checked) {
      props.setAlbumsToSend(props.albumsToSend.filter(album => {
        return !album.alreadyExported;
      }));
    }
  }
  const clearExportList = () => {
    props.setAlbumsToSend([]);
  }

  if (props.loading || (props.loadingAlbums && !props.loadedAlbums)) return (<Loading />);
  else if (!props.username) return (<AuthRequest />);
  else if (props.err) return (<>{JSON.stringify(props.err)}</>);
  else if (!props.loadedAlbums) return (
    <InitialPlaylistSelect updateCurrentPlaylist={updateCurrentPlaylist} />
  )
  else {
    return (
      <div class='appBody'>
        <ListOptions
          selectAll={selectAll}
          loadedAlbums={props.loadedAlbums}
          hideAlreadyExported={hideAlreadyExported}
          updateHideAlreadyExported={updateHideAlreadyExported}
          currentPlaylist={currentPlaylist}
          selectPlaylist={updateCurrentPlaylist}
          areAlbumsSelected={props.albumsToSend.length > 0}
          clearExportList={clearExportList}
        />
        {props.albums ?
            <AlbumList
              albums={albums}
              albumsToSend={props.albumsToSend}
              update={props.update}
              hideAlreadyExported={hideAlreadyExported}
              loadingAlbums={props.loadingAlbums}
            /> :
            ''
        }
      </div>
    )
  }
}

function Loading() {
  return (<div class="loading"><CircularProgress size="200px" style={{ color: '#A6D257' }} /></div>)
}

const AuthRequest = () => (
  <div id="authRequest">
    <h1>Welcome to Albumize!</h1>
    <p>This application takes the Spotify curated playlists (Release Radar and Discover weekly) and exports a playlist with all tracks from the albums those songs appear on.</p>
    <p>In order to use this application, you must authorize Spotify to share your data with us.</p>
    <a href='https://www.arkari.us/albumize/api/user/auth'>
      <Button
        size="large" 
        style={{backgroundColor: '#4D574D', color: '#F5F5F5'}}
      >
        Log in with Spotify
      </Button>
    </a>
  </div>
)

const InitialPlaylistSelect = (props) => (
  <div id="initialPlaylistSelect">
    <h2>Select a playlist to Albumize</h2>
    <br />
    <Button 
      size="large" 
      style={{backgroundColor: '#4D574D', color: '#F5F5F5'}}
      onClick={() => props.updateCurrentPlaylist('releaseradar')}
    >
      Release Radar
    </Button>
    &nbsp;
    <Button 
      size="large" 
      style={{backgroundColor: '#4D574D', color: '#F5F5F5'}}
      onClick={() => props.updateCurrentPlaylist('discoverweekly')}
    >
      Discover Weekly
    </Button>
  </div>
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
        classes={{paper: {minWidth: '200px'}}}
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
              <>
                You are not logged in. <br />
                <a href='https://www.arkari.us/albumize/api/user/auth'>
                  <Button
                    size="large" 
                    style={{backgroundColor: '#4D574D', color: '#F5F5F5'}}
                  >
                    Log in with Spotify
                  </Button>
                </a>
              </>
          }
        </Typography>
      </Popover>
    </div>
  )
}

function ExportDiv(props) {
  return (
    <div id="exportDiv">
      <div id="exportList" style={props.albumsToSend.length ? {} : {overflow: 'hidden'}}>
        {
          props.albumsToSend.length ? props.albumsToSend.map(album => (
            <div class="exportListItem" key={album.id}>
              <div><img src={album.images[1].url} alt={album.name + ' album cover'} width="100%" height="100%" /></div>
              <div class="exportAlbumInfo">{album.name}</div>
            </div>
          ))
          : 
          <div id="exportNoAlbums">
            No albums selected to export. 
          </div>
        }
      </div>
      <div id="exportButton">
        <Button variant="contained" onClick={props.createNewPlaylist}>
          Export to Spotify
        </Button>
      </div>
    </div>
  )
}

function ListOptions(props) {
  const [settingsAnchor, setSettingsAnchor] = useState(null)
  const smallScreen = useMediaQuery('(max-width:1300px)');
  const settingsMenuOpen = Boolean(settingsAnchor);
  const settingsMenuId = settingsAnchor ? 'settingsMenu' : undefined;

  const openSettingsMenu = (e) => {
    setSettingsAnchor(e.currentTarget);
  }

  const settingsMenuClose = () => {
    setSettingsAnchor(null);
  }

  return (
    <div id="listOptions">
      <div class="mobileButtonContainer">
        { 
        smallScreen ? 
        <>
          <div id="settingsButtonMobile">
            <Button 
              variant="contained" 
              style={{
                backgroundColor: '#3D473D',
                maxWidth: '35px',
                maxHeight: '35px',
                minWidth: '35px',
                minHeight: '35px'
              }}
              onClick={openSettingsMenu}
            >
              <SettingsIcon /> 
            </Button>
            <Popover
              id={settingsMenuId}
              open={settingsMenuOpen}
              anchorEl={settingsAnchor}
              onClose={settingsMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
            >
              <Typography sx={{ p: 2, backgroundColor: '#191919', color: '#F5F5F5' }}>
              <List>
                <ListItem 
                  button 
                  style={{
                    backgroundColor: props.hideAlreadyExported ? '#4d874D' : ''
                  }}
                  onClick={() => props.updateHideAlreadyExported(!props.hideAlreadyExported)}
                >
                  Hide Already Exported
                </ListItem>
                <ListItem button onClick={() => props.selectAll()}>
                  Select All
                </ListItem>
              </List>
              </Typography>
            </Popover>
          </div> 
        </>
        : '' 
        }
      </div>
      <div id="toggleButtons">
        <ToggleButtonGroup
          value={props.currentPlaylist}
          exclusive
          style={{color: 'white', lineHeight: 1}}
          onChange={(e) => props.selectPlaylist(e.target.value)}
          color="success"
        >
          <ToggleButton 
            value="releaseradar" 
            style={{
              color: 'white', 
              lineHeight: 'inherit',
              backgroundColor: props.currentPlaylist == 'releaseradar' ? '#4d874D' : '#3D473D'
            }} 
            selected={props.currentPlaylist == 'releaseradar'}
          >
            Release Radar
          </ToggleButton>
          <ToggleButton 
            value="discoverweekly" 
            style={{
              color:'white',
              lineHeight: 'inherit',
              backgroundColor: props.currentPlaylist == 'discoverweekly' ? '#4d874D' : '#3D473D'
            }} 
            selected={props.currentPlaylist == 'discoverweekly'}
          >
            Discover Weekly
          </ToggleButton>
        </ToggleButtonGroup>
      { smallScreen ? '' :
      <>
        &nbsp;
        <ToggleButtonGroup 
          style={{lineHeight: 1}}
          onChange={() => props.updateHideAlreadyExported(!props.hideAlreadyExported)}
        >
          <ToggleButton
            style={{
              color:'white',
              lineHeight: 'inherit',
              backgroundColor: props.hideAlreadyExported ? '#4d874D' : '#3D473D'
            }} 
            selected={props.hideAlreadyExported}
          >
            Hide Previously Exported
          </ToggleButton>
        </ToggleButtonGroup>
        &nbsp;
        <Button 
          size="large" 
          variant="contained" 
          onClick={props.selectAll}
          style={{
            lineHeight: 1.4,
            boxShadow: 'none',
            color: 'black',
            backgroundColor: '#B5B5B5'
          }}
        >
          Select All
        </Button>
      </>
      }
      </div>
      <div class="mobileButtonContainer">
        <div id="clearButton">
          {
            props.areAlbumsSelected ?
            <Button 
              variant="contained" 
              style={ smallScreen ? { 
                backgroundColor: '#234523',
                maxWidth: '30px',
                maxHeight: '30px',
                minWidth: '30px',
                minHeight: '30px'
              } : {
                backgroundColor: '#234523'
              }}
              onClick={() => props.clearExportList()}>
              <ClearIcon /> { smallScreen ? '' : 'Clear' }
            </Button>
            : ''
          }
        </div>
      </div>
    </div>
  )
}

function AlbumList(props) {
  const albums = props.hideAlreadyExported ? props.albums.filter(album => !album.alreadyExported) : props.albums;

  if (props.loadingAlbums) return (<Loading />)
  else 
  return (
    <div class='albumListGrid'>
      {albums.map((album, index) => (
        <label for={'album' + index}>
          <div
            class="albumListItem"
            style={props.albumsToSend.includes(album) ? { backgroundColor: '#2d772D' } : {}}
          >
            <div><Image src={album.images[1].url} alt={album.name + ' album cover'} width="100%" height="100%" animationDuration={300} disableSpinner={true} color={'#3D473D'} /></div>
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
