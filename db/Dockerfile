FROM postgres:latest

ENV POSTGRES_USER=usertest
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=findyouranimal
ENV POSTGRES_HOST=127.0.0.1
ENV POSTGRES_PORT=5432

COPY structure.sql /docker-entrypoint-initdb.d/
