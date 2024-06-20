/* eslint-disable react/react-in-jsx-scope */
import Alert from "react-bootstrap/Alert";

const ToastDefault = (tipo,texto) => {
  // const textoValor = Object.values(texto)[1]
  return (
    <>
      {[Object.values(tipo)[0]].map((variant) => (
        <Alert key={variant} variant={variant}>
          {Object.values(texto)[1]} 
        </Alert>
      ))}
    </>
  );
}

export default ToastDefault;
