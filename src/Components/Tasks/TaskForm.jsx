import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { motion, AnimatePresence } from 'framer-motion';
import { addTask } from '@/Features/Tasks/tasksSlice';

const TaskForm = () => {
	const dispatch = useDispatch();
	const [expanded, setExpanded] = useState(false);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		priority: 'medium',
		dueDate: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Validar que al menos haya un título
		if (!formData.title.trim()) return;

		// Crear y despachar la nueva tarea
		dispatch(
			addTask({
				id: nanoid(),
				title: formData.title.trim(),
				description: formData.description.trim(),
				completed: false,
				priority: formData.priority,
				dueDate: formData.dueDate || null,
				createdAt: new Date().toISOString(),
			})
		);

		// Limpiar el formulario
		setFormData({
			title: '',
			description: '',
			priority: 'medium',
			dueDate: '',
		});

		// Contraer el formulario
		setExpanded(false);
	};

	// Iconos para prioridades
	const priorityIcons = {
		high: 'fa-arrow-up',
		medium: 'fa-equals',
		low: 'fa-arrow-down',
	};

	return (
		<div className='mb-6'>
			<motion.form
				onSubmit={handleSubmit}
				layout
				className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transition-all duration-300'>
				<div className='flex items-center mb-4 gap-3'>
					<motion.span
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className='flex-none w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-md'>
						<i className='fa-solid fa-plus'></i>
					</motion.span>

					<input
						type='text'
						name='title'
						value={formData.title}
						onChange={handleChange}
						onClick={() => setExpanded(true)}
						placeholder='Añadir nueva tarea'
						className='flex-1 bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 py-2 outline-none text-gray-800 dark:text-white transition-colors placeholder-gray-400 dark:placeholder-gray-500'
						autoComplete='off'
					/>
				</div>

				<AnimatePresence>
					{expanded && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className='space-y-4 overflow-hidden'>
							<div>
								<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
									<i className='fa-solid fa-align-left mr-2 text-indigo-500 dark:text-indigo-400'></i>
									Descripción
								</label>
								<textarea
									name='description'
									value={formData.description}
									onChange={handleChange}
									placeholder='Añadir una descripción...'
									rows='2'
									className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg resize-none outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors text-gray-800 dark:text-white'></textarea>
							</div>

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
												className={`flex-1 flex items-center justify-center gap-1.5 py-2 cursor-pointer transition-colors
													${
														formData.priority === priority
															? 'bg-indigo-500 text-white'
															: 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
													}`}>
												<input
													type='radio'
													name='priority'
													value={priority}
													checked={formData.priority === priority}
													onChange={handleChange}
													className='sr-only'
												/>
												<i className={`fa-solid ${priorityIcons[priority]}`}></i>
												<span className='capitalize text-sm'>
													{priority === 'high'
														? 'Alta'
														: priority === 'medium'
														? 'Media'
														: 'Baja'}
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
										name='dueDate'
										value={formData.dueDate}
										onChange={handleChange}
										className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors text-gray-800 dark:text-white'
									/>
								</div>
							</div>

							<div className='flex justify-end pt-2 gap-2'>
								<motion.button
									type='button'
									onClick={() => setExpanded(false)}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium'>
									Cancelar
								</motion.button>

								<motion.button
									type='submit'
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className='px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow font-medium flex items-center gap-2'>
									<i className='fa-solid fa-save'></i>
									Guardar
								</motion.button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.form>
		</div>
	);
};

export default TaskForm;
