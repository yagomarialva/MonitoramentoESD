import { createContext, useContext, useState } from "react";
import { v4 as uuid } from 'uuid';

const UsersContext = createContext();

export const UsersProvider = ({ data, children }) => {
  const [users, setUsers] = useState(data);
  const [editUserTemplate, setEditUserTemplate] = useState(null);

  const createEditUserTemplate = (user) => {
    setEditUserTemplate(user);
  }

  const editUser = (userToEdit) => {
    setUsers(users => {
      return users.map(user => {
        if (user.id === userToEdit.id) {
          user.name = userToEdit.name;
          user.email = userToEdit.email;
        }
        return user;
      });
    });
    setEditUserTemplate(null);
  }

  const addUser = (name, email) => {
    const newUser = {
      id: uuid(),
      name,
      email,
    }

    setUsers(users => [...users, newUser]);
  }
  const deleteUser = (userToDelete) => {
    setUsers(users => {
      return users.filter(user => user.id !== userToDelete.id)
    });
    setEditUserTemplate(null);
  }

  return (
    <UsersContext.Provider value={{ 
      users,
      addUser,
      editUser,
      editUserTemplate,
      createEditUserTemplate,
      deleteUser
    }}>
      {children}
    </UsersContext.Provider>
  );
}

export const useUsersContext = () => useContext(UsersContext);