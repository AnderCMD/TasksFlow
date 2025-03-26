// ? Importaciones
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// ? Features
import { seleccionarTareasFiltradas, seleccionarFiltroActivo } from '@/Features/Tasks/tareasSlice';

// ? Componentes
import ElementoTarea from '@/Components/Tasks/TaskItem';

const ListaTareas = () => {
	const tareas = useSelector(seleccionarTareasFiltradas) || [];
	const filtroActivo = useSelector(seleccionarFiltroActivo);

	// Filtrar tareas inválidas (nulas o indefinidas)
	const tareasValidas = tareas.filter((tarea) => tarea !== null && tarea !== undefined);

	// Dividir tareas en páginas
	const tareasPorPagina = 5;
	const [paginaActual, setPaginaActual] = useState(1);
	const paginas = Math.ceil(tareasValidas.length / tareasPorPagina);
	const tareasPagina = tareasValidas.slice((paginaActual - 1) * tareasPorPagina, paginaActual * tareasPorPagina);

	const cambiarPagina = (pagina) => {
		if (pagina >= 1 && pagina <= paginas) {
			setPaginaActual(pagina);
		}
	};

	// Mensajes personalizados según el filtro activo
	const obtenerMensajeVacio = () => {
		switch (filtroActivo) {
			case 'completadas':
				return {
					titulo: 'No hay tareas completadas',
					descripcion: 'Las tareas que completes aparecerán aquí',
					icono: 'fa-solid fa-check-circle',
				};
			case 'activas':
				return {
					titulo: 'No hay tareas pendientes',
					descripcion: '¡Buen trabajo! Has completado todas tus tareas',
					icono: 'fa-solid fa-thumbs-up',
				};
			case 'alta':
				return {
					titulo: 'No hay tareas de alta prioridad',
					descripcion: 'Agrega una tarea con prioridad alta',
					icono: 'fa-solid fa-arrow-up',
				};
			case 'media':
				return {
					titulo: 'No hay tareas de prioridad media',
					descripcion: 'Agrega una tarea con prioridad media',
					icono: 'fa-solid fa-equals',
				};
			case 'baja':
				return {
					titulo: 'No hay tareas de baja prioridad',
					descripcion: 'Agrega una tarea con prioridad baja',
					icono: 'fa-solid fa-arrow-down',
				};
			default:
				return {
					titulo: 'No hay tareas disponibles',
					descripcion: 'Agrega una nueva tarea para comenzar',
					icono: 'fa-solid fa-list-check',
				};
		}
	};

	if (tareasValidas.length === 0) {
		const mensajeVacio = obtenerMensajeVacio();
		return (
			<motion.div
				className='text-center p-10 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}>
				<div className='inline-flex justify-center items-center w-16 h-16 mb-4 bg-gray-100 dark:bg-gray-800 rounded-full'>
					<i className={`${mensajeVacio.icono} text-2xl text-indigo-500 dark:text-indigo-400`}></i>
				</div>
				<h3 className='text-xl font-medium text-gray-700 dark:text-gray-300'>{mensajeVacio.titulo}</h3>
				<p className='text-gray-500 dark:text-gray-400 mt-2'>{mensajeVacio.descripcion}</p>
			</motion.div>
		);
	}

	return (
		<div className='space-y-4'>
			<AnimatePresence mode='popLayout'>
				{tareasPagina.map((tarea) => (
					<motion.div
						key={tarea.id}
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
						<ElementoTarea tarea={tarea} />
					</motion.div>
				))}
			</AnimatePresence>

			{/* Paginación */}
			<div className='flex justify-center items-center gap-2 mt-4'>
				<button
					onClick={() => cambiarPagina(paginaActual - 1)}
					disabled={paginaActual === 1}
					className={`px-4 py-2 rounded-lg ${
						paginaActual === 1
							? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
							: 'bg-indigo-500 text-white hover:bg-indigo-600'
					}`}>
					<i className='fa-solid fa-chevron-left'></i>
				</button>
				{Array.from({ length: paginas }, (_, index) => (
					<button
						key={index + 1}
						onClick={() => cambiarPagina(index + 1)}
						className={`px-4 py-2 rounded-lg ${
							paginaActual === index + 1
								? 'bg-indigo-500 text-white'
								: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-600'
						}`}>
						{index + 1}
					</button>
				))}
				<button
					onClick={() => cambiarPagina(paginaActual + 1)}
					disabled={paginaActual === paginas}
					className={`px-4 py-2 rounded-lg ${
						paginaActual === paginas
							? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
							: 'bg-indigo-500 text-white hover:bg-indigo-600'
					}`}>
					<i className='fa-solid fa-chevron-right'></i>
				</button>
			</div>
		</div>
	);
};

export default ListaTareas;
