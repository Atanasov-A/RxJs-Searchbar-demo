import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  from,
  fromEvent,
  map,
  pluck,
  switchMap,
} from "rxjs";
import { displayResults, getJsLibrary } from "./utils";

// Get the html elements
const searchbar = document.getElementById("searchbar");
const suggestedResults = document.getElementById("suggested-results");

const customDebounceTime = (callback, wait) => {
  let timerId = null;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

let previousSearchedValue = "";
// Handle the logic while the user is typing
const onTextChange = customDebounceTime((e) => {
  const serachedValue = searchbar.value;
  // customDistinctUntilChanged() logic
  if (previousSearchedValue === serachedValue) return;
  previousSearchedValue = serachedValue;

  getJsLibrary(serachedValue)
    .then((response) => {
      const transformedResponse = response.data.results;
      // Show only 5 results
      const limitedResponse = transformedResponse.slice(0, 5);
      displayResults(suggestedResults, limitedResponse);
    })
    .catch((e) => console.warn("Error ", e));
}, 1000);

// Trigger event, when user is typing
searchbar.addEventListener("input", onTextChange);

// Get the html elements
const searchbarRx = document.getElementById("searchbarRx");
const suggestedResultsRx = document.getElementById("suggested-results-rx");

// Create observable from event
const userInputObs = fromEvent(searchbarRx, "input");

// Handle the logic while the user is typing
userInputObs
  .pipe(
    pluck("target", "value"),
    debounceTime(1000),
    distinctUntilChanged(),
    switchMap((searchedText) => {
      return from(getJsLibrary(searchedText)).pipe(
        map((res) => res.data.results),
        map((res) => res.slice(0, 5)),
        catchError((e) => console.warn("Error observable", e))
      );
    })
  )
  .subscribe((response) => {
    displayResults(suggestedResultsRx, response);
  });
