# 🚀 Pull Request

## 📝 Descripción
**Tipo de cambio:**
- [ ] Feat (Nueva funcionalidad)
- [ ] Fix (Corrección de errores)
- [ ] Chore (Mantenimiento, dependencias, configuración)
- [ ] Style (Cambios visuales, CSS, formato)
- [ ] Performance (Mejora de rendimiento)

## 🔗 Tickets o enlaces relacionados
Ticket: 
---

## 🛠️ Checklist de Convenciones (Basado en v1.0)

### 🏗️ Arquitectura y Estructura
- [ ] Los archivos están en la carpeta correcta (`features/` vs `components/` vs `pages/`).
- [ ] Se han seguido las reglas de nombrado (`PascalCase` para componentes, `camelCase` para hooks).
- [ ] No hay lógica de negocio en componentes de presentación.

### 🧪 Calidad de Código
- [ ] No hay `console.log()` ni código comentado.
- [ ] Se han destructurado las `props` y definido `PropTypes` o tipos de TS.
- [ ] Las llamadas a API están centralizadas en `services/` o `api.js` (no hay `fetch` directo).
- [ ] El estado se maneja según la regla de oro (Local vs Global vs Server state).

### 🎨 Estilos y UI
- [ ] Se ha seguido la estrategia de estilos acordada (sin `!important` ni inline styles innecesarios).
- [ ] El diseño es responsivo y respeta los tokens de diseño.
- [ ] Se han añadido etiquetas `alt` a imágenes y `labels` a inputs (a11y).

### ⚙️ Otros
- [ ] ¿Hay nuevas variables de entorno? Si es así, se agregaron a `.env.example`.
- [ ] Se han añadido/actualizado tests si la lógica es crítica.
- [ ] El commit sigue el formato **Conventional Commits**.

---

## 📸 Capturas de Pantalla / Grabaciones
## 🧪 ¿Cómo probar estos cambios?
1. Hacer `npm install`
2. Ir a la ruta `/ejemplo`
3. Click en el botón 'X' y verificar...