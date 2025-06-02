import UserCard from './Components/UserCard'

export default function Props() {
    const users = [
        {id: 1, name: "John", age: 20, city: "New York"},
        {id: 2, name: "Jane", age: 21, city: "Los Angeles"},
        {id: 3, name: "Jim", age: 22, city: "Chicago"}
    ]

    return (
        <div>
            <h1>Users</h1>
            {users.map(user => (
                <UserCard key={user.id} {...user} />
            ))}
        </div>
    )
}