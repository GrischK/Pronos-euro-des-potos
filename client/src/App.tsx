import React from 'react';
import {useUsersQuery} from "./gql/generated/schema";

function App() {
    const {data, error} = useUsersQuery();

    console.log(data, error)

    return (
        <div>
            users: {data?.users}
        </div>
    );
}

export default App;
