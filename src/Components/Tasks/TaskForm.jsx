import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addTask } from '@/Features/Tasks/tasksSlice';

const TaskForm = () => {
	const dispatch = useDispatch();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [priority, setPriority] = useState('medium');
	const [error, setError] = useState('');
	const [showForm, setShowForm] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!title.trim()) {
			setError('El título es obligatorio');
			return;
		}

		dispatch(addTask(title, description, priority));

		// Limpiar el formulario
		setTitle('');
		setDescription('');
		setPriority('medium');
		setError('');
		setShowForm(false);
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'low':
				return 'bg-green-100 text-green-800 border-green-200';
			default:
				return 'bg-blue-100 text-blue-800 border-blue-200';
		}
	};

	return (
		<div>
			{!showForm ? (
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => setShowForm(true)}
					className='w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-colors shadow-md'>
					<span className='text-xl'>+</span>
					<span className='font-medium'>Añadir Nueva Tarea</span>
				</motion.button>
			) : (
				<motion.form
					onSubmit={handleSubmit}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
					className='bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md border border-gray-200 dark:border-gray-700'>
					<h3 className='text-lg font-medium text-gray-800 dark:text-white mb-4'>Nueva Tarea</h3>

					<div className='mb-4'>
						<label
							htmlFor='title'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
							Título <span className='text-red-500'>*</span>
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<i className='fas fa-thumbtack text-gray-400'></i>
							</div>
							<input
								id='title'
								type='text'
								value={title}
								onChange={(e) => {
									setTitle(e.target.value);
									if (e.target.value.trim()) setError('');
								}}
								className={`w-full pl-10 px-3 py-2.5 border ${
									error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
								} rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
								placeholder='¿Qué necesitas hacer?'
							/>
						</div>
						{error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
					</div>

					<div className='mb-4'>
						<label
							htmlFor='description'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
							Descripción
						</label>
						<div className='relative'>
							<div className='absolute top-3 left-0 pl-3 flex items-start pointer-events-none'>
								<i className='fas fa-align-left text-gray-400'></i>
							</div>
							<textarea
								id='description'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className='w-full pl-10 px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
								placeholder='Detalles adicionales (opcional)'
								rows={3}></textarea>
						</div>
					</div>

					<div className='mb-5'>
						<label
							htmlFor='priority'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
							Prioridad
						</label>
						<div className='grid grid-cols-3 gap-2'>
							<button
								type='button'
								onClick={() => setPriority('low')}
								className={`px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
									priority === 'low'
										? `${getPriorityColor(
												'low'
										  )} border-green-200 dark:border-green-800 dark:bg-green-900 dark:text-green-300`
										: 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
								}`}>
								Baja
							</button>
							<button
								type='button'
								onClick={() => setPriority('medium')}
								className={`px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
									priority === 'medium'
										? `${getPriorityColor(
												'medium'
										  )} border-yellow-200 dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`
										: 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
								}`}>
								Media
							</button>
							<button
								type='button'
								onClick={() => setPriority('high')}
								className={`px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
									priority === 'high'
										? `${getPriorityColor(
												'high'
										  )} border-red-200 dark:border-red-800 dark:bg-red-900 dark:text-red-300`
										: 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
								}`}>
								Alta
							</button>
						</div>
					</div>

					<div className='flex justify-end gap-2'>
						<button
							type='button'
							onClick={() => {
								setShowForm(false);
								setTitle('');
								setDescription('');
								setError('');
								setPriority('medium');
							}}
							className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors'>
							Cancelar
						</button>
						<button
							type='submit'
							className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm'>
							Guardar Tarea
						</button>
					</div>
				</motion.form>
			)}
		</div>
	);
};

export default TaskForm;
