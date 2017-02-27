import {connect} from 'react-redux';
import {promoActions} from '../modules';
import PromoCode from './PromoCode';

const mapStateToProps = (state) => {
  const {promoCode} = state;
  return {
    code: promoCode.code,
    loading: promoCode.loading,
    message: promoCode.message,
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {
    userSubmitPromo: () => {dispatch(promoActions.userSubmitPromo())},
    userChangePromo: (promo) => {dispatch(promoActions.userChangePromo(promo))},
    userSkipPromo: () => {dispatch(promoActions.userSkipPromo())},
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PromoCode);