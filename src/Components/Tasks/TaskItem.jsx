// ? Importaciones
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';

// ? Features
import { toggleTaskStatus, removeTask, updateTask } from '@/Features/Tasks/tasksSlice';

const TaskItem = ({ task }) => {
	const dispatch = useDispatch();
	const [showActions, setShowActions] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedTask, setEditedTask] = useState(task);

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

	// Formato de fecha más legible para México
	const formatDate = (dateString) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		const options = {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			timeZone: 'America/Mexico_City',
		};
		return date.toLocaleDateString('es-MX', options);
	};

	// Manejar la edición de la tarea
	const handleEdit = () => {
		if (!editedTask.title.trim()) return;

		const updatedTask = {
			id: task.id,
			...editedTask,
			title: editedTask.title.trim(),
			description: editedTask.description?.trim() || '',
			dueDate: editedTask.dueDate || null, // Aseguramos que dueDate sea null si no hay fecha
		};

		dispatch(updateTask(updatedTask));
		setIsEditing(false);
	};

	if (isEditing) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				className='p-4 bg-gradient-to-br from-gray-50 to-neutral-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-sm'>
				<div className='space-y-4'>
					<input
						type='text'
						value={editedTask.title}
						onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
						className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors text-gray-800 dark:text-white'
						placeholder='Título de la tarea'
					/>
					<textarea
						value={editedTask.description || ''}
						onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
						className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors text-gray-800 dark:text-white resize-none'
						placeholder='Descripción de la tarea'
						rows='2'
					/>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
								<i className='fa-solid fa-flag mr-2 text-indigo-500 dark:text-indigo-400'></i>
								Prioridad
							</label>
							<div className='flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
								{['high', 'medium', 'low'].map((priority) => (
									<label
										key={priority}
										className={`flex-1 flex items-center justify-center gap-1.5 py-2 cursor-pointer transition-colors text-sm
                                            ${
												editedTask.priority === priority
													? 'bg-indigo-500 text-white'
													: 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
											}`}>
										<input
											type='radio'
											name='priority'
											value={priority}
											checked={editedTask.priority === priority}
											onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
											className='sr-only'
										/>
										<i className={`fa-solid ${priorities[priority].icon}`}></i>
										<span className='hidden sm:inline capitalize'>
											{priorities[priority].label}
										</span>
									</label>
								))}
							</div>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
								<i className='fa-solid fa-calendar-days mr-2 text-indigo-500 dark:text-indigo-400'></i>
								Fecha límite
							</label>
							<input
								type='date'
								value={editedTask.dueDate || ''} // Aseguramos que sea string vacío si es null
								onChange={(e) =>
									setEditedTask({
										...editedTask,
										dueDate: e.target.value || null, // Si está vacío, guardamos null
									})
								}
								className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors text-gray-800 dark:text-white'
							/>
						</div>
					</div>
					<div className='flex justify-end gap-2 pt-2'>
						<motion.button
							type='button'
							onClick={() => setIsEditing(false)}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm'>
							Cancelar
						</motion.button>
						<motion.button
							type='button'
							onClick={handleEdit}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow font-medium text-sm'>
							Guardar cambios
						</motion.button>
					</div>
				</div>
			</motion.div>
		);
	}

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
						onClick={() => setIsEditing(true)}
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
