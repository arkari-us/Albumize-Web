import axios from 'axios';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

const DataInterface = {
  async getReleaseRadarAlbums() {
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

  async getDiscoverWeeklyAlbums() {
    const uri = 'https://arkari.us/albumize/api/albums/discoverweekly';

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
      `https://arkari.us/albumize/api/playlists/newplaylist`,
      {albums: albums},
      headers
    )
      .then((res) => {
        return res.data.id;
      })
      .catch((err) => {
        return err.response.data;
      })
  }
}

export default DataInterface;
