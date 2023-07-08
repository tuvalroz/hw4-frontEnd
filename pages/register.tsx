import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import Layout from "../components/Layout";
import userContext from "../components/userContext";
import { NextRouter, useRouter } from "next/router";
import darkModeContext from "../components/darkModeContext";
import { login } from "./login";
import { Upload } from "../components/Upload";

export const postImageInColudinary = async (formData: FormData) => {
    try {
        const response = await fetch('/api/uploadImage', {
            method: 'POST',
            body: formData,
        });
        const res = await response;
        const data = await res.json();

        return data;

    } catch (error) {
        console.log(error);
        return { url: "-1" }
    }
}


async function register(username: string, password: string, email: string, setUser: Dispatch<SetStateAction<{ username: string, email: string, token: string, imageUrl: string }>>, router: NextRouter, selectedFileFormData: FormData, setIsUploading: Dispatch<SetStateAction<boolean>>) {
    setIsUploading(true);
    let imageUrl = undefined;

    if (selectedFileFormData.get('inputFile')) {
        let imageData = await postImageInColudinary(selectedFileFormData);
        if (imageData.url == "-1") {
            alert("Faild to upload image")
            setIsUploading(false);
            return
        }
        imageUrl = imageData.url;

    }


    try {
        //TODO should make verifications (email should be unique)?
        const body = { username, password, email, imageUrl };
        let response = await fetch(`/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (response.status == 500) {
            alert("Email is already used")
        }
        else if (response.status == 200) {
            await router.push("/"); // Go to feed page
            login(username, password, setUser, router);
        }
        else {
            alert("Register failed")
        }
    } catch (error) {
        alert("error=" + error);
    }
    finally {
        setIsUploading(false);
    }

}

const Register: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFileFormData, setSelectedFileFormData] = useState<FormData>(new FormData());
    const router = useRouter();
    const setUser = useContext(userContext).setUser;
    const user = useContext(userContext).user;
    const darkMode = useContext(darkModeContext).darkMode;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const isUserLogged = user?.username != "";

    if (isUserLogged) {
        return (
            <Layout>
                <h1>Register</h1>
                <div>You can't be logged in when view this page.</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="form-container">
                <h1>Register</h1>
                <label>Username:</label>
                <input type="text" onChange={(e) => setUsername(e.target.value)} required /><br /><br />

                <label>Password:</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)} required /><br /><br />

                <label>Email:</label>
                <input type="text" onChange={(e) => setEmail(e.target.value)} required /><br /><br />

                <label>Profile image:</label>
                <Upload setFormData={setSelectedFileFormData} /><br /><br />

                {!isUploading ?
                    <button disabled={username=="" || password=="" || email==""} onClick={() => { register(username, password, email, setUser, router, selectedFileFormData, setIsUploading) }}>Register</button>
                    :
                    <div className="spinner-container">
                        <div className="loading-spinner">
                        </div>
                    </div>
                }



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
                @keyframes spinner {
                    0% {
                      transform: rotate(0deg);
                    }
                    100% {
                      transform: rotate(360deg);
                    }
                  }
                  .loading-spinner{
                    width: 50px;
                    height: 50px;
                    border: 10px solid #f3f3f3; /* Light grey */
                    border-top: 10px solid #383636; /* Black */
                    border-radius: 50%;
                    animation: spinner 1.5s linear infinite;
          
                  }
            `}</style>
        </Layout>
    );
};

export default Register;
