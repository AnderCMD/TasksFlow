// Importaciones
import { createSlice, createSelector } from '@reduxjs/toolkit';

// Función auxiliar para ajustar la fecha a la zona horaria de México
const ajustarAZonaHorariaMexico = (fechaString) => {
	if (!fechaString) return null;
	const fecha = new Date(fechaString);
	// Ajustamos la fecha a mediodía en la zona horaria de México (UTC-6)
	fecha.setUTCHours(18, 0, 0, 0); // 18 UTC = 12 PM Mexico
	return fecha.toISOString();
};

// Recuperar tareas del localStorage si existen
const cargarTareasDelAlmacenamiento = () => {
	try {
		// Obtener las tareas del localStorage
		const tareasAlmacenadas = localStorage.getItem('tareas');
		if (!tareasAlmacenadas) return [];
		// Parsear los datos del localStorage
		const tareasParseadas = JSON.parse(tareasAlmacenadas);
		// Validar que sea un array
		if (!Array.isArray(tareasParseadas)) return [];
		// Filtrar elementos nulos y asegurarse de que tengan la estructura correcta
		const tareasValidas = tareasParseadas.filter(
			(tarea) =>
				tarea !== null &&
				typeof tarea === 'object' &&
				typeof tarea.id === 'string' &&
				typeof tarea.titulo === 'string'
		);
		// Si hay diferencia entre las tareas almacenadas y las válidas, actualizar localStorage
		if (tareasValidas.length !== tareasParseadas.length) {
			localStorage.setItem('tareas', JSON.stringify(tareasValidas));
		}
		return tareasValidas;
	} catch (error) {
		console.error('Error al cargar tareas del localStorage:', error);
		// En caso de error, limpiar el localStorage para evitar problemas futuros
		localStorage.removeItem('tareas');
		return [];
	}
};

// Estado inicial
const estadoInicial = {
	tareas: cargarTareasDelAlmacenamiento(),
	filtro: 'todos',
	busqueda: '',
	ordenarPor: 'fechaCreacion:desc',
	estado: 'inactivo',
	error: null,
};

export const tareasSlice = createSlice({
	name: 'tareas',
	initialState: estadoInicial,
	reducers: {
		// Reducer para agregar una tarea
		agregarTarea: (state, action) => {
			if (!action.payload?.titulo?.trim()) {
				return;
			}

			state.tareas.push({
				...action.payload,
				titulo: action.payload.titulo.trim(),
				descripcion: action.payload.descripcion?.trim() || '',
				completada: action.payload.completada || false,
				prioridad: action.payload.prioridad || 'media',
				fechaVencimiento: ajustarAZonaHorariaMexico(action.payload.fechaVencimiento),
				fechaCreacion: new Date().toISOString(),
			});
			localStorage.setItem('tareas', JSON.stringify(state.tareas));
		},

		// Reducer para eliminar una tarea
		eliminarTarea: (state, action) => {
			state.tareas = state.tareas.filter((tarea) => tarea !== null && tarea.id !== action.payload);
			localStorage.setItem('tareas', JSON.stringify(state.tareas));
		},

		// Reducer para alternar el estado de completado de una tarea
		alternarEstadoTarea: (state, action) => {
			const tarea = state.tareas.find((tarea) => tarea !== null && tarea.id === action.payload);
			if (tarea) {
				tarea.completada = !tarea.completada;
				localStorage.setItem('tareas', JSON.stringify(state.tareas));
			}
		},

		// Reducer para actualizar una tarea
		actualizarTarea: (state, action) => {
			const { id, ...cambios } = action.payload;
			if (!id || !cambios.titulo?.trim()) {
				return;
			}

			const tareaExistente = state.tareas.find((tarea) => tarea?.id === id);
			if (tareaExistente) {
				Object.assign(tareaExistente, {
					...tareaExistente,
					...cambios,
					titulo: cambios.titulo.trim(),
					descripcion: cambios.descripcion?.trim() || tareaExistente.descripcion,
					prioridad: cambios.prioridad || tareaExistente.prioridad,
					fechaVencimiento: ajustarAZonaHorariaMexico(cambios.fechaVencimiento),
				});
				localStorage.setItem('tareas', JSON.stringify(state.tareas));
			}
		},

		// Reducers para manejar el filtro, búsqueda y ordenamiento
		establecerFiltro: (state, action) => {
			state.filtro = action.payload;
		},

		establecerBusqueda: (state, action) => {
			state.busqueda = action.payload;
		},

		establecerOrdenamiento: (state, action) => {
			state.ordenarPor = action.payload;
		},

		// Reducer para limpiar tareas inválidas
		limpiarTareas: (state) => {
			state.tareas = state.tareas.filter(
				(tarea) =>
					tarea !== null &&
					typeof tarea === 'object' &&
					typeof tarea.id === 'string' &&
					typeof tarea.titulo === 'string'
			);
			localStorage.setItem('tareas', JSON.stringify(state.tareas));
		},
	},
});

// Acciones
export const {
	agregarTarea,
	eliminarTarea,
	alternarEstadoTarea,
	actualizarTarea,
	establecerFiltro,
	establecerBusqueda,
	establecerOrdenamiento,
	limpiarTareas,
} = tareasSlice.actions;

// Selectores
export const seleccionarTodasLasTareas = (state) => state.tareas?.tareas || [];

// Selector optimizado para rendimiento
export const seleccionarTareasFiltradas = createSelector(
	[
		(state) => state.tareas?.tareas || [],
		(state) => state.tareas?.filtro || 'todos',
		(state) => state.tareas?.busqueda || '',
		(state) => state.tareas?.ordenarPor || 'fechaCreacion:desc',
	],
	(tareas, filtro, busqueda, ordenarPor) => {
		let tareasFiltradas = tareas.filter(
			(tarea) => tarea !== null && tarea !== undefined && typeof tarea === 'object'
		);

		// Aplicar filtro por estado/prioridad
		switch (filtro) {
			case 'activas':
				tareasFiltradas = tareasFiltradas.filter((tarea) => !tarea.completada);
				break;
			case 'completadas':
				tareasFiltradas = tareasFiltradas.filter((tarea) => tarea.completada);
				break;
			case 'alta':
			case 'media':
			case 'baja':
				tareasFiltradas = tareasFiltradas.filter((tarea) => tarea.prioridad === filtro);
				break;
		}

		// Aplicar búsqueda
		if (busqueda.trim()) {
			const busquedaMinusculas = busqueda.toLowerCase().trim();
			tareasFiltradas = tareasFiltradas.filter(
				(tarea) =>
					tarea.titulo.toLowerCase().includes(busquedaMinusculas) ||
					(tarea.descripcion || '').toLowerCase().includes(busquedaMinusculas)
			);
		}

		// Aplicar ordenamiento
		const [campo, direccion] = ordenarPor.split(':');
		return [...tareasFiltradas].sort((a, b) => {
			let comparacion = 0;
			switch (campo) {
				case 'fechaCreacion':
					comparacion = new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
					break;
				case 'fechaVencimiento':
					comparacion = new Date(a.fechaVencimiento || '9999') - new Date(b.fechaVencimiento || '9999');
					break;
				case 'prioridad':
					const ordenPrioridad = { alta: 3, media: 2, baja: 1 };
					comparacion = ordenPrioridad[b.prioridad] - ordenPrioridad[a.prioridad];
					break;
			}
			return direccion === 'asc' ? -comparacion : comparacion;
		});
	}
);

export const seleccionarFiltroActivo = (state) => state.tareas?.filtro || 'todos';

// Contador de tareas por filtro para mostrar badges
export const seleccionarConteoTareas = createSelector([seleccionarTodasLasTareas], (tareas) => {
	// Aseguramos que tasks sea un array incluso si viene undefined
	const arrayTareas = tareas || [];
	const tareasValidas = arrayTareas.filter((tarea) => tarea !== null && tarea !== undefined);

	return {
		todos: tareasValidas.length,
		activas: tareasValidas.filter((tarea) => !tarea.completada).length,
		completadas: tareasValidas.filter((tarea) => tarea.completada).length,
		alta: tareasValidas.filter((tarea) => tarea.prioridad === 'alta').length,
		media: tareasValidas.filter((tarea) => tarea.prioridad === 'media').length,
		baja: tareasValidas.filter((tarea) => tarea.prioridad === 'baja').length,
	};
});

// Selector para obtener una tarea por ID
export const seleccionarTareaPorId = (state, idTarea) => {
	const tareas = state.tareas?.tareas || [];
	return tareas.find((tarea) => tarea !== null && tarea.id === idTarea);
};

export default tareasSlice.reducer;
