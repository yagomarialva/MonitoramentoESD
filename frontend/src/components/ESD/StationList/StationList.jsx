import ESDTable from "../../../pages/ESD/Stations/ESDTable/ESDTable";
import Menu from "../../../pages/Menu/Menu";

function StationList() {
  return <Menu componentToShow={<ESDTable/>}></Menu>;
}

export default StationList;
