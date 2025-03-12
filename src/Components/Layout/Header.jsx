// ? Importaciones
import { motion } from 'framer-motion';
import packageJson from '../../../package.json';

// ? Componentes
import DarkMode from '../UI/DarkMode';

const Header = () => {
	return (
		<header className='bg-white dark:bg-gray-800 shadow-md rounded-lg mb-6 transition-colors duration-300'>
			<nav className='container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center'>
				<section className='flex items-center gap-3 flex-1 min-w-0'>
					<motion.div
						initial={{ rotate: 0 }}
						animate={{ rotate: 360 }}
						transition={{ duration: 0.8, ease: 'easeInOut' }}
						className='bg-gradient-to-r from-indigo-500 to-purple-600 p-2 sm:p-2.5 rounded-lg text-white shadow-lg flex-none'>
						<i className='fa-solid fa-list-check text-lg sm:text-xl'></i>
					</motion.div>
					<motion.h1
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.5 }}
						className='text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate'>
						Tasks
						<span className='bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-extrabold'>
							Flow
						</span>
						<span className='text-xs text-gray-500 dark:text-gray-400 ml-2'>
							v{packageJson.version}
						</span>
					</motion.h1>
				</section>

				<div className='flex items-center gap-2 sm:gap-4'>
					<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className='relative z-10'>
						<DarkMode />
					</motion.div>
				</div>
			</nav>
		</header>
	);
};

export default Header;
