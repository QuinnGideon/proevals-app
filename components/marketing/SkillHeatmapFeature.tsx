

import React from 'react';
import { BrainCircuit, ClipboardCheck, TrendingUp, Cpu, Heart, Briefcase } from 'lucide-react';
import { SKILL_CATEGORIES } from '../../types';
import { SkillCategory } from '../../types';

const skillIconsMap: Record<SkillCategory, React.ElementType> = {
    "Strategic Thinking": BrainCircuit,
    "Execution & Prioritization": ClipboardCheck,
    "Growth & Monetization": TrendingUp,
    "Technical Acumen": Cpu,
    "User Research & Empathy": Heart,
    "Stakeholder Management": Briefcase
};

interface SkillHeatmapFeatureProps {
    isMini?: boolean;
}

const SkillHeatmapFeature: React.FC<SkillHeatmapFeatureProps> = ({ isMini = false }) => {
    const skills = [...SKILL_CATEGORIES, ...SKILL_CATEGORIES];
    return (
         <div className="heatmap-feature dimension-on">
            <article className={`heatmap-article ${isMini ? 'p-6' : ''}`}>
                 <div className="heatmap-header">
                    <h2>
                        <span>Track Your</span>&nbsp;<span className="gradient-text">Skill Heatmap</span>
                    </h2>
                    {!isMini && <p>Get a granular view of your performance across core PM competencies. Identify your strengths and pinpoint areas for focused improvement.</p>}
                 </div>
                 <div className="heatmap-window">
                     <div className="heatmap-scene">
                         <ul className="heatmap-grid">
                            {skills.map((skill, index) => {
                                const Icon = skillIconsMap[skill as SkillCategory];
                                return (
                                    <li key={index}>
                                        <div className="heatmap-item">
                                            <div className="heatmap-item__icon">
                                                <Icon />
                                            </div>
                                            <div className="heatmap-item__text">{skill}</div>
                                        </div>
                                    </li>
                                );
                            })}
                         </ul>
                     </div>
                 </div>
            </article>
        </div>
    );
};

export default SkillHeatmapFeature;