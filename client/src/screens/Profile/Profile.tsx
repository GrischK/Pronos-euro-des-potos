import {useState} from "react";

interface UserProfile {
    id: number;
    email: string;
    userName: string;
    picture?: string | null;
    role?: string | null;
}


interface ProfileProps {
    userProfile: UserProfile | undefined;
}

export default function Profile({userProfile}: ProfileProps) {
    const [image, setImage] = useState({
        preview: '',
        raw: new FormData(),
    });

    const getFileInfo = (e: any) => {
        const formData = new FormData();
        formData.append('my-image-file', e.target.files[0], e.target.files[0].name);
        setImage({
            preview: URL.createObjectURL(e.target.files[0]),
            raw: formData,
        });
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        // const data = {value: 'This is my awesome test value!'};

        fetch('http://localhost:4000/image-upload', {
            method: 'POST',
            body: image.raw
        })
            .then(response => {
                console.log('POST request successful!', response)
            })
    }

    return (

        <form onSubmit={handleSubmit}>
            <h2>Add Image:</h2>
            <input type="file" onChange={getFileInfo}/>
            {image.preview !== "" && <img src={image.preview} alt={`avatar_${userProfile?.userName}`}/>}
            <button type="submit">Upload</button>
        </form>

    )
}