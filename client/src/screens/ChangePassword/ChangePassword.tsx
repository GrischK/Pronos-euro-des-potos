import {useParams} from "react-router-dom";
import {useState} from "react";
import {useFetchTokenQuery, useChangePasswordMutation} from "../../gql/generated/schema";

export default function ChangePassword() {
    const [serverToken, setServerToken] = useState({});

    const { token, id } = useParams();

    const cleanId = id?.replace(/[:]+/g, "") ?? "0";
    console.log(cleanId)

    const [credentials, setCredentials] = useState({
        id: id ?? "",
        newPassword: "",
    });

    useFetchTokenQuery({
        // + turns string into number
        variables: { fetchTokenId: +cleanId },
        onCompleted: (response) => {
            //response back to client from server is the token saved in the database
            setServerToken(JSON.stringify(response.fetchToken.changePasswordToken));
        },
    });

    const [changePassword] = useChangePasswordMutation();

    const cleanServerToken = JSON.stringify(serverToken)
        .replace(/[\\]/g, "")
        .replace(/['"]+/g, "");
    const cleanToken = token?.replace(/[:]+/g, "");

    if (!token || cleanToken !== cleanServerToken)
        return (
            <div>
                {/* <img src={lost} alt="lost" /> */}
                <p>OOOPPS invalid token</p>
            </div>
        );
    return(
        <form
            // style={passwordResetContainerStyles}
            onSubmit={(e) => {
                e.preventDefault();
                changePassword({variables: {newPassword: credentials.newPassword, changePasswordId: +credentials.id}})
                    .then(() => {
                        console.log("success");
                    })
                    .catch(console.error);
            }}
        >
            <label htmlFor="newPassword">
                <input
                    // style={inputStyles}
                    // type={showPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder="Nouveau mot de passe"
                    value={credentials.newPassword}
                    onChange={(e) =>
                        setCredentials({id: cleanId ?? "", newPassword: e.target.value})
                    }
                ></input>
                {/*<button type="button"*/}
                {/*        onClick={togglePassword}>{showPassword ? "Hide password" : "Show password"}</button>*/}
            </label>
            <div>
                {/*<button style={secondaryButtonStyles}>Retour</button>*/}
                <button type="submit"
                        // style={primaryButtonStyles}
                    >
                    Valider
                </button>
            </div>
        </form>
    )
}