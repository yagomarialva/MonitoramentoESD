import ESDTable from "../../../pages/ESD/Jig/ESDTable/ESDTable";
import Menu from "../../../pages/Menu/Menu";

function StationList() {
  return <Menu componentToShow={<ESDTable/>}></Menu>;
}

export default StationList;
