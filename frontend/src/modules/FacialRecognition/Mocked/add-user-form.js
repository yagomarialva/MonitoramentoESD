import { Button, TextField } from "@mui/material";
import { useInput } from "../../hooks/use-input";
import { useUsersContext } from "./users-provider";

export const AddUserForm = () => {
  const [nameProps, nameActions] = useInput('');
  const [emailProps, emailActions] = useInput('');

  const { addUser } = useUsersContext();

  const onSubmit = (e) => {
    e.preventDefault();
    addUser(nameProps.value, emailProps.value);
    nameActions.reset();
    emailActions.reset();
  }

  return (
    <form onSubmit={onSubmit} style={{ margin: '24px 0' }}>
      <TextField
        {...nameProps}
        fullWidth
        type="text"
        label="Name"
        variant="outlined"
      />
      <br />
      <br />
      <TextField
        {...emailProps}
        fullWidth
        type="email"
        label="Email"
        variant="outlined"
      />
      <div style={{ textAlign: 'right', marginTop: 12 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit">
          Create
        </Button>
      </div>
    </form>
  );
}