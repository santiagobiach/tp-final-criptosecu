SHELL := /bin/bash
PWD := $(shell pwd)

build-all:
	docker build -t serverbn server
	docker build -t clientbn client
	docker build -t mockserver mock-server

start-all:
	docker-compose up -d

down-all:
	docker-compose down

reset-all: down-all start-all

logs:
	docker-compose logs

