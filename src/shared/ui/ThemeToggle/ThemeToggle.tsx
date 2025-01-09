import { FC } from 'react';
import { useTheme } from '../../lib/hooks/useTheme';
import styles from './ThemeToggle.module.css';

export const ThemeToggle: FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button 
            className={styles.toggle}
            onClick={toggleTheme}
            data-theme={theme}
            aria-label="Toggle theme"
        />
    );
};
