import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button
} from "@mui/material";
import { useUsersContext } from './users-provider';

export const UsersTable = () => {
  const { users, createEditUserTemplate } = useUsersContext();

  const handleEditUserAction = (user) => {
    createEditUserTemplate(user);
  }

  const renderUsers = (users) => {
    return users.map(user => {
      return (
        <TableRow key={user.id}>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                color="info"
                onClick={() => handleEditUserAction(user)}>
                Edit
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );
    })
  }
  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderUsers(users)}</TableBody>
      </Table>
    </TableContainer>
  );
}