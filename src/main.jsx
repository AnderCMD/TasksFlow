// ? Importaciones
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

// ? Store
import { store } from '@/App/store';

// ? Estilos
import '@/index.css';

// ? Iconos FontAwesome v6
import '@/Assets/FontAwesome/css/all.min.css';

// ? Componentes
import App from '@/App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);
