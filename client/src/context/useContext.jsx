import axios from 'axios'
import { createContext, useState, useEffect } from 'react'

export const UserContext = createContext({})
export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (!user) {
            axios.get('/profile').then(({ data }) => {
                setUser(data)
            })
        }
    }, [user]) // Include user in the dependency array

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}
