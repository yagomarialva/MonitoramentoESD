import mysql.connector
from datetime import date
import random

# Connect to MySQL
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="fct_db"
)

# Create a cursor
mycursor = mydb.cursor()

# SQL statements to insert data
sql_users = "INSERT INTO users (Id, Name, Badge, Born) VALUES (%s, %s, %s, %s)"
sql_monitor = "INSERT INTO monitoresd (Id, UserId, SerialNumber, PositionX, PositionY, Status, Description, DateHour, LastDate) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"

# Generate data for users
val_users = []
for i in range(1, 301):
    val_users.append((i, f'User Test {i:04d}', f'XQDL {i}', date.today()))

# Generate data for monitors
val_monitor = []
rows, cols = 20, 14  # Dimensions of the matrix
for i in range(1, 281):
    row = (i - 1) // cols + 1  # Calculate row number (1-based index)
    col = (i - 1) % cols + 1   # Calculate column number (1-based index)
    status = random.choice(['PASS', 'FAIL'])  # Randomly choose 'PASS' or 'FAIL'
    val_monitor.append((
        i, 
        i, 
        f'AXY{i:06}', 
        row, 
        col, 
        status, 
        f'Monitor for compal stations {i}', 
        date.today(), 
        date.today()
    ))

# Insert data
try:
    # Insert into users table
    mycursor.executemany(sql_users, val_users)
    
    # Insert into monitoresd table
    mycursor.executemany(sql_monitor, val_monitor)
    
    # Commit the transaction
    mydb.commit()
    print(mycursor.rowcount, "record(s) inserted.")
except mysql.connector.Error as err:
    print(f"Error: {err}")
    mydb.rollback()

# Close the cursor and connection
mycursor.close()
mydb.close()
