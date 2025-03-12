import { motion } from 'framer-motion';
import DarkMode from '../UI/DarkMode';

const Header = () => {
	return (
		<header className='bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300'>
			<nav className='container mx-auto px-4 py-4 flex justify-between items-center'>
				<section className='flex items-center'>
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
				</section>

				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}>
					<DarkMode />
				</motion.button>
			</nav>
		</header>
	);
};

export default Header;
