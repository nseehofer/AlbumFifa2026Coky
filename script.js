// --- 1. CONFIGURACIÓN Y GENERACIÓN DE DATOS ---

        // Lista de los 48 países para las páginas 2 a 49
        const paises = [
            "México", "Sudáfrica", "República de Corea", "República Checa", "Canadá",
            "Bosnia y Herzegovina", "Catar", "Suiza", "Brasil", "Marruecos", "Haití",
            "Escocia", "EE.UU", "Paraguay", "Australia", "Turquía", "Alemania", "Curacao",
            "Costa de Marfil", "Ecuador", "Países Bajos", "Japón", "Suecia", "Túnez",
            "Bélgica", "Egipto", "Iran", "Nueva Zelanda", "España", "Cabo Verde",
            "Arabia Saudí", "Uruguay", "Francia", "Senegal", "Irak", "Noruega",
            "Argentina", "Argelia", "Austria", "Jordania", "Portugal",
            "República Democrática del Congo", "Uzbekistán", "Colombia", "Inglaterra",
            "Croacia", "Ghana", "Panamá"
        ];

        // Generamos la estructura de las 52 páginas.
        const paginas = [];

        // Lógica de construcción del array de páginas
        for (let i = 1; i <= 52; i++) {
            let titulo = "";
            let cantidad = 0;

            if (i === 1) {
                titulo = "Intro";
                cantidad = 9;
            } else if (i >= 2 && i <= 49) {
                // i - 2 porque la página 2 corresponde al índice 0 del array paises
                titulo = paises[i - 2]; 
                cantidad = 12; // 12 figuritas por país (del 0 al 11)
            } else if (i === 50) {
                titulo = "Emoción";
                cantidad = 14;
            } else if (i === 51 || i === 52) {
                titulo = "Ciudad";
                cantidad = 8;
            }
            
            paginas.push({
                numeroPagina: i,
                titulo: titulo,
                cantidadFiguritas: cantidad
            });
        }


        // --- 2. ESTADO DE LA APLICACIÓN ---
        
        let paginaActualIndex = 0; // Índice en el array 'paginas' (0 a 51)
        
        // Recuperar figuritas guardadas de localStorage o crear un Set nuevo
        const guardadasJSON = localStorage.getItem('figuritasFifa2026');
        const figuritasObtenidas = guardadasJSON ? new Set(JSON.parse(guardadasJSON)) : new Set();


        // --- 3. REFERENCIAS AL DOM ---
        
        const contenedorFiguritas = document.getElementById('contenedor-figuritas');
        const tituloPagina = document.getElementById('titulo-pagina');
        const infoPagina = document.getElementById('info-pagina');
        const listaSugerencias = document.getElementById('lista-sugerencias');
        const inputBuscar = document.getElementById('buscar-pagina');
        const buscadorContainer = document.getElementById('buscador-container');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');


        // --- 4. FUNCIONES DE RENDERIZADO Y NAVEGACIÓN ---

        function inicializarApp() {
            // Llenar la lista de sugerencias con las páginas para el buscador predictivo
            paginas.forEach((pag, index) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.classList.add('dropdown-item');
                a.href = '#';
                
                // Mostramos el número de página y el título
                a.textContent = `Pág. ${pag.numeroPagina} - ${pag.titulo}`;
                
                // Evento al hacer click en una sugerencia
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    irAPaginaDirecta(index);
                    listaSugerencias.classList.remove('show');
                });
                
                li.appendChild(a);
                listaSugerencias.appendChild(li);
            });

            // Mostrar sugerencias al hacer foco en el input
            inputBuscar.addEventListener('focus', () => {
                filtrarSugerencias();
                listaSugerencias.classList.add('show');
            });

            // Filtrar sugerencias al escribir
            inputBuscar.addEventListener('input', () => {
                filtrarSugerencias();
                listaSugerencias.classList.add('show');
            });

            // Ocultar lista al hacer click fuera del buscador
            document.addEventListener('click', (e) => {
                if (!buscadorContainer.contains(e.target)) {
                    listaSugerencias.classList.remove('show');
                }
            });

            // Opcional: si apretan Enter, ir a la primera opción visible
            inputBuscar.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const itemsVisibles = Array.from(listaSugerencias.querySelectorAll('li')).filter(li => li.style.display !== 'none');
                    if (itemsVisibles.length > 0) {
                        itemsVisibles[0].querySelector('a').click();
                    }
                }
            });

            // Renderizar la primera página
            renderizarPagina(paginaActualIndex);
        }

        // Función auxiliar para quitar acentos
        function quitarAcentos(texto) {
            return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        function filtrarSugerencias() {
            const valorBuscado = quitarAcentos(inputBuscar.value.trim().toLowerCase());
            const items = listaSugerencias.querySelectorAll('li');
            
            items.forEach(item => {
                const textoItem = quitarAcentos(item.textContent.toLowerCase());
                // Si el item incluye el texto buscado, se muestra; si no, se oculta
                if (textoItem.includes(valorBuscado)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        function renderizarPagina(index) {
            const pagina = paginas[index];
            
            // Actualizar el valor del input al nombre de la página y estado de botones
            inputBuscar.value = pagina.titulo;
            btnPrev.disabled = index === 0;
            btnNext.disabled = index === paginas.length - 1;

            // Iniciar animación de salida (fade out)
            contenedorFiguritas.classList.add('fade-out');

            // Esperar un poquito a que la opacidad baje antes de cambiar el contenido
            setTimeout(() => {
                // Actualizar textos
                tituloPagina.textContent = `${pagina.titulo}`;
                infoPagina.textContent = `Página ${pagina.numeroPagina} de ${paginas.length} | Contiene ${pagina.cantidadFiguritas} figuritas (Nº 0 al ${pagina.cantidadFiguritas - 1})`;

                // Limpiar grilla
                contenedorFiguritas.innerHTML = '';

                // Crear e inyectar las figuritas correspondientes (desde 0 hasta cantidad-1)
                for (let i = 0; i < pagina.cantidadFiguritas; i++) {
                    const idUnico = `${pagina.numeroPagina}-${i}`;
                    const figDiv = document.createElement('div');
                    figDiv.classList.add('figurita');
                    figDiv.textContent = i;
                    
                    // Si ya estaba obtenida en el localStorage, le ponemos la clase
                    if (figuritasObtenidas.has(idUnico)) {
                        figDiv.classList.add('obtenida');
                    }

                    // Evento Click para pintar/despintar
                    figDiv.addEventListener('click', () => toggleFigurita(idUnico, figDiv));

                    contenedorFiguritas.appendChild(figDiv);
                }

                // Cambiar clase a fade in para animar la entrada
                contenedorFiguritas.classList.remove('fade-out');
                // Un pequeño truco para forzar el reflow del DOM y que la transición funcione
                void contenedorFiguritas.offsetWidth; 
                contenedorFiguritas.classList.add('fade-in');

                // Limpiar la clase fade-in después de que termine la animación
                setTimeout(() => {
                    contenedorFiguritas.classList.remove('fade-in');
                }, 300);

            }, 150); // Mismo tiempo aproximado que la mitad de la transición CSS
        }

        function cambiarPagina(direccion) {
            const nuevoIndex = paginaActualIndex + direccion;
            if (nuevoIndex >= 0 && nuevoIndex < paginas.length) {
                paginaActualIndex = nuevoIndex;
                renderizarPagina(paginaActualIndex);
            }
        }

        function irAPaginaDirecta(index) {
            if (index >= 0 && index < paginas.length && index !== paginaActualIndex) {
                paginaActualIndex = index;
                renderizarPagina(paginaActualIndex);
            }
        }

        // --- 5. LÓGICA DE INTERACCIÓN Y GUARDADO ---

        function toggleFigurita(numero, elementoDOM) {
            // Alternar clase visual
            elementoDOM.classList.toggle('obtenida');

            // Actualizar Set de datos
            if (figuritasObtenidas.has(numero)) {
                figuritasObtenidas.delete(numero);
            } else {
                figuritasObtenidas.add(numero);
            }

            // Guardar en LocalStorage
            guardarProgreso();
        }

        function guardarProgreso() {
            // Convertir Set a Array para guardarlo en JSON
            const arrayGuardar = Array.from(figuritasObtenidas);
            localStorage.setItem('figuritasFifa2026', JSON.stringify(arrayGuardar));
        }

        // --- INICIO DE LA APLICACIÓN ---
        document.addEventListener('DOMContentLoaded', inicializarApp);
