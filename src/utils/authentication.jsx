import axios from "axios";
import Cookies from "js-cookie";

// jika menggunakan localstorage
// Fungsi untuk mengatur token pada setiap permintaan HTTP
// const setAuthToken = (token) => {
//   if (token) {
//     axios.defaults.headers.common["Authorization"] = `Token ${token}`;
//   } else {
//     delete axios.defaults.headers.common["Authorization"];
//   }
// };

// export default setAuthToken;

// testing cookie
export const setAuthToken = (token) => {
  if (token) {
    Cookies.set("authToken", token, { expires: 7, sameSite: "Lax" });
    axios.defaults.headers.common["Authorization"] = `Token ${token}`;
  }
};

export const setUserName = (user) => {
  Cookies.set("userName", user.name);
};

export const setCSRFToken = (csrfToken) => {
  if (csrfToken) {
    // Set the CSRF token as a cookie
    Cookies.set("csrfToken", csrfToken, { expires: 7, sameSite: "Lax" });
  }
};

export const getCSRFToken = (name) => {
  var cookieValue = null;
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim(); // Remove leading/trailing spaces
    if (cookie.startsWith(name + "=")) {
      cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
      break;
    }
  }
  return cookieValue;
};
