import axios from 'axios';

const DataInterface = {
  async getAlbums(playlistID = '') {
    const uri = 'https://arkari.us/albumize/api/albums/releaseradar';

    return axios.get(
      uri, 
      {}
    )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log('Error getting albums: ' + err.response.data.err);
        return err.response.data;
      });
  },
  
  async createNewPlaylist(albums) {
    return axios.post(
      `https://arkari.us/albumize/api/playlists/newplaylist?albums=${albums.join(',')}`
    )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      })
  }
}

export default DataInterface;
