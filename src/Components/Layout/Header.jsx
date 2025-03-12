import { motion } from 'framer-motion';
import DarkMode from './DarkMode';

const Header = () => {
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
					<div>
						<h1 className='text-xl font-bold text-gray-800 dark:text-white'>
							Tasks<span className='text-indigo-600 dark:text-indigo-400'>Flow</span>
						</h1>
						<p className='text-xs text-gray-500 dark:text-gray-400 hidden sm:block'>
							Gestiona tus tareas de forma eficiente
						</p>
					</div>
				</div>

				<DarkMode />
			</div>
		</header>
	);
};

export default Header;
