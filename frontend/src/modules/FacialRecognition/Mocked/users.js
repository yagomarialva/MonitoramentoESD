import { Container } from '@mui/material';
import { UsersTable } from './users-table';
import { AddUserForm } from './add-user-form';
import { EditUserForm } from './edit-user-form';
import { useUsersContext } from './users-provider';

export const Users = () => {
  const { editUserTemplate } = useUsersContext();
  
  return (
    <Container 
      maxWidth="md" 
      sx={{ margin: '20px auto' }}>
      {editUserTemplate ? <EditUserForm /> : <AddUserForm />}
      <UsersTable />
    </Container>
  );
}