import React from 'react'
import logo from './logo.svg'
import { Counter } from './features/counter/Counter'
import './App.css'
import SingleItemWithArray from './components/form-examples/SingleItemWithArray'
import MultiFormArray from './components/form-examples/MultiFormArray'

function App() {
    return (
        <div className="App">
            {/* <SingleItemWithArray /> */}
            <MultiFormArray />
        </div>
    )
}

export default App
