import BasicTable from '../../templates/table/BasicTable';
import { getAllBracelets } from '../../api/braceletApi';
import React, { useEffect, useState } from "react";

function BraceletList() {
    const [bracelets, setBracelets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const result = await getAllBracelets();
            setBracelets(result);
            // console.log(Object.entries(result))
          } catch (error) {
            console.error("Error fetching users:", error);
          }
        };
    
        // const fetchDataAllUsers = async () => {
        //   try {
        //     const result = await getAllUsers();
        //     console.log("result", result);
        //     setAllUsers(result);
        //   } catch (error) {
        //     console.error("Error fetching users:", error);
        //   }
        // };
        // fetchDataAllUsers();
        fetchData();
      }, []);
  return (
      <BasicTable linhas={bracelets}></BasicTable>
  );
}

export default BraceletList;