import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectFilteredTasks } from '@/Features/Tasks/tasksSlice';
import TaskItem from './TaskItem';

const TasksList = () => {
	const tasks = useSelector(selectFilteredTasks) || [];

	// Filtrar tareas inválidas (nulas o indefinidas)
	const validTasks = tasks.filter((task) => task !== null && task !== undefined);

	if (validTasks.length === 0) {
		return (
			<motion.div
				className='text-center p-8 bg-gray-50 dark:bg-gray-700 rounded-lg'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}>
				<h3 className='text-xl font-medium text-gray-500 dark:text-gray-300'>No hay tareas disponibles</h3>
				<p className='text-gray-400 dark:text-gray-400 mt-2'>Agrega una nueva tarea para comenzar</p>
			</motion.div>
		);
	}

	return (
		<ul className='divide-y divide-gray-200 dark:divide-gray-700'>
			<AnimatePresence>
				{validTasks.map((task) => (
					<motion.li
						key={task.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, x: -100 }}
						transition={{ duration: 0.3 }}
						layout>
						<TaskItem task={task} />
					</motion.li>
				))}
			</AnimatePresence>
		</ul>
	);
};

export default TasksList;
