import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toggleTheme, selectTheme } from '@/Features/Theme/themeSlice';

const Header = () => {
	const dispatch = useDispatch();
	const theme = useSelector(selectTheme);

	const handleToggleTheme = () => {
		dispatch(toggleTheme());
	};

	return (
		<header className='bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300'>
			<div className='container mx-auto px-4 py-4 flex justify-between items-center'>
				<div className='flex items-center'>
					<motion.div
						initial={{ rotate: 0 }}
						animate={{ rotate: 360 }}
						transition={{ duration: 0.5 }}
						className='text-indigo-600 dark:text-indigo-400 mr-3 text-2xl'>
						<i className='fas fa-tasks'></i>
					</motion.div>
					<h1 className='text-xl font-bold text-gray-800 dark:text-white'>
						Tasks<span className='text-indigo-600 dark:text-indigo-400'>Flow</span>
					</h1>
				</div>

				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={handleToggleTheme}
					className='p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
					aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
					{theme === 'dark' ? (
						<i className='fas fa-sun text-yellow-500'></i>
					) : (
						<i className='fas fa-moon text-indigo-600'></i>
					)}
				</motion.button>
			</div>
		</header>
	);
};

export default Header;
