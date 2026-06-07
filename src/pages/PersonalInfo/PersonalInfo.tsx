import { PersonalInfoComponent } from '../../features/PersonalInfo/components';

/*
  Características:
  -Página que renderiza el componente de información personal
  -Actúa como wrapper o punto de entrada para la funcionalidad de información personal
  -Delega toda la lógica y UI al componente PersonalInfoComponent

  @ Ejemplo:
  // Ruta: /info-personal
  <PersonalInfoPage />
*/
const PersonalInfoPage = () => {
    return <PersonalInfoComponent />;
};

export default PersonalInfoPage;
