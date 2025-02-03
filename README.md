# PROYECTO MEAL MASTER


<pre>
**Descripción del Proyecto**:

Meal Master es un sistema que permite a los usuarios gestionar su perfil, recetas, comentarios y listas de favoritos, así como acceder a funcionalidades premium mediante un modelo de pago. Está diseñado para simplificar la búsqueda y gestión de recetas y mejorar la experiencia del usuario a través de una interfaz intuitiva.


Características

-Gestión de recetas, favoritos y comentarios.

-Suscripción Premium para acceder a funcionalidades avanzadas.

-Integración con APIs externas para enriquecer la experiencia del usuario:

  -API MealDB: Obtiene una base de datos extensa de recetas, ingredientes y categorías.

  -API de PayPal: Permite a los usuarios básicos realizar pagos para actualizarse a un plan premium y disfrutar de beneficios adicionales.



Planes del Sistema:

### Plan Básico:

-Gestión de perfil del usuario (ABM).

-Visualización y filtrado de lista de favoritos.

-Acceso y visualización de recetas.

-Gestión de comentarios.

-Acceso a funcionalidades limitadas.



### Plan Premium:

-Gestión de recetas propias (ABM) por parte del usuario premium.

-Filtrado y visualización de recetas por ingredientes.

-Acceso completo a funcionalidades avanzadas.

-Creación y gestión de un plan de comidas personalizado para cada día de la semana.



## Herramientas Utilizadas

-Lenguajes: JavaScript, HTML, CSS

-Frameworks: Angular

-API externas:

  -MealDB: Para recetas, ingredientes y categorías.

  -API de PayPal: Para procesar pagos y actualizar a los usuarios al plan premium.



## Configuración Inicial del Proyecto

Antes de comenzar con el desarrollo, es necesario inicializar e instalar ciertas dependencias y configuraciones. Sigue estos pasos:

1) Instalar Express y Multer:
   
npm i express multer

2) Instalar Bootstrap y Popper.js:

npm install bootstrap
npm install @popperjs/core



## Instrucciones para el Desarrollo

1) Clonar el repositorio:
git clone https://github.com/julibucci/MealMaster-Project.git

2) Instalar las dependencias:
cd MealMaster-Project
npm install

3) Iniciar el servidor JSON (para simular las bases de datos):
Para que el sistema funcione correctamente, debes ejecutar el servidor JSON para almacenar y gestionar los datos.
Ejecuta los siguientes comandos para abrir los puertos necesarios (Asegúrate de ejecutar ambos servidores JSON en puertos separados):

-Inicia el servidor en el puerto 3000: json-server --watch db.json --port 3000

-Inicia el servidor en el puerto 3002: json-server --watch db2.json --port 3002


4) Navegar al directorio backend:
cd backend


5) Ejecutar el servidor backend:
node server.js


6) Ejecutar el servidor de desarrollo:
ng serve

Esto iniciará la aplicación en http://localhost:4200/.



## Perfiles de Prueba:

### INDICACIONES: REFRESCAR LA PÁGINA CADA VEZ QUE SE CAMBIA DE PERFIL.
  

### Para probar las funcionalidades del usuario básico, puedes usar este perfil:

-Email: jane.smith@example.com

-Password: 456
  

### Para probar las funcionalidades del usuario premium, puedes usar este perfil:

-Email: john.doe@example.com

-Password: 123
  

### También puedes crear tu propio perfil, que se inicializará con el plan básico y al simular el pago pasará a ser Premium.

</pre>
