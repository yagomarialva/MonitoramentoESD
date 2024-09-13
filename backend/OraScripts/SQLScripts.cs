using System.Net.Security;

namespace BiometricFaceApi.OraScripts
{
    public class SQLScripts
    {

        /// <summary>
        /// Comando SQL CreateAdminUser
        /// </summary>
        public const string insertAdminUserQuery = @"
                INSERT INTO AUTHENTICATION (USERNAME, PASSWORD, ROLESNAME, BADGE)
                VALUES (:Username, :Password, :RolesName, :Badge)";
        //verificar se o usuário ja existe 
        public const string checkUserQuery = "SELECT COUNT(*) FROM AUTHENTICATION WHERE username = :username";

        /// <summary>
        /// Comando SQL USERS
        /// </summary>
        //pesquisa e lista todos os users
        public const string GetAllUsers = @"SELECT * FROM users";
       
        //pesquisa user por ID
        public const string GetUserById = @"SELECT * FROM users WHERE ID = :id";
        //pesquisa user por martricula
        public const string GetUserByBadge = @"SELECT * FROM users WHERE BADGE = :badge";
        //pesquisa user por nome
        public const string GetUserByName = @"SELECT * FROM users WHERE NAME = :name";
        //insert novo user
        public const string InsertUser = @"INSERT INTO users (
                                                                 NAME,
                                                                 BADGE,
                                                                 CREATED
                                                             ) VALUES (
                                                                 :name,
                                                                 :badge,
                                                                 SYSDATE
                                                             )";
        //altera user
        public const string UpdateUser = @"UPDATE users 
                                                        SET 
                                                            NAME = :name, 
                                                            BADGE = :badge 
                                                        WHERE ID = :id";
        //deleta user
        public const string DeleteUser = @"DELETE FROM users WHERE ID = :id";


        /// <summary>
        /// COMANDOS SQL IMAGES
        /// </summary>
        //pesquisa e lista todas as imagens
        public const string GetAllImage = @"SELECT * FROM images";
        //pesquisa imagem por ID
        public const string GetImageById = @"SELECT * FROM images WHERE ID = :id";
        //pesquisa usuario por ID           
        public const string GetUserId = @"SELECT * FROM images WHERE USERID = :userId";
        //insere nova imagem
        public const string InsertImage = @"INSERT INTO images (
                                                                  USERID,
                                                                  PICTURESTREAM
                                                               ) VALUES (
                                                                  :userId,
                                                                  :pictureStream
                                                               )";
        //atera imagem
        public const string UpdateImage = @"UPDATE images SET
                                                                USERID = :userId, 
                                                                PICTURESTREAM = :pictureStream 
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
        public const string GetLineByName = @"SELECT * FROM line WHERE NAME = :name";
        //insere linha 
        public const string InsertLine = @"INSERT INTO line (
                                                                NAME
                                                            ) VALUES (
                                                                :name
                                                            )";
        //altera linha
        public const string UpdateLine = @"UPDATE line 
                                                       SET 
                                                            NAME = :name 
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
        public const string GetStationName = @"SELECT * FROM station WHERE NAME = :name";
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
                                                                       SYSDATE, 
                                                                       SYSDATE
                                                                  )";
        //altera estação
        public const string UpdateStation = @"UPDATE station SET 
                                                                    NAME = :name, 
                                                                    SIZEX = :sizex, 
                                                                    SIZEY = :sizey, 
                                                                    LASTUPDATED = SYSDATE 
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
        //pesquisa jig por nome
        public const string GetJigName = @"SELECT * FROM jig WHERE NAME = :name";
        //insere jig
        public const string InsertJig = @"INSERT INTO jig (
                                                                NAME, 
                                                                DESCRIPTION,
                                                                CREATED, 
                                                                LASTUPDATED
                                                          )VALUES (
                                                                :name, 
                                                                :description, 
                                                                SYSDATE, 
                                                                SYSDATE
                                                          )";
        //altera jig
        public const string UpdateJig = @"UPDATE jig    
                                                     SET
                                                            NAME = :name,
                                                            DESCRIPTION = :description,
                                                            LASTUPDATED = SYSDATE 
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
        //pesquisa por status
        public const string GetStatus = @"SELECT * FROM monitoresd WHERE STATUS = :status";
        //pesquisa status do operador 
        public const string GetStatusOP = @"SELECT * FROM monitoresd WHERE STATUSOPERADOR = :statusOperador";
        //pesquisa por status do jig
        public const string GetStatusJig = @"SELECT * FROM monitoresd WHERE STATUSJIG = :statusJig";
        //insere mionitorEsd
        public const string InsertMonitorEsd = @"INSERT INTO monitoresd (
                                                                            SERIALNUMBER, 
                                                                            STATUS, 
                                                                            STATUSOPERADOR, 
                                                                            STATUSJIG, 
                                                                            DESCRIPTION, 
                                                                            DATEHOUR, 
                                                                            LASTDATE
                                                                         )VALUES (
                                                                            :serialNumber, 
                                                                            :status, 
                                                                            :statusOperador, 
                                                                            :statusJig, 
                                                                            :description, 
                                                                            SYSDATE, 
                                                                            SYSDATE
                                                                         )";
        // altera monitorEsd
        public const string UpdateMonitorEsd = @"UPDATE monitoresd 
                                                                   SET 
                                                                        SERIALNUMBER = :serialNumber, 
                                                                        STATUS = :status, 
                                                                        STATUSOPERADOR = :statusOperador,
                                                                        STATUSJIG = :statusJig, 
                                                                        DESCRIPTION = :description, 
                                                                        LASTDATE = SYSDATE
                                                                   WHERE ID = :id";
        //deleta minitorEsd
        public const string DeleteMonitor = @"DELETE FROM monitoresd WHERE ID = :id";


        /// <summary>
        /// COMANDO SQL LINKSTATIONANDLINE
        /// </summary>
        public const string GetAllLinks = @"SELECT * FROM linkStationAndLine";
        //pesquisa link por id
        public const string GetByLineId = @"SELECT * FROM linkStationAndLine WHERE LINEID = :id";
        //pesquisa linha por id
        public const string GetByLinkId = @"SELECT * FROM linkStationAndLine WHERE ID = :id";
        //pesquisa estação por id
        public const string GetByLinkStationId = @"SELECT * FROM linkStationAndLine WHERE STATIONID = :id ";
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
                                                                                        SYSDATE, 
                                                                                        SYSDATE
                                                                                    )";
        //altera lide de estação e linha
        public const string UpdateLinkAndStation = @"UPDATE linkStationAndLine 
                                                                              SET 
                                                                                    ORDERSLIST = :ordersList, 
                                                                                    LINEID = :lineId, 
                                                                                    STATIONID = :stationId, 
                                                                                    LASTUPDATED = SYSDATE 
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
        public const string GetMonitorActById = @"SELECT * FROM produceactivity WHERE MONITORPRODUCE = :id";
        //pesquisa jig por id
        public const string GetJigActById = @"SELECT * FROM produceactivity WHERE JIGPRODUCE = :id";
        //pesquisa user por id
        public const string GetUserActById = @"SELECT * FROM produceactivity WHERE USERPRODUCE = :id";
        //pesquisa estação por id
        public const string GetLinkStationAndLineById = @"SELECT * FROM produceactivity WHERE LINKSTATIONANLINEID = :id";
        //pesquisa isLocked por id
        public const string GetIsLockedId = @"SELECT * FROM produceactivity WHERE ISLOCKED = :id";
        //insere produceActivity
        public const string InsertProduceAct = @"INSERT INTO produceactivity (
                                                                                USERID, 
                                                                                JIGID, 
                                                                                MONITORESDID, 
                                                                                STATIONID, 
                                                                                ISLOCKED, 
                                                                                DESCRIPTION, 
                                                                                DATATIMEMONITORESDEVENT
                                                                             ) VALUES (
                                                                                :userid, 
                                                                                :jigid, 
                                                                                :monitoresdid, 
                                                                                :stationid, 
                                                                                :islocked, 
                                                                                :description, 
                                                                                SYSDATE
                                                                              )";
        //update produceActivity
        public const string UpdateProduceAct = @"UPDATE produceactivity 
                                                    SET 
                                                        USERID = :userid, 
                                                        JIGID = :jigid, 
                                                        MONITORESDID = :monitoresdid, 
                                                        STATIONID = :stationid, 
                                                        ISLOCKED = :islocked, 
                                                        DESCRIPTION = :description, 
                                                        DATATIMEMONITORESDEVENT = SYSDATE
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
        public const string GetRecordProduceActId = @"SELECT * FROM recordStatusProduce WHERE PRODUCEACTIVITYID = :id";
        //pesquisa userId por id
        public const string GetRecordProduceUserId = @"SELECT * FROM recordStatusProduce WHERE USERID = :id";
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
                                                                                            SYSDATE 
                                                                                         )";
        //update recordStatusProduce
        public const string UpdateRecordStatusProduce = @"UPDATE recordstatusproduce 
                                                            SET 
                                                                PRODUCEACTIVITYID = :produceactivityid, 
                                                                USERID = :userid, 
                                                                DESCRIPTION = :description, 
                                                                STATUS = :status, 
                                                                DATEEVENT = SYSDATE 
                                                            WHERE ID = :id";
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
        public const string GetRolesByRolesName = @"SELECT * FROM roles WHERE ROLESNAME = :rolesname";
        //insere roles
        public const string InsertRoles = @"INSERT INTO Roles (
                                                                    ROLESNAME
                                                              ) VALUES (    
                                                                    :rolesname    
                                                              )";
        //update roles
        public const string UpdateRoles = @"UPDATE Roles
                                                SET 
                                                    ROLESNAME = :rolesname    
                                                WHERE
                                                    ID = :id";
        //delete roles
        public const string DeleteRoles = @"DELETE FROM Roles WHERE  ID = :id";


        /// <summary>
        /// COMANDO SQL AUTHENTICATION
        /// </summary>      
        //realiza pesquisa de usuario e senha para realizar a autenticação
        public const string AuthentitateUser = @"SELECT 
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
        public const string GetAuthenticationByUserName = @"SELECT * FROM authentication WHERE USERNAME = :username";
        //pesquisa authetication por badge
        public const string GetAuthenticationByBadge = @"SELECT * FROM authentication WHERE BADGE = :badge";
        //insere authetication
        public const string InsertAuthetication = @"INSERT INTO Authentication ( 
                                                                                USERNAME, 
                                                                                ROLESNAME, 
                                                                                BADGE, 
                                                                                PASSWORD
                                                                            ) VALUES ( 
                                                                                :username,    
                                                                                :rolesname,   
                                                                                :badge,      
                                                                                :password    
                                                                            )";
        //update authetication
        public const string UpdateAuthetication = @"UPDATE Authentication
                                                                    SET 
                                                                        USERNAME = :username,      
                                                                        ROLESNAME = :rolesname,   
                                                                        BADGE = :badge,            
                                                                        PASSWORD = :password      
                                                                    WHERE
                                                                        ID = :id";
        //delete authetication
        public const string DeleteAuthetication = @"DELETE FROM Authentication WHERE ID = :id";


        /// <summary>
        /// COMANDO SQL STATIONVIEW
        /// </summary>   
        //pesquisa e lista todos stationview
        public const string GetAllStationView= @"SELECT * FROM stationview";
        //pesquisa stationview por id
        public const string GetStationViewById = @"SELECT * FROM stationview WHERE ID = :id";
        //pesquisa pesquisa positionseguence por id 
        public const string GetStationViewPositionById = @"SELECT * FROM stationview WHERE POSITIONSEQUENCE = :id";
        //delete stationview
        public const string DeleteStationView = @"DELETE FROM StationView WHERE ID = :id";
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
                                                                                SYSDATE, 
                                                                                SYSDATE
                                                                          )";
        //update stationview
        public const string UpdateStationView = @"UPDATE StationView
                                                                    SET 
                                                                        MONITORESDID = :monitoresdId, 
                                                                        LINKSTATIONANDLINEID = :linkStationAndLineId, 
                                                                        POSITIONSEQUENCE = :positionSequence, 
                                                                        LASTUPDATED = SYSDATE
                                                                    WHERE 
                                                                        ID = :id";
        
    }
}
