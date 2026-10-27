import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { DataProvider } from './context/DataContext.jsx'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Theme persistence mimicking the original JS logic
const theme = localStorage.getItem("theme");
if (theme !== "light") {
    document.body.classList.add("dark-theme");
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <DataProvider>
            <App />
        </DataProvider>
    </React.StrictMode>,
)
