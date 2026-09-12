import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import { selectTheme, setTheme } from '@/Features/Theme/themeSlice';
import { selectAllTasks, clearAllTasks, replaceAllTasks } from '@/Features/Tasks/tasksSlice';

const Settings = () => {
	const dispatch = useDispatch();
	const theme = useSelector(selectTheme);
	const tasks = useSelector(selectAllTasks) || [];
	const fileInputRef = useRef(null);

	const [confirmingClear, setConfirmingClear] = useState(false);
	const [feedback, setFeedback] = useState(null);

	const showFeedback = (type, message) => {
		setFeedback({ type, message });
		window.setTimeout(() => setFeedback(null), 4000);
	};

	const handleExport = () => {
		try {
			const payload = JSON.stringify(tasks, null, 2);
			const blob = new Blob([payload], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `tasksflow-export-${new Date().toISOString().slice(0, 10)}.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			showFeedback('success', 'Tareas exportadas correctamente.');
		} catch (error) {
			console.error('Failed to export tasks:', error);
			showFeedback('error', 'No se pudo exportar la información.');
		}
	};

	const handleImportClick = () => {
		fileInputRef.current?.click();
	};

	const handleImportFile = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			try {
				const parsed = JSON.parse(reader.result);
				if (!Array.isArray(parsed)) {
					throw new Error('El archivo no contiene una lista de tareas válida.');
				}
				dispatch(replaceAllTasks(parsed));
				showFeedback('success', `Se importaron ${parsed.length} tareas.`);
			} catch (error) {
				console.error('Failed to import tasks:', error);
				showFeedback('error', 'El archivo seleccionado no es válido.');
			}
		};
		reader.onerror = () => showFeedback('error', 'No se pudo leer el archivo.');
		reader.readAsText(file);

		event.target.value = '';
	};

	const handleClearAll = () => {
		dispatch(clearAllTasks());
		setConfirmingClear(false);
		showFeedback('success', 'Se eliminaron todas las tareas.');
	};

	return (
		<div className='space-y-6'>
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors duration-300'>
				<h1 className='text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-6'>
					Configuración
				</h1>

				{feedback && (
					<div
						className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
							feedback.type === 'success'
								? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
								: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
						}`}>
						{feedback.message}
					</div>
				)}

				{/* Theme */}
				<section className='mb-8'>
					<h2 className='font-semibold text-gray-800 dark:text-white mb-1'>Apariencia</h2>
					<p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
						Elige cómo quieres que se vea TasksFlow.
					</p>
					<div className='flex gap-3'>
						<button
							onClick={() => dispatch(setTheme('light'))}
							className={`flex-1 sm:flex-none px-5 py-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 font-medium text-sm ${
								theme === 'light'
									? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
									: 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
							}`}>
							<i className='fa-solid fa-sun'></i>
							Claro
						</button>
						<button
							onClick={() => dispatch(setTheme('dark'))}
							className={`flex-1 sm:flex-none px-5 py-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 font-medium text-sm ${
								theme === 'dark'
									? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
									: 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
							}`}>
							<i className='fa-solid fa-moon'></i>
							Oscuro
						</button>
					</div>
				</section>

				{/* Data */}
				<section className='mb-8'>
					<h2 className='font-semibold text-gray-800 dark:text-white mb-1'>Datos</h2>
					<p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
						Tus tareas se guardan localmente en este navegador. Puedes exportarlas como respaldo o
						importarlas en otro dispositivo.
					</p>
					<div className='flex flex-wrap gap-3'>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleExport}
							className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow font-medium text-sm flex items-center gap-2'>
							<i className='fa-solid fa-download'></i>
							Exportar tareas
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleImportClick}
							className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm flex items-center gap-2'>
							<i className='fa-solid fa-upload'></i>
							Importar tareas
						</motion.button>
						<input
							ref={fileInputRef}
							type='file'
							accept='application/json'
							className='hidden'
							onChange={handleImportFile}
						/>
					</div>
				</section>

				{/* Danger zone */}
				<section>
					<h2 className='font-semibold text-red-600 dark:text-red-400 mb-1'>Zona de riesgo</h2>
					<p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
						Elimina permanentemente todas tus tareas de este navegador. Esta acción no se puede
						deshacer.
					</p>
					{!confirmingClear ? (
						<button
							onClick={() => setConfirmingClear(true)}
							className='px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium text-sm flex items-center gap-2'>
							<i className='fa-solid fa-trash-can'></i>
							Eliminar todas las tareas
						</button>
					) : (
						<div className='flex flex-wrap items-center gap-3'>
							<span className='text-sm text-gray-700 dark:text-gray-300'>¿Estás seguro?</span>
							<button
								onClick={handleClearAll}
								className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm'>
								Sí, eliminar todo
							</button>
							<button
								onClick={() => setConfirmingClear(false)}
								className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm'>
								Cancelar
							</button>
						</div>
					)}
				</section>
			</div>
		</div>
	);
};

export default Settings;
