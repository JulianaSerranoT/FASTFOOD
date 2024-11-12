# **Sistema de Gestión de Ordenes y empleados en Microservicios**
[Luis Angel Garcia]
[Antonio Cardenas Jurado]
[Juliana del toro]

## Descripción  
En el competitivo sector de la comida rápida, la eficiencia en la gestión de órdenes y la coordinación del personal es crucial para maximizar la satisfacción del cliente y optimizar las operaciones internas. Sin embargo, muchas empresas, como FASTFOOD, enfrentan desafíos significativos debido a la falta de herramientas tecnológicas adecuadas. Actualmente, la gestión de órdenes y la asignación de tareas se realizan de forma manual, lo que genera errores, retrasos y una disminución en la eficiencia operativa. Estas deficiencias se traducen en la pérdida de clientes potenciales, ya que el tiempo de respuesta y la calidad del servicio no logran satisfacer las expectativas del mercado.

## Preparacion
Inicialmente debemos configurar nuestro entorno de trabajo:

## Confguracion 
1. crear un entrono de trabajpo
    - Descarga e instalar la ultima version de vagrant y virtualbox
        https://www.virtualbox.org/wiki/Downloads
        https://releases.hashicorp.com/vagrant/
    - Verificamos la version de vagrant e instalar los plugins de vagrant en la terminal de windows
        ```
        version: vagrant version
        plugins: plugin install vagrant-vbguest
        ```
    - varios de los servicios trajados durante el proyecto fueros desplegados desde la maquina de clienteUbuntu y otros desde otra llamada servidorUbuntu
        1. Cree un directorio y le da un nombre al gusto con tal de recordar su ubicacion y su nombre, en nuestro caso lo llamamos prueba
        2. desde la consola de windows terminal, accedemos con el comando "cd" y ladireccion de donde guardamos el vagrantFile.
            ```
            - cd "direccion/de/la/carpeta/prueba"
            ```
        3. iniciamos las maquinas desde vagrant
            - vagrant init 
        - El vagrant file contiene las lineas de configuracion de la maquina virtual donde se les asigna las siguientes direcciones IP de cada maquina por ejemplo 192.168.100.2 el servidor y el cliente 192.168.100.3
        4. Iniciamos las maquinas /maquina necesaria
            - vagrant up / vagrant up servidorUbuntu
        5. verificamos el inicio de las maquinas con vagrant status
            - vagrant status
        6. iniciamos el ssh de la maquina necesaria
            - vagrant shh clienteUbuntu
            - vagrant shh servidorUbuntu
2. Instalacion y configuracion de docker
    ya habiendo iniciado en la maquina lo mas recomendable para tener acceso a ella es acceder a usuario root
        - sudo -i
    despues de haber iniciado con usuario root ahora si podemos pasar a instalar docker 
    1. verificamos verios de docker 
        ```
        docker --version
        ```
        ## En caso que docker no esta instalado vamos intalar
        - Actualizar paquetes
            ```
            sudo apt-get update
            ```
        - Ejecuta el script de instalación de Docker:
            ```
            curl -fsSL https://get.docker.com -o get-docker.sh
            sudo sh get-docker.sh
            ```
        - ya tendriamos docker
    2. clonamos repositorio del proyecto dentro de nuestra maquina
        ```
        git clone https://github.com/JulianaSerranoT/FASTFOOD
        ```
    ## ahora configuremos un cluster con el servidor como maestro 
    1. desde el servidor iniciamos el cluster con:
        ```
        docker swarm init --advertise-addr 192.168.100.2
        ```
    2. verificamos si el nodo se creo con 
        ```
        - docker node ls
        ```
    3. sacamos el token de acceso del cluster
        ```
      docker swarm join-token worker
        ```
    4. desde el cliente ubuntu 
        docker swarm join --token SWMTKN-1-14j97qwyz2sljg9g7505jsao71f0vcxy3cei6m0bcqv5ay6qie-414dehfo85d91ygyt780iuvqm 192.168.100.2:2377
## Desplegar la aplicacion
1. ya habiendo hecho los pasos anteriores ya terminamos de configurar lo basico dentro de las maquinas ahora antes de empezar entramos a la carpeta que clonamos de github 
    ```
    cd FASTFOOD
    ```
2. a la carpeta de haproxi le damos los permisos necesarios
    ```
    chmod 777 haproxy
    ```
3.  despues entramos a la carpeta pyspark y damos permisos a los siguientes archivos  
    ```
    chmod 777 output
    chmod 777 wait-for-it.sh
    ```
4. regresamos a la carpeta raiz del proyecto (FASTFOO) 
    ```
    cd ..
    ```
5. desplegamos el stack
    ```
    docker stack deploy -c docker_compose.yml fastfood
    ```
6. esperamos un momento mientras todo se carga y listo queda el servicio desplegado.