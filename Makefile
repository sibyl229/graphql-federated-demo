compose_server_fn = docker-compose -f docker-compose.yml $(1)
compose_ingest_fn = docker-compose -f docker-compose.yml -f docker-compose.ingest.yml $(1)

.PHONY: clean
clean:
	$(call compose_ingest_fn, down -v)

.PHONY: stop
down:
	$(call compose_ingest_fn, down)

.PHONY: start-ingest
start-ingest:
	$(call compose_ingest_fn, up)

.PHONY: start
start:
	$(call compose_server_fn, up)
