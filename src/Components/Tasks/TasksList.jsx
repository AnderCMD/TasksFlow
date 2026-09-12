import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import { selectFilteredTasks, selectActiveFilter } from '@/Features/Tasks/tasksSlice';

import TaskItem from '@/Components/Tasks/TaskItem';

const TASKS_PER_PAGE = 5;

const TasksList = () => {
	const tasks = useSelector(selectFilteredTasks) || [];
	const activeFilter = useSelector(selectActiveFilter);

	const validTasks = tasks.filter((task) => task !== null && task !== undefined);

	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(validTasks.length / TASKS_PER_PAGE);
	const pageTasks = validTasks.slice((currentPage - 1) * TASKS_PER_PAGE, currentPage * TASKS_PER_PAGE);

	const changePage = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const getEmptyStateMessage = () => {
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
		const emptyState = getEmptyStateMessage();
		return (
			<motion.div
				className='text-center p-10 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}>
				<div className='inline-flex justify-center items-center w-16 h-16 mb-4 bg-gray-100 dark:bg-gray-800 rounded-full'>
					<i className={`${emptyState.icon} text-2xl text-indigo-500 dark:text-indigo-400`}></i>
				</div>
				<h3 className='text-xl font-medium text-gray-700 dark:text-gray-300'>{emptyState.title}</h3>
				<p className='text-gray-500 dark:text-gray-400 mt-2'>{emptyState.description}</p>
			</motion.div>
		);
	}

	return (
		<div className='space-y-4'>
			<AnimatePresence mode='popLayout'>
				{pageTasks.map((task) => (
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

			{/* Pagination */}
			<div className='flex justify-center items-center gap-2 mt-4'>
				<button
					onClick={() => changePage(currentPage - 1)}
					disabled={currentPage === 1}
					className={`px-4 py-2 rounded-lg ${
						currentPage === 1
							? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
							: 'bg-indigo-500 text-white hover:bg-indigo-600'
					}`}>
					<i className='fa-solid fa-chevron-left'></i>
				</button>
				{Array.from({ length: totalPages }, (_, index) => (
					<button
						key={index + 1}
						onClick={() => changePage(index + 1)}
						className={`px-4 py-2 rounded-lg ${
							currentPage === index + 1
								? 'bg-indigo-500 text-white'
								: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-600'
						}`}>
						{index + 1}
					</button>
				))}
				<button
					onClick={() => changePage(currentPage + 1)}
					disabled={currentPage === totalPages}
					className={`px-4 py-2 rounded-lg ${
						currentPage === totalPages
							? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
							: 'bg-indigo-500 text-white hover:bg-indigo-600'
					}`}>
					<i className='fa-solid fa-chevron-right'></i>
				</button>
			</div>
		</div>
	);
};

export default TasksList;
