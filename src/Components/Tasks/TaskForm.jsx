// ? Importaciones
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { motion, AnimatePresence } from 'framer-motion';

// ? Features
import { agregarTarea } from '@/Features/Tasks/tareasSlice';

const FormularioTarea = () => {
	const dispatch = useDispatch();
	const [expandido, setExpandido] = useState(false);
	const [datosFormulario, setDatosFormulario] = useState({
		titulo: '',
		descripcion: '',
		prioridad: 'media',
		fechaVencimiento: '',
	});

	// Manejar el cambio de los campos del formulario
	const manejarCambio = (e) => {
		const { name, value } = e.target;
		setDatosFormulario({
			...datosFormulario,
			[name]: value,
		});
	};

	// Manejar el envío del formulario
	const manejarEnvio = (e) => {
		e.preventDefault();

		// Validar que al menos haya un título
		if (!datosFormulario.titulo.trim()) return;

		// Crear y despachar la nueva tarea
		dispatch(
			agregarTarea({
				id: nanoid(),
				titulo: datosFormulario.titulo.trim(),
				descripcion: datosFormulario.descripcion.trim(),
				completada: false,
				prioridad: datosFormulario.prioridad,
				fechaVencimiento: datosFormulario.fechaVencimiento || null,
				fechaCreacion: new Date().toISOString(),
			})
		);

		// Limpiar el formulario
		setDatosFormulario({
			titulo: '',
			descripcion: '',
			prioridad: 'media',
			fechaVencimiento: '',
		});

		// Contraer el formulario
		setExpandido(false);
	};

	// Iconos para prioridades
	const iconosPrioridad = {
		alta: 'fa-arrow-up',
		media: 'fa-equals',
		baja: 'fa-arrow-down',
	};

	return (
		<div className='mb-6'>
			<motion.form
				onSubmit={manejarEnvio}
				layout
				className='bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md p-10 sm:p-5 transition-all duration-300'>
				<div className='flex items-center mb-4 gap-3'>
					<motion.span
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className='flex-none w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-md'
						onClick={() => setExpandido(true)}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}>
						<i className='fa-solid fa-plus'></i>
					</motion.span>

					<input
						type='text'
						name='titulo'
						value={datosFormulario.titulo}
						onChange={manejarCambio}
						onClick={() => setExpandido(true)}
						placeholder='Añadir nueva tarea'
						className='flex-1 bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 py-2 outline-none text-gray-800 dark:text-white transition-colors placeholder-gray-400 dark:placeholder-gray-500 min-w-0'
						autoComplete='off'
					/>
				</div>

				<AnimatePresence>
					{expandido && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className='space-y-4 overflow-hidden p-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
									<i className='fa-solid fa-align-left mr-2 text-indigo-500 dark:text-indigo-400'></i>
									Descripción
								</label>
								<textarea
									name='descripcion'
									value={datosFormulario.descripcion}
									onChange={manejarCambio}
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
										{['alta', 'media', 'baja'].map((prioridad) => (
											<label
												key={prioridad}
												className={`flex-1 flex items-center justify-center gap-1.5 py-2 cursor-pointer transition-colors text-sm
													${
														datosFormulario.prioridad === prioridad
															? 'bg-indigo-500 text-white'
															: 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
													}`}>
												<input
													type='radio'
													name='prioridad'
													value={prioridad}
													checked={datosFormulario.prioridad === prioridad}
													onChange={manejarCambio}
													className='sr-only'
												/>
												<i className={`fa-solid ${iconosPrioridad[prioridad]}`}></i>
												<span className='hidden sm:inline capitalize'>
													{prioridad === 'alta'
														? 'Alta'
														: prioridad === 'media'
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
										name='fechaVencimiento'
										value={datosFormulario.fechaVencimiento}
										onChange={manejarCambio}
										className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors text-gray-800 dark:text-white'
									/>
								</div>
							</div>

							<div className='flex justify-end pt-2 gap-2'>
								<motion.button
									type='button'
									onClick={() => setExpandido(false)}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm'>
									Cancelar
								</motion.button>

								<motion.button
									type='submit'
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className='px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow font-medium text-sm flex items-center gap-2'>
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

export default FormularioTarea;
