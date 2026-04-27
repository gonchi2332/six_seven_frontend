import { SoftSkillsList } from "../features/SoftSkills";

const STYLES = {
    PAGE: "align-start flex flex-col gap-6",
};

const SoftSkillPage = () => {
    return(
        <div className={STYLES.PAGE}>
            <SoftSkillsList />
        </div>
    );
}

export default SoftSkillPage;