import { createContext } from 'react';

export const CraftContext = createContext({ 
    isCraftMode: false, 
    setIsCraftMode: () => {},
    resourcesList: [],
    setResourcesList: () => {},
});