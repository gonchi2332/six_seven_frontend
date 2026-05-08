import type { ProjectEntry } from "../features/PersonalProjects/services/personalProjectsService";

export const mockProjects: ProjectEntry[] = [
    {
        id: "1",
        name: "E-commerce Platform",
        description: "Plataforma de comercio electrónico completa con carrito de compras, pasarela de pagos y panel de administración.",
        topic: "Full Stack",
        role: "Desarrollador Full Stack",
        status: "Finalizado",
        links: [
            { label: "GitHub", url: "https://github.com/user/ecommerce" },
            { label: "Deploy", url: "https://ecommerce-demo.com" },
            { label: "GitHub", url: "https://github.com/user/ecommerce" },
            { label: "Deploy", url: "https://ecommerce-demo.com" }

        ],
        imageUrl: "https://via.placeholder.com/300x200/2C666E/ffffff?text=E-commerce",
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-03-20T00:00:00Z"
    },
    {
        id: "2",
        name: "Task Manager App",
        description: "Aplicación de gestión de tareas con drag & drop, colaboración en tiempo real y notificaciones.",
        topic: "Frontend",
        role: "Desarrollador Frontend",
        status: "En proceso",
        links: [
            { label: "GitHub", url: "https://github.com/user/taskmanager" }
        ],
        imageUrl: "https://via.placeholder.com/300x200/2C666E/ffffff?text=Task+Manager",
        createdAt: "2024-02-10T00:00:00Z",
        updatedAt: "2024-04-05T00:00:00Z"
    },
    {
        id: "3",
        name: "Weather Dashboard",
        description: "Dashboard meteorológico con mapas interactivos, gráficos de temperatura y pronóstico semanal.",
        topic: "Frontend",
        role: "Desarrollador UI/UX",
        status: "Finalizado",
        links: [
            { label: "GitHub", url: "https://github.com/user/weather" },
            { label: "Demo", url: "https://weather-dashboard.com" }
        ],
        imageUrl: "https://via.placeholder.com/300x200/2C666E/ffffff?text=Weather+Dashboard",
        createdAt: "2023-11-20T00:00:00Z",
        updatedAt: "2024-01-10T00:00:00Z"
    },
    {
        id: "4",
        name: "Mobile Chat App",
        description: "Aplicación de mensajería instantánea con videollamadas, cifrado end-to-end y mensajes efímeros.",
        topic: "Mobile",
        role: "Desarrollador React Native",
        status: "Cancelado",
        links: [
            { label: "GitHub", url: "https://github.com/user/chat" }
        ],
        imageUrl: "https://via.placeholder.com/300x200/2C666E/ffffff?text=Chat+App",
        createdAt: "2023-09-05T00:00:00Z",
        updatedAt: "2023-12-15T00:00:00Z"
    },
    {
        id: "5",
        name: "Analytics Platform",
        description: "Plataforma de análisis de datos con visualizaciones personalizables y exportación de reportes.",
        topic: "Backend",
        role: "Arquitecto de Software",
        status: "En proceso",
        links: [
            { label: "GitHub", url: "https://github.com/user/analytics" },
            { label: "Demo", url: "https://analytics-demo.com" }
        ],
        imageUrl: "https://via.placeholder.com/300x200/2C666E/ffffff?text=Analytics",
        createdAt: "2024-03-01T00:00:00Z",
        updatedAt: "2024-04-08T00:00:00Z"
    },
    {
        id: "6",
        name: "Portfolio Website",
        description: "Portfolio personal con animaciones, modo oscuro y optimización SEO.",
        topic: "Frontend",
        role: "Diseñador UI/UX",
        status: "Finalizado",
        links: [
            { label: "GitHub", url: "https://github.com/user/portfolio" },
            { label: "Website", url: "https://johndoe.dev" }
        ],
        imageUrl: "https://via.placeholder.com/300x200/2C666E/ffffff?text=Portfolio",
        createdAt: "2024-04-01T00:00:00Z",
        updatedAt: "2024-04-10T00:00:00Z"
    }
];
