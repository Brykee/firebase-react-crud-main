import { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase-config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

function App() {
  const [newName, setNewName] = useState('');
  const [newTardy, setNewTardy] = useState(0);

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, 'users');

  const createUser = async () => {
    await addDoc(usersCollectionRef, {
      name: newName,
      tardy: Number(newTardy),
    }).then(() => {
      alert('User Created');
    });
  };

  const updateUser = async (id, tardy) => {
    const userDoc = doc(db, 'users', id);
    const newFields = { tardy: tardy + 1 };
    await updateDoc(userDoc, newFields);
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, 'users', id);
    await deleteDoc(userDoc);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, []);

  return (
    <div className="App">
      <h1>Tardy List</h1>
      <input
        placeholder="Name..."
        onChange={(event) => {
          setNewName(event.target.value);
        }}
      />
      <input
        type="number"
        placeholder="Number of Tardies..."
        onChange={(event) => {
          setNewTardy(event.target.value);
        }}
      />
      <br />
      <button onClick={createUser}> Create User</button>

      {users.map((user) => {
        return (
          <div>
            <h2>Name: {user.name}</h2>
            <h2>Tardies: {user.tardy}</h2>
            <button
              onClick={() => {
                updateUser(user.id, user.tardy);
              }}
            >
              Add Tardy
            </button>
            <button
              onClick={() => {
                deleteUser(user.id);
              }}
            >
              Delete User
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
