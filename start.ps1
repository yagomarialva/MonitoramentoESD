# python.exe -m pip install --upgrade pip


# pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org psutil

# pip install psutil

# Obtém o IP da máquina local
python generate_env.py
# Inicia o Docker Compose com a variável de ambiente configurada
docker-compose up -d --build
