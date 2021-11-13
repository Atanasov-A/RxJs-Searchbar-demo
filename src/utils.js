import axios from "axios";

export const API_BASE_URL = "https://api.cdnjs.com/libraries";
export const API_QUERY = "?search=";

export const displayResults = (list, results) => {
  // clear list
  list.innerHTML = "";
  const listChildren = results.forEach((result) => {
    const liEl = document.createElement("li");
    liEl.classList.add("list-group-item");

    liEl.appendChild(document.createTextNode(result.name));

    list.appendChild(liEl);
  });
};

export const getJsLibrary = (name) => {
  const response = axios.get(API_BASE_URL + API_QUERY + name);
  return response;
};
