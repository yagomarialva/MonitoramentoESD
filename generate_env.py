# generate_env.py
import socket

def get_ip_address():
    hostname = socket.gethostname()
    return socket.gethostbyname(hostname)

def write_env_file(ip_address):
    with open('.env', 'w') as f:
        f.write(f"DB_HOST={ip_address}\n")

if __name__ == "__main__":
    ip_address = get_ip_address()
    write_env_file(ip_address)
