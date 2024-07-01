SHELL := /bin/bash
PWD := $(shell pwd)

build-all:
	docker build -t serverbn server
	docker build -t clientbn client
	docker build -t mockserver mock-server
.PHONY: build-all

start-all: build-all
	docker-compose up -d
.PHONY: start-all

down-all:
	docker-compose down
.PHONY: down-all

reset-all: down-all start-all
.PHONY: reset-all

logs:
	docker-compose logs
.PHONY: logs

