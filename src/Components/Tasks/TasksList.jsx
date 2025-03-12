import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectFilteredTasks, selectActiveFilter } from '@/Features/Tasks/tasksSlice';
import TaskItem from './TaskItem';

const TasksList = () => {
	const tasks = useSelector(selectFilteredTasks) || [];
	const activeFilter = useSelector(selectActiveFilter);

	// Filtrar tareas inválidas (nulas o indefinidas)
	const validTasks = tasks.filter((task) => task !== null && task !== undefined);

	// Mensajes personalizados según el filtro activo
	const getEmptyMessage = () => {
		switch (activeFilter) {
			case 'completed':
				return {
					title: 'No hay tareas completadas',
					description: 'Las tareas que completes aparecerán aquí',
					icon: 'fa-solid fa-check-circle',
				};
			case 'active':
				return {
					title: 'No hay tareas pendientes',
					description: '¡Buen trabajo! Has completado todas tus tareas',
					icon: 'fa-solid fa-thumbs-up',
				};
			case 'high':
				return {
					title: 'No hay tareas de alta prioridad',
					description: 'Agrega una tarea con prioridad alta',
					icon: 'fa-solid fa-arrow-up',
				};
			case 'medium':
				return {
					title: 'No hay tareas de prioridad media',
					description: 'Agrega una tarea con prioridad media',
					icon: 'fa-solid fa-equals',
				};
			case 'low':
				return {
					title: 'No hay tareas de baja prioridad',
					description: 'Agrega una tarea con prioridad baja',
					icon: 'fa-solid fa-arrow-down',
				};
			default:
				return {
					title: 'No hay tareas disponibles',
					description: 'Agrega una nueva tarea para comenzar',
					icon: 'fa-solid fa-list-check',
				};
		}
	};

	if (validTasks.length === 0) {
		const emptyMessage = getEmptyMessage();
		return (
			<motion.div
				className='text-center p-10 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}>
				<div className='inline-flex justify-center items-center w-16 h-16 mb-4 bg-gray-100 dark:bg-gray-800 rounded-full'>
					<i className={`${emptyMessage.icon} text-2xl text-indigo-500 dark:text-indigo-400`}></i>
				</div>
				<h3 className='text-xl font-medium text-gray-700 dark:text-gray-300'>{emptyMessage.title}</h3>
				<p className='text-gray-500 dark:text-gray-400 mt-2'>{emptyMessage.description}</p>
			</motion.div>
		);
	}

	return (
		<div className='space-y-4'>
			<AnimatePresence mode='popLayout'>
				{validTasks.map((task) => (
					<motion.div
						key={task.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, x: -100, height: 0 }}
						transition={{
							opacity: { duration: 0.3 },
							y: { type: 'spring', stiffness: 300, damping: 30 },
							x: { duration: 0.2 },
							height: { duration: 0.2 },
						}}
						layout>
						<TaskItem task={task} />
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};

export default TasksList;
