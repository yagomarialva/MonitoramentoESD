import BasicTable from '../../../pages/ESD/table/BasicTable';

function BraceletList() {
    // const [bracelets, setBracelets] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const result = await getAllBracelets();
    //         setBracelets(result);
    //         // console.log(Object.entries(result))
    //       } catch (error) {
    //         console.error("Error fetching users:", error);
    //       }
    //     };
    
    //     // const fetchDataAllUsers = async () => {
    //     //   try {
    //     //     const result = await getAllUsers();
    //     //     console.log("result", result);
    //     //     setAllUsers(result);
    //     //   } catch (error) {
    //     //     console.error("Error fetching users:", error);
    //     //   }
    //     // };
    //     // fetchDataAllUsers();
    //     fetchData();
    //   }, []);
  return (
      <BasicTable></BasicTable>
  );
}

export default BraceletList;