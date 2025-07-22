import ApiConstants from "../../adapter/ApiConstants";
import api from "../../libs/api";

const Factories = {
  getHotelsNotApproval: () => {
    return api.get(ApiConstants.FETCH_HOTELS_NOT_APPROVAL);
  },
};
export default Factories;
