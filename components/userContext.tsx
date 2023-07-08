import { Dispatch, SetStateAction, createContext } from 'react';

const emptySetUserFunction: Dispatch<SetStateAction<{ username: string, email: string, token: string, imageUrl: string }>> = (value: SetStateAction<{ username: string, email: string, token: string, imageUrl: string }>) => { };

const userContext = createContext({
    user: { username: "", email: "", token: "", imageUrl: "" },
    setUser: emptySetUserFunction,
});

export default userContext;

