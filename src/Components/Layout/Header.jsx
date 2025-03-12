import { motion } from 'framer-motion';
import DarkMode from '../UI/DarkMode';

const Header = () => {
	return (
		<header className='bg-white dark:bg-gray-800 shadow-md rounded-lg mb-6 transition-colors duration-300'>
			<nav className='container mx-auto px-6 py-4 flex justify-between items-center'>
				<section className='flex items-center gap-3'>
					<motion.div
						initial={{ rotate: 0 }}
						animate={{ rotate: 360 }}
						transition={{ duration: 0.8, ease: 'easeInOut' }}
						className='bg-gradient-to-r from-indigo-500 to-purple-600 p-2.5 rounded-lg text-white shadow-lg'>
						<i className='fa-solid fa-list-check text-xl'></i>
					</motion.div>
					<motion.h1
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.5 }}
						className='text-2xl font-bold text-gray-800 dark:text-white'>
						Tasks
						<span className='bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-extrabold'>
							Flow
						</span>
					</motion.h1>
				</section>

				<div className='flex items-center gap-4'>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className='hidden md:flex items-center gap-2 bg-indigo-50 dark:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium text-indigo-700 dark:text-indigo-300 transition-colors'>
						<i className='fa-solid fa-plus'></i>
						<span>Nueva tarea</span>
					</motion.button>

					<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
						<DarkMode />
					</motion.div>
				</div>
			</nav>
		</header>
	);
};

export default Header;
