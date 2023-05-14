import * as types from './types';

export const reducer = (state, action) => {
  switch (action.type) {
    case types.PACKS_SUCCESS: {
      return { ...state, packs: action.payload, loading: false };
    }
    case types.PACKS_LOADING: {
      return { ...state, loading: true };
    }
  }

  return { ...state };
};
