def generate_docker_compose(num_clients):
    # Define the base YAML content
    yaml_content = f"""\
name: tpfinal
networks:
  intranet:
    name: intranet
    driver: bridge
services:
  server:
    container_name: server
    image: serverbn:latest
    environment:
      - DOWNLOAD_FILEPATH=./downloads
    networks:
      - intranet
    ports:
      - 3000:3000
    volumes:
      - ./server/server.js:/usr/src/app/server.js
      - ./server/results_handlers.js:/usr/src/app/results_handlers.js
      - ./server/setup.js:/usr/src/app/setup.js
  mock-server:
    container_name: mock-server
    image: mockserver:latest
    networks:
      - intranet
    ports:
      - 7000:7000
    volumes:
      - ./mock-server/server.js:/usr/src/app/server.js
"""

    # Add client services based on the number of clients
    for i in range(1, num_clients + 1):
        yaml_content += f"""\
  client{i}:
    container_name: client{i}
    depends_on:
      - server
    image: clientbn:latest
    networks:
      - intranet
    volumes:
      - ./client/client.js:/usr/src/app/client.js
      - ./client/commands.js:/usr/src/app/commands.js
"""
    
    return yaml_content

def write_to_file(content):
    with open('docker-compose.yml', 'w') as f:
        f.write(content)

# Generate docker-compose.yml file with 3 client services
num_clients = 7
compose_content = generate_docker_compose(num_clients)
write_to_file(compose_content)
