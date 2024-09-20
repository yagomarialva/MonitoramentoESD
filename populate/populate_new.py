import mysql.connector
from datetime import datetime
import random
import string
import uuid
import os

# Script para gerar dados aleatórios em tabelas seguenciais onde uma depende da outra para gerar dados no banco.
# por favor não altere a ordem de polulação das tabelas por causa das PK e Fk cada tabela.
# Função para gerar strings aleatórias
def generate_random_string(length):
    letters = string.ascii_letters + string.digits + "-_"
    return ''.join(random.choice(letters) for _ in range(length))

# Lista de valores específicos para o campo description da tabela jig
fixture_descriptions = [
    "Warlock Intel RPL",
    "Warlock AMD",
    "Warlock ADL",
    "Warlock Metal",
    "Arches 14 MLK",
    "Oasis 14 MLK",
    "Arches 13 MLK",
    "Luxor MLK",
    "Aegis MLK2",
    "Sentry UMA/DIS/2in1",
    "Polaris",
    "Maldives R6U",
    "Garden Party"
]

# Função para gerar um nome aleatório para a tabela Users
def generate_random_name():
    first_names = ["Lucas", "Gabriel", "Miguel", "Alice", "Sophia", "Isabella", "Pedro", "Arthur", "Helena", "Valentina"]
    last_names = ["Silva", "Santos", "Oliveira", "Pereira", "Costa", "Rodrigues", "Almeida", "Nascimento", "Lima", "Gomes"]
    return f"{random.choice(first_names)} {random.choice(last_names)}"

# Função para gerar um badge aleatório
def generate_random_badge():
    prefix = 'b1g'
    number = ''.join(random.choices(string.digits, k=4))
    return f"{prefix}{number}"

# Função para carregar o conteúdo de uma imagem em formato binário
def load_image_as_string(file_path):
    with open(file_path, 'rb') as file:
        return file.read().decode('latin1')  # Usando 'latin1' para converter binário para string

# Função para obter uma lista de caminhos de arquivos de imagem em um diretório
def get_image_file_paths(directory):
    return [os.path.join(directory, file) for file in os.listdir(directory) if file.endswith(('png', 'jpg', 'jpeg', 'bmp'))]

# Conecte ao MySQL
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="fct_db"
)

# Criar um cursor
mycursor = mydb.cursor()

# SQL para inserir dados
sql_monitor = "INSERT INTO monitoresd (serialNumber, statusOperador, statusJig, description, dateHour, lastDate) VALUES (%s, %s, %s, %s, %s, %s, %s)"
sql_jig = "INSERT INTO jig (name, description, created, lastUpdated) VALUES (%s, %s, %s, %s)"
sql_line = "INSERT INTO line (ID, Name) VALUES (%s, %s)"
sql_station = "INSERT INTO station (id, name, sizeX, sizeY, created, lastUpdated) VALUES (%s, %s, %s, %s, %s, %s)"
sql_link_station_and_line = "INSERT INTO linkStationAndLine (id, `order`, lineID, stationID, created, lastUpdated) VALUES (%s, %s, %s, %s, %s, %s)"
sql_station_view = "INSERT INTO stationview (id, monitorEsdId, linkStationAndLineId, positionsequence, created, lastUpdated) VALUES (%s, %s, %s, %s, %s, %s)"
sql_users = "INSERT INTO users (ID, Name, Badge, Created) VALUES (%s, %s, %s, %s)"
sql_images = "INSERT INTO images (Id, UserId, PictureStream) VALUES (%s, %s, %s)"
sql_produce_activity =  "INSERT INTO produceactivity (ID, userId, jigid ,monitoresdId, stationID, isLocked, description, DataTimeMonitorEsdEvent) VALUES (%s, %s, %s, %s, %s, %s, %s)"


# Diretório com as imagens
image_directory = "populate\image"  # Modifique com o caminho correto

# Obter os caminhos dos arquivos de imagem
image_paths = get_image_file_paths(image_directory)

# Função para verificar se um usuário existe
def check_user_exists(user_id):
    mycursor.execute("SELECT COUNT(*) FROM users WHERE Id = %s", (user_id,))
    return mycursor.fetchone()[0] > 0


# Gerar dados para a tabela monitoresd
val_monitor = []
for i in range(1, 6):  # Adapte o número de registros conforme necessário
    serial_number = generate_random_string(50)
    status_operador = random.choice(['PASS', 'FAIL'])
    status_jig = random.choice(['PASS', 'FAIL'])
    description = generate_random_string(70)
    date_hour = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    last_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    val_monitor.append((
        serial_number,
        status_operador,
        status_jig,
        description,
        date_hour,
        last_date
    ))
# Gerar dados para a tabela jig
val_jig = []
for i in range(1, 6):  # Adapte o número de registros conforme necessário
    name = ''.join(random.choices('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_', k=50))
    description = random.choice(fixture_descriptions)
    created = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    last_updated = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    val_jig.append((
        name,
        description,
        created,
        last_updated
    ))
# Gerar dados para a tabela line
val_line = []
for i in range(1, 6):  # De 1 a 1000
    id = i
    name = f"Linha {i}"  # Nome no formato "Line X"
    
    val_line.append((
        id,
        name
    ))
# Gerar dados para a tabela station
val_station = []
for i in range(1, 6):  # De 1 a 1000
    id = i
    name = f"Post {i}"  # Nome no formato "Post X"
    sizeX = random.randint(1, 4)  # Número aleatório entre 1 e 6
    sizeY = random.randint(1, 4)  # Número aleatório entre 1 e 6
    created = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]  # Data e hora atual
    last_updated = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]  # Data e hora atual
    
    val_station.append((
        id,
        name,
        sizeX,
        sizeY,
        created,
        last_updated
    ))
# Gerar dados para a tabela LinkStationAndLine
val_link_station_and_line = []
for i in range(1, 6):  # De 1 a 5000
    id = i
    order = random.randint(1, 6)  # Número aleatório entre 1 e 5000
    lineID = random.randint(1, 6)  # Número aleatório entre 1 e 5000
    stationID = random.randint(1, 6)  # Número aleatório entre 1 e 5000
    created = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]   # Data e hora atual no formato UTC
    last_updated = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]  # Data e hora atual no formato UTC
    
    val_link_station_and_line.append((
        id,
        order,
        lineID,
        stationID,
        created,
        last_updated
    ))
# Gerar dados para a tabela stationview
val_station_view = []
for i in range(1, 6):
    id = str(uuid.uuid4())  # Gerar um GUID único
    monitor_esd_id = random.randint(1, 6)
    link_station_and_line_id = random.randint(1, 6)
    position_sequence = random.randint(1, 6)  # Valor aleatório para positionsequence
    created = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]
    last_updated = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]
    # Adicionar de 1 a 3 monitor_esd_id diferentes
    for _ in range(random.randint(1, 3)):
        monitor_esd_id = random.randint(1, 6)
        val_station_view.append((
            id,
            monitor_esd_id,
            link_station_and_line_id,
            position_sequence,
            created,
            last_updated
        ))
# Gerar dados para a tabela users
val_users = []
for i in range(1, 101):  # Adapte o número de registros conforme necessário
    user_id = i
    name = generate_random_name()
    badge = generate_random_badge()
    created = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]
    
    val_users.append((
        user_id,
        name,
        badge,
        created
    ))


# Gerar dados para a tabela images
val_images = []
# Assumindo que os IDs dos usuários já foram criados e vão de 1 a 100
for i, image_path in enumerate(image_paths):
    user_id = i + 1  # Assumindo que os IDs dos usuários são sequenciais de 1 a 100
    
    if check_user_exists(user_id):  # Verifica se o usuário existe
        picture_stream = load_image_as_string(image_path)
        
        val_images.append((
            i + 1,        # Id da imagem começando de 1
            user_id,      # UserId correspondente
            picture_stream  # Conteúdo da imagem como string
        ))


val_produce_activity = []
for i in range(1, 101):  # Adapte o número de registros conforme necessário
    id = i
    user_id = random.randint(1, 6)
    monitoresd_id = random.randint(1, 6)
    station_id = random.randint(1, 6)
    is_locked = random.choice([True, False])
    description = generate_random_string(20)  # Gera uma descrição aleatória com 20 caracteres
    datetime_monitor_esd_event = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]  # Data e hora atual
    
    val_produce_activity.append((
        id,
        user_id,
        monitoresd_id,
        station_id,
        is_locked,
        description,
        datetime_monitor_esd_event
    ))



# Função para inserir dados

def insert_data(sql_query, data_list):
    for record in data_list:
        try:
            mycursor.execute(sql_query, record)
            mydb.commit()
        except mysql.connector.Error as err:
            print(f"Erro ao inserir: {err}")
            mydb.rollback()

# Inserir dados (Função para inserir dados Primeiro inserimos dados nas tabelas station e line,
#  pois essas tabelas são referenciadas na tabela LinkStationAndLine.)
insert_data(sql_users, val_users)
insert_data(sql_images, val_images)
insert_data(sql_jig, val_jig)
insert_data(sql_line, val_line)
insert_data(sql_monitor, val_monitor)
insert_data(sql_station, val_station)
insert_data(sql_link_station_and_line, val_link_station_and_line)
insert_data(sql_station_view, val_station_view)


########################################
# Inserir os dados
#try:
    #mycursor.executemany(sql_jig, val_jig)
    #mycursor.executemany(sql_line, val_line)
    #mycursor.executemany(sql_station, val_station)
    #mycursor.executemany(sql_link_station_and_line, val_link_station_and_line)


    
    # Commit a transação
    #mydb.commit()
    #print(mycursor.rowcount, "registro(s) inserido(s).")
#except mysql.connector.Error as err:
    #print(f"Erro: {err}")
    #mydb.rollback()

# Fechar cursor e conexão
#mycursor.close()
#mydb.close()

###################################################################
# Inserir os dados um por vez
# for record in val_monitor:
#     try:
#         mycursor.execute(sql_monitor, record)
#         mydb.commit()  # Commit após cada inserção
#     except mysql.connector.Error as err:
#         print(f"Erro ao inserir monitor: {err}")
#         mydb.rollback()

# for record in val_jig:
#     try:
#         mycursor.execute(sql_jig, record)
#         mydb.commit()  # Commit após cada inserção
#     except mysql.connector.Error as err:
#         print(f"Erro ao inserir jig: {err}")
#         mydb.rollback()

# for record in val_line:
#     try:
#         mycursor.execute(sql_line, record)
#         mydb.commit()  # Commit após cada inserção
#     except mysql.connector.Error as err:
#         print(f"Erro ao inserir linha: {err}")
#         mydb.rollback()

# for record in val_station:
#     try:
#         mycursor.execute(sql_station, record)
#         mydb.commit()  # Commit após cada inserção
#     except mysql.connector.Error as err:
#         print(f"Erro ao inserir station: {err}")
#         mydb.rollback()

# for record in val_link_station_and_line:
#     try:
#         mycursor.execute(sql_link_station_and_line, record)
#         mydb.commit()  # Commit após cada inserção
#     except mysql.connector.Error as err:
#         print(f"Erro ao inserir link station and line: {err}")
#         mydb.rollback()
###################################################################

