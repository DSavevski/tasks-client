import axios from 'axios';
import router from '@/router/index.js'
export default {
  user: {
    authenticated: false,
    profile: null
  },


  check() {
    return axios.get('/api/user')
      .then(response => {
        if (response.data.id != null) {
          this.user.authenticated = true;
          this.user.profile = response.data;
        }
        else {
          this.user.authenticated = false;
          this.user.profile = null;
        }
      })

  },

  signin(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token; // etc etc
    axios.post(`/api/tokensignin`, {
      id_token: id_token
    })
      .then(response => {
        this.check()
          .then(response =>{
            router.push({name:'daily'});
          });

      })
      .catch(e => {
        console.log(e);
      })
  },

  signOut(){
    axios.post('/api/signout',{})
      .then(response => {
        this.check()
          .then(response =>{
            router.push({name:'home'});
          });
      })
  }
}
