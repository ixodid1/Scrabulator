import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BoardWidget from "./display/BoardWidget.tsx";

function myTest(){
  let socket = new WebSocket(
    "ws://127.0.0.1:9002"
  );

  socket.onopen = function () {
    socket.send('hello from the client');
  };
}

function App() {

  return (
    <>
        <BoardWidget selectedTileIdx={-1} candidatePos={0} candidateTiles={[]} candidateTileFreq={[]} candidateHorizontal={false} candidateRow={0} candidateColumn={0} candidateMovePositions={[]} />
    </>
  )
}

export default App
