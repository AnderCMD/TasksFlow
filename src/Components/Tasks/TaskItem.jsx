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
				})
			);
			setIsEditing(false);
		}
	};

	const handleCancel = () => {
		setEditedTitle(task.title);
		setEditedDescription(task.description);
		setIsEditing(false);
	};

	// Formatear la fecha de creación
	const formattedDate = format(new Date(task.createdAt), 'dd/MM/yyyy HH:mm');

	// Obtener el color de la etiqueta de prioridad
	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
			case 'low':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
			default:
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
		}
	};

	if (isEditing) {
		return (
			<div className='py-4 px-2'>
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
				<div className='flex justify-end space-x-2'>
					<button
						onClick={handleCancel}
						className='px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'>
						Cancelar
					</button>
					<button
						onClick={handleSave}
						className='px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700'>
						Guardar
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='py-4 px-2'>
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
						<span>{formattedDate}</span>
					</div>
				</div>
			</div>

			<div className='mt-3 flex justify-end space-x-2'>
				<button
					onClick={handleEdit}
					className='text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300'>
					Editar
				</button>
				<button
					onClick={handleRemove}
					className='text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'>
					Eliminar
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
