import axios from 'axios';

//axios should always send cookies
axios.defaults.withCredentials = true;

const DataInterface = {
  async getAlbums(playlistID = '') {
    const uri = 'https://www.arkari.us/albumize/api/albums';

    return axios.get(uri, {})
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log('Error getting albums: ' + err.response.data.err);
        return err.response.data;
      });
  }
}

export default DataInterface;
