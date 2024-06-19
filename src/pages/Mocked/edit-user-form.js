import { useEffect } from "react";
import { useInput } from "../../hooks/use-input";
import { useUsersContext } from "./users-provider";
import { Button, TextField } from "@mui/material";

export const EditUserForm = () => {
  const [nameProps, nameActions] = useInput('');
  const [emailProps, emailActions] = useInput('');

  const { editUser, editUserTemplate } = useUsersContext();

  useEffect(() => {
    const { name, email, company } = editUserTemplate;

    nameActions.update(name);
    emailActions.update(email);

  }, [editUserTemplate]);

  const onSubmit = (e) => {
    e.preventDefault();
    editUser({
      id: editUserTemplate.id,
      name: nameProps.value,
      email: emailProps.value,
    })
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
          Save
        </Button>
      </div>
    </form>
  );
}