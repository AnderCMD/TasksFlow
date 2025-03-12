import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toggleTaskStatus, removeTask } from '@/Features/Tasks/tasksSlice';

const TaskItem = ({ task }) => {
	const dispatch = useDispatch();
	const [showActions, setShowActions] = useState(false);

	// Prioridades con iconos y colores
	const priorities = {
		high: {
			label: 'Alta',
			icon: 'fa-solid fa-arrow-up',
			class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
		},
		medium: {
			label: 'Media',
			icon: 'fa-solid fa-equals',
			class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300',
		},
		low: {
			label: 'Baja',
			icon: 'fa-solid fa-arrow-down',
			class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
		},
	};

	const priority = priorities[task.priority] || priorities.medium;

	// Formato de fecha más legible
	const formatDate = (dateString) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		const options = { day: 'numeric', month: 'short', year: 'numeric' };
		return date.toLocaleDateString('es-ES', options);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			layout
			className={`bg-gradient-to-br from-gray-50 to-neutral-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden
				${
					task.completed
						? 'border-l-4 border-green-500 dark:border-green-600'
						: 'border-l-4 border-indigo-500 dark:border-indigo-600'
				}`}
			onMouseEnter={() => setShowActions(true)}
			onMouseLeave={() => setShowActions(false)}
			onTouchStart={() => setShowActions(true)}>
			<div className='p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4'>
				<div className='flex-none'>
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => dispatch(toggleTaskStatus(task.id))}
						className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors
						${
							task.completed
								? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600'
								: 'border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400'
						}`}>
						{task.completed && <i className='fa-solid fa-check text-white text-xs'></i>}
					</motion.button>
				</div>

				<div className='flex-1 min-w-0' onClick={() => dispatch(toggleTaskStatus(task.id))}>
					<h3
						className={`text-base sm:text-lg font-medium mb-1 text-gray-800 dark:text-white truncate
						${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
						{task.title}
					</h3>
					{task.description && (
						<p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2'>{task.description}</p>
					)}
					<div className='flex flex-wrap items-center gap-2 text-sm'>
						{task.dueDate && (
							<span className='inline-flex items-center text-xs text-gray-500 dark:text-gray-400'>
								<i className='fa-regular fa-calendar mr-1'></i>
								{formatDate(task.dueDate)}
							</span>
						)}

						<span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full ${priority.class}`}>
							<i className={`${priority.icon} mr-1`}></i>
							{priority.label}
						</span>
					</div>
				</div>
				<motion.div
					className='flex gap-2 self-end sm:self-center'
					initial={{ opacity: 0 }}
					animate={{ opacity: showActions ? 1 : 0 }}>
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className='w-8 h-8 rounded-full text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors'
						aria-label='Editar tarea'>
						<i className='fa-solid fa-pen-to-square'></i>
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.1, color: '#ef4444' }}
						whileTap={{ scale: 0.9 }}
						onClick={() => dispatch(removeTask(task.id))}
						className='w-8 h-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
						aria-label='Eliminar tarea'>
						<i className='fa-solid fa-trash-can'></i>
					</motion.button>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default TaskItem;
