-- Cria��o da tabela AUTHENTICATION
CREATE TABLE authentication (
    ID INTEGER PRIMARY KEY,
    Username VARCHAR2(16) NOT NULL,
    RolesName VARCHAR2(50) NOT NULL,
    Badge VARCHAR2(255) UNIQUE NOT NULL,
    Password VARCHAR2(50) NOT NULL
);

-- Criando uma sequgencia para gerar valores do ID:
CREATE SEQUENCE auth_seq START WITH 1 INCREMENT BY 1;

-- Criando um gatilho para usar a sequ�ncia na inser��o de novos registros
CREATE TRIGGER auth_trigger
BEFORE INSERT ON authentication
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
    SELECT auth_seq.NEXTVAL INTO :NEW.ID FROM dual;
END;
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- Criando a tabela users
CREATE TABLE users (
    ID INTEGER PRIMARY KEY,
    Name VARCHAR2(50) NOT NULL,
    Badge VARCHAR2(255)  UNIQUE NOT NULL,
    Created DATE NOT NULL
);

-- Criando uma sequ�ncia para a tabela users
CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;

-- Criando um gatilho para preencher o ID automaticamente usando a sequ�ncia users_seq
CREATE TRIGGER users_trigger
BEFORE INSERT ON users
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
    SELECT users_seq.NEXTVAL INTO :NEW.ID FROM dual;
END;
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- Inserir usu�rio na tabela users
INSERT INTO users (Name, Badge, Created)
VALUES ('admin', 'admin_badge', SYSDATE);

-- Inserir informa��es na tabela authentication
INSERT INTO authentication (Username, RolesName, Badge, Password)
VALUES ('admin', 'admin_role', 'admin_badge', 'admcompal');
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- Criando  a tabela images
CREATE TABLE images (
    ID INTEGER PRIMARY KEY,
    UserId INTEGER NOT NULL,
    PictureStream BLOB,
    CONSTRAINT fk_users FOREIGN KEY (UserId) REFERENCES users(ID)
);

-- Criando uma sequ�ncia para a tabela images
CREATE SEQUENCE images_seq START WITH 1 INCREMENT BY 1;

-- Criando um gatilho para preencher o ID automaticamente usando a sequ�ncia images_seq
CREATE TRIGGER images_trigger
BEFORE INSERT ON images
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
    SELECT images_seq.NEXTVAL INTO :NEW.ID FROM dual;
END;

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- Criando  a tabela jig
CREATE TABLE jig (
    ID INTEGER PRIMARY KEY,
    Name VARCHAR2(50) NOT NULL,
    Description VARCHAR2(250),
    Created DATE,
    LastUpdated DATE
);

-- Criando uma sequ�ncia para a tabela jig
CREATE SEQUENCE jig_seq START WITH 1 INCREMENT BY 1;

-- Criando um gatilho para preencher o ID automaticamente usando a sequ�ncia jig_seq
CREATE TRIGGER jig_trigger
BEFORE INSERT ON jig
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
    SELECT jig_seq.NEXTVAL INTO :NEW.ID FROM dual;
END;

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- Criando  a tabela roles
CREATE TABLE roles (
    ID INTEGER PRIMARY KEY,
    RolesName VARCHAR2(50)UNIQUE NOT NULL
);

-- Criando uma sequ�ncia para a tabela roles
CREATE SEQUENCE roles_seq START WITH 1 INCREMENT BY 1;

-- Criando um gatilho para preencher o ID automaticamente usando a sequ�ncia roles_seq
CREATE TRIGGER roles_trigger
BEFORE INSERT ON roles
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
    SELECT roles_seq.NEXTVAL INTO :NEW.ID FROM dual;
END;

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- Criando  a tabela station
CREATE TABLE station (
    ID INTEGER PRIMARY KEY,
    Name VARCHAR2(50) UNIQUE NOT NULL,
    SizeX NUMBER(10) NOT NULL,
    SizeY NUMBER(10) NOT NULL,
    Created DATE,
    LastUpdated DATE
);

-- Criando  uma sequ�ncia para a tabela station
CREATE SEQUENCE station_seq START WITH 1 INCREMENT BY 1;

-- Criando um gatilho para preencher o ID automaticamente usando a sequ�ncia station_seq
CREATE TRIGGER station_trigger
BEFORE INSERT ON station
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
    SELECT station_seq.NEXTVAL INTO :NEW.ID FROM dual;
END;

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- Crie a tabela line:
CREATE TABLE line (
    ID INTEGER PRIMARY KEY,
    Name VARCHAR2(255) UNIQUE NOT NULL
);

-- Crie uma sequ�ncia para a tabela line:
CREATE SEQUENCE line_seq START WITH 1 INCREMENT BY 1;

-- Crie um gatilho para preencher o ID automaticamente usando a sequ�ncia line_seq:
CREATE TRIGGER line_trigger
BEFORE INSERT ON line
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
    SELECT line_seq.NEXTVAL INTO :NEW.ID FROM dual;
END;

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- Criando a tabela monitorEsd
CREATE TABLE monitorEsd (
    ID NUMBER PRIMARY KEY,
    SerialNumber VARCHAR2(100) UNIQUE NOT NULL,
    Status VARCHAR2(20),
    StatusOperador VARCHAR2(20),
    StatusJig VARCHAR2(20),
    Description VARCHAR2(250),
    DateHour TIMESTAMP NOT NULL,
    LastDate TIMESTAMP NOT NULL
);

-- Criando 
CREATE SEQUENCE monitorEsd_seq START WITH 1 INCREMENT BY 1;

-- Criando um gatilho para preencher o ID automaticamente usando a sequ�ncia monitorEsd_seq
CREATE TRIGGER monitorEsd_trigger
BEFORE INSERT ON monitorEsd
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
    SELECT monitorEsd_seq.NEXTVAL INTO :NEW.ID FROM dual;
END;

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- Criando a tabela linkStationAndLine
CREATE TABLE linkStationAndLine (
    ID INTEGER PRIMARY KEY,
    OrdersList INTEGER NOT NULL,
    LineID INTEGER NOT NULL,
    StationID INTEGER NOT NULL,
    Created DATE,
    LastUpdated DATE,
    CONSTRAINT fk_line FOREIGN KEY (LineID) REFERENCES line(ID),
    CONSTRAINT fk_station FOREIGN KEY (StationID) REFERENCES station(ID)
);

-- Criando uma sequ�ncia para a tabela linkStationAndLine
CREATE SEQUENCE linkStationAndLine_seq START WITH 1 INCREMENT BY 1;

-- Criando  um gatilho para preencher o ID automaticamente usando a sequ�ncia linkStationAndLine_seq
CREATE TRIGGER linkStationAndLine_trigger
BEFORE INSERT ON linkStationAndLine
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
    SELECT linkStationAndLine_seq.NEXTVAL INTO :NEW.ID FROM dual;
END;

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------

-- Criando  a tabela stationView
CREATE TABLE stationView (
    ID INTEGER PRIMARY KEY,
    MonitorEsdId INTEGER UNIQUE NOT NULL,
    LinkStationAndLineId INTEGER NOT NULL,
    PositionSequence INTEGER NOT NULL,
    Created DATE,
    LastUpdated DATE,
    CONSTRAINT fk_linkStationAndLine FOREIGN KEY (LinkStationAndLineId) REFERENCES linkStationAndLine(ID),
    CONSTRAINT fk_monitor FOREIGN KEY (MonitorEsdId) REFERENCES monitorEsd(ID)
);

CREATE SEQUENCE stationView_seq START WITH 1 INCREMENT BY 1;

CREATE TRIGGER stationView_trigger
BEFORE INSERT ON stationView
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
    SELECT stationView_seq.NEXTVAL INTO :NEW.ID FROM dual;
END;

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- cada nome de restri��o foi alterado para incluir um prefixo (fk_produceActivity_) para garantir que seja exclusivo.
-- Criando a tabela produceActivity
CREATE TABLE produceActivity (
    ID INTEGER PRIMARY KEY,
    UserId INTEGER NOT NULL,
    JigId INTEGER NOT NULL,
    MonitorEsdId INTEGER NOT NULL,
    LinkStationAndLineID INTEGER,  -- Adicionando a coluna para a foreign key
    IsLocked NUMBER(1) NOT NULL CHECK (IsLocked IN (0, 1)),
    Description VARCHAR2(250),
    DataTimeMonitorEsdEvent DATE,
    CONSTRAINT fk_produceActivity_jig FOREIGN KEY (JigId) REFERENCES jig(ID),
    CONSTRAINT fk_produceActivity_monitor FOREIGN KEY (MonitorEsdId) REFERENCES monitorEsd(ID),
    CONSTRAINT fk_produceActivity_user FOREIGN KEY (UserId) REFERENCES users(ID),
    CONSTRAINT fk_produceActivity_linkStLine FOREIGN KEY (LinkStationAndLineID) REFERENCES linkStationAndLine(ID)
);
-- Criando  uma sequ�ncia para a tabela produceActivity
CREATE SEQUENCE produceActivity_seq START WITH 1 INCREMENT BY 1;

-- Criando um gatilho para preencher o ID automaticamente usando a sequ�ncia produceActivity_seq
CREATE TRIGGER produceActivity_trigger
BEFORE INSERT ON produceActivity
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
    SELECT produceActivity_seq.NEXTVAL INTO :NEW.ID FROM dual;
END;

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- Nomes das Restri��es: Abreviados para fk_rsp_produceActivity e fk_rsp_users.
-- Criando a tabela recordStatusProduce
CREATE TABLE recordStatusProduce (
    ID INTEGER PRIMARY KEY,
    ProduceActivityId INTEGER NOT NULL,
    UserId INTEGER NOT NULL,
    Description VARCHAR2(250) NOT NULL,
    Status NUMBER(1),
    DateEvent DATE,
    CONSTRAINT fk_rsp_produceActivity FOREIGN KEY (ProduceActivityId) REFERENCES produceActivity(ID),
    CONSTRAINT fk_rsp_users FOREIGN KEY (UserId) REFERENCES users(ID)
);

-- Criando uma sequ�ncia para a tabela recordStatusProduce
CREATE SEQUENCE recordStatusProduce_seq START WITH 1 INCREMENT BY 1;

-- Criando  um gatilho para preencher o ID automaticamente usando a sequ�ncia ecordStatusProduce_seq
CREATE TRIGGER recordStatusProduce_trigger
BEFORE INSERT ON recordStatusProduce
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
    SELECT recordStatusProduce_seq.NEXTVAL INTO :NEW.ID FROM dual;
END;

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------

