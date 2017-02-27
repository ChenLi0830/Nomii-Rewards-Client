import * as Actions from '../src/modules/promoCode';
import reducer from '../src/modules/promoCode';

test('reducer sync methods', ()=>{
  expect(reducer(undefined, {})).toEqual({
    code: "",
    loading: false,
    message: "",
  });

  expect(reducer({
    code: "",
    loading: false,
    message: "",
  }, Actions.userChangePromo("C"))).toEqual({
    code: "C",
    loading: false,
    message: "",
  });

  expect(reducer({
    code: "C",
    loading: false,
    message: "",
  }, Actions.userChangePromo("CO"))).toEqual({
    code: "CO",
    loading: false,
    message: "",
  });

  // expect(reducer({
  //   code: "CODE",
  //   loading: false,
  //   message: "",
  // }, Actions.userSubmitPromo())).toEqual({
  //   code: "CODE",
  //   loading: true,
  //   message: "",
  // })
});

// test('reducer async method', ()=>{
//   return reducer({
//     code: "WRONG_CODE",
//     loading: false,
//     message: "",
//   }, Actions.userSubmitPromo())
//       .then(state => {
//         state.toEqual({
//           code: "",
//           loading: false,
//           message: "Invalid Code",
//         });
//       })
// });
//
