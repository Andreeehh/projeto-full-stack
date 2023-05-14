import * as types from './types';

export const reducer = (state, action) => {
  switch (action.type) {
    case types.PRODUCTS_SUCCESS: {
      return { ...state, products: action.payload, loading: false };
    }
    case types.PRODUCTS_LOADING: {
      return { ...state, loading: true };
    }
  }

  return { ...state };
};
