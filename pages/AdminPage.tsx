


import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Drill, PM_LEVELS, SKILL_CATEGORIES, PmLevel, SkillCategory } from '../types';
import * as dataService from '../services/localDataService';
import { seedLeaderboardData, SEED_DRILLS } from '../utils/seedData';
import { AlertTriangle, CheckCircle, UploadCloud, Users, Trash2, Edit, X, BookOpen, Code, ArrowUp, ArrowDown, Star } from 'lucide-react';
import { Alert } from '../App';
import CustomSelect from '../components/CustomSelect';

// Edit Modal for a single Drill
const DrillEditModal: React.FC<{ drill: Drill; onSave: (drill: Drill) => void; onClose: () => void; }> = ({ drill, onSave, onClose }) => {
    const [formData, setFormData] = useState<Drill>(drill);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let parsedValue: string | number | undefined = type === 'number' ? parseInt(value, 10) || 0 : value;
        
        if (name === 'strategic_alternative' && value === 'None') {
            const { strategic_alternative, strategic_alternative_rationale, ...rest } = formData;
            setFormData(rest as Drill);
            return;
        }

        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };
    
    const handleCustomSelectChange = (name: keyof Drill, value: string) => {
        if (name === 'strategic_alternative' && value === 'None') {
            // Create a new object without the strategic fields
            const { strategic_alternative, strategic_alternative_rationale, ...rest } = formData;
            setFormData(rest as Drill);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const peerSum = formData.peer_data_a + formData.peer_data_b + formData.peer_data_c + formData.peer_data_d;
        if (Math.round(peerSum) !== 100) {
            setError(`Peer data percentages must sum to 100. Current sum: ${peerSum}.`);
            return;
        }
        if (formData.strategic_alternative && !formData.strategic_alternative_rationale) {
            setError('A rationale must be provided for the strategic alternative.');
            return;
        }
        setError(null);
        onSave(formData);
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in-up" onClick={onClose}>
            <div className="bg-[var(--color-bg-secondary)] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-[var(--color-border-primary)] sticky top-0 bg-[var(--color-bg-secondary)] z-10">
                         <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Edit Drill</h2>
                            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)]">Drill ID: {formData.drill_id}</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
                        
                        {/* Core Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="title" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Optimal Choice</label>
                                <CustomSelect options={['A','B','C','D']} value={formData.optimal_choice} onChange={(val) => handleCustomSelectChange('optimal_choice', val)}/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Target PM Level</label>
                                <CustomSelect options={[...PM_LEVELS]} value={formData.target_pm_level} onChange={(val) => handleCustomSelectChange('target_pm_level', val)}/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Skill Category</label>
                                <CustomSelect options={[...SKILL_CATEGORIES]} value={formData.skill_category} onChange={(val) => handleCustomSelectChange('skill_category', val)}/>
                            </div>
                        </div>

                         <div>
                            <label htmlFor="core_scenario_text" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Core Scenario</label>
                            <textarea name="core_scenario_text" value={formData.core_scenario_text} onChange={handleChange} rows={4} className="w-full p-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-md"/>
                        </div>

                        {/* Stakeholders */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[var(--color-border-primary)] pt-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="space-y-2">
                                     <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Stakeholder {i} Role</label>
                                     <input type="text" name={`stakeholder_${i}_role`} value={formData[`stakeholder_${i}_role` as keyof Drill] as string} onChange={handleChange} className="w-full p-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-md"/>
                                     <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Stakeholder {i} Quote</label>
                                     <textarea name={`stakeholder_${i}_quote`} value={formData[`stakeholder_${i}_quote` as keyof Drill] as string} onChange={handleChange} rows={3} className="w-full p-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-md"/>
                                </div>
                            ))}
                        </div>
                        
                        {/* Options & Rationales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--color-border-primary)] pt-4">
                            {['a', 'b', 'c', 'd'].map(opt => (
                                <div key={opt} className="space-y-2">
                                    <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Option {opt.toUpperCase()}</label>
                                    <textarea name={`option_${opt}`} value={formData[`option_${opt}` as keyof Drill] as string} onChange={handleChange} rows={2} className="w-full p-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-md"/>
                                    <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Rationale for {opt.toUpperCase()}</label>
                                    <textarea name={`rationale_for_${opt}`} value={formData[`rationale_for_${opt}` as keyof Drill] as string} onChange={handleChange} rows={3} className="w-full p-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-md"/>
                                </div>
                            ))}
                        </div>

                        {/* Strategic Alternative */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[var(--color-border-primary)] pt-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Strategic Alternative</label>
                                <CustomSelect options={['None', 'A', 'B', 'C', 'D']} value={formData.strategic_alternative || 'None'} onChange={(val) => handleCustomSelectChange('strategic_alternative', val)}/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Strategic Alternative Rationale</label>
                                <textarea name="strategic_alternative_rationale" value={formData.strategic_alternative_rationale || ''} onChange={handleChange} rows={3} className="w-full p-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-md" disabled={!formData.strategic_alternative}/>
                            </div>
                        </div>


                         <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Expert Analysis</label>
                            <textarea name="expert_analysis_text" value={formData.expert_analysis_text} onChange={handleChange} rows={4} className="w-full p-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-md"/>
                        </div>

                         {/* Peer Data */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[var(--color-border-primary)] pt-4">
                            {['a', 'b', 'c', 'd'].map(opt => (
                                <div key={opt}>
                                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Peer Data {opt.toUpperCase()} (%)</label>
                                    <input type="number" name={`peer_data_${opt}`} value={formData[`peer_data_${opt}` as keyof Drill] as number} onChange={handleChange} min="0" max="100" className="w-full p-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-md"/>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 border-t border-[var(--color-border-primary)] sticky bottom-0 bg-[var(--color-bg-secondary)] z-10 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-md text-sm font-medium transition hover:bg-[var(--color-bg-tertiary)]">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium transition">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
};

const validateAndProcessDrills = (newDrills: any[], currentBank: Drill[], { isReplacing }: { isReplacing: boolean }): { processedDrills: Drill[], errors: string[], warnings: string[] } => {
    const errors: string[] = [];
    let warnings: string[] = [];
    const processedDrills: Drill[] = [];
    const existingIds = isReplacing ? new Set<string>() : new Set(currentBank.map(d => d.drill_id));
    const newDrillIds = new Set<string>();
    
    const requiredFields: (keyof Drill)[] = [
        'drill_id', 'title', 'target_pm_level', 'skill_category', 'core_scenario_text', 
        'stakeholder_1_role', 'stakeholder_1_quote', 'stakeholder_2_role', 'stakeholder_2_quote', 
        'stakeholder_3_role', 'stakeholder_3_quote', 'option_a', 'option_b', 'option_c', 'option_d', 
        'optimal_choice', 'expert_analysis_text', 'rationale_for_a', 'rationale_for_b', 
        'rationale_for_c', 'rationale_for_d', 'peer_data_a', 'peer_data_b', 'peer_data_c', 'peer_data_d'
    ];

    if (!Array.isArray(newDrills)) {
        errors.push("Input must be an array of drill objects.");
        return { processedDrills, errors, warnings };
    }

    newDrills.forEach((drill, index) => {
        let errorPrefix = `Drill at index ${index} (Title: '${drill.title || 'N/A'}')`;
        let validationFailed = false;

        for (const key of requiredFields) {
            if (!(key in drill)) {
                errors.push(`${errorPrefix}: Missing required field '${key}'.`);
                validationFailed = true;
            }
        }
        if(validationFailed) return;

        // Check non-empty strings for a subset of critical fields
        (['title', 'core_scenario_text', 'expert_analysis_text'] as (keyof Drill)[]).forEach(field => {
             if (typeof drill[field] !== 'string' || (drill[field] as string).trim() === '') {
                errors.push(`${errorPrefix}: Field '${field}' must be a non-empty string.`);
                validationFailed = true;
            }
        });
       
        if (!PM_LEVELS.includes(drill.target_pm_level)) {
            errors.push(`${errorPrefix}: 'target_pm_level' of '${drill.target_pm_level}' is invalid.`);
            validationFailed = true;
        }
        if (!SKILL_CATEGORIES.includes(drill.skill_category)) {
            errors.push(`${errorPrefix}: 'skill_category' of '${drill.skill_category}' is invalid.`);
            validationFailed = true;
        }
        if (!['A', 'B', 'C', 'D'].includes(drill.optimal_choice)) {
            errors.push(`${errorPrefix}: 'optimal_choice' must be 'A', 'B', 'C', or 'D'.`);
            validationFailed = true;
        }
        if (drill.strategic_alternative && !['A', 'B', 'C', 'D'].includes(drill.strategic_alternative)) {
             errors.push(`${errorPrefix}: 'strategic_alternative' must be 'A', 'B', 'C', or 'D'.`);
             validationFailed = true;
        }
        if (drill.strategic_alternative && (!drill.strategic_alternative_rationale || typeof drill.strategic_alternative_rationale !== 'string')) {
             errors.push(`${errorPrefix}: A non-empty 'strategic_alternative_rationale' string must be provided if 'strategic_alternative' is set.`);
             validationFailed = true;
        }


        const peerSum = ['a', 'b', 'c', 'd'].reduce((sum, opt) => {
            const val = drill[`peer_data_${opt}`];
            if(typeof val !== 'number' || val < 0 || val > 100) {
                 errors.push(`${errorPrefix}: 'peer_data_${opt}' must be a number between 0 and 100.`);
                 validationFailed = true;
            }
            return sum + (val || 0);
        }, 0);
        if (Math.round(peerSum) !== 100) {
            errors.push(`${errorPrefix}: Peer data percentages must sum to 100. Current sum: ${peerSum}.`);
            validationFailed = true;
        }
        
        if (validationFailed) return;

        let finalDrill = { ...drill } as Drill;
        if (!finalDrill.drill_id || newDrillIds.has(finalDrill.drill_id) || existingIds.has(finalDrill.drill_id)) {
            const oldId = finalDrill.drill_id || `(no ID)`;
            const newId = `drill_${Date.now()}_${index}`;
            warnings.push(`Drill '${finalDrill.title}' with original ID '${oldId}' was assigned a new unique ID.`);
            finalDrill.drill_id = newId;
        }
        
        existingIds.add(finalDrill.drill_id);
        newDrillIds.add(finalDrill.drill_id);
        processedDrills.push(finalDrill);
    });

    return { processedDrills, errors, warnings };
};


const AdminPage: React.FC = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [drills, setDrills] = useState<Drill[]>([]);
    const [editingDrill, setEditingDrill] = useState<Drill | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Drill; direction: 'ascending' | 'descending' }>({ key: 'drill_id', direction: 'descending' });

    const refreshDrills = () => {
        const allDrills = dataService.getDrillBank();
        setDrills(allDrills);
    };

    useEffect(() => {
        refreshDrills();
    }, []);

    const sortedDrills = useMemo(() => {
        let sortableItems = [...drills];
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [drills, sortConfig]);

    const requestSort = (key: keyof Drill) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleJsonUpload = (isReplacing: boolean) => {
        setMessage(null);
        let processedInput = jsonInput.trim();
        let rawDrills;
    
        if (!processedInput) {
            setMessage({ type: 'error', text: 'Input is empty.' });
            return;
        }
    
        try {
            // Attempt to parse as-is first
            const parsedData = JSON.parse(processedInput);
            
            if (parsedData.drills && Array.isArray(parsedData.drills)) { // { drills: [...] }
                rawDrills = parsedData.drills;
            } else if (Array.isArray(parsedData)) { // [...]
                rawDrills = parsedData;
            } else if (typeof parsedData === 'object' && !Array.isArray(parsedData) && parsedData !== null) { // {...}
                rawDrills = [parsedData];
            } else {
                 throw new Error("Unrecognized but valid JSON structure.");
            }
        } catch (e) {
            // If initial parsing fails, try to fix it by wrapping in an array.
            // This handles common copy-paste errors like `{...}, {...}`
            if (!processedInput.startsWith('[')) {
                processedInput = `[${processedInput}]`;
            }
            try {
                const fixedParsedData = JSON.parse(processedInput);
                if (Array.isArray(fixedParsedData)) {
                    rawDrills = fixedParsedData;
                } else {
                    throw new Error("Corrected input was not an array of drills.");
                }
            } catch (finalError: any) {
                setMessage({ type: 'error', text: `Invalid JSON format. Please check for syntax errors like missing commas or brackets. Error: ${finalError.message}` });
                return;
            }
        }
        
        if (!rawDrills || rawDrills.length === 0) {
            setMessage({ type: 'error', text: 'No drills found in the provided JSON.' });
            return;
        }
    
        const currentBank = dataService.getDrillBank();
        const { processedDrills, errors, warnings } = validateAndProcessDrills(rawDrills, currentBank, { isReplacing });
        
        if (errors.length > 0) {
            setMessage({ type: 'error', text: `Validation failed: ${errors.join('; ')}` });
            return;
        }
    
        if (processedDrills.length === 0) {
            setMessage({ type: 'error', text: 'No valid drills were processed. Please check your data.' });
            return;
        }
    
        if (isReplacing) {
            dataService.replaceDrillBank(processedDrills);
        } else {
            processedDrills.forEach(d => dataService.addDrillToBank(d));
        }
        
        let successMessage = `Successfully ${isReplacing ? 'replaced bank with' : 'added'} ${processedDrills.length} drill(s).`;
        if (warnings.length > 0) {
            successMessage += ` ${warnings.length} ID(s) regenerated automatically.`;
        }
    
        setMessage({ type: 'success', text: successMessage });
        setJsonInput('');
        refreshDrills();
    };
    
    const handleSeedLeaderboard = () => {
        if(dataService.isLeaderboardSeeded()){
            setMessage({ type: 'error', text: 'Leaderboard has already been seeded. Reset seed status to re-seed.' });
            return;
        }
        seedLeaderboardData();
        dataService.markLeaderboardAsSeeded();
        setMessage({ type: 'success', text: 'Successfully seeded mock leaderboard data.' });
    };

    const handleResetSeedStatus = () => {
        dataService.resetLeaderboardSeedStatus();
        setMessage({ type: 'success', text: 'Leaderboard seed status has been reset. You can now re-seed.' });
    };
    
    const handleUpdateDrill = (updatedDrill: Drill) => {
        dataService.updateDrill(updatedDrill.drill_id, updatedDrill);
        setMessage({ type: 'success', text: `Drill "${updatedDrill.title}" updated successfully.` });
        setEditingDrill(null);
        refreshDrills();
    };
    
    const handleDeleteDrill = (drillId: string, drillTitle: string) => {
        if (window.confirm(`Are you sure you want to delete the drill "${drillTitle}"? This cannot be undone.`)) {
            dataService.deleteDrill(drillId);
            setMessage({ type: 'success', text: `Drill "${drillTitle}" has been deleted.` });
            refreshDrills();
        }
    };

    const SortableHeader: React.FC<{ sortKey: keyof Drill, label: string, className?: string }> = ({ sortKey, label, className }) => (
        <div onClick={() => requestSort(sortKey)} className={`flex items-center gap-1 cursor-pointer hover:text-[var(--color-text-primary)] transition-colors ${className}`}>
            {label}
            {sortConfig.key === sortKey ? (
                sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
            ) : null}
        </div>
    );

    return (
        <div className="py-12 sm:py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Admin Panel</h1>
                    <p className="mt-2 text-[var(--color-text-secondary)]">Content Management</p>

                    {message && (
                        <div className="my-6">
                            <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} />
                        </div>
                    )}

                    <div className="mt-8 p-8 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] space-y-8">
                        
                        {/* Drill Management CMS */}
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] flex items-center">
                                <BookOpen className="mr-2"/> Drill Management ({drills.length} Drills)
                            </h2>
                             <div className="grid grid-cols-12 gap-2 p-3 mt-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                                <SortableHeader sortKey="title" label="Title" className="col-span-12 md:col-span-5" />
                                <SortableHeader sortKey="skill_category" label="Skill" className="col-span-5 md:col-span-2" />
                                <SortableHeader sortKey="target_pm_level" label="Level" className="col-span-5 md:col-span-2" />
                                <div className="col-span-2 text-center">Flags</div>
                                <div className="col-span-12 md:col-span-1 text-right">Actions</div>
                            </div>
                            <div className="mt-1 space-y-2 max-h-96 overflow-y-auto pr-2">
                                {sortedDrills.map(drill => (
                                    <div key={drill.drill_id} className="grid grid-cols-12 gap-2 items-center p-3 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border-primary)]">
                                        <div className="col-span-12 md:col-span-5 font-semibold truncate" title={drill.title}>{drill.title}</div>
                                        <div className="col-span-5 md:col-span-2 text-xs text-[var(--color-text-secondary)]">{drill.skill_category}</div>
                                        <div className="col-span-5 md:col-span-2 text-xs text-[var(--color-text-secondary)]">{drill.target_pm_level}</div>
                                        <div className="col-span-2 flex justify-center items-center gap-2">
                                            {drill.strategic_alternative && <span title={`Strategic Alt: ${drill.strategic_alternative}`}><Star size={16} className="text-sky-400"/></span>}
                                        </div>
                                        <div className="col-span-12 md:col-span-1 flex items-center justify-end gap-2">
                                            <button onClick={() => setEditingDrill(drill)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-full transition" aria-label={`Edit drill: ${drill.title}`}><Edit size={16}/></button>
                                            <button onClick={() => handleDeleteDrill(drill.drill_id, drill.title)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition" aria-label={`Delete drill: ${drill.title}`}><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-[var(--color-border-primary)] pt-8">
                            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] flex items-center"><UploadCloud className="mr-2"/>Drill Seeder</h2>
                            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Paste JSON to add or replace drills. Accepts a single object, an array `[...]`, or a `{ "drills": [...] }` object.</p>
                            <textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder='{ "drills": [ ... ] } or [ ... ] or { ... } or even {...}, {...}'
                                className="mt-4 w-full h-48 p-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-md font-mono text-sm"
                            />
                            <div className="mt-4 flex space-x-4">
                                <button onClick={() => handleJsonUpload(true)} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm font-medium transition">Replace Bank</button>
                                <button onClick={() => handleJsonUpload(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium transition">Add to Bank</button>
                            </div>
                        </div>

                        <div className="border-t border-[var(--color-border-primary)] pt-8">
                            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] flex items-center"><Users className="mr-2"/>Leaderboard Seeder</h2>
                             <p className="text-sm text-[var(--color-text-secondary)] mt-1">Populate or reset the mock leaderboard data.</p>
                            <div className="mt-4 flex space-x-4">
                                <button onClick={handleSeedLeaderboard} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm font-medium transition">Seed Leaderboard</button>
                                <button onClick={handleResetSeedStatus} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white text-sm font-medium transition flex items-center"><Trash2 className="h-4 w-4 mr-1"/> Reset Seed Status</button>
                            </div>
                        </div>
                        
                        <div className="border-t border-[var(--color-border-primary)] pt-8">
                             <details className="group">
                                <summary className="cursor-pointer text-xl font-semibold text-[var(--color-text-primary)] flex items-center list-none">
                                    <Code className="mr-2"/> Definitive Drill JSON Structure
                                    <span className="ml-2 text-[var(--color-text-secondary)] group-open:rotate-90 transition-transform">&#9656;</span>
                                </summary>
                                <div className="mt-4 p-4 bg-[var(--color-bg-primary)] rounded-md border border-[var(--color-border-primary)] space-y-4">
                                    <div>
                                        <h4 className="font-bold text-[var(--color-text-primary)]">Important Notes on Seeding:</h4>
                                        <ul className="list-disc list-inside text-sm text-[var(--color-text-secondary)] mt-2 space-y-1">
                                            <li><span className="font-semibold text-[var(--color-text-primary)]">Automatic ID Generation:</span> If you provide a `drill_id` that is missing or already exists, the system will automatically generate a new, unique ID for that drill.</li>
                                            <li><span className="font-semibold text-[var(--color-text-primary)]">Strict Validation:</span> All required fields are checked. If any field is missing, empty, or has an invalid value (e.g., incorrect skill category), the operation will be rejected with a specific error message.</li>
                                            <li><span className="font-semibold text-[var(--color-text-primary)]">Peer Data:</span> All four `peer_data` fields must be numbers, and their sum must equal 100.</li>
                                            <li><span className="font-semibold text-[var(--color-text-primary)]">Strategic Alternative:</span> The `strategic_alternative` and `strategic_alternative_rationale` fields are <span className="font-bold">optional</span>. If you provide one, you must provide both.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[var(--color-text-primary)]">JSON Template:</h4>
                                        <p className="text-sm text-[var(--color-text-secondary)] mb-2">Use this structure for each object inside the `"drills"` array.</p>
                                        <pre className="text-xs text-left whitespace-pre-wrap overflow-x-auto bg-black/50 text-white p-4 rounded-md">
                                            <code>{JSON.stringify(SEED_DRILLS.find(d => d.strategic_alternative) || SEED_DRILLS[0], null, 2)}</code>
                                        </pre>
                                    </div>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
            {editingDrill && <DrillEditModal drill={editingDrill} onSave={handleUpdateDrill} onClose={() => setEditingDrill(null)} />}
        </div>
    );
};

export default AdminPage;