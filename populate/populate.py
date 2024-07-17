import mysql.connector
from datetime import date

# Connect to MySQL
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="fct_db"
)

# Create a cursor
mycursor = mydb.cursor()


# SQL statement to insert data
sql_users = "INSERT INTO users (id, Name, Badge, Born) VALUES (%s, %s, %s, %s)"
sql_monitor = "INSERT INTO monitoresd (Id, SerialNumber, Description) VALUES (%s, %s, %s)"
sql_station = "INSERT INTO jig (Id, Name, Description, Created, LastUpdated) VALUES (%s, %s, %s, %s, %s )"
# sql_produce = "INSERT INTO produceactivity (Id, UserId, JigId, StationId, MonitorEsdId, IsLocked, Description, DataTimeMonitorEsdEvent) VALUES (%s, %s, %s, %s, %s, %s, %s, %s )"




val_monitor = []
for i in range(1, 300):
    val_monitor.append((i, f'AXY{i:06}', f'Monitor da Estação {i}'))

val_users = [
]
for i in range(1, 300):
    val_users.append((i, f'User Test {i:04d}', f'XQDL {i}',  date.today()))
#  ('1', 'John Doe', 'XQDL123', date.today()),

val_stations = []
for i in range(1, 300):
    station_id = f'Station {i:02}'
    station_desc = f'Station for ARCHERS {i} MLK'
    val_stations.append((i, station_id, station_desc, date.today(), date.today()))
    
    
# val_produce = []
# for i in range(1, 300):
#     val_produce.append((i, i, i, i, i, 1, f'Station for New JIGs {i}', date.today()))

# Insert data with tqdm progress bar
mycursor.executemany(sql_monitor, val_monitor)
mycursor.executemany(sql_users, val_users)
mycursor.executemany(sql_station, val_stations)
# mycursor.executemany(sql_produce, val_produce)

# Commit the transaction
mydb.commit()

# Verify insertion by checking the row count
print(mycursor.rowcount, "record inserted.")