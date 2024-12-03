import React  , {useEffect} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle'
import { Provider } from "react-redux";
// src/index.js
import Store from './Rtk/Store'; // Correct

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <Provider store={Store}>
  <App />
  </Provider>
);