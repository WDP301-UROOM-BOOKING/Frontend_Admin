import HotelActions from "./actions";

const initState = {
  Auth: {
    _id: -1,
  },
  hotelsNotApproval:[]
};

const Reducer = (state = initState, action) => {
  switch (action.type) {
    case HotelActions.FETCH_HOTELS_NOT_APPROVAL_SUCCESS:
      return {
        ...state,
        hotelsNotApproval: action.payload.hotels,
      };
    default:
      return state;
  }
};

export default Reducer;
