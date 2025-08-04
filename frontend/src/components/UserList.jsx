function UserList({ users }) {
  return (
    <div className="user-list">
      <h4>Online Users</h4>
      <ul>
        {users.map((u, i) => (
          <li key={i}>{u.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
