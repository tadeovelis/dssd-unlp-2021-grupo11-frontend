# dssd-unlp-2021-grupo11-frontend

# Aplicación de registro de solicitud de Sociedad Anónima 🏢

_Siga las siguientes instrucciones para clonar y ejecutar este repositorio en su máquina local_

### Pre-requisitos 📋

- docker-compose
https://docs.docker.com/compose/install/

- Haber clonado e instalado el docker-compose provisto por el grupo, siguiendo la guía de instalación https://github.com/juliancasaburi/dssd-unlp-2021-grupo11-laradock

- Haber clonado el proyecto BPM en Bonita Open Solution, siguiendo la guía de instalación https://github.com/juliancasaburi/dssd-unlp-2021-grupo11-bpm

### Aclaraciones importantes ❕

>Iniciar previamente el docker-compose, explicado en el repositorio [dssd-unlp-2021-grupo11-laradock](https://github.com/juliancasaburi/dssd-unlp-2021-grupo11-laradock)

>Luego, iniciar este frontend antes que el del repositorio [dssd-unlp-2021-grupo11-monitoreo-service-frontend](https://github.com/tadeovelis/dssd-unlp-2021-grupo11-monitoreo-service-frontend)

- Siguiendo este orden conseguimos que el frontend de registro de S.A. y de monitoreo corran en los puertos 3002 y 3003 respectivamente.
- Si ocurre algún error de CORS por un origen no permitido, se puede cambiar el puerto del frontend en el backend correspondiente, en el archivo .env.

### Instalación y ejecución 🔧

_Sigue las siguientes instrucciones para clonar el repositorio_

_1. Clone el repositorio_
```
git clone https://github.com/tadeovelis/dssd-unlp-2021-grupo11-frontend.git
```

_2. Posiciónese en el nuevo directorio_
```
cd dssd-unlp-2021-grupo11-frontend
```

_3. Instale las dependencias_
```
npm install
```

_4. Inicie la aplicación_
```
npm start
```

_5. Cuando le avise que el puerto está ocupado y usará otro, presione ENTER_

<br>
¡LISTO! La aplicación se iniciará automáticamente en una pestaña del navegador.

