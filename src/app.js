import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  of,
  pluck,
  switchMap,
} from "rxjs";
import { ajax } from "rxjs/ajax";
import { API_BASE_URL, API_QUERY, displayResults, getJsLibrary } from "./utils";

const searchbar = document.getElementById("searchbar");
const suggestedResults = document.getElementById("suggested-results");

// Debounce time can be solved with loadash
// distinctUntilChanged -> store last value in
// variable and compapre it to the new value
const onTextChange = (e) => {
  const serachedValue = searchbar.value;
  getJsLibrary(serachedValue)
    .then((response) => {
      const transformedResponse = response.data.results;
      displayResults(suggestedResults, transformedResponse);
    })
    .catch((e) => console.warn("Error ", e));
};

searchbar.addEventListener("input", onTextChange);

const searchbarRx = document.getElementById("searchbarRx");
const suggestedResultsRx = document.getElementById("suggested-results-rx");

const userInputObs = fromEvent(searchbarRx, "input");

userInputObs
  .pipe(
    pluck("target", "value"),
    debounceTime(1000),
    distinctUntilChanged(),
    switchMap((searchedText) => {
      const url = API_BASE_URL + API_QUERY + searchedText;
      return ajax(url).pipe(
        map((res) => res.response.results),
        catchError((err) => {
          return of(error);
        })
      );
    })
  )
  .subscribe((response) => {
    displayResults(suggestedResultsRx, response);
  });
