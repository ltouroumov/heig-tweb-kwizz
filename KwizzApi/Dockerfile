FROM microsoft/dotnet:sdk

COPY . /app

WORKDIR /app

ENV LTTNG_UST_REGISTER_TIMEOUT=0

RUN ["dotnet", "restore"]

RUN ["dotnet", "build"]

EXPOSE 5000/tcp

CMD ["dotnet", "run", "--server.urls", "http://*:5000"]
