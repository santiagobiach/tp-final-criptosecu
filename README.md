# Trabajo Final 66.69 - BotNet - Grupo 10

Sistema educativo que modela una botnet y como un botmaster controla y comanda a computadoras infectadas para distintos fines.

## Instrucciones de Uso

### Levantar Servidores y clientes
1) Buildear las imágenes de docker
> $ make build-all  

2) OPCIONAL: crear una arquitectura con una cantidad distinta de clientes que la por defecto    
- Editar el archivo compose-maker.py modificando la variable num_clients
> $ python compose-maker.py

3) Correr los contenedores
> $ make start-all

Recomendamos Docker Desktop para ver los logs, pero como alternativa se puede usar docker logs.

### Correr el Botmaster
> $ python cli-botmaster.py

Abre una CLI para interactuar con los bots a través del server.
Algunos de los comandos soportados son:
- Download: Descarga un archivo de la computadora infectada elegida al server.
- Exec: Ejecutar un archivo que envía el botmaster en el bot elegido.
- DDoS: Ordena al bot a enviar HTTP GET a una IP:PUERTO.
- Shell: Abre una shell remota con la maquina objetivo.

Los argumentos esperados de cada comando se pueden ver si en la CLI se llama al comando sin argumentos.