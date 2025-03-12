import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { toggleTaskStatus, removeTask, updateTask } from '@/Features/Tasks/tasksSlice';

const TaskItem = ({ task }) => {
	const dispatch = useDispatch();
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState(task.title);
	const [editedDescription, setEditedDescription] = useState(task.description);
	const [editedPriority, setEditedPriority] = useState(task.priority);

	const handleStatusToggle = () => {
		dispatch(toggleTaskStatus(task.id));
	};

	const handleRemove = () => {
		dispatch(removeTask(task.id));
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = () => {
		if (editedTitle.trim()) {
			dispatch(
				updateTask({
					id: task.id,
					title: editedTitle,
					description: editedDescription,
					priority: editedPriority,
				})
			);
			setIsEditing(false);
		}
	};

	const handleCancel = () => {
		setEditedTitle(task.title);
		setEditedDescription(task.description);
		setEditedPriority(task.priority);
		setIsEditing(false);
	};

	// Formatear la fecha de creación
	const formattedDate = format(new Date(task.createdAt), 'dd/MM/yyyy HH:mm');

	// Obtener el color de la etiqueta de prioridad
	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border border-red-200 dark:border-red-800';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800';
			case 'low':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border border-green-200 dark:border-green-800';
			default:
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
		}
	};

	if (isEditing) {
		return (
			<motion.div
				className='py-4 px-4 bg-gray-50 dark:bg-gray-750 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'
				initial={{ opacity: 0.8, y: 0 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}>
				<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>Editando tarea</h3>

				<div className='mb-3'>
					<label
						htmlFor='edit-title'
						className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
						Título
					</label>
					<input
						id='edit-title'
						type='text'
						value={editedTitle}
						onChange={(e) => setEditedTitle(e.target.value)}
						className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
					/>
				</div>

				<div className='mb-3'>
					<label
						htmlFor='edit-description'
						className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
						Descripción
					</label>
					<textarea
						id='edit-description'
						value={editedDescription}
						onChange={(e) => setEditedDescription(e.target.value)}
						className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
						rows={3}></textarea>
				</div>

				<div className='mb-4'>
					<label
						htmlFor='edit-priority'
						className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
						Prioridad
					</label>
					<select
						id='edit-priority'
						value={editedPriority}
						onChange={(e) => setEditedPriority(e.target.value)}
						className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
						<option value='low'>Baja</option>
						<option value='medium'>Media</option>
						<option value='high'>Alta</option>
					</select>
				</div>

				<div className='flex justify-end space-x-2'>
					<button
						onClick={handleCancel}
						className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors'>
						Cancelar
					</button>
					<button
						onClick={handleSave}
						className='px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors'>
						Guardar
					</button>
				</div>
			</motion.div>
		);
	}

	return (
		<div className='py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150 rounded-lg'>
			<div className='flex items-start'>
				<div className='flex-shrink-0 mr-3 pt-1'>
					<input
						type='checkbox'
						checked={task.completed}
						onChange={handleStatusToggle}
						className='h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer dark:bg-gray-700 dark:border-gray-600'
					/>
				</div>
				<div className='flex-1'>
					<div className='flex items-center justify-between'>
						<h3
							className={`text-md font-medium ${
								task.completed
									? 'line-through text-gray-500 dark:text-gray-400'
									: 'text-gray-800 dark:text-white'
							}`}>
							{task.title}
						</h3>
						<span
							className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getPriorityColor(
								task.priority
							)}`}>
							{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
						</span>
					</div>

					{task.description && (
						<motion.p
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							className={`mt-1 text-sm ${
								task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
							}`}>
							{task.description}
						</motion.p>
					)}

					<div className='mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400'>
						<i className='fas fa-clock mr-1'></i>
						<span>{formattedDate}</span>
					</div>
				</div>
			</div>

			<div className='mt-3 flex justify-end space-x-2'>
				<button
					onClick={handleEdit}
					className='text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors'>
					<i className='fas fa-pen-to-square text-xs'></i>
					<span>Editar</span>
				</button>
				<button
					onClick={handleRemove}
					className='text-sm flex items-center gap-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors'>
					<i className='fas fa-trash text-xs'></i>
					<span>Eliminar</span>
				</button>
			</div>
		</div>
	);
};

TaskItem.propTypes = {
	task: PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string,
		completed: PropTypes.bool.isRequired,
		createdAt: PropTypes.string.isRequired,
		priority: PropTypes.string.isRequired,
	}).isRequired,
};

export default TaskItem;
