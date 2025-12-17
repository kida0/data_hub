// 디스트럭처링
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;

// main.js
import {add, subtract, multiply} from './utils.js';
console.log(add(1, 2));
console.log(subtract(1, 2));
console.log(multiply(1, 2));

import { StrictMode } from 'react';
import {createRoot} from 'react-dom/client';
import { Child, ArrowFunctionComponent } from './Child.jsx';

function Hello() {  // 대문자로 시작하는 컴포넌트는 리액트 컴포넌트로 인식, 소문자로 진행하면 랜더링X
    return (
        <h1>Hello, World!</h1>
    )
}
// 컴포넌트
function App() {

    return (
        <>
        <Hello />  // 이름을 태그로 사용하면 컴포넌트를 랜더링
        <h2>Hello, World!</h2>   // 랜더링할 요소를 jsx로 반환
        <Child />
        <ArrowFunctionComponent />
        </>
    )   
}

export default App;