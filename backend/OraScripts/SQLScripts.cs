using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace BiometricFaceApi.OraScripts
{
    public class SQLScripts
    {
        /// <summary>
        /// Comando SQL USERS
        /// </summary>
        public const string VerifyTables = @"SELECT COUNT(1)
                                                FROM all_tables
                                                WHERE table_name = '{0}'";

        /// <summary>
        /// Comando SQL USERS
        /// </summary>
        //pesquisa e retornar todos os users
        public const string GetAllUsers = @"SELECT * FROM users";
        //pesquisa e lista todos os users
        public const string GetListUsers = @"SELECT * 
                                                    FROM (
                                                    SELECT a.*, ROWNUM rnum 
                                                    FROM (
                                                        SELECT * FROM users 
                                                        ORDER BY LASTUPDATED DESC
                                                    ) a 
                                                    WHERE ROWNUM <= :Offset + :Limit
                                                    ) 
                                                    WHERE rnum > :Offset";

        //pesquisa user por ID
        public const string GetUserById = @"SELECT * FROM users WHERE ID = :id";
        //pesquisa user por martricula
        public const string GetUserByBadge = @"SELECT * FROM users WHERE BADGE = :badgeLower";
        //pesquisa user por nome
        public const string GetUserByName = @"SELECT * FROM users WHERE NAME = :nameLower";
        //retorna a quantidade de users 
        public const string GetUsersCount = @"SELECT COUNT(*) FROM Users";
        //insert novo user
        public const string InsertUser = @"INSERT INTO users (
                                                                 NAME,
                                                                 BADGE,
                                                                 CREATED,
                                                                 LASTUPDATED
                                                             ) VALUES (
                                                                 :name,
                                                                 :badge,
                                                                 :created,
                                                                 :lastUpdated
                                                             )";
        //altera user
        public const string UpdateUser = @"UPDATE users 
                                                        SET 
                                                            NAME = :name, 
                                                            BADGE = :badge,
                                                            LASTUPDATED = :lastUpdated 
                                                        WHERE ID = :id";
        //deleta user
        public const string DeleteUser = @"DELETE FROM users WHERE ID = :id";


        /// <summary>
        /// COMANDOS SQL IMAGES
        /// </summary>
        //pesquisa e lista todas as imagens
        public const string GetAllImage = @"SELECT * FROM images";
        //retore uam lista de image
        public const string GetListImage = @"SELECT * 
                                                    FROM (
                                                    SELECT a.*, ROWNUM rnum 
                                                    FROM (
                                                        SELECT * FROM images 
                                                        ORDER BY LASTUPDATED DESC
                                                    ) a 
                                                    WHERE ROWNUM <= :Offset + :Limit
                                                    ) 
                                                    WHERE rnum > :Offset";
        //pesquisa imagem por ID
        public const string GetImageById = @"SELECT * FROM images WHERE ID = :id";
        //pesquisa usuario por ID           
        public const string GetUserId = @"SELECT * FROM images WHERE USERID = :userId";
        //pesqisa peal string da image
        public const string GetImageByString = @"SELECT * FROM images WHERE PICTURESTREAM = :img";
        //insere nova imagem
        public const string InsertImage = @"INSERT INTO images (
                                                                  USERID,
                                                                  PICTURESTREAM,
                                                                  CREATED,
                                                                  LASTUPDATED
                                                               ) VALUES (
                                                                  :userId,
                                                                  :pictureStream,
                                                                  :created,
                                                                  :lastUpdated
                                                               )";
        //atera imagem
        public const string UpdateImage = @"UPDATE images SET
                                                                USERID = :userId, 
                                                                PICTURESTREAM = :pictureStream,
                                                                LASTUPDATED = :lastUpdated
                                                          WHERE ID = :ID";
        //deleta imagem
        public const string DeleteImage = @"DELETE FROM images WHERE ID = :id";


        /// <summary>
        /// COMANDO SQL LINE
        /// </summary>
        //pesquisa e lista todas as linhas
        public const string GetAllLine = @"SELECT * FROM line";
        //pesquisa linha por id
        public const string GetLineById = @"SELECT * FROM line WHERE ID = :id";
        //pesquisa linha por nome
        public const string GetLineByName = @"SELECT * FROM line WHERE NAME = :nameLower";
        //insere linha 
        public const string InsertLine = @"INSERT INTO line (
                                                                NAME,
                                                                CREATED, 
                                                                LASTUPDATED
                                                            ) VALUES (
                                                                :name,
                                                                :created,
                                                                :lastUpdated
                                                            )";
        //altera linha
        public const string UpdateLine = @"UPDATE line 
                                                       SET 
                                                            NAME = :name,
                                                            LASTUPDATED = :lastUpdated
                                                       WHERE ID = :id";
        //deleta linha
        public const string DeleteLine = @"DELETE FROM line WHERE ID = :id";


        /// <summary>
        /// COMANDO SQL STATION
        /// </summary>
        //pesquisa e lista todas as estações
        public const string GetAllLStation = @"SELECT * FROM station";
        //pesquisa estação por id
        public const string GetStationId = @"SELECT * FROM station WHERE ID = :id";
        //pesqyuisa estação por nome
        public const string GetStationName = @"SELECT * FROM station WHERE NAME = :nameLower";
        //insere estação
        public const string InsertStation = @"INSERT INTO station (
                                                                       NAME, 
                                                                       SIZEX,
                                                                       SIZEY,
                                                                       CREATED,
                                                                       LASTUPDATED
                                                                  ) VALUES (
                                                                       :name, 
                                                                       :sizex, 
                                                                       :sizey,
                                                                       :lastUpdated, 
                                                                       :created
                                                                  )";
        //altera estação
        public const string UpdateStation = @"UPDATE station SET 
                                                                    NAME = :name, 
                                                                    SIZEX = :sizex, 
                                                                    SIZEY = :sizey, 
                                                                    LASTUPDATED = :lastUpdated 
                                                             WHERE ID = :id";
        //deleta estação
        public const string DeleteStation = @"DELETE FROM station WHERE ID = :id";


        /// <summary>
        /// COMANDO SQL JIG
        /// </summary>
        //pesquias e lista todos os jigs
        public const string GetAllJig = @"SELECT * FROM jig";
        //pesquisa jig por id
        public const string GetJigId = @"SELECT * FROM jig WHERE ID = :id";
        //pesquisa jig por serial number
        public const string GetjigBySerialNumber = @"SELECT SERIALNUMBER FROM jig WHERE SERIALNUMBER = :serialNumber";
        //pesquisa jig por nome
        public const string GetJigName = @"SELECT * FROM jig WHERE NAME = :nameLower";
        //insere jig
        public const string InsertJig = @"INSERT INTO jig (
                                                                NAME, 
                                                                SERIALNUMBER,
                                                                DESCRIPTION,
                                                                CREATED, 
                                                                LASTUPDATED
                                                          )VALUES (
                                                                :name, 
                                                                :serialNumber, 
                                                                :description, 
                                                                :created, 
                                                                :lastUpdated
                                                          )";
        //altera jig
        public const string UpdateJig = @"UPDATE jig    
                                                     SET
                                                            NAME = :name,
                                                            SERIALNUMBER:serialNumber,
                                                            DESCRIPTION = :description,
                                                            LASTUPDATED = :lastUpdated 
                                                     WHERE ID = :id";
        //deleta jig
        public const string DeleteJig = @"DELETE FROM jig WHERE ID = :id";


        /// <summary>
        /// COMANDO SQL MONITORESD
        /// </summary>
        //pesquisa e lista todos os monitoresEsd
        public const string GetAllMonitor = @"SELECT * FROM monitoresd";
        //pesquisa monitorEsd por id
        public const string GetMonitorId = @"SELECT * FROM monitoresd WHERE ID = :id";
        //pesquisa monitorEsd por serial number
        public const string GetSerialNumber = @"SELECT * FROM monitoresd WHERE SERIALNUMBER = :serial";
        //pesquisa monitorEsd pelo ip number
        public const string GetByIP = @"SELECT * FROM monitoresd WHERE IP = :ip";
        //pesquisa por logs do monitorEsd 
        public const string GetByLogs = @"SELECT * FROM monitoresd WHERE LOGS = :logs";
        //pesquisa por status
        public const string GetStatus = @"SELECT * FROM monitoresd WHERE STATUS = :statusLower";
        //pesquisa status do operador 
        public const string GetStatusOP = @"SELECT * FROM monitoresd WHERE STATUSOPERADOR = :statusOperadorLower";
        //pesquisa por status do jig
        public const string GetStatusJig = @"SELECT * FROM monitoresd WHERE STATUSJIG = :statusJigLower";
        //insere mionitorEsd
        public const string InsertMonitorEsd = @"INSERT INTO monitoresd (
                                                                            SERIALNUMBER,
                                                                            DESCRIPTION, 
                                                                            CREATED, 
                                                                            LASTUPDATED
                                                                         )VALUES (
                                                                            :serialNumber,
                                                                            :description, 
                                                                            :created, 
                                                                            :lastUpdated
                                                                         )";
        // altera monitorEsd
        public const string UpdateMonitorEsd = @"UPDATE monitoresd 
                                                                   SET 
                                                                        SERIALNUMBER = :serialNumber,
                                                                        DESCRIPTION = :description, 
                                                                        LASTUPDATED = :lastUpdated
                                                                   WHERE ID = :id";
        //deleta minitorEsd
        public const string DeleteMonitor = @"DELETE FROM monitoresd WHERE ID = :id";


        /// <summary>
        /// COMANDO SQL LINKSTATIONANDLINE
        /// </summary>
        public const string GetAllLinks = @"SELECT * FROM linkStationAndLine";
        //pesquisa link por id
        public const string GetByLineId = @"SELECT * FROM linkStationAndLine WHERE LINEID = :lineId";
        //pesquisa linha por id
        public const string GetByLinkId = @"SELECT * FROM linkStationAndLine WHERE ID = :id";
        //pesquisa estação por id
        public const string GetByLinkStationId = @"SELECT * FROM linkStationAndLine WHERE STATIONID = :stationId ";
        //pusquisa link de linha e estação por id
        public const string GetByLinkLineAndStationById = @"SELECT * FROM linkStationAndLine WHERE LINEID = :lineId AND STATIONID = :stationId";
        //faz duas pesquisas por Id de linha e Id de estação
        public const string GetLineAndStationbyId = @"SELECT 
                                                                ID, 
                                                                ORDERSLIST, 
                                                                LINEID,
                                                                STATIONID, 
                                                                CREATED, 
                                                                LASTUPDATED 
                                                              FROM 
                                                                linkStationAndLine 
                                                              WHERE 
                                                                LINEID = :lineId 
                                                              AND 
                                                                STATIONID = :stationId";
        //insere link de estação e linha
        public const string InsertLinkAndStation = @"INSERT INTO linkStationAndLine (
                                                                                        ORDERSLIST,
                                                                                        LINEID,
                                                                                        STATIONID,
                                                                                        CREATED, 
                                                                                        LASTUPDATED
                                                                                    ) VALUES (
                                                                                        :ordersList, 
                                                                                        :lineId, 
                                                                                        :stationId, 
                                                                                        :created, 
                                                                                        :lastUpdated
                                                                                    )";
        //altera lide de estação e linha
        public const string UpdateLinkAndStation = @"UPDATE linkStationAndLine 
                                                                              SET 
                                                                                    ORDERSLIST = :ordersList, 
                                                                                    LINEID = :lineId, 
                                                                                    STATIONID = :stationId, 
                                                                                    LASTUPDATED = :lastUpdated 
                                                                               WHERE ID = :id";
        //deleta link de estação e linha
        public const string DeleteLinkAndStation = @"DELETE FROM linkStationAndLine WHERE ID = :id";


        /// <summary>
        /// COMANDO SQL PRODUCEACTIVITY
        /// </summary>
        //pesquisa e lista todos os produceActivity
        public const string GetAllProcuceAct = @"SELECT * FROM produceactivity";
        //pesquisa por produceActivity por id
        public const string GetProduceActById = @"SELECT * FROM produceactivity WHERE ID = :id";
        //pesquisa monitor por id 
        public const string GetMonitorActById = @"SELECT * FROM produceactivity WHERE MONITORPRODUCE = :monitorProduce";
        //pesquisa jig por id
        public const string GetJigActById = @"SELECT * FROM produceactivity WHERE JIGPRODUCE = :jigProduce";
        //pesquisa user por id
        public const string GetUserActById = @"SELECT * FROM produceactivity WHERE USERPRODUCE = :usersProduce";
        //pesquisa estação por id
        public const string GetLinkStationAndLineById = @"SELECT * FROM produceactivity WHERE LINKSTATIONANDLINEID = :LinkStationAndLineId";
        //pesquisa isLocked por id
        public const string GetIsLockedId = @"SELECT * FROM produceactivity WHERE ISLOCKED = :id";
        //insere produceActivity
        public const string InsertProduceAct = @"INSERT INTO produceactivity ( 
                                                                       USERID, 
                                                                       JIGID, 
                                                                       MONITORESDID, 
                                                                       LINKSTATIONANDLINEID, 
                                                                       ISLOCKED, 
                                                                       DESCRIPTION,
                                                                       CREATED,
                                                                       LASTUPDATED
                                                                     ) VALUES (
                                                                      :userId,
                                                                      :jigId,
                                                                      :monitorEsdId,
                                                                      :linkStationAndLineID,
                                                                      :isLocked,
                                                                      :description,
                                                                      :created,
                                                                      :lastUpdated
                                                                     )";


        //update produceActivity
        public const string UpdateProduceAct = @"UPDATE produceactivity 
                                                    SET 
                                                        USERID = :userid, 
                                                        JIGID = :jigid, 
                                                        MONITORESDID = :monitoresdid, 
                                                        LINKSTATIONANDLINEID = :linkStationAndLineID, 
                                                        ISLOCKED = :islocked, 
                                                        DESCRIPTION = :description, 
                                                        LASTUPDATED = :lastUpdated
                                                   WHERE ID = :id";
       public const string DeleteProduceAct = @"DELETE FROM produceactivity WHERE ID = :id";


        /// <summary>
        /// COMANDO SQL RECORDSTATUSPRODUCE
        /// </summary>
        //pesquisa e lista todos recordStatusProduce
        public const string GetAllRecordStatus = @"SELECT * FROM recordStatusProduce";
        //pesquisa recordStatusProduce por id
        public const string GetRecordStatusById = @"SELECT * FROM recordStatusProduce WHERE ID = :id";
        //pesquisa produceActivity por id 
        public const string GetRecordProduceActId = @"SELECT * FROM recordStatusProduce WHERE PRODUCEACTIVITYID = :produceActivityId";
        //pesquisa userId por id
        public const string GetRecordProduceUserId = @"SELECT * FROM recordStatusProduce WHERE USERID = :userId";
        //insere recordStatusProduce
        public const string InsereRecordStatusProduce = @"INSERT INTO recordstatusproduce (
                                                                                            PRODUCEACTIVITYID,
                                                                                            USERID,
                                                                                            DESCRIPTION,
                                                                                            STATUS,
                                                                                            DATEEVENT
                                                                                         ) VALUES (
                                                                                            :produceactivityid, 
                                                                                            :userid, 
                                                                                            :description, 
                                                                                            :status, 
                                                                                            :dateEvent 
                                                                                         )";
        //update recordStatusProduce
        public const string UpdateRecordStatusProduce = @"UPDATE recordstatusproduce 
                                                            SET 
                                                                PRODUCEACTIVITYID = :produceactivityid, 
                                                                USERID = :userid, 
                                                                DESCRIPTION = :description, 
                                                                STATUS = :status, 
                                                                DATEEVENT = :dateEvent 
                                                            WHERE ID = :recordModel";
        //deleta recordStatusProduce
        public const string DeleteRecordStatusProduce = @"DELETE FROM recordstatusproduce WHERE ID = :id";


        /// <summary>
        /// COMANDO SQL ROLES
        /// </summary>  
        //pesquisa e lista todos roles
        public const string GetAllRoles = @"SELECT * FROM roles";
        //pesquisa roles por id
        public const string GetRolesById = @"SELECT * FROM roles WHERE ID = :id";
        //pesquisa roles por id
        public const string GetRolesByRolesName = @"SELECT * FROM roles WHERE ROLESNAME = :roleLower";
        //insere roles
        public const string InsertRoles = @"INSERT INTO Roles (
                                                                    ROLESNAME,
                                                                    CREATED,
                                                                    LASTUPDATED
                                                              ) VALUES (    
                                                                    :rolesname,
                                                                    :created,
                                                                    :lastUpdated
                                                              )";
        //update roles
        public const string UpdateRoles = @"UPDATE Roles
                                                SET 
                                                    ROLESNAME = :rolesname,
                                                    LASTUPDATED = :lastUpdated
                                                WHERE
                                                    ID = :id";
        //delete roles
        public const string DeleteRoles = @"DELETE FROM Roles WHERE  ID = :id";


        /// <summary>
        /// COMANDO SQL AUTHENTICATION
        /// </summary>      
        //realiza pesquisa de usuario e senha para realizar a autenticação
        public const string AuthenticateUser = @"SELECT 
                                                        ID, 
                                                        USERNAME, 
                                                        ROLESNAME, 
                                                        BADGE, 
                                                        PASSWORD 
                                                    FROM 
                                                        Authentication 
                                                    WHERE 
                                                        USERNAME = :username 
                                                    AND PASSWORD = :password";
        //pesquisa authetication por id
        public const string GetAuthenticationById = @"SELECT * FROM authentication WHERE ID = :id";
        //pesquisa authetication por username
        public const string GetAuthenticationByUserName = @"SELECT * FROM AUTHENTICATION WHERE username=:username";
        //pesquisa authetication por badge
        public const string GetAuthenticationByBadge = @"SELECT * FROM authentication WHERE BADGE = :badge";
        //insere authetication
        public const string InsertAuthentication = @"INSERT INTO Authentication ( 
                                                                                USERNAME, 
                                                                                ROLESNAME, 
                                                                                BADGE, 
                                                                                PASSWORD,
                                                                                CREATED,
                                                                                LASTUPDATED
                                                                            ) VALUES ( 
                                                                                :username,
                                                                                :rolesname,
                                                                                :badge,
                                                                                :password,
                                                                                :created,
                                                                                :lastUpdated
                                                                            )";
        //update authetication
        public const string UpdateAuthentication = @"UPDATE Authentication
                                                                    SET 
                                                                        USERNAME = :username,
                                                                        ROLESNAME = :rolesname,
                                                                        BADGE = :badge,
                                                                        PASSWORD = :password,
                                                                        LASTUPDATED = :lastUpdated
                                                                    WHERE
                                                                        ID = :id";
        //delete authetication
        public const string DeleteAuthentication = @"DELETE FROM Authentication WHERE ID = :id";


        /// <summary>
        /// COMANDO SQL STATIONVIEW
        /// </summary>   
        //pesquisa e lista todos stationview
        public const string GetAllStationView= @"SELECT * FROM stationview";
        //pesquisa stationview por id
        public const string GetStationViewById = @"SELECT * FROM stationview WHERE ID = :id";
        //procura id de monitor na tabela estaionView
        public  const string GetMonitorByIdInST = @"SELECT * FROM stationview WHERE monitoresdid = :id";
        //pesquisa pesquisa positionseguence por id 
        public const string GetStationViewPositionById = @"SELECT * FROM stationview WHERE POSITIONSEQUENCE = :positionId";
        //pesquisa pesquisa positionseguence por id 
        public const string GetStationViewPositionByLinkId = @"SELECT POSITIONSEQUENCE FROM stationview WHERE LINKSTATIONANDLINEID = :linkStationAndLineId AND POSITIONSEQUENCE = :seguenceNumber";
        //delete stationview
        public const string DeleteStationView = @"DELETE FROM StationView WHERE ID = :id";
        //delete monitor da tablea stationview
        public const string Delele_MonitorByStationView = @"DELETE FROM stationview WHERE monitoresdid = :id";
        //insert stationview
        public const string InsertStationView = @"INSERT INTO StationView ( 
                                                                                MONITORESDID, 
                                                                                LINKSTATIONANDLINEID, 
                                                                                POSITIONSEQUENCE, 
                                                                                CREATED, 
                                                                                LASTUPDATED
                                                                          ) VALUES ( 
                                                                                :monitoresdId, 
                                                                                :linkStationAndLineId, 
                                                                                :positionSequence, 
                                                                                :created, 
                                                                                :lastUpdated
                                                                          )";
        //update stationview
        public const string UpdateStationView = @"UPDATE StationView
                                                                    SET 
                                                                        MONITORESDID = :monitoresdId, 
                                                                        LINKSTATIONANDLINEID = :linkStationAndLineId, 
                                                                        POSITIONSEQUENCE = :positionSequence, 
                                                                        LASTUPDATED = :lastUpdate
                                                                    WHERE 
                                                                        ID = :id";

        /// <sumary>
        /// COMANDO SQL LOGMONITORESD
        /// <sumary>
        // retorna uma lista de logs cadastrados
        public const string GetAllLogMonitor = @"SELECT * FROM logmonitorEsd";
        // pesquisa logMonitor por ID
        public const string GetLogMonitorById = @"SELECT * FROM logmonitorEsd WHERE ID =:id";
        // pesquisa ID monitorEsd na tabela logMonitor
        public const string GetMonitorEsdInLogById = @"SELECT * FROM logmonitorEsd WHERE MONITORESDID = :monitorId";
        // pesquisa ID monitorEsd na tabela logMonitor
        public const string GetMonitorEsdInLogByIP = @"SELECT * FROM logmonitorEsd WHERE IP = :ip";
        //pesquisa SERIAL NUMBER de monitorEsd na tabela
        public const string GetMonitorEsdInLogBySerialNumber = @"SELECT * FROM logmonitoresd WHERE SERIALNUMBER = :serialNumber";
        //tras uma lista paginada de informações do monitor esd 
        public const string GetListMonitorByIdWithPagination = @"SELECT *
                                                            FROM (
                                                                SELECT t.*, ROWNUM rnum
                                                                FROM (
                                                                    SELECT * 
                                                                    FROM LogMonitorEsd
                                                                    WHERE MONITORESDID = :monitorId
                                                                    ORDER BY CREATED DESC
                                                                ) t
                                                                WHERE ROWNUM <= :limit + :offset
                                                            )
                                                            WHERE rnum > :offset";
        //tras uma lista paginada de informações do monitor esd atravez do SerialNumber
        public const string GetListMonitorBySerialNumberWithLimit = @"SELECT *
                                                                            FROM (
                                                                                SELECT t.*, ROWNUM rnum
                                                                                FROM LogMonitorEsd t
                                                                                WHERE SerialNumber = :serialNumber
                                                                                AND ROWNUM <= :limit
                                                                                ORDER BY Created DESC
                                                                            )
                                                                            WHERE rnum > 0";
        // retorna MenssageContent
        public const string GetMessageContent = @"SELECT * FROM logmonitorEsd WHERE MESSAGECONTENT = :messageContentLower";
        // retorna MenssageType
        public const string GetMessageType = @"SELECT * FROM logmonitorEsd WHERE MESSAGETYPE = :messageTypeLower";
        //pesquisar tipo de mensage
        public const string SelectLogMonitor = @"SELECT * FROM logmonitoresd WHERE ID = :id AND MESSAGETYPE = :messageType";
        // delete log de um MonitorEsd especifico.
        public const string DeleteLogMonitorEsd = @"DELETE FROM logmonitorEsd WHERE ID = :id";
        //delete monitorEsd da tabela Log
        public const string Delete_MonitorEsd = @"DELETE FROM logmonitoresd WHERE MONITORESDID = :id";
        // insert logMonitorEsd
        public const string InsertLogMonitorEsd = @"INSERT INTO logmonitorEsd (
                                                                                SerialNumber,
                                                                                MessageType, 
                                                                                MonitorEsdID,
                                                                                Ip,
                                                                                Status,
                                                                                MessageContent,
                                                                                Description,
                                                                                Created,
                                                                                LastUpdated
                                                                            ) VALUES (
                                                                                :SerialNumber,
                                                                                :MessageType, 
                                                                                :MonitorEsdID,
                                                                                :Ip,
                                                                                :Status,
                                                                                :MessageContent,
                                                                                :Description,
                                                                                :Created,
                                                                                :LastUpdated
                                                                            )";
        //update logMonitorEsd
        public const string UpdateLogMonitorEsd = @"UPDATE LogMonitorEsd
                                                                    SET 
                                                                        SerialNumber = :serialNumber,
                                                                        MessageType = :messagetype,
                                                                        MonitorEsdID = :monitoresdId,
                                                                        Ip = :ip,
                                                                        Status = :status,
                                                                        MessageContent = :messagecontent,
                                                                        Description = :description,
                                                                        LastUpdated = :lastUpdated
                                                                    WHERE ID = :id";
        //update status
        public const string UpdateLogMonitorStatus = @"UPDATE LogMonitorEsd
                                                                    SET 
                                                                        STATUS = :status,
                                                                        Description = :description,
                                                                        MessageType = :messageType,
                                                                        LastUpdated = :lastedUpdated
                                                                    WHERE ID = :id
                                                                      AND MESSAGETYPE = :messageType";



    }
}
