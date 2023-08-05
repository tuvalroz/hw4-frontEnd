import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import darkModeContext from "../components/darkModeContext";
import userContext from "../components/userContext";
import { NextRouter, useRouter } from 'next/router';

export function setTokenCookie(value: string) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // 7 = 7 days
    const cookieValue = encodeURIComponent("FrontEndToken") + "=" + encodeURIComponent(value) + ";expires=" + expirationDate.toUTCString() + ";path=/";
    document.cookie = cookieValue;
}



export async function login(username: string, password: string, setUser: Dispatch<SetStateAction<{ username: string, email: string, token: string, imageUrl: string }>>, router: NextRouter) {
    

    try {
        const body = { username, password };
        let response = await fetch(`/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (response.status == 404) {
            alert("Incorrect username")
        }
        else if (response.status == 401) {
            alert("Incorrect password")
        }
        if (response.status == 200) {
            const data = await response.json();
            const { token, name, email, imageUrl } = data;
            await router.push("/"); // Go to feed page
            setUser({ username: name, email: email, token: token, imageUrl: imageUrl});
            setTokenCookie(token);
        }

    } catch (error) {
        alert("error=" + error);
    }
}

const Login: React.FC = () => {
    const router = useRouter();
    const setUser = useContext(userContext).setUser;
    const darkMode = useContext(darkModeContext).darkMode;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        setUser({ username: "", email: "", token: "", imageUrl: "" })
        setTokenCookie("");
    }, [])

    return (
        <Layout>
            <div className="form-container">
                <h1>Log in</h1>

                <label>Username:</label>
                <input type="text" onChange={(e) => setUsername(e.target.value)} required /><br /><br />

                <label>Password:</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)} required /><br />

                <button onClick={() => { login(username, password, setUser, router) }}>Log in</button>

            </div>
            <style jsx>{`
                .form-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                label {
                    font-weight: bold;
                    color: ${darkMode ? "white" : "black"};
                }

                button {
                    color :${darkMode ? "white" : ""};
                }
            `}</style>
        </Layout>
    );
};

export default Login;
