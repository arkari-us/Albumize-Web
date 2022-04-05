import axios from 'axios';
axios.defaults.withCredentials = true;

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

const DataInterface = {
  async getReleaseRadarAlbums() {
    return this.getAlbums('https://arkari.us/albumize/api/albums/releaseradar');
  },

  async getDiscoverWeeklyAlbums() {
    return this.getAlbums('https://arkari.us/albumize/api/albums/discoverweekly');
  },
  
  async getAlbums(uri) {
    return axios.get(
      uri, 
      {}
    )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log('Error getting albums: ' + err);
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
  },

  async pageLoadCheckUser() {
    return axios.get(
      'https://arkari.us/albumize/api/user'
    )
      .then((res) => {
        console.log(res.data.data);
        return res.data.data;
      })
      .catch((err) => {
        return false;
      });
  },

  async logout() {
    axios.delete(
      'https://arkari.us/albumize/api/user',
      {headers: headers}
    )
      .then((res) => {
        location.reload();
      })
      .catch((err) => {
        alert(err.data);
      });
  },

  async purge() {
    if (confirm('This will delete all of your user data from Albumze, including data on previously exported albums. Is this okay?')){
      axios.delete(
        'https://arkari.us/albumize/api/user/auth',
        {headers: headers}
      )
        .then((res) => {
          location.reload();
        })
        .catch((err) => {
          alert(err.data);
        })
    }
  }
}

export default DataInterface;
