import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'antd/dist/antd.css';  // antd 모듈을 갖고온다
import { Provider} from 'react-redux'   // redux 모듈을 갖고온다
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';

const createStoreWithMiddleware = applyMiddleware()
ReactDOM.render(
  <Provider
    store = {createStoreWithMiddleware(Reducer,
      window.__REDUX_DEVTOOLS-EXTENSION__&&
      window.__REDUX_DEVTOOLS-EXTENSION__()
      )}
  >
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performlance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// npm install react-router-dom
// npm i http-proxy-middleware --save

// npm i antd --save
// ant design css 프레임워크를 사용하기 위한 모듈 설치

// redux : 상태 관리 라이브러리
// npm i redux react-redux redux-promise redux-thunk --save 
// 참고 강의 링크 : https://www.inflearn.com/course/%EB%94%B0%EB%9D%BC%ED%95%98%EB%A9%B0-%EB%B0%B0%EC%9A%B0%EB%8A%94-%EB%85%B8%EB%93%9C-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EA%B8%B0%EB%B3%B8/lecture/37089?tab=curriculum