import { AnimatePresence, motion } from 'framer-motion';

import TaskList from '@/Components/Tasks/TasksList';
import TaskForm from '@/Components/Tasks/TaskForm';
import TaskFilter from '@/Components/Tasks/TaskFilter';

const Home = () => {
	return (
		<>
			<div>
				<motion.h1
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5 }}
					className='text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4'>
					¡Bienvenido a TasksFlow!
				</motion.h1>
			</div>
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 transition-colors duration-300'>
				<div className='flex flex-col'>
					<div className='flex items-center justify-between mb-4'>
						<h1 className='text-lg sm:text-xl font-semibold text-gray-800 dark:text-white'>
							Añadir Nueva Tarea
						</h1>
					</div>
					<TaskForm />
				</div>
			</div>
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors duration-300'>
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
					<h2 className='text-lg sm:text-xl font-semibold text-gray-800 dark:text-white'>Mis Tareas</h2>
				</div>
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}>
						<TaskFilter />
					</motion.div>
				</AnimatePresence>
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}>
						<TaskList />
					</motion.div>
				</AnimatePresence>
			</div>
		</>
	);
};

export default Home;
