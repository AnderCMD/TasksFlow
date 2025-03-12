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

		dispatch(addTask(title, description));

		// Limpiar el formulario
		setTitle('');
		setDescription('');
		setPriority('medium');
		setError('');
		setShowForm(false);
	};

	return (
		<div>
			{!showForm ? (
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => setShowForm(true)}
					className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors'>
					<span className='text-xl'>+</span>
					<span>Añadir Nueva Tarea</span>
				</motion.button>
			) : (
				<motion.form
					onSubmit={handleSubmit}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
					className='bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
					<div className='mb-4'>
						<label
							htmlFor='title'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
							Título <span className='text-red-500'>*</span>
						</label>
						<input
							id='title'
							type='text'
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
								if (e.target.value.trim()) setError('');
							}}
							className={`w-full px-3 py-2 border ${
								error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
							} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
							placeholder='¿Qué necesitas hacer?'
						/>
						{error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
					</div>

					<div className='mb-4'>
						<label
							htmlFor='description'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
							Descripción
						</label>
						<textarea
							id='description'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
							placeholder='Detalles adicionales (opcional)'
							rows={3}></textarea>
					</div>

					<div className='mb-4'>
						<label
							htmlFor='priority'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
							Prioridad
						</label>
						<select
							id='priority'
							value={priority}
							onChange={(e) => setPriority(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
							<option value='low'>Baja</option>
							<option value='medium'>Media</option>
							<option value='high'>Alta</option>
						</select>
					</div>

					<div className='flex justify-end gap-2'>
						<button
							type='button'
							onClick={() => {
								setShowForm(false);
								setTitle('');
								setDescription('');
								setError('');
							}}
							className='px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'>
							Cancelar
						</button>
						<button
							type='submit'
							className='px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700'>
							Guardar Tarea
						</button>
					</div>
				</motion.form>
			)}
		</div>
	);
};

export default TaskForm;
