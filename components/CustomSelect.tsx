import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface CustomSelectProps {
    options: readonly string[];
    value: string;
    onChange: (value: string) => void;
    labelId?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, labelId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={selectRef} className="relative">
            <button
                type="button"
                onClick={handleToggle}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                {...(labelId && { 'aria-labelledby': labelId })}
                className="relative w-full cursor-pointer rounded-md bg-[var(--color-bg-primary)] py-3 pl-3 pr-10 text-left border border-[var(--color-border-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)] sm:text-sm"
            >
                <span className="block truncate text-[var(--color-text-primary)]">{value}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </span>
            </button>

            {isOpen && (
                <ul
                    role="listbox"
                    aria-activedescendant={value}
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[var(--color-bg-secondary)] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-[var(--color-border-primary)] animate-dropdown-enter origin-top"
                >
                    {options.map((option) => (
                        <li
                            key={option}
                            id={option}
                            role="option"
                            aria-selected={option === value}
                            onClick={() => handleSelect(option)}
                            className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
                        >
                            {option === value && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--color-brand-primary)]">
                                    <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                            )}
                            <span className={`block truncate ${option === value ? 'font-semibold text-[var(--color-text-primary)]' : 'font-normal'}`}>
                                {option}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
