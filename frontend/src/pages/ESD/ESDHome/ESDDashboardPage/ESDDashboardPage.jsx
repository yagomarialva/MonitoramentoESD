import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Modal,
  Button,
  TextField,
  Container
} from "@mui/material";
import { CardHeader } from "react-bootstrap";
import Menu from "../../../Menu/Menu";

const ESDDashboardPage = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos"
        );
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  const handleOpen = (todo) => {
    setSelectedTodo(todo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTodo(null);
  };

  return (
    <>
      <Typography paragraph>
        <Container sx={{ mt: -7, ml: 22 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Controle das Estações
            </Typography>
            <Grid container spacing={3}>
              {todos.map((todo) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={todo.id}>
                  <Card
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpen(todo)}
                  >
                    <CardHeader>
                      <Typography
                        sx={{
                          backgroundColor: todo.completed
                            ? "#4caf50"
                            : "#d32f2f",
                          color: "white",
                          cursor: "pointer",
                          justifyContent: "center",
                        }}
                        variant="body2"
                      >
                        {todo.completed ? "PASS" : "FAIL"}
                      </Typography>
                    </CardHeader>
                    <CardContent>
                      <Typography variant="h6">Station: {todo.id}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="todo-modal-title"
              aria-describedby="todo-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  border: "2px solid #000",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                {selectedTodo && (
                  <form>
                    <Typography
                      id="todo-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Station Details
                    </Typography>
                    <TextField
                      label="Title"
                      value={selectedTodo.title}
                      margin="normal"
                      fullWidth
                      disabled
                    />
                    <TextField
                      label="Completed"
                      value={selectedTodo.completed ? "PASS" : "FAIL"}
                      margin="normal"
                      fullWidth
                      disabled
                    />
                    <TextField
                      label="Description"
                      value={selectedTodo.title} // No description available in the API, using title as placeholder
                      margin="normal"
                      fullWidth
                      disabled
                    />
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        onClick={handleClose}
                        variant="contained"
                        color="success"
                        sx={{ mt: 1 }}
                      >
                        Close
                      </Button>
                    </Box>
                  </form>
                )}
              </Box>
            </Modal>
          </Box>
        </Container>
      </Typography>
    </>
  );
};

export default ESDDashboardPage;
