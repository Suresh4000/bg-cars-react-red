import React, { createContext, useState, useEffect } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/website-data.json')
            .then(res => res.json())
            .then(data => {
                setSiteData(data);
                setLoading(false);
            });
    }, []);

    return (
        <DataContext.Provider value={{ siteData, loading }}>
            {children}
        </DataContext.Provider>
    );
};
