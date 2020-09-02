const newDeviceReducer = (state = {}, action) => {
    switch (action.type) {
      case 'SET_DEVICE_SITE':
        return {site: action.payload};
      case 'SET_BREAKER':
        return {breaker: action.payload};
      case 'SET_SERIAL':
        return {serial: action.payload};
      case 'SET_TYPE':
        return {type: action.payload};
      case 'SET_NAME':
        return {name: action.payload};
      case 'SET_DATE':
        return {date: action.payload};
      default:
        return state;
    }
  };
  
  // newDevice will be on the redux state at:
  // state.device
  export default newDeviceReducer;