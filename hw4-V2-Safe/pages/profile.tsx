import React, { useContext, useState } from "react";
import Layout from "../components/Layout";
import userContext from "../components/userContext";
import darkModeContext from "../components/darkModeContext";
import { Upload } from "../components/Upload";
import { postImageInColudinary } from "./register";
import { NextRouter, useRouter } from "next/router";

async function ChangeProfileHandler(selectedFileFormData : FormData, user : {email: string, imageUrl : string}, router: NextRouter) {
    let imageUrl = undefined;

    if (selectedFileFormData.get('inputFile')) {
        let imageData = await postImageInColudinary(selectedFileFormData);
        if (imageData.url == "-1") {
            alert("Faild to upload image")
            return
        }
        imageUrl = imageData.url;
    }

    try {
        let email = user.email
        const body = { email, imageUrl };
        let response = await fetch(`/api/updateImage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (response.status == 200) {
            user.imageUrl = imageUrl;
            await router.push("/"); 
        }
        else{
            alert("error")
        }


    } catch (error) {
        alert("error=" + error);
    }



}

const Profile: React.FC = () => {
    const router = useRouter();
    const [selectedFileFormData, setSelectedFileFormData] = useState<FormData>(new FormData());
    const [isEditingPicture, setIsEditingPicture] = useState(false);
    const user = useContext(userContext).user;
    const darkMode = useContext(darkModeContext).darkMode;
    const session = user.username != ""; //TODO update to token

    if (!session) {
        return (
            <Layout>
                <h1>Profile</h1>
                <div>Log in before you get into this page.</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div>
                <h1>{user.username}'s Profile</h1><br />
                <label>username : {user.username}</label> <br />
                <label>email : {user.email}</label><br />
                {user.imageUrl != "" && <div><label>Profile picture : </label><img src={user.imageUrl} height="150px" width="150px"/></div>}
                <button onClick={() => setIsEditingPicture(!isEditingPicture)}>{isEditingPicture ? "Cancel editing profile picture" : "Add/Change profile picture"}</button><br /><br />
                {isEditingPicture && <div><Upload setFormData={setSelectedFileFormData} /><br/><button onClick={()=>ChangeProfileHandler(selectedFileFormData,user,router)}>submit</button></div>}
            </div>
            <style jsx>{`
                label {
                    font-weight: bold;
                    color: ${darkMode ? "white" : "black"};
                }
            `}</style>
        </Layout>
    );
};

export default Profile;
