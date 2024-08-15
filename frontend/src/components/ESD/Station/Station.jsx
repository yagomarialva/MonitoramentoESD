import StationTable from "../../../pages/ESD/Station/StationTable/StationTable";
import Menu from "../../../pages/Menu/Menu";

function Station() {
  return <Menu componentToShow={<StationTable/>}></Menu>;
}

export default Station;
