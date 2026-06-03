// src/features/CV/hooks/useCVData.ts

import { useState, useEffect } from "react";
import { useEducation } from "../../Education/hooks/useEducation";
import { fetchSkillsPublicNew } from "../../HardSkills/services/skillsService";
import { useSoftSkills } from "../../SoftSkills/hooks/userSoftSkills";
import { useCertificates } from "../../Certificates/hooks/useCertificates";
import { useWorkExperiences } from "../../WorkExperience/hooks/useWorkExperiences";
import { useProjects } from "../../PersonalProjects/hooks/useProjects";
import { usePersonalInfo } from "../../../hooks/useNavbarInfo";
import type { Skill } from "../types/cv.types";

export const useCVData = (username: string) => {
    const {
        publicEntries: education,
        isLoadingPublic: isLoadingEducation,
        setPublicUser: setPublicUserEducation,
    } = useEducation();

    const {
        publicSkills: softSkills,
        isLoadingPublic: isLoadingSoftSkills,
        setPublicUser: setPublicUserSoftSkills,
    } = useSoftSkills();

    const {
        publicCertificates: certificates,
        isLoadingPublic: isLoadingCertificates,
        setPublicUser: setPublicUserCertificates,
    } = useCertificates();

    const {
        publicExperiences: workExperiences,
        isLoadingPublic: isLoadingWorkExperiences,
        setPublicUser: setPublicUserWorkExperiences,
    } = useWorkExperiences();

    const {
        publicProjects: projects,
        isLoadingPublic: isLoadingProjects,
        setPublicUser: setPublicUserProjects,
    } = useProjects();

    const {
        publicInfo: personalInfo,
        isLoadingPublic: isLoadingPersonalInfo,
        setPublicUser: setPublicUserPersonalInfo,
    } = usePersonalInfo();

    const [hardSkills, setHardSkills] = useState<Skill[]>([]);

    useEffect(() => {
        if (!username) return;
        setPublicUserEducation(username);
        setPublicUserSoftSkills(username);
        setPublicUserCertificates(username);
        setPublicUserWorkExperiences(username);
        setPublicUserProjects(username);
        setPublicUserPersonalInfo(username);
    }, [
        username,
        setPublicUserEducation,
        setPublicUserSoftSkills,
        setPublicUserCertificates,
        setPublicUserWorkExperiences,
        setPublicUserProjects,
        setPublicUserPersonalInfo,
    ]);

    useEffect(() => {
        if (!username) return;
        fetchSkillsPublicNew(username)
            .then((response) => {
                const raw = response?.data?.hardSkills ?? response?.skills ?? response?.data ?? [];
                const formatted: Skill[] = raw.map((s: any, i: number) => ({
                    skill_id: s.id ?? s.skill_id ?? i,
                    name: s.name,
                    level: s.level ?? s.punctuation ?? 0,
                    visible: true,
                }));
                setHardSkills(formatted);
            })
            .catch(console.error);
    }, [username]);

    const isLoading =
        isLoadingEducation ||
        isLoadingSoftSkills ||
        isLoadingCertificates ||
        isLoadingWorkExperiences ||
        isLoadingProjects ||
        isLoadingPersonalInfo;

    return {
        education,
        softSkills,
        certificates,
        workExperiences,
        projects,
        personalInfo,
        hardSkills,
        isLoading,
    };
};
