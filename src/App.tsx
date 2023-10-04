import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BoardWidget from "./display/BoardWidget.tsx";
import Rack from './logic/Rack.tsx';
import RackWidget from './display/RackWidget.tsx';
import GamePage from './pages/GamePage.tsx';
// import { loadKWG, loadWASMmodule } from './wasm/WASMUtil.tsx';
import { GameVariant } from './logic/Constants.tsx';

// function myTest(){
//   let socket = new WebSocket(
//     "ws://127.0.0.1:9002"
//   );

//   socket.onopen = function () {
//     socket.send('hello from the client');
//   };
// }

function App() {
  // loadWASMmodule();
  // loadKWG("NWL18");
  return (
    <>
        <GamePage variant={GameVariant.OMGWords}></GamePage>
    </>
  )
}

export default App
