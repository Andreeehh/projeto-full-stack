import * as types from './types';

export const loadPacks = async (dispatch) => {
  dispatch({ type: types.PACKS_LOADING });

  const packsRaw = await fetch('http://localhost:5000/packs/');
  const packs = await packsRaw.json();

  return () => dispatch({ type: types.PACKS_SUCCESS, payload: packs });
};
