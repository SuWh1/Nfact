import React, { useState, useEffect } from 'react'

export default function UserCard(users) {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount((count) => count + 1);
    }

    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            margin: '10px'
        }}>
            <h2>{users.name}</h2>
            <p>{users.age} years old</p>
            <p>From {users.city}</p>
            <hr></hr>

            <p>Likes: {count}</p>
            <button onClick={handleClick}>Like</button>
        </div>
    )
}