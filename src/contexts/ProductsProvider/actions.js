import * as types from './types';

export const loadProducts = async (dispatch) => {
  dispatch({ type: types.PRODUCTS_LOADING });

  const productsRaw = await fetch('http://localhost:5000/products/');
  const products = await productsRaw.json();

  return () => dispatch({ type: types.PRODUCTS_SUCCESS, payload: products });
};
