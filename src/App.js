import './App.css';
import React, { useEffect, useState } from 'react';
import DataInterface from './DataInterface';
import PersonIcon from '@mui/icons-material/Person';
import ViewListIcon from '@mui/icons-material/ViewList';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { CircularProgress, DialogContentText, DialogTitle, DialogContentText, List, ListItem, ToggleButtonGroup, DialogContent } from '@mui/material';
import Image from 'material-ui-image';
import { ToggleButton } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SettingsIcon from '@mui/icons-material/Settings';

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

  return (
    <div id="mainContent">
      {props.loading || (props.loadingAlbums && !props.loadedAlbums) ? <Loading /> :
        !props.username ? <AuthRequest /> :
          props.err ? <>{JSON.stringify(props.err)}</> :
            !props.loadedAlbums ? <InitialPlaylistSelect updateCurrentPlaylist={updateCurrentPlaylist} /> :
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
      }
    </div>
  )
}

function Loading(props) {
  return (<div class={props.fullSize ? 'loadingFullSize' : 'loading'}><CircularProgress size="200px" style={{ color: '#A6D257' }} /></div>)
}

function AuthRequest() {
  const [UAopen, setUAopen] = useState(false);
  const [PPopen, setPPopen] = useState(false);

  const closeUA = () => {
    setUAopen(false);
  }

  const closePP = () => {
    setPPopen(false);
  }

  return(
    <div id="authRequest">
      <h1>Welcome to Albumize!</h1>
      <p>This application takes the Spotify curated playlists (Release Radar and Discover weekly) and exports a playlist with all tracks from the albums those songs appear on.</p>
      <p>In order to use this application, you must authorize Spotify to share your data with us, so we can pull your versions of those playlists.</p>
      <p>By authorizing, you agree to our <span class="authlinks" onClick={() => setUAopen(true)}>User Agreement</span> and <span class="authlinks" onClick={() => setPPopen(true)}>Privacy Policy</span></p>
      <UserAgreement open={UAopen} onClose={closeUA} />
      <PrivacyPolicy open={PPopen} onClose={closePP} />
      <a href='https://www.arkari.us/albumize/api/user/auth'>
        <Button
          size="large"
          style={{ backgroundColor: '#4D574D', color: '#F5F5F5' }}
        >
          Log in with Spotify
        </Button>
      </a>
    </div>
  )
}

const InitialPlaylistSelect = (props) => (
  <div id="initialPlaylistSelect">
    <h2>Select a playlist to Albumize</h2>
    <br />
    <Button
      size="large"
      style={{ backgroundColor: '#4D574D', color: '#F5F5F5' }}
      onClick={() => props.updateCurrentPlaylist('releaseradar')}
    >
      Release Radar
    </Button>
    &nbsp;
    <Button
      size="large"
      style={{ backgroundColor: '#4D574D', color: '#F5F5F5' }}
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
        classes={{ paper: { minWidth: '200px' } }}
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
                <Button style={{ color: '#A6D257' }} onClick={DataInterface.logout}>Log out</Button><br />
                <Button style={{ color: '#A6D257' }} onClick={DataInterface.purge}>Remove account</Button>
              </>
              :
              <>
                You are not logged in. <br />
                <a href='https://www.arkari.us/albumize/api/user/auth'>
                  <Button
                    size="small"
                    style={{ backgroundColor: '#4D574D', color: '#F5F5F5' }}
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

function Footer() {
  return (
    <div id="footer">
      <img id="imageContain" src="img/Spotify_Logo_RGB_Green.png" />
    </div>
  )
}

function ExportDiv(props) {
  const [loading, setLoading] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState('');

  const exportAlbums = () => {
    setLoading(true);
    props.createNewPlaylist()
      .then((id) => {
        setNewPlaylist(id);
      })
      .catch((err) => {
        alert(err);
      })
      .finally((res) => {
        setLoading(false);
      });
  }

  return (
    <>
    { loading ? <div class="legalDocModalDiv"><Loading fullSize="1" /></div> :
      newPlaylist ? 
      <div class="legalDocModalDiv">
        <h3>New playlist created!</h3>
        <a href={`https://open.spotify.com/playlist/${newPlaylist}`}><Button style={{ backgroundColor: '#4d874D', color: '#F5F5F5' }}>View your new playlist</Button></a>
      </div>
      :
      <div id="exportDiv">
          <>
            <div id="exportList" style={props.albumsToSend.length ? {} : { overflow: 'hidden' }}>
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
              <Button disabled={!props.albumsToSend.length} variant="contained" style={{ backgroundColor: '#4d874D' }} onClick={exportAlbums}>
                Export to Spotify
              </Button>
            </div>
          </>
      </div>
    }
    </>
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
          style={{ color: 'white', lineHeight: 1 }}
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
              color: 'white',
              lineHeight: 'inherit',
              backgroundColor: props.currentPlaylist == 'discoverweekly' ? '#4d874D' : '#3D473D'
            }}
            selected={props.currentPlaylist == 'discoverweekly'}
          >
            Discover Weekly
          </ToggleButton>
        </ToggleButtonGroup>
        {smallScreen ? '' :
          <>
            &nbsp;
            <ToggleButtonGroup
              style={{ lineHeight: 1 }}
              onChange={() => props.updateHideAlreadyExported(!props.hideAlreadyExported)}
            >
              <ToggleButton
                style={{
                  color: 'white',
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
                style={smallScreen ? {
                  backgroundColor: '#234523',
                  maxWidth: '30px',
                  maxHeight: '30px',
                  minWidth: '30px',
                  minHeight: '30px'
                } : {
                  backgroundColor: '#234523'
                }}
                onClick={() => props.clearExportList()}>
                <ClearIcon /> {smallScreen ? '' : 'Clear'}
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

function UserAgreement(props) {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <div class="legalDocModalDiv">
        <DialogTitle>User Agreement</DialogTitle>
        <DialogContent>
          <DialogContentText class="uappText">By authorizing with Spotify, you (User) agree to the following User Agreement:</DialogContentText>
          <DialogContentText class="uappText">
            <ol class="legalDocLists">
              <li>Albumize makes no warranties or representations on behalf of Spotify and expressly disclaims all implied warranties with respect to the Spotify Platform, Spotify Service and Spotify Content, including the implied warranties of merchantability, fitness for a particular purpose and non-infringement. </li>
              <li>User is prohibited from modifying or creating derivative works based on the Spotify Platform, Spotify Service, or Spotify Content.</li>
              <li>User is prohibited from decompiling, reverse-engineering, disassembling, and otherwise reducing the Spotify Platform, Spotify Service, and Spotify Content to source code or other human-perceivable form, to the full extent allowed by law.</li>
              <li>Albumize is solely responsible for any issues resulting from use of this site. Spotify, and any other applicable third parties, will not be held responsible for any issues resulting from use of this site.</li>
              <li>Spotify is a third party beneficiary of this User Agreement, as well as the Privacy Policy included on this site, and is entitled to directly enforce both.</li>
            </ol>
          </DialogContentText>
        </DialogContent>
      </div>
    </Dialog>
  )
}

function PrivacyPolicy(props) {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <div class="legalDocModalDiv">
        <DialogTitle>Privacy Policy</DialogTitle>
        <DialogContent>
          <DialogContentText class="uappText">By authorizing with Spotify, you agree to the following Privacy Policy:</DialogContentText>
          <h3>Personal Data</h3>
          <DialogContentText class="uappText">
            The following personal data is procured from your Spotify account when you authorize:
            <ul class="legalDocLists">
              <li>Your Spotify user ID</li>
              <li>Your Spotify username</li>
            </ul>
          </DialogContentText>
          <h3>Usage Data</h3>
          <DialogContentText class="uappText">
            The following data is collected as you use the app:
            <ul class="legalDocLists">
              <li>When you submit a list of albums (using the EXPORT TO SPOTIFY button), the IDs of the exported albums are saved and associated with your user account.</li>
            </ul>
          </DialogContentText>
          <h3>Cookies</h3>
          <DialogContentText class="uappText">
            This site automatically adds a single cookie to your browser to track your login session and authenticate your requests to our API. Without this cookie, the site will not function correctly, so the site does not offer an option to exclude it. You may delete the cookie from your browser settings at any time—however, it will be replaced if you open Albumize again.
          </DialogContentText>
          <h3>Data Use</h3>
          <DialogContentText class="uappText">
            Your collected data is used in the following ways:
            <ul class="legalDocLists">
              <li>Your Username is gathered in order to display it on the website (to identify which user is logged in).</li>
              <li>Your User ID is gathered to use as a unique identifier in our database system.</li>
              <li>The list of exported albums is used to identify those albums on the page as you browse.</li>
            </ul>
            Your data will not be disclosed to any third parties, except:
            <ul class="legalDocLists">
              <li>If site ownership is transferred, your data may be provided to the new owner to ensure your user experience remains constant.</li>
              <li>In response to a valid request, we may be required to provide your data to law enforcement, courts, or other government agencies.</li>
            </ul>
          </DialogContentText>
          <h3>Data Retention</h3>
          <DialogContentText class="uappText">
            Your personal data and usage data will be stored for as long as your account remains in the Albumize database. You may remove this data from our system at any time by clicking the Profile icon in the upper right of the page and selecting “REMOVE ACCOUNT”. 
          </DialogContentText>
          <h3>Inquiries</h3>
          <DialogContentText class="uappText">
            If you have any questions about your data, please send an email to albumize.webmaster@gmail.com. 
          </DialogContentText>
        </DialogContent>
      </div>
    </Dialog>
  )
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

  async function newPlaylist() {
    if (albumsToSend.length == 0) {
      alert('Please select at least one album to export.');
    }
    else {
      var albums = [];
      albumsToSend.forEach(album => {
        albums.push(album.id);
      });

      return await DataInterface.createNewPlaylist(albums)
        .then((id) => {
          return id;
        })
        .catch((err) => {
          alert(`Error creating album: ${err}`);
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
      <Footer />
    </>
  )
}

export default App;
