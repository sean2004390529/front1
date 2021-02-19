import http from "../axios-common"

class AuthService {

  //获取token
  loadToken(userLoginForm) {
    const clientId = 'nginx';
    const clientSecret = 'nginx';
    const tokenBase64 = "Basic " + Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString('base64')
    const username = userLoginForm.username;
    const password = userLoginForm.password;
    const url = `/oauth/token?grant_type=password&scope=all&username=${username}&password=${password}`;

    return http.post(url, null, {
      headers: {
        Authorization: tokenBase64
      }
    });

  }

  register(registerForm) {
    return http.post("/register", registerForm);
  }

  loadUserInfo(token) {
    return http.get('/user/info', { headers: {"Authorization" : `Bearer ${token}`} });
  }

  logout() {
    localStorage.removeItem('userInfo');
  }


}

export default new AuthService();
