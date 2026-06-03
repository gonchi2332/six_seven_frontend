
export interface Skill {
    skill_id: number;
    name: string;
    level: number;
    visible: boolean;
}

export interface PersonalInfo {
    names: string | null;
    first_surname: string | null;
    second_surname: string | null;
    username: string;
    contact_email: string | null;
    phone_number: string | null;
    residence_city_name: string | null;
    residence_country_name: string | null;
}

export interface CVDocumentProps {
    username: string;
    personalInfo: PersonalInfo | null;
    education: import("../../Education/services/educationService").EducationEntry[];
    workExperiences: import("../../WorkExperience/services/workExperienceService").WorkExperienceBackend[];
    projects: import("../../PersonalProjects/services/personalProjectsService").ProjectEntry[];
    hardSkills: Skill[];
    softSkills: { skill_id: string; name: string; visible: boolean }[];
    certificates: import("../../Certificates/services/certificateService").Certificate[];
}
