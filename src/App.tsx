import RegisterPage from "./pages/Auth/RegisterPage";

/*
  Características:
  -Componente raíz de la aplicación
  -Actualmente renderiza la página de registro (RegisterPage)
  -Punto de entrada principal del frontend

  @ Ejemplo:
  // Renderiza la aplicación completa
  <App />
*/
function App() {
    return (
        <div className="App">
            <RegisterPage />
        </div>
    )
}
export default App;